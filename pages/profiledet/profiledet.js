const fetch = require('../../utils/util');

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    photo: '',
    name: '',
    phone: '',
    section: '',
    role: '',
    accredit: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const reqUrl = fetch.reqUrl;
    const params = { user_id: app.globalData.userId };
    wx.showLoading({
      title: '加载中...'
    })
    fetch.reqMethod(`user/selUserOnly`, params)
      .then(res => {
        wx.hideLoading();
        if (res.data.result === "Sucess") {
          // 头像
          const icon = res.data.data1.head_picture || '';
          var photo = '';
          if (icon) {
            photo = reqUrl + '/showImage?state=0&fileName=' + icon;
          } else {
            photo = '/assets/icon/icon.png';
          }
          // 姓名
          const name = res.data.data1.user_name;
          // 手机号
          const phone = res.data.data1.user_phone;
          // 所属部门
          const section = res.data.data1.organize_name || '';
          // 角色
          const role = res.data.data1.role_name || '';
          // 授权范围
          let accreditArr = res.data.data1.userOgzs || []; 
          let accredit = []
          accreditArr.forEach(item => {
            accredit.push(item.organize_name)
          })
          accredit = accredit.join('、')
          // 设置数据  
            this.setData({ photo, name, phone, section, role, accredit });
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