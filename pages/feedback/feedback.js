// pages/more/more.js
import Api from '/../../utils/api.js';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false, //不显示分享
    page: 1,
    content: '',
    disabled: true,
    comments: [],
    loadMore: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isRose: false,
    focus: false,
    placeholder: '点击评论回复...',
    pid: 0,
    userInfo: {},
    reply_username: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let _userInfo = wx.getStorageSync('userInfo')
    that.setData({
      userInfo: _userInfo
    });
    if (wx.getStorageSync('userInfo')) { } else {
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function (res) {
                let _userInfo = res.userInfo;
                app.globalData.userInfo = _userInfo;
                wx.setStorageSync('userInfo', _userInfo)
              },
              fail: function () { }
            })
          }
        }
      });
    }
    that.commentlists(); //反馈列表
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      comments: [],
      page: 1
    });
    that.commentlists();
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
  onShareAppMessage: function (res) {
    return {
      title: '锲而舍之,朽木不折;锲而不舍,金石可镂',
      imageUrl: '/assets/images/share.jpg'
    }
  },
  forRemark: function (e) {
    var that = this;
    let _data = e.detail.value;
    // 禁止输入空格
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    var emptyy = re.test(_data);
    if (emptyy) return false;
    //end
    that.setData({
      content: _data
    });
    if (that.data.content) {
      that.setData({
        disabled: false
      })
    } else {
      that.setData({
        disabled: true
      })
    }
  },
  rewardRose: function () {
    var that = this;
    that.setData({
      show: true
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
  bindGetUserInfo: function (e) {
    var that = this;
    var userInfo = {};
    if (e.detail.userInfo) {
      userInfo = e.detail.userInfo;
    } else {
      wx.getUserInfo({
        success: function (res) {
          userInfo = res.userInfo;
        },
        fail: function (res) {
          wx.showModal({
            showCancel: false,
            confirmColor: '#1d8f59',
            confirmColor: '#1d8f59',
            content: '授权通过后才能评论哟，请重新授权！'
          })
        }
      })
    }
    if (JSON.stringify(userInfo) == '{}') return false;
    that.setData({
      userInfo: userInfo
    })
    that.postComments()
  },
  postComments: function () {
    var that = this;
    if (!that.data.content) {
      wx.showModal({
        showCancel: false,
        confirmColor: '#1d8f59',
        content: '评论不能为空!'
      });
      return false;
    }
    if (!that.data.userInfo) return false;
    wx.showLoading();
    let _params = {
      type: "punch",
      pid: that.data.pid, // 父评论ID，默认为0
      from_username: that.data.userInfo.nickName, // 评论者用户名
      from_avatar: that.data.userInfo.avatarUrl, // 评论者头像
      reply_username: that.data.reply_username, // 回复了谁，pid不为0时，不允许未空
      reply_avatar: "", // 回复了谁的头像，允许为空
      content: that.data.content
    }
    Api.postcomments(_params).then(res => {
      if (!res.data.code) {
        wx.showToast({
          title: '评论成功',
          icon: 'success',
          duration: 2000
        })
        that.setData({
          content: '',
          page: 1,
          comments: [],
          reply_username: '',
          pid: 0,
          placeholder: '点击评论回复...',
          disabled: true
        });
        that.commentlists();
      }
    });
  },
  commentlists: function () {
    var that = this;
    let _params = {
      type: "punch",
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
          confirmColor: '#1d8f59',
          content: '评论加载失败!'
        })
      }
    });
  },
  modalCancel: function () {
    this.setData({
      show: false
    })
  },
  onPageScroll: function (e) {
    console.log(e)
    if (e.scrollTop > 100) {
      this.setData({
        backShow: true
      });
    } else {
      this.setData({
        backShow: false
      });
    }
  },
   goHome: function(){
    wx.switchTab({
      url: '../index/index'
    });
  }
})
