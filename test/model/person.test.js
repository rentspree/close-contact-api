import { factory } from "factory-girl"
import Person from "../_helper/person-test-model"

xdescribe("Person Model", () => {
  const person = {
    firstName: "test1",
    lastName: "test2",
    age: 120,
    email: "testja@gmail.com",
  }
  it("should create person document", () => {
    const newPerson = new Person(person)
    newPerson.save().then(result => {
      const savedPerson = result.toObject({ versionKey: false })
      delete savedPerson._id
      savedPerson.should.deep.equals(person)
    })
  })
  context("try build", () => {
    let fixtureData
    before(done => {
      factory
        .createMany("person", 10)
        .then(persons => {
          fixtureData = persons
          done()
        })
        .catch(done)
    })
    it("try now", () =>
      Person.findOne({
        _id: fixtureData[0]._id,
      }).should.eventually.have.property("_id"))
  })
  context("validation", () => {
    it("should throw error when validate", () => {
      const p = new Person({
        firstName: "hello",
      })
      const fn = () => p.verify()
      fn()
        .should.have.property("error")
        .to.have.property("name")
        .to.equal("ValidationError")
    })
  })
})
