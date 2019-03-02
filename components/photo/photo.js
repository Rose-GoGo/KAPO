// components/photo/photo.js
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /*
    海报
    */
    createNewImg: function () {
      var that = this;
      var context = wx.createCanvasContext('mycanvas');
      context.setFillStyle("#ffffff")
      context.fillRect(0, 0, 600, 970); //填充一个矩形。用 setFillStyle
      var items = this.data.items;
      var title = items.title;
      var desc = items.description;
      var thumb = items.thumb;
      var qrcodeLoal = "https://www.zhmzjl.com/statics/images/blog/kapo.jpg";
      context.drawImage(thumb, 40, 40, 520, 260); //绘制首图
      context.drawImage(qrcodeLoal, 210, 650, 180, 180); //绘制二维码
      context.drawImage(qrcodeLoal, 210, 650, 180, 180); //绘制二维码
      context.setFillStyle("#000000");
      context.setFontSize(20); //设置字体大小
      context.setTextAlign('center'); //设置字体对齐
      context.fillText("阅读文章,请长按识别二维码", 300, 895);
      context.setFillStyle("#000000");
      context.beginPath() //分割线
      context.moveTo(30, 620)
      context.lineTo(570, 620)
      context.stroke();
      context.setTextAlign('left');
      context.setFontSize(40);
      if (title.lengh <= 12) {
        context.fillText(title, 40, 360); //文章标题
      } else {
        context.fillText(title.substring(0, 12), 40, 360);
        context.fillText(title.substring(12, 26), 40, 410);
      }
      context.setFontSize(20);
      if (desc.lengh <= 26) {
        context.fillText(desc, 40, 470); //文章描述
      } else {
        context.fillText(desc.substring(0, 26), 40, 470);
        context.fillText(desc.substring(26, 50) + '...', 40, 510);
      }
      context.draw();
      //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
      setTimeout(function () {
        wx.canvasToTempFilePath({
          canvasId: 'mycanvas',
          success: function (res) {
            var tempFilePath = res.tempFilePath;
            that.setData({
              imagePath: tempFilePath,
              canvasHidden: true
            });
          },
          fail: function (res) {
            console.log(res);
          }
        });
      }, 200);
    },
    //点击保存到相册
    baocun: function () {
      var that = this
      wx.saveImageToPhotosAlbum({
        filePath: that.data.imagePath,
        success(res) {
          wx.showModal({
            content: '图片已保存到相册，赶紧晒一下吧~',
            showCancel: false,
            confirmText: '好的',
            confirmColor: '#333',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
                /* 该隐藏的隐藏 */
                that.setData({
                  maskHidden: false
                })
              }
            },
            fail: function (res) {
              console.log(11111)
            }
          })
        }
      })
    },
    //点击生成
    formSubmit: function (e) {
      var that = this;
      this.setData({
        maskHidden: false
      });
      wx.showToast({
        title: '请骚等...',
        icon: 'loading',
        duration: 1000
      });
      setTimeout(function () {
        wx.hideToast()
        that.createNewImg();
        that.setData({
          maskHidden: true
        });
      }, 1000)
    },
    getCode: function () { //生成二维码
      var that = this;
      let _params = {
        catid: that.data.catid,
        id: that.data.id
      }
      Api.creatcode(_params).then(res => {
        if (res.data.code == 0) {
          let _data = res.data.url;
          that.setData({
            codeurl: _data
          })
        }
      });
    },

  }
})
