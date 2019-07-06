const fetch = require('../../utils/util');

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showStartDate: '',
    showEndDate: '',
    startDate: '',
    endDate: '',
    checks: [],
    pageIndex: 0,
    pageSize: 20,
    loadState: false,
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const startDate = options.startDate;
    const showStartDate = startDate.replace(/-/g, '.');
    const endDate = options.endDate;
    const showEndDate = endDate.replace(/-/g, '.');
    this.setData({ showStartDate, startDate, showEndDate, endDate })
    // 获取列表数据
    this.loadMore();
  },

  loadMore() {
    let { startDate, endDate, pageIndex, pageSize } = this.data;
    const params = { project_id: app.globalData.nowProid, start_date: startDate, end_date: endDate, page: ++pageIndex, limit1: pageSize };
    wx.showLoading({
      title: '加载中...'
    })
    return fetch.reqMethod(`main/selInsAbnormal`, params)
      .then(res => {
        wx.hideLoading();
        if (res.data.result === "Sucess") {
          const totalCount = parseInt(res.data.data1.total);
          const hasMore = pageIndex * pageSize < totalCount;
          const checks = this.data.checks.concat(res.data.data1.insAbnormal);
          this.setData({ checks, pageIndex, hasMore });
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
    this.setData({ undones: [], pageIndex: 0, hasMore: true });
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
  },

  // 跳转历史记录
  skipRecord(e) {
    const posid = e.currentTarget.dataset.posid;
    const insid = e.currentTarget.dataset.insid;
    wx.navigateTo({
      url: '/pages/checklog/checklog?posid=' + posid + '&insid=' + insid
    })
  }

})