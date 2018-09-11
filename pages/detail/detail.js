// pages/detail/detail.js
import Api from '/../../utils/config/api.js';
let wxparse = require("../../wxParse/wxParse.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dkcontent: '',
    id: '',
    catid: '',
    comments: [], //反馈列表
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    disabled: true,
    loadMore: true,
    focus: false,
    userInfo: {},
    content: '',
    placeholder: '评论...',
    reply_username: '',
    pid: 0,
    page: 1,
    count: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading();
    var that = this;
    let _userInfo = wx.getStorageSync('userInfo')
    that.setData({
      userInfo: _userInfo,
      id: options.id,
      catid: options.catid
    });

    if (wx.getStorageSync('userInfo')) {


    } else {
      wx.getSetting({
        success: function (res) {
          console.log(res)
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function (res) {
                console.log(res)
                let _userInfo = res.userInfo;
                app.globalData.userInfo = _userInfo;
                wx.setStorageSync('userInfo', _userInfo)
              },
              fail: function () {
              }
            })
          }
        }
      });

    }


    that.commentlists(); //反馈列表
    that.getData();
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
    var that = this;
    let page = that.data.page + 1;
    that.setData({
      page: page
    });
    if (that.data.loadMore) {
      that.commentlists();
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.items.title,
      imageUrl: '/assets/images/share.jpg'
    }
  },
  getData: function () {
    var that = this;
    let _params = {
      catid: that.data.catid,
      id: that.data.id
    };
    Api.pageitem(_params).then(res => {
      if (!res.data.code) {
        wx.hideLoading();
        let _data = res.data.data;
        var _tpl = _data.content;
        that.setData({
          items: _data,
          dkcontent: _tpl
        });
        wxparse.wxParse('dkcontent', 'html', _tpl, that, 5);
      }
    })
  },
  forContent: function (e) {
    let _content = e.detail.value;
    this.setData({
      content: _content
    })
  },
  backContent: function (e) { //回复的评论
    let _from = e.currentTarget.dataset.from;
    let _id = e.currentTarget.dataset.pid;
    this.setData({
      placeholder: '回复 ' + _from,
      focus: true,
      reply_username: _from,
      pid: _id
    });
  },
  postComments: function () {
    var that = this;

    if (!that.data.content) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '评论不能为空!'
      });
      return false;
    }
    wx.showLoading();
    let _params = {
      newsid: that.data.id,  // 博客文章ID
      pid: that.data.pid, // 父评论ID，默认为0
      from_username: that.data.userInfo.nickName,  // 评论者用户名
      from_avatar: that.data.userInfo.avatarUrl,   // 评论者头像
      reply_username: that.data.reply_username,  // 回复了谁，pid不为0时，不允许未空
      reply_avatar: "",                 // 回复了谁的头像，允许为空
      content: that.data.content
    }
    Api.postcomments(_params).then(res => {
      if (!res.data.code) {
        wx.hideLoading();
        that.setData({
          content: '',
          page: 1,
          comments: [],
          reply_username: '',
          pid: 0,
          placeholder: '评论...'
        });
        that.commentlists();
      }
    });
  },
  commentlists: function () {
    var that = this;
    let _params = {
      newsid: that.data.id,
      page: this.data.page,
      pagesize: 10
    }
    Api.commentlists(_params).then(res => {
      if (res.data.code == 0) {
        let _data = res.data.data;
        let _count = res.data.count;
        let _arr = that.data.comments.concat(_data);
        that.setData({
          comments: _arr,
          count: _count
        });
        if (_data.length < 10) {
          that.setData({
            loadMore: false
          });
        }
      } else {
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '评论加载失败!'
        })
      }
    });
  },
  rewardRose: function () {
    console.log(222)

    // wx.requestPayment(
    // {
    //   'timeStamp': '',
    //   'nonceStr': '',
    //   'package': '',
    //   'signType': 'MD5',
    //   'paySign': '',
    //   'success':function(res){
    //     console.log('1111')
    //   },
    //   'fail':function(res){},
    //   'complete':function(res){}
    // })
    wx.showModal({
      title: '提示',
      content: '该功能暂未开放',
      showCancel: false
    })
  },
  bindGetUserInfo: function (e) {
    var userInfo = e.detail.userInfo;
    this.setData({
      userInfo: userInfo
    })
  }
})
