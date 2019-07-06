// pages/home/home.js
const fetch = require('../../utils/util');
import * as echarts from '../../components/ec-canvas/echarts';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    proName: '',
    startDate: '2018-01-01',
    endDate: '2020-01-01',
    whetherReq: false,
    loginNum: '',
    staffNum: '',
    workNum: '',
    facilityNum: '',
    ec: {
      lazyLoad: true // 延迟加载
    },
    polTaskData: [],
    checkItemData: [],
    workData: [],
    callnameData: [],
    posCardData: [],
    fixCardData: []
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
    this.getReportData();
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
    // 获取报表数据
    this.getReportData();
  },

  /** 获取报表数据 */
  getReportData() {
    const params = { project_id: app.globalData.nowProid, start_date: this.data.startDate, end_date: this.data.endDate };
    wx.showLoading({
      title: '加载中...'
    })
    return fetch.reqMethod(`main/selMainData`, params)
      .then(res => {
        wx.hideLoading();
        if (res.data.result === "Sucess") {
          const homeData = res.data.data1
          // 登录人数
          const loginNum = homeData.loginSize || 0;
          // 员工数量
          const staffNum = homeData.userSize || 0;
          // 工单总数
          const workNum = homeData.woSize || 0;
          // 设备数量
          const facilityNum = homeData.deviceSize || 0;
          /* 巡检任务统计 */
          // 已完成
          let polFinish = parseFloat(homeData.insContinueRate) || 0;
          // 未完成
          let polUnfinished = parseFloat(homeData.insNotContinueRate) || 0;
          const polTaskData = [
            { value: polFinish, name: '已完成' },
            { value: polUnfinished, name: '未完成' }
          ];
          /* 检查项统计 */
          // 巡检总数
          const checkAll = parseFloat(res.data.data1.insAllSize) || 0;
          // 异常
          const checkAbnormal = parseFloat(res.data.data1.insAbnormalSize) || 0;
          // 正常
          const checkNormal = checkAll - checkAbnormal
          const checkItemData = [
            { value: checkNormal, name: '正常' },
            { value: checkAbnormal, name: '异常' }
          ];
          /* 工单统计 */
          // 已完成
          let workFinish = parseFloat(homeData.continueWoRate) || 0;
          // 未完成
          let workUnfinished = parseFloat(homeData.notContinueWoRate) || 0;
          const workData = [
            { value: workFinish, name: '已完成' },
            { value: workUnfinished, name: '未完成' }
          ];
          /* 点名管理统计 */
          // 成功
          let callnameSucceed = parseFloat(homeData.rollCallSucessRate) || 0;
          // 失败
          let callnameError = parseFloat(homeData.rollCallFailedRate) || 0;
          const callnameData = [
            { value: callnameSucceed, name: '成功' },
            { value: callnameError, name: '失败' }
          ];
          /* 位置打卡统计 */
          // 有记录
          let posCardHove = parseFloat(homeData.placeRecordHaveRate) || 0;
          // 无记录
          let posCardNoHove = parseFloat(homeData.placeRecordNotHaveRate) || 0;
          const posCardData = [
            { value: posCardHove, name: '有记录' },
            { value: posCardNoHove, name: '无记录' }
          ];
          /* 固定岗打卡统计 */
          // 成功
          let fixCardSucceed = parseFloat(homeData.permanentSucessRate) || 0;
          // 失败
          let fixCardError = parseFloat(homeData.permanentFailedRate) || 0;
          const fixCardData = [
            { value: fixCardSucceed, name: '成功' },
            { value: fixCardError, name: '失败' }
          ];
          // 设置数据
          this.setData({
            loginNum: loginNum,
            staffNum: staffNum,
            workNum: workNum,
            facilityNum: facilityNum,
            polTaskData: polTaskData,
            checkItemData: checkItemData,
            workData: workData,
            callnameData: callnameData,
            posCardData: posCardData,
            fixCardData: fixCardData
          });
          // 巡检任务统计
          this.init_pol_task();
          // 检查项统计
          this.init_check_item();
          // 工单统计
          this.init_work();
          // 点名管理统计
          this.init_callname();
          // 位置打卡统计
          this.init_pos_card();
          // 固定岗打卡统计
          this.init_fix_card();
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
  /* 巡检任务统计 */
  init_pol_task () {
    const pieComponent = this.selectComponent('#pol_task_pie');
    pieComponent.init((canvas, width, height) => {
      // 初始化图表
      const pieChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      pieChart.setOption(this.getPolTaskOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return pieChart;
    });
  },
  getPolTaskOption () {
    return {
      series: [
        {
          name: '巡检任务统计',
          type: 'pie',
          hoverAnimation: false,
          radius: '75%',
          center: ['50%', '50%'],
          itemStyle: {
            normal: {
              label: {
                show: true,
                // formatter: '{b} : {c} ({d}%)'
                formatter: '{b} : {d}%'
              },
              labelLine: { show: true }
            }
          },
          labelLine: {
            normal: {
              show: true,
              length: 6,
              length2: 8
            }
          },
          data: this.data.polTaskData
        }
      ],
      color: ['#4abc8e', '#f5bd80']
    }
  },  
  /* 检查项统计 */
  init_check_item() {
    const pieComponent = this.selectComponent('#check_item_pie');
    pieComponent.init((canvas, width, height) => {
      // 初始化图表
      const pieChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      pieChart.setOption(this.getCheckItemOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return pieChart;
    });
  },
  getCheckItemOption() {
    return {
      series: [
        {
          name: '检查项统计',
          type: 'pie',
          hoverAnimation: false,
          radius: '75%',
          center: ['50%', '50%'],
          itemStyle: {
            normal: {
              label: {
                show: true,
                // formatter: '{b} : {c} ({d}%)'
                formatter: '{b} : {d}%'
              },
              labelLine: { show: true }
            }
          },
          labelLine: {
            normal: {
              show: true,
              length: 6,
              length2: 8
            }
          },
          data: this.data.checkItemData
        }
      ],
      color: ['#4abc8e', '#f5bd80']
    }
  },  
  /* 工单统计 */
  init_work () {
    const pieComponent = this.selectComponent('#work_pie');
    pieComponent.init((canvas, width, height) => {
      // 初始化图表
      const pieChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      pieChart.setOption(this.getWorkOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return pieChart;
    });
  },
  getWorkOption() {
    return {
      series: [
        {
          name: '工单统计',
          type: 'pie',
          hoverAnimation: false,
          radius: '75%',
          center: ['50%', '50%'],
          itemStyle: {
            normal: {
              label: {
                show: true,
                // formatter: '{b} : {c} ({d}%)'
                formatter: '{b} : {d}%'
              },
              labelLine: { show: true }
            }
          },
          labelLine: {
            normal: {
              show: true,
              length: 6,
              length2: 8
            }
          },
          data: this.data.workData
        }
      ],
      color: ['#4abc8e', '#f5bd80']
    }
  },  
  /* 点名管理统计 */
  init_callname() {
    const pieComponent = this.selectComponent('#callname_pie');
    pieComponent.init((canvas, width, height) => {
      // 初始化图表
      const pieChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      pieChart.setOption(this.getCallnameOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return pieChart;
    });
  },
  getCallnameOption() {
    return {
      series: [
        {
          name: '点名管理统计',
          type: 'pie',
          hoverAnimation: false,
          radius: '75%',
          center: ['50%', '50%'],
          itemStyle: {
            normal: {
              label: {
                show: true,
                // formatter: '{b} : {c} ({d}%)'
                formatter: '{b} : {d}%'
              },
              labelLine: { show: true }
            }
          },
          labelLine: {
            normal: {
              show: true,
              length: 6,
              length2: 8
            }
          },
          data: this.data.callnameData
        }
      ],
      color: ['#4abc8e', '#f5bd80']
    }
  }, 
  /* 位置打卡统计 */
  init_pos_card() {
    const pieComponent = this.selectComponent('#pos_card_pie');
    pieComponent.init((canvas, width, height) => {
      // 初始化图表
      const pieChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      pieChart.setOption(this.getPosCardOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return pieChart;
    });
  },
  getPosCardOption() {
    return {
      series: [
        {
          name: '点名管理统计',
          type: 'pie',
          hoverAnimation: false,
          radius: '75%',
          center: ['50%', '50%'],
          itemStyle: {
            normal: {
              label: {
                show: true,
                // formatter: '{b} : {c} ({d}%)'
                formatter: '{b} : {d}%'
              },
              labelLine: { show: true }
            }
          },
          labelLine: {
            normal: {
              show: true,
              length: 6,
              length2: 8
            }
          },
          data: this.data.posCardData
        }
      ],
      color: ['#4abc8e', '#f5bd80']
    }
  }, 
  /* 固定岗打卡统计 */
  init_fix_card() {
    const pieComponent = this.selectComponent('#fix_card_pie');
    pieComponent.init((canvas, width, height) => {
      // 初始化图表
      const pieChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      pieChart.setOption(this.getFixCardOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return pieChart;
    });
  },
  getFixCardOption() {
    return {
      series: [
        {
          name: '点名管理统计',
          type: 'pie',
          hoverAnimation: false,
          radius: '75%',
          center: ['50%', '50%'],
          itemStyle: {
            normal: {
              label: {
                show: true,
                // formatter: '{b} : {c} ({d}%)'
                formatter: '{b} : {d}%'
              },
              labelLine: { show: true }
            }
          },
          labelLine: {
            normal: {
              show: true,
              length: 6,
              length2: 8
            }
          },
          data: this.data.fixCardData
        }
      ],
      color: ['#4abc8e', '#f5bd80']
    }
  }, 
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      proName: app.globalData.nowProname
    });
    // 重新加载数据
    this.getReportData().then(() => wx.stopPullDownRefresh())
  }
})