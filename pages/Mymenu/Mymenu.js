// pages/Mymenu/Mymenu.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //美食菜谱详情
  toCookDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../CookDetail/CookDetail?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    });
    let that = this;
    wx.request({
      url: 'https://www.liaoyansheng.top/api/user/showmymenu',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        name: app.globalData.user.name,
      },
      dataType: 'json',
      success(res) {
        //console.log(res)
        let foodlist = res.data.filter(item => item.menu_step = JSON.parse(item.menu_step));
        that.setData({
          menulist: foodlist
        })
        wx.hideLoading()
      }
    });
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