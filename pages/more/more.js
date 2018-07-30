// pages/more/more.js
import Api from '/../../utils/config/api.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    catid: '',
    title: '',
    remark: '',
    disabled: true,
    items: {},
    loadNore: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    username:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
     var that = this;
    wx.showLoading();
    that.setData({
      catid: options.catid
    })
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
    that.getLine();
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
  onReachBottom: function() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '锲而舍之,朽木不折;锲而不舍,金石可镂',
      imageUrl: '/assets/images/share.jpg'
    }
  },
  forTitle: function(e) {
    let _data = e.detail.value;
    this.setData({
      title: _data
    });
    if (this.data.title && this.data.remark) {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  forRemark: function(e) {
    let _data = e.detail.value;
    this.setData({
      remark: _data
    });
    if (this.data.title && this.data.remark) {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
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
    }
    Api.everyday(_params).then(res => {
      if (!res.data.code) {
        that.setData({
          title: '',
          remark: '',
          disabled: true
        })
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        that.getLine();
      }
    });
  },
  getLine: function() {
    let _params = {
      year: '2018',
      month: '07',
      catid: this.data.catid,
    }
    Api.showday(_params).then(res => {
      if (!res.data.code) {
        var _data = res.data.data;
        var obj = Object.assign(this.data.items, _data);
        this.setData({
          items: obj
        });
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
