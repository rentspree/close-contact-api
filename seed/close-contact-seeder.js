import { CloseContact } from "../src/models/close-contact"

export default async function closeContactSeeder(
  contact,
  contactee,
  timestamps = Date.now,
) {
  return CloseContact.create({
    contact: contact._id,
    contactee: contactee._id,
    timestamps,
  })
}
