/* eslint-disable no-unused-vars */
import { Types } from "mongoose"
import { composeWithMongoose } from "graphql-compose-mongoose"
import { CloseContact } from "../models/close-contact"
import { User } from "../models/user"

const { ObjectId } = Types
export const CloseContactTC = composeWithMongoose(CloseContact)

CloseContactTC.addFields({
  contacteeUser: {
    type: "User",
    resolve: async (source, args, req) => {
      const cc = await CloseContact.findOne({
        _id: ObjectId(source._id),
      })
        .populate("contactee")
        .exec()
      return cc.contactee
    },
  },
  contactUser: {
    type: "User",
    resolve: async (source, args, req) => {
      const cc = await CloseContact.findOne({
        _id: ObjectId(source._id),
      })
        .populate("contact")
        .exec()
      return cc.contact
    },
  },
})

CloseContactTC.addResolver({
  name: "contactTo",
  type: "[User]",
  resolve: async ({ source, args, context, info }) => {
    const contacteeIds = await CloseContact.find({
      contact: ObjectId(source._id),
    }).distinct("contactee")
    const contactee = await User.find({
      _id: { $in: contacteeIds },
    })

    return contactee
  },
})

CloseContactTC.addResolver({
  name: "contactFrom",
  type: "[User]",
  resolve: async ({ source, args, context, info }) => {
    const contactIds = await CloseContact.find({
      contact: ObjectId(source._id),
    }).distinct("contact")
    const contacts = await User.find({
      _id: { $in: contactIds },
    })

    return contacts
  },
})

// distinct
CloseContactTC.addResolver({
  name: "contactAll",
  type: "[User]",
  resolve: async ({ source, args, context, info }) => {
    const closeContacts = await CloseContact.find({
      $or: [
        { contactee: ObjectId(source._id) },
        { contact: ObjectId(source._id) },
      ],
    })
      .select("contactee contact")
      .exec()

    const others = closeContacts
      .map(({ contact, contactee }) =>
        contact === source.id ? contactee : contact,
      )
      .filter((value, index, self) => self.indexOf(value) === index)

    const contacts = await User.find({
      _id: { $in: others },
    })
    return contacts
  },
})
