// components/bottombar/bottombar.js
import Api from '/../../utils/api.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commentShow: {
      type: Boolean,
      value: false
    },
    newsid: {
      type: String,
      value: ''
    },
    items: {
      type: Object,
      value: {}
    },
    pid: {
      type: String,
      value: ''
    },
    placeholder: {
      type: String,
      value: ''
    },
    reply_username: {
      type: String,
      value: ''
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    bottom: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    disabled: true,
    content: '',
    show: false, //分享
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindGetUserInfo(e) {
      var that = this;
      var userInfo = {};
      if (e.detail.userInfo) {
        userInfo = e.detail.userInfo;
      } else {
        wx.getUserInfo({
          success: function (res) {
            userInfo = res.userInfo;
          },
          fail: function (res) {
            wx.showModal({
              showCancel: false,
              confirmColor: '#1d8f59',
              content: '授权通过后才能评论哟，请重新授权！'
            })
          }
        })
      }
      if (JSON.stringify(userInfo) == '{}') return false;
      that.setData({
        userInfo: userInfo
      })
      that.postComments();
    },
    closeBox() {
      this.setData({
        commentShow: false,
      })
    },
    forContent(e) {
      let that = this;
      let _content = e.detail.value;
      // 禁止输入空格
      var regu = "^[ ]+$";
      var re = new RegExp(regu);
      var emptyy = re.test(_content);
      if (emptyy) return false;
      //end
      that.setData({
        content: _content
      })
      if (that.data.content) {
        that.setData({
          disabled: false
        })
      } else {
        that.setData({
          disabled: true
        })
      }
    },
    postComments() {
      var that = this;
      var _content = this.data.content;
      if (!_content) {
        wx.showModal({
          showCancel: false,
          confirmColor: '#1d8f59',
          content: '评论不能为空!'
        });
        return false;
      }
      var postinfo = that.data.userInfo;
      if (JSON.stringify(postinfo) == "{}") return false;
      wx.showLoading();
      let _params = {
        newsid: that.data.newsid, // 博客文章ID
        pid: that.data.pid, // 父评论ID，默认为0
        from_username: postinfo.nickName, // 评论者用户名
        from_avatar: postinfo.avatarUrl, // 评论者头像
        reply_username: that.data.reply_username, // 回复了谁，pid不为0时，不允许未空
        reply_avatar: "", // 回复了谁的头像，允许为空
        content: _content
      }
      Api.postcomments(_params).then(res => {
        if (!res.data.code) {
          wx.hideLoading();
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            commentShow: false,
            content: '',
            reply_username: '',
            pid: 0,
            disabled: true
          });
          that.cancelBut();
          that.triggerEvent('commentlists')
        }
      });
    },
    cancelBut(e) {
      var that = this;
      var myEventDetail = { page: 1 } // detail对象，提供给事件监听函数
      this.triggerEvent('pullComment', myEventDetail) //
    },
    rewardRose() {
      var that = this;
      that.setData({
        show: true
      })
    },
    goHome() {
      wx.switchTab({
        url: '../index/index'
      });
    },
    makePhoto() { //父組件調用子組件的方法
      var that = this;
      that.triggerEvent('makePhoto')
    },
    rewardRose() {
      var that = this;
      that.setData({
        show: true
      })
    },
  }
})
