// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  getUserInfo: function (e) {
    //console.log(e);
    wx.showLoading({
      mask: true,
      title: '加载中...',
    });
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    //增加用户
    wx.request({
      url: 'https://www.liaoyansheng.top/api/user/addUser',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        name: e.detail.userInfo.nickName,
        head_img: e.detail.userInfo.avatarUrl
      },
      dataType: 'json',
      success(res) {
        wx.hideLoading()
        //console.log(res);
        console.log(res.data[0].id);
        app.globalData.user = res.data[0];
        wx.switchTab({
          url: '../foodhome/foodhome',
        })
      }
    })


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})