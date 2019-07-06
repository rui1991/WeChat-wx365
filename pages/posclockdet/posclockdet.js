const fetch = require('../../utils/util');

const app = getApp();

Page({
  /**
   * 页面的初始数据 
   */
  data: {
    posid: 0,
    date: 100,
    list: [],
    pageIndex: 0,
    pageSize: 50,
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const posid = options.posid;
    const date = options.date
    this.setData({ posid, date });
    // 获取列表数据
    this.loadMore();
  },

  loadMore() {
    let { posid, date, pageIndex, pageSize } = this.data;
    const params = { project_id: app.globalData.nowProid, position_id: posid, now_date: date, page: ++pageIndex, limit1: pageSize };
    wx.showLoading({
      title: '加载中...'
    })
    fetch.reqMethod(`rollCall/selUserRecordPositionMs`, params)
      .then(res => {
        wx.hideLoading();
        if (res.data.result === "Sucess") {
          const totalCount = parseInt(res.data.data1.total);
          const hasMore = pageIndex * pageSize < totalCount;
          const list = this.data.list.concat(res.data.data1.message);
          this.setData({ list, pageIndex, hasMore });
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

  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    // 重新加载数据
    this.setData({ list: [], pageIndex: 0, hasMore: true });
    this.loadMore().then(() => wx.stopPullDownRefresh())
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.hasMore) {
      return;
    }
    this.loadMore();
  }
})