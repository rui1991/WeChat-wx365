const fetch = require('../../utils/util');

const app = getApp();

Page({
  /**
   * 页面的初始数据 
   */
  data: {
    initUserName: '',
    initUserPwd: '',
    userName: '',
    userPwd: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userName = wx.getStorageSync('ezx_user_phone');
    let userPwd = wx.getStorageSync('ezx_user_pwd');
    if (userName && userPwd) {
      this.setData({
        initUserName: userName,
        initUserPwd: userPwd,
        userName: userName,
        userPwd: userPwd
      })
      this.loginSkip();
    }
  },

  // 用户名 
  userNameInput(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  // 密码
  userPwdInput(e) {
    this.setData({
      userPwd: e.detail.value
    })
  },
  // 登录
  loginDispose() {
    let userName = this.data.userName;
    if (!userName) {
      wx.showToast({
        title: '请输入用户名！',
        icon: 'success',
        image: '../../assets/icon/hint.png',
        duration: 2000
      })
      return;
    } else if (!fetch.checkPhone(userName)) {
      wx.showToast({
        title: '手机号码不合法！',
        icon: 'success',
        image: '../../assets/icon/hint.png',
        duration: 2000
      })
      return;
    }
    let userPwd = this.data.userPwd;
    if (!userPwd) {
      wx.showToast({
        title: '请输入密码！',
        icon: 'success',
        image: '../../assets/icon/hint.png',
        duration: 2000
      })
      return;
    }
    this.loginSkip();
  },
  // 跳转页面
  loginSkip() {
    const params = { type: 0, user_phone: this.data.userName, user_pwd: this.data.userPwd };
    wx.showLoading({
      title: '正在登录...'
    })
    fetch.reqMethod(`login`, params)
      .then(res => {
        wx.hideLoading();
        if (res.data.result === "Sucess") {
          // 保存用户名和密码
          wx.setStorageSync('ezx_user_phone', this.data.userName);
          wx.setStorageSync('ezx_user_pwd', this.data.userPwd);
          // 保存登录信息
          const loginData = res.data.data1
          // 保存企业名称
          app.globalData.companyName = loginData.user.company_name;
          // 保存用户ID
          app.globalData.userId = loginData.user.user_id;
          // 保存用户名称
          app.globalData.userName = loginData.user.user_name;
          // 保存用户号码
          app.globalData.userPhone = loginData.user.user_phone;
          // 用户头像
          app.globalData.userPhoto = loginData.user.head_picture || '';
          // 保存用户项目
          const projects = loginData.projects;
          if (projects.length === 0) {
            wx.showToast({
              title: '还未分配项目！',
              icon: 'success',
              image: '../../assets/icon/hint.png',
              duration: 2000
            })
            return;
          }
          // 当前项目
          let lastPro = loginData.last_project || ''
          // 获取当前项目信息
          let nowProindex = 0
          let nowProid = ''
          let nowProname = ''
          let nowOrgid = ''
          let nowClientid = ''
          if (lastPro) {
            projects.forEach((item, index, array) => {
              if (item.project_id == lastPro) {
                nowProindex = index
                nowProid = item.project_id
                nowProname = item.project_name
                nowOrgid = item.organize_id
                nowClientid = item.company_id
              }
            })
          }
          if (!nowProid) {
            nowProindex = 0
            nowProid = projects[0].project_id
            nowProname = projects[0].project_name
            nowOrgid = projects[0].organize_id
            nowClientid = projects[0].company_id
          }
          // 保存当前项目信息
          app.globalData.projects = projects;
          app.globalData.nowProindex = nowProindex;
          app.globalData.nowProid = nowProid;
          app.globalData.nowProname = nowProname;
          app.globalData.nowOrgid = nowOrgid;
          app.globalData.nowClientid = nowClientid;
          // 跳转到首页
          wx.switchTab({
            url: "../home/home"
          });
        } else {
          if (res.data.error_code == 10098) {
            wx.showToast({
              title: '用户不存在！',
              icon: 'success',
              image: '../../assets/icon/hint.png',
              duration: 2000
            })
          } else if (res.data.error_code == 10005) {
            wx.showToast({
              title: '密码错误！',
              icon: 'success',
              image: '../../assets/icon/hint.png',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '请求失败！',
              icon: 'success',
              image: '../../assets/icon/hint.png',
              duration: 2000
            })
          }
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
