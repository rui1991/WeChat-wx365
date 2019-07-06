const fetch = require('../../utils/util');

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    project: '',        // 项目名称
    exeTime: '',        // 执行时间
    position: '',       // 巡检地址
    exePerson: '',      // 执行人
    checkItem: '',      // 检查项
    exeResult: '',      // 执行结果
    checkContent: '',   // 检查内容及要求
    remark: '',         // 备注
    workName: '',       // 工单名称
    crePerson: '',      // 创建人
    creTime: '',        // 创建时间
    nowExePerson: '',   // 当前处理人
    lastExePerson: '',  // 最后处理时间
    finishState: ''    // 完成状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const params = { isd_id: options.id };
    wx.showLoading({
      title: '加载中...'
    })
    fetch.reqMethod(`main/selInsAbnormalDetails`, params)
      .then(res => { 
        wx.hideLoading();
        if (res.data.result === "Sucess") {
          // 项目名称
          const project = res.data.data1.abMap.project_name;
          // 执行时间
          let exeTime = res.data.data1.abMap.modification_time || '';
          // 巡检地址
          const position = res.data.data1.abMap.position_name;
          // 执行人
          const exePerson = res.data.data1.abMap.user_name || '';
          //检查项
          const checkItem = res.data.data1.abMap.ins_name;
          //执行结果
          const exeResult = res.data.data1.abMap.task_state;
          // 检查内容及要求
          const checkContent = res.data.data1.abMap.check_content;
          // 备注
          const remark = res.data.data1.abMap.note;
          // 工单名称
          const workName = res.data.data1.woMap.wo_name || '';
          // 创建人
          const crePerson = res.data.data1.woMap.create_user_name || '';
          // 创建时间
          let creTime = res.data.data1.woMap.create_time || '';
          // 当前处理人
          const nowExePerson = res.data.data1.woMap.accept_user_name || '';
          // 最后处理时间
          let lastExePerson = res.data.data1.woMap.last_time || '';
          // 完成状态          
          const finishState = res.data.data1.woMap.wo_state || '';
          // 设置数据
          this.setData({ project, exeTime, position, exePerson, checkItem, exeResult, checkContent, remark, workName, crePerson, creTime, nowExePerson, lastExePerson, finishState });
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
  }
})