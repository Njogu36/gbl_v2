const date = new Date();
const year = date.getFullYear();
const day = ('0' + date.getDate()).slice(-2);
const month = ('0' + (date.getMonth() + 1)).slice(-2);
const today = year + "-" + month + "-" + day;

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
module.exports = {
  date:date,
  hour:addZero(date.getHours()),
  minute:addZero(date.getMinutes()),
  second:addZero(date.getSeconds()),
  year:year,
  day:day,
  month:month,
  today:today,
  random:Math.floor(100000 + Math.random() * 900000),
  random2:Math.floor(100000 + Math.random() * 900000)
}
