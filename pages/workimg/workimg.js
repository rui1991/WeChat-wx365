const fetch = require('../../utils/util');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const reqUrl = fetch.reqUrl;
    const url = options.url;
    const imgUrl = reqUrl + '/showImage?state=10&fileName=' + url;
    this.setData({ imgUrl });
  }
})