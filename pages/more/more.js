// pages/more/more.js
import Api from '/../../utils/config/api.js';
Page({
  /**
   * 页面的初始数据
   */
   data: {
    bigData: [],
    catid: '',
    disabled: true,
    loadMore: true,
    monthData: {},//存储月数据
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    isRose: false,
    dataIndex: 0 //为了得到bigdata中的数组，特别是是换年
  },
  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
    var that = this;
    var ss = new Date().getMonth() + 1;
    ss = ss >= 10 ? '' + ss : '0' + ss;
    that.setData({
      catid: options.catid,
      month: ss
    })
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              var userInfo = res.userInfo;
              if (userInfo.nickName == '赵') {
                that.setData({
                  isRose: true
                });
              }
              that.setData({
                username: userInfo.nickName,
                sex: userInfo.gender
              })
            }
          });
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
    var that = this;
    if(that.data.loadMore){
      that.earMonth(); //上个月的时间
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
  formSubmit: function () {
    var that = this;
    that.setData({
        disabled: true //想偷懒都不行，这里需要点击按钮后，按钮就设置成disabled, 避免重负提交
    })
    let _params = {
      catid: that.data.catid,
      title: that.data.title,
      remark: that.data.remark,
      username: that.data.username,
    }
    Api.everyday(_params).then(res => {
      if (!res.data.code) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        });
        let month = new Date().getMonth() + 1;
        let year = new Date().getFullYear();
        month = month >= 10 ? '' + month : '0' + month;
        that.setData({
          title: '',
          remark: '',
          year: year,
          month: month
        })
        that.getLine();
      }
    });
  },
  earMonth: function (n) { //获取年月
    var ym, year, month;
    var that = this;
    year = that.data.year;
    month = that.data.month;
    ym = year + '-' + month;
    if (new Date(ym).getMonth() == 0) {
      year = year - 1;
      month = 12;
      let big = that.data.bigData;
      let index = this.data.dataIndex + 1
      let datas = { [year]: {} }
      big.push(datas)
      that.setData({
        dataIndex: index,
        bigData: big
      });
    } else {
      year = year;
      month = month - 1;
    }
    year = '' + year;
    month = month >= 10 ? '' + month : '0' + month
    that.setData({
      year: year,
      month: month
    });
  },
  getLine: function () {
    wx.showLoading();
    var that = this,
    obj = {};
    var year = that.data.year;
    var month = that.data.month;
    var dataIndex = that.data.dataIndex;
    var big = that.data.bigData;
    let _params = {
      year: year,
      month: month,
      catid: that.data.catid,
    }
    Api.showday(_params).then(res => {
      if (!res.data.code) {
        let _data = res.data.data;
        if (that.data.month == '12') { //换年了
           obj = _data;
        } else {
           obj = Object.assign(that.data.monthData, _data);// 月数据
        }
        that.setData({
          monthData: obj
        });
        big[dataIndex] = { [year]: obj }
        that.setData({
          bigData: big
        })
        if (_data[month].length == 0) { //如果没有月数据，则不加载了，本来是想判断是否已经加载到底了，但是这里可能有半途没添加数据的情况，所以这里的逻辑不是很严谨
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
