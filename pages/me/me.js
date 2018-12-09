// pages/me/me.js
import Api from '/../../utils/api.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'
    ],
    RoseHeight: '550px',
    currentTab: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          RoseHeight: res.windowHeight
        })
      }
    });
    that.getData();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
  },
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
  shake: function() {
    var numX = 1 //x轴
    var numY = 1 // y轴
    var numZ = 0 // z轴
    var stsw = true // 开关，保证在一定的时间内只能是一次，摇成功
    var positivenum = 0 //正数 摇一摇总数
      //  var audioCtx = wx.createAudioContext('myAudio') //音频，用于摇成功提示
    wx.onAccelerometerChange(function(res) { //小程序api 加速度计
      if (numX < res.x && numY < res.y) { //个人看法，一次正数算摇一次，还有更复杂的
        positivenum++
        setTimeout(() => {
            positivenum = 0
          }, 2000) //计时两秒内没有摇到指定次数，重新计算
      }
      if (numZ < res.z && numY < res.y) { //可以上下摇，上面的是左右摇
        positivenum++
        setTimeout(() => {
            positivenum = 0
          }, 2000) //计时两秒内没有摇到指定次数，重新计算
      }
      if (positivenum == 2 && stsw) { //是否摇了指定的次数，执行成功后的操作
        stsw = false;
        wx.showModal({
            title: 'test',
            content: 'yaoyiyao',
          })
          // audioCtx.setSrc('http://pic.ibaotu.com/00/43/58/92J888piCmbi.mp3') //音频文件，第三方的可自行选择
          // audioCtx.play() //播发音频
          // console.log('摇一摇成功')
          // setTimeout(() => {
          //   positivenum = 0 // 摇一摇总数，重新0开始，计算
          //   stsw = true
          // },2000)
      }
    });
  },
  swichNav: function(e) {
    var cur = e.target.dataset.current;
    console.log(cur)
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  swiper_change: function(e) {
    var curindex = e.detail.current;
    this.setData({
      currentTab: curindex
    })
  },
  // getData: function() {
  //   var that = this;
  //   let _params = {
  //     pagesize: 10,
  //     page: 1,
  //     catid: '15'
  //   };
  //   Api.lists(_params).then(res => {
  //     if (!res.data.code) {
  //       // wx.hideLoading();
  //       let _data = res.data.data;
  //       console.log(_data)
  //     }
  //   })
  // },
})
