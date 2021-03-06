// pages/foodhome/foodhome.js
var time = 0;
var touchDot = 0;//触摸时的原点
var interval = "";
var flag_hd = true;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '/image/adpic/01.jpg',
      '/image/adpic/02.jpg',
      '/image/adpic/03.jpg',
    ],
    swiperIndex: 0
  },
  //搜索跳转
  toCookinglist:function(e){
    if (e.detail.value != ''){
      let name = e.detail.value;
      wx.navigateTo({
        url: '../Cookinglist/Cookinglist?name=' + name,
      })
    }else{
      wx.navigateTo({
        url: '../Cookinglist/Cookinglist'
      })
    }

  },
  //搜索跳转
  toCookinglist2: function (e) {
      wx.navigateTo({
        url: '../Cookinglist/Cookinglist'
      })
  },
  //美食菜谱详情
  toCookDetail:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../CookDetail/CookDetail?id='+id,
    })
  },

  //轮播图
  bindchange(e) {
    this.setData({
      swiperIndex: e.detail.current
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
        url: '../classify/classify'
      })
    }
    // 向右滑动   
    if (touchMove - touchDot >= 100 && time < 10 && flag_hd == true) {
      //flag_hd = false;
      //执行切换页面的方法
      //console.log("向左滑动");
      // wx.switchTab({
      //   url: '../foodhome/foodhome'
      // })
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
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
    // wx.showTabBarRedDot({
    //   index: 2,
    //   success: function (e) {
    //     console.log("成功");
    //   }
    // });
    wx.setTabBarBadge({
      index: 2,
      text: '3'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    flag_hd = true;    //重新进入页面之后，可以再次执行滑动切换页面代码
    clearInterval(interval); // 清除setInterval
    time = 0;

    let that = this;
    //展示菜谱数据
    wx.request({
      url: 'https://www.liaoyansheng.top/api/foodlist/showMenuList',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
      },
      dataType: 'json',
      success(res) {
        let food = res.data.filter(item => item.menu_step = JSON.parse(item.menu_step));
        //console.log(food);
        that.setData({
          foodlist: food
        })
      }
    }) 

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