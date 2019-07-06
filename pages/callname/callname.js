const fetch = require('../../utils/util');

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowSearchName: '',
    searchName: '',
    proName: '',
    startDate: '',
    endDate: '',
    resultIndex: 0,
    result: '',
    resultName: '全部',
    whetherReq: false,
    callnames: [],
    pageIndex: 0,
    pageSize: 20,
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取当前时间
    const beforeDate = fetch.getBeforeDate();
    this.setData({
      proName: app.globalData.nowProname,
      startDate: beforeDate,
      endDate: beforeDate
    });
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
    this.setData({ callnames: [], pageIndex: 0, hasMore: true });
    this.loadMore();
  },

  loadMore() {
    let { searchName, startDate, endDate, result, pageIndex, pageSize } = this.data;
    const params = { project_id: app.globalData.nowProid, user_name: searchName, start_date: startDate, end_date: endDate, over: result, page: ++pageIndex, limit1: pageSize };
    wx.showLoading({
      title: '加载中...'
    })
    return fetch.reqMethod(`rollCall/selRollCallResult`, params)
      .then(res => {
        wx.hideLoading();
        if (res.data.result === "Sucess") {
          const totalCount = parseInt(res.data.data1.total);
          const hasMore = pageIndex * pageSize < totalCount;
          const callnames = this.data.callnames.concat(res.data.data1.rcs);
          this.setData({ callnames, pageIndex, hasMore });
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

  // 用户名搜索
  onChange: function (e) {
    this.setData({
      nowSearchName: e.detail
    })
  },
  onSearch: function () {
    // 重新加载数据
    const searchName = this.data.nowSearchName;
    this.setData({ searchName, callnames: [], pageIndex: 0, hasMore: true });
    this.loadMore();
  },

  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    // 重新加载数据
    this.setData({ callnames: [], pageIndex: 0, hasMore: true });
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