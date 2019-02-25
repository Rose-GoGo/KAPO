// components/share/share.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    //是否显示modal
    show: {
      type: Boolean,
      value: false
    }
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
    clickMask() {
      // this.setData({show: false})
    },

    cancel() {
      this.setData({
        show: false
      })
      this.triggerEvent('cancel')
    },

    confirm() {
      this.setData({
        show: false
      })
      this.triggerEvent('confirm')
    }
  }
})
