const fetch = require('../../utils/util');

const app = getApp();

Page({
  data: {
    proName: '',
    startDate: '2018-01-01',
    endDate: '2020-01-01',
    whetherReq: false,
    approvals: [],
    pageIndex: 0,
    pageSize: 20,
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取当前时间
    const nowDate = fetch.nowDate('yyyy-mm-dd');
    this.setData({
      proName: app.globalData.nowProname,
      startDate: nowDate,
      endDate: nowDate
    });
    // 获取报表数据
    this.loadMore();
  },

  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    if (!this.data.whetherReq) {
      return;
    }
    this.setData({
      whetherReq: false
    })
    // 重新加载数据
    this.setData({ approvals: [], pageIndex: 0, hasMore: true });
    this.loadMore();
  },


  loadMore() {
    let { startDate, endDate, pageIndex, pageSize } = this.data;
    const params = { project_id: app.globalData.nowProid, start_date: startDate, end_date: endDate, page: ++pageIndex, limit1: pageSize };
    wx.showLoading({
      title: '加载中...'
    })
    return fetch.reqMethod(`audit/selHandleRecords`, params)
      .then(res => {
        wx.hideLoading();
        if (res.data.result === "Sucess") {
          const totalCount = parseInt(res.data.data1.total);
          const hasMore = pageIndex * pageSize < totalCount;
          const approvals = this.data.approvals.concat(res.data.data1.audit);
          this.setData({ approvals, pageIndex, hasMore });
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
    this.setData({ approvals: [], pageIndex: 0, hasMore: true });
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
