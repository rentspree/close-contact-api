import { factory } from "factory-girl"
import Person from "../_helper/person-test-model"

factory.define("person", Person, {
  firstName: factory.chance("first"),
  lastName: factory.chance("last"),
  age: factory.chance("age"),
  email: factory.seq("User.email", n => `user_${n}@gmail.com`),
})
