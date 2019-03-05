// pages/classify/classify.js
var time = 0;
var touchDot = 0;//触摸时的原点
var interval = "";
var flag_hd = true;

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //分类搜索列表
  toCookinglist:function(){
    wx.navigateTo({
      url: '../Cookinglist/Cookinglist',
    })
  },
  // 触摸开始事件
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸结束事件
  touchEnd: function (e) {
    var touchMove = e.changedTouches[0].pageX;
    // 向左滑动   
    if (touchMove - touchDot <= -100 && time < 10 && flag_hd == true) {
      flag_hd = false;
      //执行切换页面的方法
      //console.log("向右滑动");
      wx.switchTab({
        url: '../index/index'
      })
    }
    // 向右滑动   
    if (touchMove - touchDot >= 100 && time < 10 && flag_hd == true) {
      flag_hd = false;
      //执行切换页面的方法
      //console.log("向左滑动");
      wx.switchTab({
        url: '../foodhome/foodhome'
      })
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff0000',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
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
    flag_hd = true;    //重新进入页面之后，可以再次执行滑动切换页面代码
    clearInterval(interval); // 清除setInterval
    time = 0;
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