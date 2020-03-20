import moment from "moment"

export const setMillisecondToDate = ms =>
  moment()
    .set("millisecond", ms)
    .format()
