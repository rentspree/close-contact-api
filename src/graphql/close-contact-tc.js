/* eslint-disable no-unused-vars */
import { Types } from "mongoose"
import { composeWithMongoose } from "graphql-compose-mongoose"
import { schemaComposer } from "graphql-compose"
import { CloseContact } from "../models/close-contact"
import { User } from "../models/user"
import { makeInput, makeOutput } from "./helper"

const { ObjectId } = Types
export const CloseContactTC = composeWithMongoose(CloseContact)

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
    resolve: (source, args, context) =>
      source.contact.toString() === context.user._id.toString() ? 0 : 1,
  },
})

const CloseContactCreateIC = makeInput(CloseContactTC, ["contact"]) // user scan as contactee
const CloseContactUpdateIC = makeInput(CloseContactTC, ["contact", "contactee"]) // user scan as contactee
const CloseContactOutputIC = makeOutput(CloseContactTC, [
  "contact",
  "contactee",
])

export const makeContactResolver = CloseContactTC.getResolver("createOne")
  .wrapResolve(next => async ({ args, context, ...rest }) => {
    const { contact: contactee, ...restArgs } = args
    const newArgs = {
      record: {
        ...restArgs,
        contactee,
        contact: context.user._id, // must be in current user context
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
      ...CloseContactCreateIC.getFields(),
    },
    type: CloseContactTC,
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
// CloseContactTC.addFields({
//   contacteeUser: {
//     type: "User",
//     resolve: async (source, args, req) => {
//       const cc = await CloseContact.findOne({
//         _id: ObjectId(source._id),
//       })
//         .populate("contactee")
//         .exec()
//       return cc.contactee
//     },
//   },
//   contactUser: {
//     type: "User",
//     resolve: async (source, args, req) => {
//       const cc = await CloseContact.findOne({
//         _id: ObjectId(source._id),
//       })
//         .populate("contact")
//         .exec()
//       return cc.contact
//     },
//   },
// })

// CloseContactTC.addResolver({
//   name: "contactTo",
//   type: "[User]",
//   resolve: async ({ source, args, context, info }) => {
//     const contacteeIds = await CloseContact.find({
//       contact: ObjectId(source._id),
//     }).distinct("contactee")
//     const contactee = await User.find({
//       _id: { $in: contacteeIds },
//     })

//     return contactee
//   },
// })

// CloseContactTC.addResolver({
//   name: "contactFrom",
//   type: "[User]",
//   resolve: async ({ source, args, context, info }) => {
//     const contactIds = await CloseContact.find({
//       contact: ObjectId(source._id),
//     }).distinct("contact")
//     const contacts = await User.find({
//       _id: { $in: contactIds },
//     })

//     return contacts
//   },
// })

// // distinct
// CloseContactTC.addResolver({
//   name: "contactAll",
//   type: "[User]",
//   resolve: async ({ source, args, context, info }) => {
//     const closeContacts = await CloseContact.find({
//       $or: [
//         { contactee: ObjectId(source._id) },
//         { contact: ObjectId(source._id) },
//       ],
//     })
//       .select("contactee contact")
//       .exec()

//     const others = closeContacts
//       .map(({ contact, contactee }) =>
//         contact === source.id ? contactee : contact,
//       )
//       .filter((value, index, self) => self.indexOf(value) === index)

//     const contacts = await User.find({
//       _id: { $in: others },
//     })
//     return contacts
//   },
// })
