//logs.js
const util = require('../../utils/util.js')
Page({
    data: {
        count: 1,
        staffA: { firstName: 'Hulk', lastName: 'Hu' },
        staffB: { firstName: 'Shang', lastName: 'You' },
        staffC: { firstName: 'Gideon', lastName: 'Lin' },

        object: {
            key: 'Hello '
        },
        array: ['MINA'],
        zero: 0,
         obj1: {
          a: 1,
          b: 2
        },
        obj2: {
          c: 3,
          d: 4
        },
        item:{
            index: 0,
            msg: 'this id Rose',
            time: new Date().toLocaleDateString()
        }
    },

    add: function(e) {
        this.setData({
            count: this.data.count + 1
        })
    },
    onLoad: function() {
        this.setData({
            Rose: 'my name is Rose Zhao',
            arr: [1, 2, 3, 4, 5]
        })
    }
})
