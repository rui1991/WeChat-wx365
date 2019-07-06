const fetch = require('../../utils/util');

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPwd: '',
    nowPwd1: '',
    nowPwd2: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 旧密码
  oldPassword(e) {
    this.setData({
      oldPwd: e.detail
    })
  },
  // 新密码1
  nowPassword1(e) {
    this.setData({
      nowPwd1: e.detail
    })
  },
  // 新密码2
  nowPassword2(e) {
    this.setData({
      nowPwd2: e.detail
    })
  },

  /**
   * 确定
   */
  amendConfirm() {
    console.log(this.data.oldPwd)
    console.log(this.data.nowPwd1)
    // 旧密码
    let oldPwd = this.data.oldPwd;
    if (!oldPwd) {
      wx.showToast({
        title: '请输入密码！',
        icon: 'success',
        image: '../../assets/icon/hint.png',
        duration: 2000
      })
      return;
    } else if (!this.verifyPassword(oldPwd)) {
      wx.showToast({
        title: '原密码错误！',
        icon: 'success',
        image: '../../assets/icon/hint.png',
        duration: 2000
      })
      return;
    }
    // 新密码1
    let nowPwd1 = this.data.nowPwd1;
    if (!nowPwd1) {
      wx.showToast({
        title: '请输入新密码！',
        icon: 'success',
        image: '../../assets/icon/hint.png',
        duration: 2000
      })
      return;
    } else if (!this.checkPwd(nowPwd1)) {
      wx.showToast({
        title: '新密码不合法！',
        icon: 'success',
        image: '../../assets/icon/hint.png',
        duration: 2000
      })
      return;
    }
    // 新密码2
    let nowPwd2 = this.data.nowPwd2;
    if (!nowPwd2) {
      wx.showToast({
        title: '请验证新密码！',
        icon: 'success',
        image: '../../assets/icon/hint.png',
        duration: 2000
      })
      return;
    } else if (nowPwd1 !== nowPwd2) {
      wx.showToast({
        title: '两次输入不同！',
        icon: 'success',
        image: '../../assets/icon/hint.png',
        duration: 2000
      })
      return;
    }
    this.amendPassword();
  },
  /**
   * 修改密码
   */
  amendPassword() {
    const oldPwd = this.data.oldPwd;
    const nowPwd = this.data.nowPwd1;
    const params = { user_id: app.globalData.userId, old_pwd: oldPwd, new_pwd: nowPwd };
    fetch.reqMethod(`user/updateUserPass`, params)
      .then(res => {
        if (res.data.result === 'Sucess') {
          wx.showToast({
            title: '密码修改成功！',
            icon: 'success',
            duration: 2000
          });
          // 跳转到我的
          setTimeout(() => {
            wx.switchTab({
              url: "../profile/profile"
            });
          }, 3000);
        } else if (res.data.error_code == 10101) {
          wx.showToast({
            title: '与原密码相同！',
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

  // 校验旧密码
  verifyPassword(input) {
    const userPwd = wx.getStorageSync('ezx_user_pwd');
    if (input === userPwd) {
      return true;
    } else {
      return false;
    }
  },

  // 校验密码是否合法
  checkPwd(input) {
    var regex = /^[0-9a-zA-Z]\w{5,17}$/;
    //match()方法匹配正则表达式
    if (input.match(regex)) {
      return true;
    } else {
      return false;
    }
  }

})