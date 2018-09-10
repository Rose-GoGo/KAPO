//app.js
App({
  onLoad: function (options) {
  },
  onShow: function (option) {
  },
  onPageNotFound: function (res) {
  },
  onLaunch: function () {
    wx.login({
      success: function (res) {
        if (res.code) {

        }
      }
    })
  },
  globalData: {
    kinds: [
      { icon: 'icon-quanju', name: '前端', catid: '11' },
      { icon: 'icon-anquan', name: '安全', catid: '12' },
      { icon: 'icon-xiazai47', name: '生活', catid: '13' }
    ],
    userInfo: {}
  }
})
