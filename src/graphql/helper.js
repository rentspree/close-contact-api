export const makeInput = (tc, fields = []) => {
  const inputTC = tc
    .getInputTypeComposer()
    .clone(`${tc.getTypeName()}InputType`) // it generates tc.getTypeName()+'Input' for us automatically, we then use another name
  inputTC.removeField("_id")
  inputTC.removeField("createdAt")
  inputTC.removeField("updatedAt")
  fields.reduce((p, c) => {
    p.removeField(c)
    return p
  }, inputTC)
  return inputTC
}
