// pages/project/project.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
     swipter_height: '550px',
    swiperCurrent: 1,
    arr: [{
      images: '/assets/images/project_1.jpg',
      name: '项目1'
    },
    {
      images: '/assets/images/project_1.jpg',
      name: '项目121'
    },
    {
      images: '/assets/images/project_1.jpg',
      name: '项目3'
    }
    ],
    interval: 2000,
    duration: 500,
    circular: true,
    beforeColor: "white",//指示点颜色
    afterColor: "coral",//当前选中的指示点颜色
    previousmargin: '30px',//前边距
    nextmargin: '30px',//后边距
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          swipter_height: res.windowHeight
        })
      }
    })
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
  swiperChange: function (e) {
    console.log(e.detail.current);
    this.setData({
      swiperCurrent: e.detail.current //获取当前轮播图片的下标
    })
  },
  //滑动图片切换
  chuangEvent: function (e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },
})
