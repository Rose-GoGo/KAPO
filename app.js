//app.js
App({
  onLoad: function (options) {
  },
  onShow: function (option) { },
  onPageNotFound: function (res) { },
  onLaunch: function () {
    this.AppMusic = wx.createInnerAudioContext();
    this.AppMusic.autoplay = true;
    this.AppMusic.src = 'https://zhmzjl.com/statics/images/blog/qianbenyin.mp3';
    this.AppMusic.loop = true;
    this.AppMusic.volume = 0.05;
    this.AppMusic.onPlay(() => {
    })
    this.AppMusic.onError((res) => {
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
