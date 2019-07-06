// pages/profile/profile.js
const fetch = require('../../utils/util');

const app = getApp();

// import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhoto: '',
    userName: '',
    companyName: '',
    show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const reqUrl = fetch.reqUrl;
    const icon = app.globalData.userPhoto;
    var userPhoto = '';
    if (icon) {
      userPhoto = reqUrl + '/showImage?state=0&fileName=' + icon;
    } else {
      userPhoto = '/assets/icon/icon.png';
    }
    const userName = app.globalData.userName;
    const companyName = app.globalData.companyName; 
    this.setData({ userPhoto, userName, companyName });
  },

  // 退出登录
  quitLogin() {
    this.setData({ show: true });
    // wx.removeStorageSync('ezx_user_phone');
    // wx.removeStorageSync('ezx_user_pwd');
    // // 跳转到登录页
    // wx.reLaunch({
    //   url: "../login/login"
    // });
  },
  // 取消
  onCancel() {
    this.setData({ show: false });
  },
  // 确定
  onConfirm() {
    this.setData({ show: false });
    // 清除账号密码
    wx.removeStorageSync('ezx_user_phone');
    wx.removeStorageSync('ezx_user_pwd');
    // 跳转到登录页
    wx.reLaunch({
      url: "../login/login"
    });
  }


})