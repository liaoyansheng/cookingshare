// pages/CookMethod/CookMethod.js
let app = getApp();
let wechat = require("../../utils/wechat");
var Utils = require('../../utils/util.js')
var list = []
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    head_img:'',
    img_arr: [],//选择的临时图片
    menu_step:[],//步骤数组对象
    menu_material:[],//菜谱材料数组对象
    imgIndex: 0,
  },
 //发布上传
  keep:function(e){
    let that = this;
    wx.request({
      url: 'https://www.liaoyansheng.top/api/foodlist/addmenu',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        data: JSON.stringify(e.detail.value),
        menu_step: JSON.stringify(that.data.menu_step),
      },
      dataType: 'json',
      success(res) {
        console.log(res);
      }
    })

  },
  //选择步骤图片
  chooseimg:function(){
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: 'compressed',
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        that.setData({
          img_arr: that.data.img_arr.concat(tempFilePaths[0])
        })
        wx.uploadFile({
          url: 'https://www.liaoyansheng.top/api/foodlist/uploadImg',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {},
          header: {
            'Content-Type': "multipart/form-data"
          },
          success(res) {
            //console.log(res)
            let path = JSON.parse(res.data);
            let img = {
              path: path,
              content:''
              }
            that.setData({
              menu_step: that.data.menu_step.concat(img)
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (app.globalData.user) {
      console.log(app.globalData.user);
      that.setData({
        name: app.globalData.user.name,
        head_img: app.globalData.user.head_img
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

  },

//输入监听
  inputCon: function (e) {
    let that = this;
    that.data.menu_step[e.currentTarget.id - 1].content = e.detail.value;
  },

//失去焦点监听根据失去监听的input的位置来判断图片的插入位置
  outBlur: function (e) {
    let that = this;
    that.data.imgIndex = e.currentTarget.id - 0;
  },


//添加图片
  addImg: function () {
    var that = this;
    //这里考虑到性能，对于图片张数做了限制
    if (that.data.menu_step.length >= 8) {//超过8张
      wx.showModal({
        title: '提示',
        content: '最多只能添加八张图片哦',
        confirmText: "我知道了",
        confirmColor: "#ef8383",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          } else if (res.cancel) {
          }
        }
      })
    } else {//添加图片
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

                wx.uploadFile({
                  url: 'https://www.liaoyansheng.top/api/foodlist/uploadImg',
                  filePath: res.tempFilePaths[0],
                  name: 'file',
                  formData: {},
                  header: {
                    'Content-Type': "multipart/form-data"
                  },
                  success(res) {
                    //console.log(res)
                    let path = JSON.parse(res.data);
                    let info = {
                      pic: path.path,//图片地址
                      content: '',//存储图片下方相邻的输入框的内容
                    }
                    that.data.menu_step.splice(that.data.imgIndex, 0, info);//方法自行百度
                    that.setData({
                      menu_step: that.data.menu_step,
                    })
                  }
                })

              }
            })
          }
        },
        fail (res) {
          //console.log(res.errMsg)
        }
      })
    }
  },


//删除图片
  deletedImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    wx.showActionSheet({
      itemList: ['删除图片'],
      success: function (res) {
        if (res.tapIndex === 0) {//点击删除图片
          if (index === 0 && that.data.menu_step[index].content != null) {//删除第一张，要与最上方的textarea合并
            that.data.firstCon = that.data.firstCon + that.data.menu_step[index].content;
          } else if (index > 0 && that.data.menu_step[index].content != null) {
            that.data.menu_step[index - 1].content = that.data.menu_step[index - 1].content + that.data.menu_step[index].content;
          }
          that.data.menu_step.splice(index, 1);
          that.setData({
            menu_step: that.data.menu_step
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },


})