// components/backtop/backtop.js
Component({
  /**
   * 组件的属性列表
   */
   properties: {
    backShow: {
      type: Boolean,
      value: false
    },
  },
  /**
   * 组件的初始数据
   */
   data: {
   },
  /**
   * 组件的方法列表
   */
   methods: {
    backTop(){
      if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 300
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
      }
    }
  }
})
