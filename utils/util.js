// 请求方法
const reqMethod = (url, data) => {
  return new Promise((resolve, reject) => { 
    wx.request({
      url: `https://www.bczdd.com/${url}`,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: data,
      success: resolve,
      fail: reject
    })
  })
}
// 请求地址
const reqUrl = 'https://www.bczdd.com';
// 获取当前日期
const nowDate = (pattern = '') => {
  let dt = new Date();
  let year = dt.getFullYear();
  let month = dt.getMonth() + 1;
  month < 10 ? month = '0' + month : month = month;
  let day = dt.getDate().toString();
  day < 10 ? day = '0' + day : day = day;
  if (pattern.toLowerCase() === 'yyyy-mm-dd') {
    return `${year}-${month}-${day}`;
  } else {
    let hour = dt.getHours();
    hour < 10 ? hour = '0' + hour : hour = hour;
    let minute = dt.getMinutes();
    minute < 10 ? minute = '0' + minute : minute = minute;
    let second = dt.getSeconds();
    second < 10 ? second = '0' + second : second = second;
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
}

// 获取前一天日期
const getBeforeDate = () => {
  const nowdate = new Date().getTime() - 86400000
  const mydate = new Date(nowdate)
  let year = mydate.getFullYear()
  let month = mydate.getMonth() + 1 + ''
  month = month.padStart(2, '0')
  let day = mydate.getDate() + ''
  day = day.padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 验证手机号码
const checkPhone = (input) => {
  /*手机号码*/
  let regex = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
  /*match表示匹配函数*/
  if (input.match(regex)) {
    return true;
  } else {
    return false;
  }
}

// 保留小数
const formatNum = (num, n = '') => {
  let value = Number(num);
  if (n) {
    let square = Math.pow(10, n);
    return Math.round(value * square) / square;
  } else {
    return Math.round(value * 100) / 100;
  }
}

module.exports = {
  reqMethod: reqMethod,
  reqUrl: reqUrl,
  nowDate: nowDate,
  getBeforeDate: getBeforeDate,
  checkPhone: checkPhone,
  formatNum: formatNum
}