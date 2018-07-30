// pages/detail/detail.js
import Api from '/../../utils/config/api.js';
let wxparse = require("../../wxParse/wxParse.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    items:{},
    dkcontent:'',
    id: '',
    catid: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.showLoading();
    that.setData({
        id: options.id,
        catid: options.catid
    });
    that.getData();
},
/**
 * 生命周期函数--监听页面初次渲染完成
 */
onReady: function() {
},
/**
 * 生命周期函数--监听页面显示
 */
onShow: function() {
},
/**
 * 生命周期函数--监听页面隐藏
 */
onHide: function() {
},
/**
 * 生命周期函数--监听页面卸载
 */
onUnload: function() {
},
/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh: function() {
},
/**
 * 页面上拉触底事件的处理函数
 */
onReachBottom: function() {
},
/**
 * 用户点击右上角分享
 */
onShareAppMessage: function() {
  return {
      title: this.data.items.title,
      imageUrl: '/assets/images/share.jpg'
    }
},
getData: function() {
  let _params = {
    catid: this.data.catid,
    id: this.data.id
  };
  Api.pageitem(_params).then(res => {
    var that = this;
    if(!res.data.code){
      let _data = res.data.data;
      var _tpl = _data.content;
      that.setData({
        items: _data,
        dkcontent: _tpl
      });
      wxparse.wxParse('dkcontent', 'html', _tpl, that, 5);
      wx.hideLoading();
    }
  })
}
})
