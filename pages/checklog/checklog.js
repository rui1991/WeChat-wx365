const fetch = require('../../utils/util');

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    posid: '',
    insid: '',
    records: [],
    pageIndex: 0,
    pageSize: 20,
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const posid = options.posid;
    const insid = options.insid;
    this.setData({ posid, insid });
    this.loadMore();
  },

  loadMore() {
    let { posid, insid, pageIndex, pageSize } = this.data;
    const params = { project_id: app.globalData.nowProid, position_id: posid, ins_id: insid, page: ++pageIndex, limit1: pageSize };
    wx.showLoading({
      title: '加载中...'
    })
    return fetch.reqMethod(`main/selHistoryInsAbnormal`, params)
      .then(res => {
        wx.hideLoading();
        if (res.data.result === "Sucess") {
          const totalCount = parseInt(res.data.data1.total);
          const hasMore = pageIndex * pageSize < totalCount;
          const records = this.data.records.concat(res.data.data1.insAB);
          this.setData({ records, pageIndex, hasMore });
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
    this.setData({ records: [], pageIndex: 0, hasMore: true });
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