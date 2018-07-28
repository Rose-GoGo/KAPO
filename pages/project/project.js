// pages/project/project.js
import Api from '/../../utils/config/api.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
     swipter_height: '550px',
    swiperCurrent: 1,
    items: [],
    beforeColor: "#ccc",//指示点颜色
    afterColor: "#1d8f59",//当前选中的指示点颜色
    previousmargin: '30px',//前边距
    nextmargin: '30px',//后边距
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading();
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          swipter_height: res.windowHeight
        })
      }
    });
    this.getData()
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
  getData: function(){
    let _params = {
      catid: 19, //项目id
      page: 1,
      pagesize: 999 // 可选，默认为为5
    }
    Api.lists(_params).then(res=>{
      if(!this.data.code){
        let _data = res.data.data;
        this.setData({
          items: _data
        })
        wx.hideLoading();
      }
    })
  }
})
