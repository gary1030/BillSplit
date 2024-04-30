function getEndOfDate(date) {
  const endOfDate = new Date(date);
  endOfDate.setHours(23, 59, 59, 999);
  return endOfDate;
}

module.exports = { getEndOfDate };
