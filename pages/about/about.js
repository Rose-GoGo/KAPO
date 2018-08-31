//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    kinds: app.globalData.kinds,
    every:[
    {icon: 'icon-jianshen', name: '健身',id: 1},
    {icon: 'icon-book', name: '读书',id: 2},
    {icon: 'icon-yingyu', name: '外语',id: 3},
    {icon: 'icon-yinyue', name: '生活',id: 4}
    ]
  },
  onLoad: function () {

  },
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
  goEveryDay: function(e){
     let catid = e.currentTarget.dataset.catid;
     wx.navigateTo({
       url: '../more/more?catid='+ catid
     })
  },
  //事件处理函数
  showOne: function(e) {
    let catid = e.currentTarget.dataset.catid;
    wx.navigateTo({
      url: '../lists/lists?catid='+ catid
    })
  },
})
