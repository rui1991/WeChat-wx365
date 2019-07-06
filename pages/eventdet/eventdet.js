const fetch = require('../../utils/util');

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    reqUrl: '',
    icon: '',
    user: '',
    level: '',
    genre: '',
    state: '',
    createTime: '',
    title: '',
    content: '',
    images: [],
    position: '',
    readUsers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const reqUrl = fetch.reqUrl;
    const params = { project_id: app.globalData.nowProid, user_id: app.globalData.userId, te_id: options.id, event_state: options.state };
    wx.showLoading({
      title: '加载中...'
    })
    fetch.reqMethod(`event/selEventToAll`, params)
      .then(res => {
        wx.hideLoading();
        if (res.data.result === "Sucess") {
          // 头像
          const icon = res.data.data1.user_headpicture;
          // 用户
          const user = res.data.data1.user_name;
          // 紧急程度
          const level = res.data.data1.event_level;
          // 事件类型
          const genre = res.data.data1.event_type;
          // 事件状态
          const state = res.data.data1.event_state;
          // 创建时间
          const createTime = res.data.data1.create_time;
          // 标题
          const title = res.data.data1.event_title;
          // 内容
          const content = res.data.data1.event_content;
          // 图片
          const imgList = res.data.data1.add_info;
          var images = [];
          for (let i = 0; i < imgList.length; i++) {
            let imgItem = reqUrl + '/showImage?state=2&fileName=' + imgList[i];
            images.push(imgItem);
          }
          // 位置
          const position = res.data.data1.address || '未添加位置信息';
          // 已读用户
          const readUsers = res.data.data1.readUsers;
          // 设置数据 
          this.setData({ reqUrl, icon, user, level, genre, state, createTime, title, content, images, position, readUsers });

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