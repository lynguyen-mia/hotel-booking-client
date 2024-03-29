// Convert all dates to ISO 8601 format
function convertDate(date) {
  const [month, day, year] = date?.split("/");
  const formattedDate = new Date(year, month - 1, day);
  return formattedDate;
}

module.exports = convertDate;
