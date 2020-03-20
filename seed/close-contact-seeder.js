import { CloseContact } from "../src/models/close-contact"

export default async function closeContactSeeder(
  contact,
  contactee,
  timestamps = Date.now,
) {
  return CloseContact.create({
    contactId: contact._id,
    contacteeId: contactee._id,
    timestamps,
  })
}
