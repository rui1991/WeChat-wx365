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
    stateIndex: 0,
    state: 100,
    stateName: '全部',
    whetherReq: false,
    posclocks: []
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
    this.setData({ posclocks: [] });
    this.loadMore();
  }, 

  loadMore() {
    let { searchName, startDate, endDate, state } = this.data;
    const params = { project_id: app.globalData.nowProid, position_name: searchName, start_date: startDate, end_date: endDate, searchsize: state };
    wx.showLoading({
      title: '加载中...'
    })
    return fetch.reqMethod(`rollCall/selUserRecordMessage`, params)
      .then(res => {
        wx.hideLoading();
        if (res.data.result === "Sucess") {
          const posclocks = this.data.posclocks.concat(res.data.data1);
          this.setData({ posclocks });
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

  // 地址名称搜索
  onChange: function (e) {
    this.setData({
      nowSearchName: e.detail
    })
  },
  onSearch: function () {
    // 重新加载数据
    const searchName = this.data.nowSearchName;
    this.setData({ searchName, posclocks: [] });
    this.loadMore();
  },

  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    // 重新加载数据
    this.setData({ posclocks: [] });
    this.loadMore().then(() => wx.stopPullDownRefresh())
  }

})