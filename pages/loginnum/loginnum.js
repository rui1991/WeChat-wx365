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
    proName: '',
    users: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let startDate = options.startDate;
    startDate = startDate.replace(/-/g, '.');
    let endDate = options.endDate;
    endDate = endDate.replace(/-/g, '.');
    const num = options.loginNum;
    const proName = app.globalData.nowProname;
    this.setData({ startDate, endDate, num, proName })
    const params = { project_id: app.globalData.nowProid, start_date: options.startDate, end_date: options.endDate };
    wx.showLoading({
      title: '加载中...'
    })
    fetch.reqMethod(`main/selLoginUser`, params)
      .then(res => {
        wx.hideLoading();
        if (res.data.result === "Sucess") {
          var users = res.data.data1;
          this.setData({
            users: users
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
  }
})