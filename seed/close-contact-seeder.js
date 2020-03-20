import { CloseContact } from "../src/models/close-contact"

function getRnd(min, max) {
  return (Math.random() * (max - min) + min).toFixed(6)
}

function getRandomCooridinatesInBangkok() {
  const lat = {
    min: 13.60907,
    max: 14.020275,
  }
  const ln = {
    min: 100.305023,
    max: 100.999588,
  }
  return [getRnd(lat.min, lat.max), getRnd(ln.min, ln.max)]
}

export default async function closeContactSeeder(
  contact,
  contactee,
  timestamps = Date.now,
) {
  return CloseContact.create({
    contact: contact._id,
    contactee: contactee._id,
    timestamps,
    location: {
      coordinates: getRandomCooridinatesInBangkok(),
    },
  })
}
