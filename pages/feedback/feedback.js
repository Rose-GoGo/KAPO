// pages/more/more.js
import Api from '/../../utils/config/api.js';
Page({
  /**
   * 页面的初始数据
   */
   data: {
    catid: '5',
    page: 1,
    // title: '',
    remark: '',
    disabled: true,
    comments: [],
    loadMore: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    username: '',
    avatar: '',
    sex: null,
    isRose: false,
    showEdit: false,
    placeholder: '点击评论回复...',
    reply_username: '',
    pid: 0,

  },
  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
    var that = this;
    wx.showLoading();
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
              });
            }
          });
        }
      }
    });
    that.feedback();
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
    let page = that.data.page + 1;
    that.setData({
      page: page,

    });
    if (that.data.loadMore) {
      that.feedback();
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
  forRemark: function (e) {
    var that = this;
    let _data = e.detail.value;
    that.setData({
      remark: _data
    });
    if (that.data.remark) {
      that.setData({
        disabled: false
      })
    } else {
      that.setData({
        disabled: true
      })
    }
  },
  rewardRose: function () {
    wx.showModal({
      content: '您的分享与关注是对我最大的奖赏！',
      cancelText: '朕不分享',
      cancelColor:'#999',
      confirmText: '乐意效劳',
      confirmColor: '#1d8f59',
      success: function(){
        // wx.showShareMenu({
        //   return {
        //     title: '锲而舍之,朽木不折;锲而不舍,金石可镂',
        //     imageUrl: '/assets/images/share.jpg'
        //   }

        // })
        wx.showShareMenu({
          withShareTicket: true
        })
        // Page.onShareAppMessage({
        //   return {
        //     title: '锲而舍之,朽木不折;锲而不舍,金石可镂',
        //     imageUrl: '/assets/images/share.jpg'
        //   }

        // })

      }
    })
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
      sex: that.data.sex,
      avatar: that.data.avatar

    }
    Api.everyadd(_params).then(res => {
      if (!res.data.code) {
        that.setData({
          title: '',
          remark: '',
          page: 1,
          comments: [],
          disabled: true
        });
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        });
        that.feedback();
      }
    });
  },
  feedback: function () {
    var that = this;
    let _params = {
      page: that.data.page
    }
    Api.feedback(_params).then(res => {
      if (!res.data.code) {
        let _data = res.data.data;
        let _arr = that.data.comments.concat(_data);
        that.setData({
          comments: _arr
        });
        if (_data.length < 10) {
          that.setData({
            loadMore: false
          });
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
      sex: userInfo.gender,
      avatar: userInfo.avatarUrl
    });
    that.formSubmit();
  },
  editItem: function (e) {
    let forid = e.currentTarget.dataset.forid;
    let showEdit = this.data.showEdit;
    this.setData({
      showEdit: !showEdit,
      forid: forid
    })
  },
  deleteOne: function (e) { //删除本条
    var that = this;
    let id = e.currentTarget.dataset.id;
    let _params = {
      catid: 5,
      id: id
    }
    Api.everydelete(_params).then(res => {
      if (!res.data.code) {
        let month = new Date().getMonth() + 1;
        let year = new Date().getFullYear();
        month = month >= 10 ? '' + month : '0' + month;
        that.setData({
          comments: [],
          page: 1,
          loadMore: true
        });
        that.feedback();
      }
    });
  },
  backContent: function (e) { //回复的评论
    let _from = e.currentTarget.dataset.from;
    let _id = e.currentTarget.dataset.pid;
    this.setData({
      placeholder: '回复 ' + _from,
      focus: true,
      reply_username: _from,
      pid: _id
    });
  },
})
