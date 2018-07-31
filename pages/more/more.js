// pages/more/more.js
import Api from '/../../utils/config/api.js';
Page({
  /**
   * 页面的初始数据
   */
   data: {
    bigData:{},
    catid: '',
    title: '',
    remark: '',
    disabled: true,
    items: {},
    loadMore: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    username: '',
    year: "2018",
    month: '',
    topyear:"",
    topMonth:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
    var that = this;
    wx.showLoading();
    var ss = new Date().getMonth() + 1;
    ss = ss>=10? ''+ss:'0'+ss;
    that.setData({
      catid: options.catid,
      month : ss
    })
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              var userInfo = res.userInfo;
              that.setData({
                username: userInfo.nickName,
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
   onPullDownRefresh: function () { },
  /**
   * 页面上拉触底事件的处理函数
   */
   onReachBottom: function () {
    var that  = this;
    that.earMonth();
    if(that.data.loadMore){
      that.getLine();
    }
  },
  /**
   * 用户点击右上角分享
   */
   onShareAppMessage: function () {
    return {
      title: '锲而舍之,朽木不折;锲而不舍,金石可镂',
      imageUrl: '/assets/images/share.jpg'
    }
  },
  forTitle: function (e) {
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
  forRemark: function (e) {
    var that =this;
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
  formSubmit: function () {
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
  earMonth: function (n) { //获取年月
    var ym, year,month;
    year = this.data.year;
    month = this.data.month;
    ym = year + '-' + month;
    if (new Date(ym).getMonth() == 0) {
      year = year - 1;
      month = 12;
    } else {
      year = year;
      month = month - 1;
    }
    year = ''+ year;
    month = month >= 10 ? '' + month : '0' + month
    this.setData({
      year: year,
      month: month
    })
  },
  getLine: function () {
    wx.showLoading();
    var that = this;
    let _params = {
      year: that.data.year,
      month: that.data.month,
      catid: that.data.catid,
    }
    Api.showday(_params).then(res => {
      if (!res.data.code) {
        var _data = res.data.data;
        // var obj = Object.assign(that.data.items, _data);
        // that.setData({
        //   items: obj
        // });
        var month = that.data.month;
        var year = that.data.year;
        var datass = this.data.bigData;
        var datas={};



        datas[year] = {
          [month] : _data
        }
     console.log(this.data.bigData)
         var obj = Object.assign(that.data.bigData, datas);
         console.log(obj)

        this.setData({
        bigData: obj
        })

        console.log(this.data.bigData)











        // var obj = Object.assign(datass, datas);
        // console.log(this.data.bigData)
        // console.log(obj)




         // console.log(this.data.bigData)

        if(_data.length==0){
          that.setData({
            loadMore: false
          })
        }
        wx.hideLoading();
      }
    });
  },
  bindGetUserInfo: function (e) {
    var that = this;
    var userInfo = e.detail.userInfo;
    that.setData({
      username: userInfo.nickName,
      sex: userInfo.gender
    });
    that.formSubmit();
  }
})
