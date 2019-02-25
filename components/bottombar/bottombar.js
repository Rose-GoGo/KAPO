// components/bottombar/bottombar.js
import Api from '/../../utils/api.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {},
  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    disabled: true
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindGetUserInfo: function (e) {
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
      that.postComments()
    },
    goHome: function () {
      wx.switchTab({
        url: '../index/index'
      });
    },
    commentBox: function () {
      this.setData({
        show: false,
      })
    },
    wetherLike: function () { //点赞
      var that = this;
      let params = {
        id: that.data.id,
        catid: that.data.catid
      }
      if (!that.data.like) {
        Api.likenum(params).then(res => {
          if (!res.data.code) {
            let _data = res.data.data;
            let linknn = parseInt(that.data.likenum)
            that.setData({
              likenum: linknn + 1,
              like: !that.data.like
            })
            wx.showToast({
              title: '感谢您的鼓励！',
              icon: 'none',
              duration: 2000
            })
          }
        });
      }
      if (that.data.like) {
        let linknn = parseInt(that.data.likenum)
        that.setData({
          likenum: linknn - 1,
          like: !that.data.like
        })
        wx.showToast({
          title: '我会继续努力！',
          icon: 'none',
          duration: 2000
        })
      }
    },
    forContent: function (e) {
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
    postComments: function () {
      var that = this;
      if (!that.data.content) {
        wx.showModal({
          showCancel: false,
          confirmColor: '#1d8f59',
          content: '评论不能为空!'
        });
        return false;
      }
      if (!that.data.userInfo) return false;
      wx.showLoading();
      let _params = {
        newsid: that.data.id, // 博客文章ID
        pid: that.data.pid, // 父评论ID，默认为0
        from_username: that.data.userInfo.nickName, // 评论者用户名
        from_avatar: that.data.userInfo.avatarUrl, // 评论者头像
        reply_username: that.data.reply_username, // 回复了谁，pid不为0时，不允许未空
        reply_avatar: "", // 回复了谁的头像，允许为空
        content: that.data.content
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
            content: '',
            page: 1,
            comments: [],
            reply_username: '',
            pid: 0,
            placeholder: '点击评论回复...',
            disabled: true
          });
          that.commentlists();
        }
      });
    },
  }
})
