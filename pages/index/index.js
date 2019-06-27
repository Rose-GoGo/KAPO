// pages/index/index.js
import Api from '/../../utils/api.js';
const app = getApp();
var page = 1;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: true,
    notices: [],
    items: [],
    loadMore: true,
    every: [{
      icon: 'icon-yinyue',
      name: '生活',
      id: 4
    }, {
      icon: 'icon-yingyu',
      name: '外语',
      id: 3
    }, {
      icon: 'icon-book',
      name: '读书',
      id: 2
    }, {
      icon: 'icon-jianshen',
      name: '健身',
      id: 1
    }
      // {
      //   icon: 'icon-xiangji',
      //   name: '摄影',
      //   id: 5
      // }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.hideLoading();
    that.getNotice();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) { },
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
  onPullDownRefresh: function () {
    let that = this;
    page = 1;
    that.setData({
      items: [],
      loadMore: true
    });
    if (that.data.loadMore) {
      that.getNotice();
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    page = page + 1;
    if (that.data.loadMore) {
      that.getLists();
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
  articleDetail(e) {
    let id = e.currentTarget.dataset.id;
    let catid = e.currentTarget.dataset.catid
    wx.navigateTo({
      url: '../detail/detail?catid=' + catid + '&id=' + id
    });
  },
  getLists(e) {
    let that = this;
    let params = {
      page: page,
      pagesize: 8
    }
    Api.all(params).then(res => { //文章列表
      if (!res.data.code) {
        let _data = res.data.data;
        let _items = that.data.items.concat(_data);
        if (_data.length < 8) {
          that.setData({
            loadMore: false
          })
        }
        that.setData({
          items: _items
        });
      }
    });
  },
  top10() {
    Api.hits().then(res => { //文章列表
      if (!res.data.code) {
        let _data = res.data.data;
        this.setData({
          top10: _data
        });
      }
    });
  },
  getNotice() {
    var that = this;
    let _params = {
      catid: 21, //项目id
      page: 1,
      pagesize: 3 // 可选，默认为为5
    }
    Api.lists(_params).then(res => {
      if (!that.data.code) {
        let _data = res.data.data;
        that.setData({
          notices: _data,
        })
        that.getLists();
        wx.hideLoading();
      }
    });
  },
  onPageScroll(e) {
    var _backShow = false;
    if (e.scrollTop > 100) {
      _backShow = true;
    } else {
      _backShow = true;
    }
  },
  controlMusic() {
    if (this.data.isPlay) {
      app.AppMusic.pause();
      this.setData({
        isPlay: false
      });
    } else {
      app.AppMusic.play();
      this.setData({
        isPlay: true
      });
    }
  },
  goEveryDay(e) {
    let catid = e.currentTarget.dataset.catid;
    wx.navigateTo({
      url: '../more/more?catid=' + catid
    })
  },
})
