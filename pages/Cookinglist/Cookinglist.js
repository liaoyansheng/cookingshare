// pages/Cookinglist/Cookinglist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_more:1,
    name:''//搜索词
  },
  //输入框失去焦点保存搜索词
  searchWork:function(e){
    let that = this;
    that.setData({
      name:e.detail.value
    })
  },
  //跳转美食菜谱详情
  toCookDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../CookDetail/CookDetail?id=' + id,
    })
  },
  //搜索方法
  searchMenu:function(e){
    let that = this;
    that.setData({
      name: e.detail.value
    })
    this.search();
  },
  //搜索请求
  search:function(){
    let that = this;
    wx.request({
      url: 'https://www.liaoyansheng.top/api/foodlist/searchMenu',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        name: that.data.name
      },
      dataType: 'json',
      success(res) {
        let food = res.data.filter(item => item.menu_step = JSON.parse(item.menu_step));
        console.log(food);
        that.setData({
          foodlist: food
        })
      }
    })
  },
  //搜索排序
  SearchMore:function(e){
    let that =this;
    that.setData({
      search_more : e.currentTarget.dataset.id,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (options.name){
      let name = options.name;
      that.setData({
        name: name
      })
      that.search();
    }else{
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
          console.log(food);
          that.setData({
            foodlist: food
          })
        }
      })
    }

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