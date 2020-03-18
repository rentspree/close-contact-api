import { Schema } from "mongoose"
import Joi from "joi"
import mongodb from "../../src/connection"

/**
 * the ORM for Person
 * This is a mock mongoose class for the purpose of grounding up the project
 * @constructor Person
 * @property {String} firstName the person firstname
 * @property {String} lastName the person last name
 * @property {Number} age the age of this person
 * @property {String} email the email address given at registration
 * @memberof Models
 *
 */
const personSchema = new Schema({
  firstName: String,
  lastName: String,
  age: Number,
  email: String,
})

const validationSchema = Joi.object().keys({
  firstName: Joi.string()
    .required()
    .min(2)
    .max(50),
  lastName: Joi.string()
    .required()
    .min(2)
    .max(50),
  age: Joi.number()
    .min(12)
    .max(125),
  email: Joi.string().email(),
})

/**
 * this method say hello
 * @param {String} someString a string suffix hello
 * @returns {String} the value of someString
 * @memberof Models.Person
 */

// cannot use "validate" since it will clash with mongoose
personSchema.methods.verify = function() {
  return validationSchema.validate(this.toObject())
}

export default mongodb.model("Person", personSchema)
