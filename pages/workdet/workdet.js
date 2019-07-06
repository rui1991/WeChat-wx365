const fetch = require('../../utils/util');

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    reqUrl: '',
    name: '',
    coding: '',
    position: '',
    category: '',
    source: '',
    creTime: '',
    crePerson: '',
    nowPerson: '',
    state: '',
    explain: '',
    images: [],
    workLog: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const reqUrl = fetch.reqUrl;
    const params = { wo_id: options.id };
    wx.showLoading({
      title: '加载中...'
    })
    fetch.reqMethod(`workOrder/selWorkOrderOnly`, params)
      .then(res => {
        wx.hideLoading();
        if (res.data.result === "Sucess") {
          // 工单名称
          const name = res.data.data1.wo_name;
          // 流水号
          const coding = res.data.data1.serial_number;
          // 发生位置
          const position = res.data.data1.address || '无';
          // 业务类别
          const category = res.data.data1.skills_name || '无';
          // 来源
          const source = res.data.data1.wo_from;
          // 创建时间
          const creTime = res.data.data1.create_time;
          // 创建人
          const crePerson = res.data.data1.create_user_name;
          // 当前处理人
          const nowPerson = res.data.data1.access_user_name || '无';
          // 工单状态
          const state = res.data.data1.wo_state;
          // 说明
          const explain = res.data.data1.content || '无';
          // 图片
          var imgList = res.data.data1.photo || '';
          if (imgList) {
            imgList = imgList.split(',');
          } else {
            imgList = [];
          }
          var images = [];
          for (let i = 0; i < imgList.length; i++) {
            let imgItem = reqUrl + '/showImage?state=10&fileName=' + imgList[i];
            images.push(imgItem);
          }
          // 日志
          const workLog = res.data.data1.wo_log;
          // 设置数据 
          this.setData({ reqUrl, name, coding, position, category, source, creTime, crePerson, nowPerson, state, explain, images, workLog });

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

  // 预览图片
  previewHandle(e) {
    wx.previewImage({
      current: e.target.dataset.src,
      urls: this.data.images
    })
  }

})