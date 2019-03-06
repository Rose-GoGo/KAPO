// components/bottombar/bottombar.js
import Api from '/../../utils/api.js';
Component({
    /**
     * 组件的属性列表
     */
     properties: {
        commentShow: {
            type: Boolean,
            value: false
        },
        newsid: {
            type: String,
            value: ''
        },
        items: {
            type: Object,
            value: {}
        },
        pid: {
            type: String,
            value: ''
        },
        placeholder: {
            type: String,
            value: ''
        },
        reply_username: {
            type: String,
            value: ''
        },
        reply_username: {
            type: String,
            value: ''
        },
    },
    /**
     * 组件的初始数据
     */
     data: {
        bottom: 0,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        userInfo: {},
        disabled: true,
        content: '',
        show: false, //分享
    },
    /**
     * 组件的方法列表
     */
     methods: {
        bindGetUserInfo: function(e) {
            var that = this;
            var userInfo = {};
            if (e.detail.userInfo) {
                userInfo = e.detail.userInfo;
            } else {
                wx.getUserInfo({
                    success: function(res) {
                        userInfo = res.userInfo;
                    },
                    fail: function(res) {
                        wx.showModal({
                            showCancel: false,
                            confirmColor: '#1d8f59',
                            content: '授权通过后才能评论哟，请重新授权！'
                        })
                    }
                })
            }
            if (JSON.stringify(userInfo) == '{}') return false;
            that.setData({
                userInfo: userInfo
            })
            that.postComments();
        },
        closeBox: function() {
            this.setData({
                commentShow: false,
            })
        },
        forContent: function(e) {
            let that = this;
            let _content = e.detail.value;
            // 禁止输入空格
            var regu = "^[ ]+$";
            var re = new RegExp(regu);
            var emptyy = re.test(_content);
            if (emptyy) return false;
            //end
            that.setData({
                content: _content
            })
            if (that.data.content) {
                that.setData({
                    disabled: false
                })
            } else {
                that.setData({
                    disabled: true
                })
            }
        },
        postComments: function() {
            var that = this;
            var _content = this.data.content;
            if (!_content) {
                wx.showModal({
                    showCancel: false,
                    confirmColor: '#1d8f59',
                    content: '评论不能为空!'
                });
                return false;
            }
            var postinfo = that.data.userInfo;
            if (JSON.stringify(postinfo) == "{}") return false;
            wx.showLoading();
            let _params = {
                newsid: that.data.newsid, // 博客文章ID
                pid: that.data.pid, // 父评论ID，默认为0
                from_username: postinfo.nickName, // 评论者用户名
                from_avatar: postinfo.avatarUrl, // 评论者头像
                reply_username: that.data.reply_username, // 回复了谁，pid不为0时，不允许未空
                reply_avatar: "", // 回复了谁的头像，允许为空
                content: _content
            }
            Api.postcomments(_params).then(res => {
                if (!res.data.code) {
                    wx.hideLoading();
                    wx.showToast({
                        title: '评论成功',
                        icon: 'success',
                        duration: 2000
                    })
                    that.setData({
                        commentShow: false,
                        content: '',
                        reply_username: '',
                        pid: 0,
                        disabled: true
                    });
                    that.cancelBut();
                    that.triggerEvent('commentlists')
                }
            });
        },
        cancelBut: function(e) {
            var that = this;
            var myEventDetail = { page: 1 } // detail对象，提供给事件监听函数
            this.triggerEvent('pullComment', myEventDetail) //
        },
        foucus: function(e) {
            var that = this;
            if(e){
                that.setData({
                    bottom: e.detail.height
                })
            }
        },
        // 失去聚焦
        blur: function(e) {
            var that = this;
            that.setData({
                bottom: 0
            })
        },
        rewardRose: function() {
            var that = this;
            that.setData({
                show: true
            })
        },
        goHome: function() {
            wx.switchTab({
                url: '../index/index'
            });
        },
        makePhoto: function() { //父組件調用子組件的方法
            console.log(222)
            // this.setData({ //海報顯示
            //   modalshow: false
            // })
            //  this.photo = this.selectComponent('#photo');
            // this.photo.makePhoto()
            // this.makePhoto()
            var that = this;
            that.triggerEvent('makePhoto')
        },
        rewardRose: function() {
            var that = this;
            that.setData({
                show: true
            })
        },
        //     makePhoto: function (e) { //点击生成海报
        //       var that = this;
        //       that.setData({
        //         modalshow:  false
        //       });
        //       wx.showToast({
        //         title: '请骚等...',
        //         icon: 'loading',
        //         duration: 1000
        //       });
        //       setTimeout(function () {
        //         wx.hideToast()
        //         that.createNewImg();
        //         // that.setData({
        //         //   modalshow: true
        //         // });
        //       }, 1000)
        //     },
        // /*
        // 海报
        // */
        // createNewImg: function () {
        //   var that = this;
        //   var context = wx.createCanvasContext('mycanvas');
        //   context.setFillStyle("#ffffff")
        //   context.fillRect(0, 0, 600, 970); //填充一个矩形。用 setFillStyle
        //   var dataSource = this.data.items;
        //   var title = dataSource.title;
        //   var desc = dataSource.description;
        //   var thumb = dataSource.thumb;
        //   var qrcodeLoal = "https://www.zhmzjl.com/statics/images/blog/kapo.jpg";
        //   context.drawImage(thumb, 40, 40, 520, 260); //绘制首图
        //   context.drawImage(qrcodeLoal, 210, 650, 180, 180); //绘制二维码
        //   context.drawImage(qrcodeLoal, 210, 650, 180, 180); //绘制二维码
        //   context.setFillStyle("#000000");
        //   context.setFontSize(20); //设置字体大小
        //   context.setTextAlign('center'); //设置字体对齐
        //   context.fillText("阅读文章,请长按识别二维码", 300, 895);
        //   context.setFillStyle("#000000");
        //   context.beginPath() //分割线
        //   context.moveTo(30, 620)
        //   context.lineTo(570, 620)
        //   context.stroke();
        //   context.setTextAlign('left');
        //   context.setFontSize(40);
        //   if (title.lengh <= 12) {
        //     context.fillText(title, 40, 360); //文章标题
        //   } else {
        //     context.fillText(title.substring(0, 12), 40, 360);
        //     context.fillText(title.substring(12, 26), 40, 410);
        //   }
        //   context.setFontSize(20);
        //   if (desc.lengh <= 26) {
        //     context.fillText(desc, 40, 470); //文章描述
        //   } else {
        //     context.fillText(desc.substring(0, 26), 40, 470);
        //     context.fillText(desc.substring(26, 50) + '...', 40, 510);
        //   }
        //   // context.draw();
        //   // console.log(context)
        //   //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
        //   // setTimeout(function () {
        //   //   wx.canvasToTempFilePath({
        //   //     canvasId: 'mycanvas',
        //   //     success: function (res) {
        //   //       console.log(res)
        //   //       var tempFilePath = res.tempFilePath;
        //   //       that.setData({
        //   //         imagePath: tempFilePath,
        //   //         canvasHidden: true
        //   //       });
        //   //       wx.hideToast()
        //   //     },
        //   //     fail: function (res) {
        //   //       console.log(res);
        //   //     }
        //   //   }, this);
        //   // }, 1000);
        //   //绘制图片
        //   context.draw(false, wx.canvasToTempFilePath({
        //     canvasId: 'mycanvas',
        //     destWidth:600,
        //     destHeight:970,
        //     quality:22,
        //     fileType:'jpg',
        //     success: function (res) {
        //       console.log(res)
        //       var tempFilePath = res.tempFilePath;
        //       that.setData({
        //         imagePath: tempFilePath,
        //           // modalshow: false
        //         });
        //       wx.hideToast()
        //     },
        //     fail: function (res) {
        //       console.log(res);
        //     }
        //   },this));
        // },
        // //点击保存到相册
        // baocun: function () {
        //   var that = this
        //   wx.saveImageToPhotosAlbum({
        //     filePath: that.data.imagePath,
        //     success(res) {
        //       wx.showModal({
        //         content: '图片已保存到相册，赶紧晒一下吧~',
        //         showCancel: false,
        //         confirmText: '好的',
        //         confirmColor: '#333',
        //         success: function (res) {
        //           if (res.confirm) {
        //             console.log('用户点击确定');
        //             /* 该隐藏的隐藏 */
        //             that.setData({
        //               modalshow: true
        //             })
        //           }
        //         },
        //         fail: function (res) {
        //           console.log(11111)
        //         }
        //       })
        //     }
        //   })
        // },
        // //点击生成
        // getCode: function () { //生成二维码
        //   var that = this;
        //   let _params = {
        //     catid: that.data.catid,
        //     id: that.data.id
        //   }
        //   Api.creatcode(_params).then(res => {
        //     if (res.data.code == 0) {
        //       let _data = res.data.url;
        //       that.setData({
        //         codeurl: _data
        //       })
        //     }
        //   });
        // },
    }
})
