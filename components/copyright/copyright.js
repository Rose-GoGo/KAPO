// components/bottombar/bottombar.js
// import Api from '/../../utils/api.js';
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
        getYear: function() {
            var date = new Date();
            var _year = date.getFullYear();
            console.log(_year)
            // return year;
            this.setData({
              yearss: _year
            })
        }
    }
})
