// pages/lists/lists.js
import Api from '/../../utils/config/api.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    items: [],
    loadMore: true,
    catid: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var catid = options.catid;
    this.setData({
      catid: catid
    })
    wx.showLoading();
    this.getLists();
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
    let page = this.data.page+1;
    if(this.data.loadMore){
      this.setData({
        page: page
      })
      this.getLists();
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
  articleDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    let catid = e.currentTarget.dataset.catid
    wx.navigateTo({
      url: '../detail/detail?catid=' + catid + '&id=' + id
    })
  },
  showOne: function(e){
    let catid = e.currentTarget.dataset.catid;
    this.setData({
      catid : catid,
      items:[],
      page:1,
      loadMore:true
    });
    this.getLists();

  },
  getLists: function (e) {
    wx.showLoading();
    let params = {
      pagesize: 10,
      page: this.data.page,
      catid: this.data.catid
    }
    Api.lists(params).then(res => { //文章列表
      if (res.data.code==0) {
        let _data = res.data.data;
        let _items = this.data.items.concat(_data);
        this.setData({
          items: _items
        });
        if (_data.length < 10) {
          this.setData({
            loadMore: false
          })
        }
        wx.hideLoading();
      }
    })
  },
})
