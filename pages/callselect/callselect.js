const fetch = require('../../utils/util');

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowDate: '2019-01-01',
    startDate: '2019-01-01',
    endDate: '2019-01-01',
    projects: [],
    proIndex: 0,
    proId: '',
    proName: '',
    results: [
      {
        label: '全部',
        value: ''
      },
      {
        label: '成功',
        value: 1
      },
      {
        label: '失败',
        value: 0
      }
    ],
    resultIndex: 0,
    resultValue: '',
    resultName: '全部'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取前一天时间
    const beforeDate = fetch.getBeforeDate();
    this.setData({
      projects: app.globalData.projects,
      proIndex: app.globalData.nowProindex,
      proId: app.globalData.nowProid,
      proName: app.globalData.nowProname,
      nowDate: beforeDate,
      startDate: options.startDate,
      endDate: options.endDate,
      resultIndex: options.resultIndex,
      resultValue: options.result,
      resultName: options.resultName
    });
  },
  // 选择项目
  projectChange(e) {
    const index = e.detail.value
    this.setData({
      proIndex: index,
      proId: this.data.projects[index].project_id,
      proName: this.data.projects[index].project_name
    });
  },
  // 设置开始时间
  startDateChange(e) {
    this.setData({
      startDate: e.detail.value
    });
  },
  // 选择结束时间
  endDateChange(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  // 选择类型
  resultChange(e) {
    const index = e.detail.value
    this.setData({
      resultIndex: index,
      resultValue: this.data.results[index].value,
      resultName: this.data.results[index].label
    });
  },
  // 确定
  confirmSkip() {
    // 设置全局项目信息
    app.globalData.nowProindex = this.data.proIndex;
    app.globalData.nowProid = this.data.proId;
    app.globalData.nowProname = this.data.proName;
    // 获取当前页面js里面的pages里的所有信息。
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
    prevPage.setData({
      proName: this.data.proName,
      startDate: this.data.startDate,
      endDate: this.data.endDate,
      resultIndex: this.data.resultIndex,
      result: this.data.resultValue,
      resultName: this.data.resultName,
      whetherReq: true
    })
    // 返回上一级
    wx.navigateBack({
      delta: 1
    })
  },
  // 取消
  cancelSkip() {
    // 返回上一级
    wx.navigateBack({
      delta: 1
    })
  }
})