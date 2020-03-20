export const makeInput = (tc, fields = []) => {
  const inputTC = tc.getInputTypeComposer()
  inputTC.removeField("_id")
  inputTC.removeField("createdAt")
  inputTC.removeField("updatedAt")
  fields.reduce((p, c) => {
    p.removeField(c)
    return p
  }, inputTC)
  return inputTC
}
