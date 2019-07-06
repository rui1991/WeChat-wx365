const fetch = require('../../utils/util');

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    project: '',
    task: '',
    timePar: '',
    groupId: '',
    groupName: '',
    roles: '',
    executor: '',
    exeState: '',
    fulfilLlimit: '',
    order: '',
    positions: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const params = { id_id: options.id };
    wx.showLoading({
      title: '加载中...'
    })
    fetch.reqMethod(`inspection/selInsTaskOnly`, params)
      .then(res => {
        wx.hideLoading();
        if (res.data.result === "Sucess") {
          // 项目名称
          const project = app.globalData.nowProname
          // 任务名称
          const task = res.data.data1.plan_name;
          // 执行时段
          let startTime = res.data.data1.start_time;
          startTime = this.disposeTime(startTime);
          let endTime = res.data.data1.end_time;
          endTime = this.disposeTime(endTime);
          const timePar = startTime + ' 至 ' + endTime;
          // 执行组
          const groupId = res.data.data1.group_id || ''
          const groupName = res.data.data1.group_name || ''
          // 执行角色
          const roles = res.data.data1.role_name;
          // 执行人
          const executor = res.data.data1.user_name || '';
          // 执行状态
          const exeState = res.data.data1.continue_state;
          // 完成度
          let limit = res.data.data1.continue_process || 0;
          limit = fetch.formatNum(limit);
          const fulfilLlimit = limit * 1000 / 10 + '%';
          // 巡检顺序
          const order = res.data.data1.po_desc;
          // 点位列表
          const positions = res.data.data1.pt_position;
          // 设置数据 
          this.setData({ project, task, timePar, groupId, groupName, roles, executor, exeState, fulfilLlimit, order, positions });

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
  disposeTime(time) {
    if (!time) { return '' }
    let firstIndex = time.indexOf('-')
    let lastIndex = time.lastIndexOf(':')
    let formatDate = time.substring(firstIndex + 1, lastIndex)
    return formatDate
  }

})
