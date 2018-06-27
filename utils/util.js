const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatUnixTime = time => {
  let unixTimestamp = new Date(time)
  let M = ((unixTimestamp.getMonth() + 1) > 10 ? (unixTimestamp.getMonth() + 1) : '0' + (unixTimestamp.getMonth() + 1))
  let D = (unixTimestamp.getDate() > 10 ? unixTimestamp.getDate() : '0' + unixTimestamp.getDate())
  let toDay =  M + '月' + D + '日'
  return toDay
}

const formatDate = date => {
  const weekStr = ["天", "一", "二", "三", "四", "五", "六"]

  return `${date.getMonth() + 1}月${date.getDate()}日 星期${weekStr[date.getDay()]}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const newGuid = () => {
  var guid = "";
  for (var i = 1; i <= 32; i++) {
    var n = Math.floor(Math.random() * 16.0).toString(16);
    guid += n;
  }
  return guid;
}

const timeStamp = () => {
  return Date.parse(new Date())
}
module.exports = {
  formatTime,
  formatDate,
  newGuid,
  timeStamp,
  formatUnixTime
}
