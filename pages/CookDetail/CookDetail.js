// pages/CookDetail/CookDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menu_id:'',
    author:'',
    attented:false,
    col:false,
    attention_list:[],//用户关注的
    collection_list:[],
    food:{},
    userInfo: {},
    hasUserInfo: false,
    mycomment:'',//评论框值
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //查看图片
  preview:function(e){
    let that = this;
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.url] // 需要预览的图片http链接列表
    })
  },
  //失去焦点获取值
  getshareword:function(e){
    this.setData({
      share_content: e.detail.value
    })
  },
  //提交分享
  keepshare:function(){
    wx.showLoading({
      mask: true,
      title: '分享中...',
    });
    let that = this;

    wx.uploadFile({
      url: 'https://www.liaoyansheng.top/api/foodlist/uploadImg',
      filePath: that.data.tempFilePaths,
      name: 'file',
      formData: {},
      header: {
        'Content-Type': "multipart/form-data"
      },
      success(res) {
        let path = JSON.parse(res.data);
        //console.log(path.path);
        wx.request({
          url: 'https://www.liaoyansheng.top/api/foodlist/addfoodshare',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            menu_id:that.data.menu_id,
            name: app.globalData.user.name,
            head_img: app.globalData.user.head_img,
            share_img: path.path,
            share_content:that.data.share_content
          },
          dataType: 'json',
          success(res) {
            wx.hideLoading()
            if (res.statusCode == 200) {
              wx.showToast({
                icon: 'success',
                title: '分享成功',
              })
              that.hideView1();
              that.showfoodshare();
            }
          }
        })

      }
    })
  },
  //分享窗口关闭
  hideView1:function(){
    this.setData({
      showModalStatus1: false
    })
  },
  //选择图片分享
  takeshare:function(){
    let that = this;
    wx.showActionSheet({
      itemList: ['从相册选择', '拍照'],
      itemColor: '#ef8383',
      success: function (res) {
        var choseType = res.tapIndex == 0 ? "album" : res.tapIndex == 1 ? "camera" : "";
        if (choseType != "") {
          wx.chooseImage({
            sizeType: ['compressed'],//压缩图
            sourceType: [choseType],
            count: 1,//每次添加一张
            success: function (res) {
              that.setData({
                showModalStatus1: true,
                tempFilePaths: res.tempFilePaths[0]
              })

            }
          })
        }
      },
      fail(res) {
        //console.log(res.errMsg)
      }
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
    var that = this;
    var id = options.id;
    that.setData({
      menu_id: id
    })
    //展示菜谱数据
    wx.request({
      url: 'https://www.liaoyansheng.top/api/foodlist/Menu',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        id:id
      },
      dataType: 'json',
      success(res) {
        let food = res.data.filter(item => item.menu_step = JSON.parse(item.menu_step));
        // console.log(food);
        that.setData({
          food: food[0],
          author: food[0].name
        })
      }
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.showfoodshare();
    this.showcomment();
    this.showattented();
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

  //写评论弹窗
  writecomment: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  // 隐藏遮罩层
  hideView() {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  //获取用户关注信息
  showattented:function(){
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
        let attention_array = JSON.parse(res.data[0].attention_list);
        let collection_array = JSON.parse(res.data[0].collection_list);
        //console.log(array.indexOf(that.data.author));
        if (attention_array.indexOf(that.data.author) == -1) {
          //console.log("-1");
          that.setData({
            attented: false
          })
        } else {
          //console.log("1");
          that.setData({
            attented: true
          })
        }
        if (collection_array.indexOf(that.data.menu_id) == -1) {
          //console.log("-1");
          that.setData({
            col: false
          })
        } else {
          //console.log("1");
          that.setData({
            col: true
          })
        }
      }
    });
  },

  //展示网友分享
  showfoodshare: function () {
    let that = this;
    wx.request({
      url: 'https://www.liaoyansheng.top/api/foodlist/showfoodshare',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        menu_id: that.data.menu_id,
      },
      dataType: 'json',
      success(res) {
        //console.log(res.data);
        that.setData({
          foodshare: res.data
        })
      }
    })
  },

  //展示评论
  showcomment:function(){
    let that = this;
    wx.request({
      url: 'https://www.liaoyansheng.top/api/foodlist/showcomment',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        menu_id: that.data.menu_id,
      },
      dataType: 'json',
      success(res) {
        //console.log(res.data);
        that.setData({
          foodcomment: res.data
        })
      }
    })
  },

  //评论输入框失去焦点保存
  savecomment: function (e) {
    let that = this;
    that.setData({
      mycomment: e.detail.value
    })
    //console.log(that.data.mycomment);
  },
  //发表评论
  keepcomment: function () {
    let that = this;
    if (that.data.mycomment != ''){
      wx.request({
        url: 'https://www.liaoyansheng.top/api/foodlist/addcomment',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          name: app.globalData.user.name,
          head_img: app.globalData.user.head_img,
          menu_id: that.data.food.id,
          content: that.data.mycomment
        },
        dataType: 'json',
        success(res) {
          wx.showToast({
            title: '评论成功',
          })
          console.log(res);
          that.showcomment();
          that.hideView();
        }
      })
    }else{
      wx.showToast({
        icon: 'none',
        title: '评论不能为空哦！',
      })
    }

  },

  //收藏
  collection: function () {

    let that = this;
    console.log(this.data.menu_id)
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
        console.log(res.data[0].collection_list);
        if (res.data[0].collection_list == '' || res.data[0].collection_list == null) {
          console.log("收藏为空");
          let collection_list = that.data.collection_list.concat(that.data.menu_id);
          wx.request({
            url: 'https://www.liaoyansheng.top/api/user/collected',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              name: app.globalData.user.name,
              collection_list: JSON.stringify(collection_list)
            },
            dataType: 'json',
            success(res) {
              //console.log(res);
              if (res.statusCode == 200) {
                wx.showToast({
                  icon: 'success',
                  title: '收藏成功',
                })
                that.setData({
                  col: true
                })
              }
            }
          })
        } else {
          console.log("已有收藏");
          let collection_list1 = JSON.parse(res.data[0].collection_list);
          let collection_list2 = collection_list1.concat(that.data.menu_id);
          let collection_list = Array.from(new Set(collection_list2))
          wx.request({
            url: 'https://www.liaoyansheng.top/api/user/collected',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              name: app.globalData.user.name,
              collection_list: JSON.stringify(collection_list)
            },
            dataType: 'json',
            success(res) {
              //console.log(res);
              if (res.statusCode == 200) {
                wx.showToast({
                  icon: 'success',
                  title: '收藏成功',
                })
                that.setData({
                  col: true
                })
              }
            }
          })
        }
      }
    })

  },

  //取消收藏
  nocollection: function () {
    let that = this;
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
        //console.log(res.data[0].attention_list);
        let collection_list1 = JSON.parse(res.data[0].collection_list);
        let index = collection_list1.indexOf(that.data.menu_id);
        //console.log(index);
        collection_list1.splice(index, 1)

        wx.request({
          url: 'https://www.liaoyansheng.top/api/user/collected',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            name: app.globalData.user.name,
            collection_list: JSON.stringify(collection_list1)
          },
          dataType: 'json',
          success(res) {
            //console.log(res);
            if (res.statusCode == 200) {
              wx.showToast({
                icon: 'none',
                title: '已取消收藏',
              })
              that.setData({
                col: false
              })
            }
          }
        })

      }
    })
  },

  //关注
  attention: function () {
    let that = this;
    //console.log(this.data.menu_id)
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
        //console.log(res.data[0].attention_list);
        if (res.data[0].attention_list == '' || res.data[0].attention_list == null) {
          //console.log("关注为空");
          let attention_list = that.data.attention_list.concat(that.data.author);
          wx.request({
            url: 'https://www.liaoyansheng.top/api/user/attent',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              name: app.globalData.user.name,
              attention_list: JSON.stringify(attention_list)
            },
            dataType: 'json',
            success(res) {
              //console.log(res);
              if (res.statusCode == 200) {
                wx.showToast({
                  icon: 'success',
                  title: '关注成功',
                })
                that.setData({
                  attented: true
                })
              }
            }
          })
        } else {
          //console.log("已有关注");
          let attention_array1 = JSON.parse(res.data[0].attention_list);
          let attention_array2 = attention_array1.concat(that.data.author);
          let attention_list = Array.from(new Set(attention_array2))
          wx.request({
            url: 'https://www.liaoyansheng.top/api/user/attent',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              name: app.globalData.user.name,
              attention_list: JSON.stringify(attention_list)
            },
            dataType: 'json',
            success(res) {
              //console.log(res);
              if (res.statusCode == 200) {
                wx.showToast({
                  icon: 'success',
                  title: '关注成功',
                })
                that.setData({
                  attented: true
                })
              }
            }
          })
        }
      }
    })
  },

  //取消关注
  noattention: function () {
    let that = this;
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
        //console.log(res.data[0].attention_list);
        let attention_array1 = JSON.parse(res.data[0].attention_list);
        let index = attention_array1.indexOf(that.data.author);
        //console.log(index);
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
          }
        })

      }
    })

  },

})