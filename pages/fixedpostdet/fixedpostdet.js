const fetch = require('../../utils/util');

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const type = Number.parseInt(options.type);
    const posid = options.posid;
    const date = options.date
    this.setData({ type });
    // 获取列表数据
    let nowUrl = ''
    switch (type) {
      case 0:
        wx.setNavigationBarTitle({
          title: '打卡成功详情'
        });
        nowUrl = 'rollCall/selSucessPermanent'
        break
      case 1:
        wx.setNavigationBarTitle({
          title: '打卡失败详情'
        });
        nowUrl = 'rollCall/selFailedPermanent'
        break;
      case 2:
        wx.setNavigationBarTitle({
          title: '打卡异常详情'
        });
        nowUrl = 'rollCall/selAbnormalPermanent'
        break
    }
    const params = { project_id: app.globalData.nowProid, position_id: posid, this_date: date };
    wx.showLoading({
      title: '加载中...'
    })
    fetch.reqMethod(`${nowUrl}`, params)
      .then(res => {
        wx.hideLoading();
        if (res.data.result === "Sucess") {
          const list = res.data.data1
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