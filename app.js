//app.js
App({
  onLoad: function (options) { },
  onShow: function (option) { },
  onPageNotFound: function (res) { },
  onLaunch: function () {
    // wx.login({
    //   success: function(res) {
    //     if (res.code) {}
    //   }
    // })

    this.AppMusic = wx.createInnerAudioContext();
    this.AppMusic.autoplay = true;
    this.AppMusic.src = 'https://zhmzjl.com/statics/images/blog/qianbenyin.mp3';
    this.AppMusic.loop = true;
    this.AppMusic.volume = 0.05;
    this.AppMusic.onPlay(() => {
      console.log('开始播放')
    })
    this.AppMusic.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    });
  },
  globalData: {
    kinds: [{
      icon: 'icon-quanju',
      name: '前端',
      catid: '11'
    }, {
      icon: 'icon-anquan',
      name: '安全',
      catid: '12'
    },
    {
      icon: 'icon-xiazai47',
      name: '生活',
      catid: '13'
    }],
    userInfo: {}
  }
})