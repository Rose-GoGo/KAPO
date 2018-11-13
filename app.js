//app.js
App({
  onLoad: function(options) {},
  onShow: function(option) {},
  onPageNotFound: function(res) {},
  onLaunch: function() {
    // wx.login({
    //   success: function(res) {
    //     if (res.code) {}
    //   }
    // })

    this.AppMusic = wx.createInnerAudioContext();
    this.AppMusic.autoplay = true;
    this.AppMusic.loop = true;
    this.AppMusic.onPlay(() => {
      console.log('开始播放')
    })
    this.AppMusic.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })



  },
  globalData: {
    kinds: [{
      icon: 'icon-xiazai47',
      name: '生活',
      catid: '13'
    },{
      icon: 'icon-anquan',
      name: '安全',
      catid: '12'
    },{
      icon: 'icon-quanju',
      name: '前端',
      catid: '11'
    }
    ],
    userInfo: {}
  }
})
