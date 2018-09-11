// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // that.shake();

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
    var that = this;

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

  shake: function () {

    var numX = 1 //x轴
    var numY = 1 // y轴
    var numZ = 0 // z轴
    var stsw = true // 开关，保证在一定的时间内只能是一次，摇成功
    var positivenum = 0 //正数 摇一摇总数
    //  var audioCtx = wx.createAudioContext('myAudio') //音频，用于摇成功提示
    wx.onAccelerometerChange(function (res) {  //小程序api 加速度计
      console.log(res)
      if (numX < res.x && numY < res.y) {  //个人看法，一次正数算摇一次，还有更复杂的
        positivenum++
        setTimeout(() => { positivenum = 0 }, 2000) //计时两秒内没有摇到指定次数，重新计算
      }
      if (numZ < res.z && numY < res.y) { //可以上下摇，上面的是左右摇
        positivenum++
        setTimeout(() => { positivenum = 0 }, 2000) //计时两秒内没有摇到指定次数，重新计算
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


  }
  // addMe: function(){
  //   wx.navigateToMiniProgram({
  //     appId: 'wx11bb9ed460c13af5',
  //     path: 'pages/index/index',
  //     envVersion: 'release',
  //     success：(res) {
  //       wx.showModal({
  //         title: '提示'，
  //         content: '打开正式版'
  //       })
  //       // 打开成功
  //     }
  //   })
  // }
})
