//index.js
//获取应用实例
const app = getApp()

var time = 0;
var touchDot = 0;//触摸时的原点
var interval = "";
var flag_hd = true;

Page({
  data: {
    attention:[],
    collection:[],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //收藏、关注、评论
  topersonal:function(e){
    let statu = e.currentTarget.dataset.statu
    wx:wx.navigateTo({
      url: '../personal/personal?statu='+statu,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  toCookRecord:function(){
    wx.navigateTo({
      url: '../CookRecord/CookRecord',
    })
  },
  toMymenu:function(){
    wx.navigateTo({
      url: '../Mymenu/Mymenu',
    })
  },
  //上传攻略
  toCookMethod:function(){
    wx.navigateTo({
      url: '../CookMethod/CookMethod',
    })
  },
  toBrowseHistory:function(){
    wx.navigateTo({
      url: '../BrowseHistory/BrowseHistory',
    })
  },
  tofeedback:function(){
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },
  //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onLoad: function () {
    var that = this;
    wx.removeTabBarBadge({
      index: 2
    });

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (that.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      //在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e);
  
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
        console.log(res);
        console.log(res.data[0].id);
        app.globalData.user = res.data[0];

      }
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
      //flag_hd = false;
      //执行切换页面的方法
      //console.log("向右滑动");
      // wx.switchTab({
      //   url: '../index/index'
      // })
    }
    // 向右滑动   
    if (touchMove - touchDot >= 100 && time < 10 && flag_hd == true) {
      flag_hd = false;
      //执行切换页面的方法
      //console.log("向左滑动");
      wx.switchTab({
        url: '../classify/classify'
      })
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    // console.log(app.globalData.userInfo);
    // if (app.globalData.user){
    //   console.log(app.globalData.user);
    // }

    flag_hd = true;    //重新进入页面之后，可以再次执行滑动切换页面代码
    clearInterval(interval); // 清除setInterval
    time = 0;
    this.finduser();
    this.UserCommentCount();
  },
  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady: function () {
    wx.showTabBarRedDot({
      index: 2,
      success: function (e) {
        // console.log("成功");
      }
    });
    // wx.hideTabBarRedDot({
    //   index: 2,
    //   success: function (e) {
    //     console.log("成功");
    //   }
    // })
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {

  },

  //获取用户信息
  finduser:function(){
    let that = this;
    wx.request({
      url: 'https://www.liaoyansheng.top/api/user/user',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        name: app.globalData.user.name
      },
      dataType: 'json',
      success(res) {
        //console.log(JSON.parse(res.data[0].attention_list));
        let collection = JSON.parse(res.data[0].collection_list)
        let attention = JSON.parse(res.data[0].attention_list)
        that.setData({
          attention: attention,
          collection: collection
        })
      }
    })
  },

  //获取评论数据
  UserCommentCount:function(){
    let that = this;
    wx.request({
      url: 'https://www.liaoyansheng.top/api/user/UserCommentCount',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        name: app.globalData.user.name
      },
      dataType: 'json',
      success(res) {
        //console.log(res);
        that.setData({
          comment:res.data
        })
      }
    })
  }
})
