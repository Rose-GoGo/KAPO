//app.js
var common = require('utils/login.js');
App({
  onLoad: function (options) {
  },
  onShow: function (option) {},
  onPageNotFound: function (res) { },
  onLaunch: function () {
    let that = this;
    that.AppMusic = wx.createInnerAudioContext();
    that.AppMusic.autoplay = true;
    that.AppMusic.src = 'https://zhmzjl.com/statics/images/blog/qianbenyin.mp3';
    that.AppMusic.loop = true;
    that.AppMusic.volume = 0.05;
    that.AppMusic.onPlay(() => {
    })
    that.AppMusic.onError((res) => {
    });
    that.autoUpdate();
  },
  autoUpdate() {
    var self = this
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      //1. 检查小程序是否有新版本发布
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //2. 小程序有新版本，则静默下载新版本，做好更新准备
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启？',
              success: function (res) {
                if (res.confirm) {
                  //3. 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                } else if (res.cancel) {
                  //如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                  wx.showModal({
                    title: '温馨提示~',
                    content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
                    success: function (res) {
                      self.autoUpdate()
                      return;
                      //第二次提示后，强制更新
                      if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                      } else if (res.cancel) {
                        //重新回到版本更新提示
                        self.autoUpdate()
                      }
                    }
                  })
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: `新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~`,
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: `当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。`
      })
    }
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
