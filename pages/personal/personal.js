// pages/personal/personal.js
const app = getApp()

var time = 0;
var touchDot = 0;//触摸时的原点
var interval = "";
var flag_hd = true;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu:1,
  },
  // toCookDetail: function (e) {
  //   let id = e.currentTarget.dataset.id;
  //   wx.navigateTo({
  //     url: '../CookDetail/CookDetail?id=' + id,
  //   })
  // },
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
    let that = this;
    var touchMove = e.changedTouches[0].pageX;
    // 向左滑动   
    if (touchMove - touchDot <= -100 && time < 10 && flag_hd == true) {
      //flag_hd = false;
      //执行切换页面的方法
      //console.log("向右滑动");
      if (that.data.statu == 1) {
        that.setData({
          statu: 2
        })
      } else if (that.data.statu == 2) {
        that.setData({
          statu: 3
        })
      } else if (that.data.statu == 3) {
        console.log("到底了");
      }
    }
    // 向右滑动   
    if (touchMove - touchDot >= 100 && time < 10 && flag_hd == true) {
      //flag_hd = false;
      //执行切换页面的方法
      //console.log("向左滑动");
      if(that.data.statu == 1){
        console.log("到底了");
      } else if (that.data.statu == 2){
        that.setData({
          statu:1
        })
      } else if (that.data.statu == 3) {
        that.setData({
          statu: 2
        })
      }

    }
    clearInterval(interval); // 清除setInterval
    time = 0;
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
    let that = this;
    that.setData({
      statu: options.statu
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

    this.finduser();
    this.userattention();
    this.UserCommentCount();
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

  },
  //获取收藏信息
  finduser: function () {
    wx.showLoading({
      title: '加载中',
    })
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
        //let attention = JSON.parse(res.data[0].attention_list)
        //console.log(collection.toString());
        wx.request({
          url: 'https://www.liaoyansheng.top/api/user/collectionList',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            collection_list: collection.toString()
          },
          dataType: 'json',
          success(res) {
            wx.hideLoading()
            //console.log(res)
            let food = res.data.filter(item => item.menu_step = JSON.parse(item.menu_step));
            that.setData({
              collection: food
            })
          }
        })

      }
    })
  },

  //获取关注信息
  userattention: function () {
    wx.showLoading({
      title: '加载中',
    })
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
        let attention = JSON.parse(res.data[0].attention_list)
        wx.request({
          url: 'https://www.liaoyansheng.top/api/user/attentionList',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            attention_list: attention.toString()
          },
          dataType: 'json',
          success(res) {
            wx.hideLoading()
            console.log(res.data)
            that.setData({
              attention: res.data
            })
          }
        })

      }
    })
  },

  //获取评论数据
  UserCommentCount: function () {
    wx.showLoading({
      title: '加载中',
    })
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
        wx.hideLoading()
        //console.log(res);
        that.setData({
          comment: res.data
        })
      }
    })
  },

  //取消关注
  noattention: function (e) {
    let that = this;
    let author = e.currentTarget.dataset.name;

    wx.showModal({
      title: '提示',
      content: '确定不再关注？',
      success(res) {
        if (res.confirm) {
          //console.log('用户点击确定')

          wx.request({
            url: 'https://www.liaoyansheng.top/api/user/user',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              name: app.globalData.user.name,
            },
            dataType: 'json',
            success(res) {
              let attention_array1 = JSON.parse(res.data[0].attention_list);
              let index = attention_array1.indexOf(author);
              attention_array1.splice(index, 1)

              wx.request({
                url: 'https://www.liaoyansheng.top/api/user/attent',
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  name: app.globalData.user.name,
                  attention_list: JSON.stringify(attention_array1)
                },
                dataType: 'json',
                success(res) {
                  //console.log(res);
                  if (res.statusCode == 200) {
                    wx.showToast({
                      icon: 'none',
                      title: '已取消关注',
                    })
                    that.setData({
                      attented: false
                    })
                  }
                  that.userattention();
                }
              })

            }
          })

        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })

  },

  //切换
  mycollection: function () {
    this.setData({
      statu: 1,
    })
  },
  mymind: function () {
    this.setData({
      statu: 2,
    })
  },
  mycomment: function () {
    this.setData({
      statu: 3,
    })
  },


})