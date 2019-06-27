Component({
    /**
     * 组件的属性列表
     */
    properties: {
    },
    /**
     * 组件的初始数据
     */
    data: {
      yearss: ''
    },
    ready: function(){
      this.getYear();
    },
    /**
     * 组件的方法列表
     */
    methods: {
        getYear() {
            var date = new Date();
            var _year = date.getFullYear();
            this.setData({
              yearss: _year
            })
        }
    }
})
