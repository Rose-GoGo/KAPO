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
    loadNore: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading();

    this.setData({
      catid: options.catid

    })

    this.getLine();
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
  onShareAppMessage: function() {},
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
    let _params = {
      catid: this.data.catid,
      title: this.data.title,
      remark: this.data.remark,
      username:'555',
    }
    Api.everyday(_params).then(res => {
      if (!res.data.code) {
        this.setData({
          title: '',
          remark: '',

        })
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        this.getLine();
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
  onGotUserInfo: function(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
  },
})
