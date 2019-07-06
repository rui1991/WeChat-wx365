const fetch = require('../../utils/util');

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const params = { project_id: app.globalData.nowProid, userN_id: options.uid, this_date: options.date };
    wx.showLoading({
      title: '加载中...'
    })
    fetch.reqMethod(`rollCall/selRollCallOnly`, params)
      .then(res => {
        wx.hideLoading();
        if (res.data.result === "Sucess") {
          let list = res.data.data1;
          // 设置数据 
          this.setData({ list });
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