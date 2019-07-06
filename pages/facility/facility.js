const fetch = require('../../utils/util');

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: '',
    endDate: '',
    num: 0,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let startDate = options.startDate;
    startDate = startDate.replace(/-/g, '.');
    let endDate = options.endDate;
    endDate = endDate.replace(/-/g, '.');
    const num = options.facilityNum;
    const proName = app.globalData.nowProname;
    this.setData({ startDate, endDate, num, proName })
    const params = { project_id: app.globalData.nowProid, start_date: options.startDate, end_date: options.endDate };
    wx.showLoading({
      title: '加载中...'
    })
    fetch.reqMethod(`main/selDevices`, params)
      .then(res => {
        wx.hideLoading();
        if (res.data.result === "Sucess") {
          let list = res.data.data1;
          list.forEach(item => {
            let mac = item.position_mac
            mac = this.formatMac(mac)
            item.position_mac = mac
          })
          this.setData({
            list: list
          });
        } else {
          wx.showToast({
            title: '请求失败！',
            icon: 'success',
            image: '../../assets/icon/hint.png',
            duration: 2000
          })
        }
      })
      .catch(reason => {
        wx.hideLoading();
        wx.showToast({
          title: '请求失败！',
          icon: 'success',
          image: '../../assets/icon/hint.png',
          duration: 2000
        })
      });
  },
  // 格式化MAC
  formatMac (str) {
    if (!str) { return '' }
    let value = str.toUpperCase()
    value = value.replace(/:/g, '')
    value = value.replace(/(.{2})/g, '$1:')
    const lastStr = value.charAt(value.length - 1)
    return lastStr === ':' ? value.substr(0, value.length - 1) : value
  }
})