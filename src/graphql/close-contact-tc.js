/* eslint-disable no-unused-vars */
import { Types } from "mongoose"
import { composeWithMongoose } from "graphql-compose-mongoose"
import get from "lodash/get"
import { schemaComposer } from "graphql-compose"
import { CloseContact } from "../models/close-contact"
import { User } from "../models/user"
import { makeInput } from "./helper"

const { ObjectId } = Types
export const CloseContactTC = composeWithMongoose(CloseContact)
// CloseContactTC.removeField(["contact", "contactee"])

const contactTypeEnumTC = schemaComposer.createEnumTC({
  name: "ContactType",
  values: {
    CONTACT: { value: 0 },
    CONTACTEE: { value: 1 },
  },
})

CloseContactTC.addFields({
  type: {
    type: contactTypeEnumTC,
    resolve: (source, args, context) => {
      return get(source, "contact", "").toString() ===
        get(context, "user._id", "").toString()
        ? 0
        : 1
    },
    projection: { contact: true },
  },
})

// const CloseContactCreateIC = makeInput(CloseContactTC, ["contact"]) // user scan as contactee
const CloseContactUpdateIC = makeInput(CloseContactTC, ["contact", "contactee"]) // user scan as contactee

export const makeContactResolver = CloseContactTC.getResolver("createOne")
  .wrapResolve(next => async ({ args, context, ...rest }) => {
    const { contact: target, type, ...restArgs } = args
    const newArgs = {
      record: {
        ...restArgs,
        contactee: type ? context.user._id : target,
        contact: type ? target : context.user._id,
      },
    }
    const res = await next({
      args: newArgs,
      context,
      ...rest,
    })
    return res.record
  })
  .wrap(newResolver => newResolver, {
    args: {
      contact: "MongoID!",
      type: "ContactType!",
      ...CloseContactUpdateIC.getFields(),
    },
  })

export const findContactResolver = CloseContactTC.getResolver("findMany")
  .wrapResolve(next => async ({ args, context, ...rest }) => {
    const { filter = {}, ...restArgs } = args
    const { type, ...restFilter } = filter
    const newArgs = {
      ...restArgs,
      filter: {
        ...restFilter,
        ...(type === undefined && {
          $or: [{ contactee: context.user._id }, { contact: context.user._id }],
        }), // must be in current user context
        ...(type === 0 && { contact: context.user._id }),
        ...(type === 1 && { contactee: context.user._id }),
      },
    }
    const res = await next({
      args: newArgs,
      context,
      ...rest,
    })
    return res
  })
  .wrap(newResolver => {
    newResolver
      .getArgITC("filter")
      .removeField(["_id", "contact", "contactee"])
      .addFields({ type: { type: contactTypeEnumTC } })
    return newResolver
  })

export const updateContactResolver = CloseContactTC.getResolver("updateOne")
  .wrapResolve(next => async ({ args, context, ...rest }) => {
    const { _id, ...restArgs } = args
    const newArgs = {
      record: restArgs,
      filter: {
        _id,
        $or: [{ contactee: context.user._id }, { contact: context.user._id }], // must be in current user context
      },
    }
    const res = await next({
      args: newArgs,
      context,
      ...rest,
    })
    return res.record
  })
  .wrap(newResolver => newResolver, {
    args: {
      _id: "MongoID!",
      ...CloseContactUpdateIC.getFields(),
    },
    type: CloseContactTC,
  })

CloseContactTC.addFields({
  user: {
    type: "User",
    resolve: async (source, _args, context) => {
      const { contact, contactee } = source
      const { user } = context
      const contactUser = await User.findOne({
        _id:
          contact.toString() === get(user, "_id").toString()
            ? contactee
            : contact,
      })

      return contactUser
    },
    projection: { contact: true, contactee: true },
  },
})

// distinct
// TODO: pagination
CloseContactTC.addResolver({
  name: "contactPersons",
  type: "[User]",
  args: {
    since: "Date",
    until: "Date",
  },
  description:
    "find all distinct close contact persons in the given period of time",
  resolve: async ({ _source, args = {}, context, info }) => {
    const { since, until } = args
    const closeContacts = await CloseContact.find({
      ...((since || until) && {
        timestamp: {
          ...(since && { $gte: since }),
          ...(until && { $lt: until }),
        },
      }),
      $or: [
        { contactee: ObjectId(context.user._id) },
        { contact: ObjectId(context.user._id) },
      ],
    })
      .select("contactee contact")
      .exec()

    const others = closeContacts
      .map(({ contact, contactee }) =>
        contact === context.user.id ? contactee : contact,
      )
      .filter((value, index, self) => self.indexOf(value) === index)

    const contacts = await User.find({
      _id: { $in: others },
    })
    return contacts
  },
  projection: {
    _id: true,
  },
})
