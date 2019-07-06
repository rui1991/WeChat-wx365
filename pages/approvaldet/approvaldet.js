const fetch = require('../../utils/util');

const app = getApp();

Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    appid: '',
    project: '',        // 项目名称
    applicant: '',        // 申请人
    appTime: '',       // 申请时间
    genre: '',      // 申请类型
    taskName: '',      // 任务名称
    workName: '',      // 工单名称
    shiftName: '',   // 班次名称
    leaveType: '',         // 请假类型
    startTime: '',      // 开始时间
    endTime: '',     // 结束时间
    creTime: '',     // 创建时间
    shiftDate: '',   // 日期
    cause: '',        // 申请原因
    auditState: 1,    // 审批状态
    approver: '',      // 审批人
    auditTime: '',    // 审批时间
    appOpinion: '',       // 审批意见
    show: false,
    state: 0,
    opinion: '',
    appState: true
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const appid = options.id;
    const params = { adt_id: appid };
    wx.showLoading({
      title: '加载中...'
    })
    fetch.reqMethod(`audit/selAuditOnly`, params)
      .then(res => {
        wx.hideLoading();
        if (res.data.result === "Sucess") {
          // 项目名称
          const project = res.data.data1.project_name;
          // 申请人
          let applicant = res.data.data1.apply_user_name;
          // 申请时间
          let appTime = res.data.data1.apply_time;
          // 申请类型
          const genre = res.data.data1.apply_type;
          //任务名称
          const taskName = res.data.data1.type_message.plan_name || '';
          //工单名称
          const workName = res.data.data1.type_message.wo_name || '';
          // 班次名称
          const shiftName = res.data.data1.type_message.work_name || '';
          // 请假类型
          const leaveType = res.data.data1.type_message.leave_type || '';
          // 开始时间
          let startTime = res.data.data1.type_message.start_time || '';
          // 结束时间
          let endTime = res.data.data1.type_message.end_time || '';
          // 创建时间
          let creTime = res.data.data1.type_message.create_time || '';
          // 日期
          let shiftDate = res.data.data1.type_message.date || '';
          // 申请原因
          const cause = res.data.data1.apply_reason || '';
          // 申请状态
          const auditState = res.data.data1.audit_state;
          let appState = true;
          auditState === 0 ? appState = true : appState = false;
          // 审批人
          const approver = res.data.data1.audit_user_name || '';
          // 审批时间
          let auditTime = res.data.data1.audit_time || '';
          // 审批意见
          const appOpinion = res.data.data1.audit_opinion || '';
          // 设置数据
          this.setData({ appid, project, applicant, appTime, genre, taskName, workName, shiftName, leaveType, startTime, endTime, creTime, shiftDate, cause, auditState, appState, approver, auditTime, appOpinion });
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '请求失败！',
            icon: 'success',
            image: '../../assets/icon/hint.png',
            duration: 2000
          })
        }
      })
      .catch(reason => {
        wx.showToast({
          title: '请求失败！',
          icon: 'success',
          image: '../../assets/icon/hint.png',
          duration: 2000
        })
      });
  },
  // 弹框
  tapPopout(e) {
    const state = parseInt(e.currentTarget.dataset.id);
    const show = true
    this.setData({ show, state });
  },
  // 输入框
  opinionInput(e) {
    this.setData({
      opinion: e.detail.value
    })
  },
  // 取消
  onCancel() {
    const show = false;
    const opinion = '';
    this.setData({ show, opinion });
  },
  // 确定
  onConfirm() {
    let { appid, genre, state, opinion } = this.data;
    const params = { adt_id: appid, apply_type: genre, audit_state: state, audit_opinion: opinion };
    fetch.reqMethod(`audit/auditAudit`, params)
      .then(res => {
        if (res.data.result === "Sucess") {
          const show = false;
          const opinion = '';
          const appState = false;
          this.setData({ show, opinion, appState });
          wx.showToast({
            title: '审批成功！',
            icon: 'success',
            duration: 2000
          });
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
        console.log('请求失败！');
      });
  }

})