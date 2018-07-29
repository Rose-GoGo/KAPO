// pages/more/more.js
import Api from '/../../utils/config/api.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    catid: '5',
    page: 1,
    title: '',
    remark: '',
    disabled: true,
    items: [],
    loadMore: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    username:'',
    sex: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.showLoading();
    wx.getSetting({
          success: function(res){
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function(res) {
                  var userInfo = res.userInfo;
                  that.setData({
                    username:userInfo.nickName,
                    sex: userInfo.gender
                  })
                }
              })
            }
          }
        });
    that.feedback();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    let page = that.data.page + 1;
    that.setData({
      page:page
    });
    if(that.data.loadMore){
      that.feedback();
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  forTitle: function(e) {
    var that = this;
    let _data = e.detail.value;
    that.setData({
      title: _data
    });
    if (that.data.title && that.data.remark) {
      that.setData({
        disabled: false
      })
    } else {
      that.setData({
        disabled: true
      })
    }
  },
  forRemark: function(e) {
    var that = this;
    let _data = e.detail.value;
    that.setData({
      remark: _data
    });
    if (that.data.title && that.data.remark) {
      that.setData({
        disabled: false
      })
    } else {
      that.setData({
        disabled: true
      })
    }
  },
  formSubmit: function() {
    var that = this;
    let _params = {
      catid: that.data.catid,
      title: that.data.title,
      remark: that.data.remark,
      username: that.data.username,
      sex: that.data.sex
    }
    Api.everyday(_params).then(res => {
      if (!res.data.code) {
        that.setData({
          title: '',
          remark: '',
          page: 1,
          items:[],
          disabled: true
        });
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        });
         that.feedback();
      }
    });
  },
  feedback: function() {
    var that = this;
    wx.showLoading();
    let _params = {
      page: that.data.page
    }
    Api.feedback(_params).then(res => {
      if (!res.data.code) {
        let _data = res.data.data;
        let _arr = that.data.items.concat(_data);
        that.setData({
          items: _arr
        });
        if(_arr.length<10){
          that.setData({
            loadMore: false
          })
        }
        wx.hideLoading();
      }
    });
  },
  bindGetUserInfo: function(e) {
    var that = this;
    var userInfo = e.detail.userInfo;
      that.setData({
        username:userInfo.nickName,
        sex: userInfo.gender
      });
      that.formSubmit();
    }
})
