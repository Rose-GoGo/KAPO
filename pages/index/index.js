// pages/news/news.js
import Api from '/../../utils/config/api.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    items:[],
    page:1,
    loadMore:true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading();
    this.top10()
    this.getLists();
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
  onPullDownRefresh: function() {
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let _page = this.data.page+1;
    this.setData({
      page: _page
    });
    if(this.data.loadMore){
    this.getLists();
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '锲而舍之,朽木不折;锲而不舍,金石可镂',
      imageUrl: '/assets/images/share.jpg'
    }
  },
  articleDetail: function(e) {
    let id = e.currentTarget.dataset.id;
    let catid = e.currentTarget.dataset.catid
    wx.navigateTo({
      url: '../detail/detail?catid='+ catid+'&id='+ id
    })
  },
  getLists: function(e) {
    wx.showLoading();
    let params = {
      page: this.data.page
    }
    Api.all(params).then(res => { //文章列表
      if(!res.data.code){
        let _data = res.data.data;
        let _items = this.data.items.concat(_data);
        if(_data.length<5){
          this.setData({
            loadMore: false
          })
        }
        this.setData({
          items: _items
        });
        wx.hideLoading();
      }
    })
  },
  top10: function(){
    Api.hits().then(res => { //文章列表
      if(!res.data.code){
        let _data = res.data.data;
        this.setData({
          top10: _data
        });
      }
    })
  }
})
