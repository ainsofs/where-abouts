import { date } from "quasar"

function setAddedDate(element) {
  const timeStamp = Date.now()
  const curDate = date.formatDate(timeStamp, "YYYY-MM-DDTHH:mm:ss.SSSZ")
  element.dateAdded = curDate
  element.dateUpdated = curDate
  // element.updatedBy = ''
  // element.addedBy = ''

  return element
}
function setUpdatedDate(element, originalEl = null) {
  const timeStamp = Date.now()
  const curDate = date.formatDate(timeStamp, "YYYY-MM-DDTHH:mm:ss.SSSZ")
  element.dateUpdated = curDate

  if (originalEl) {
    element.dateAdded = originalEl.dateAdded
  }

  return element
}

export { setAddedDate, setUpdatedDate }
