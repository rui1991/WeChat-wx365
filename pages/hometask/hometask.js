const fetch = require('../../utils/util');

const app = getApp(); 
 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: '',
    endDate: '',
    allNUm: 0,      // 任务总数
    finish: 0,      // 完成数量
    undone: 0,      // 未完成数量
    undones: [],      // 未完成
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
    const endDate = options.endDate;
    this.setData({ startDate, endDate });
    this.loadMore();
  },


  loadMore() {
    let { startDate, endDate, pageIndex, pageSize } = this.data;
    const params = { project_id: app.globalData.nowProid, start_date: startDate, end_date: endDate, page: ++pageIndex, limit1: pageSize };
    wx.showLoading({
      title: '加载中...'
    })
    return fetch.reqMethod(`main/selInsRate`, params)
      .then(res => {
        wx.hideLoading();
        if (res.data.result === "Sucess") {
          if (this.data.loadState) {
            const totalCount = parseInt(res.data.data1.notContinueInsSize);
            const hasMore = pageIndex * pageSize < totalCount;
            const undones = this.data.undones.concat(res.data.data1.notContinueIns);
            this.setData({ undones, pageIndex, hasMore });
          } else {
            // 任务总数
            const allNUm = res.data.data1.allInsSize || 0;
            // 完成数
            const finish = res.data.data1.continueInsSize || 0;
            // 未完成数
            const undone = parseInt(res.data.data1.notContinueInsSize) || 0;
            const hasMore = pageIndex * pageSize < undone;
            const undones = this.data.undones.concat(res.data.data1.notContinueIns);
            const loadState = true;
            this.setData({ allNUm, finish, undone, undones, pageIndex, hasMore, loadState });
          }

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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.hasMore) {
      return;
    }
    this.loadMore();
  }

})