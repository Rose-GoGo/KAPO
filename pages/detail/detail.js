// pages/detail/detail.js
import Api from '/../../utils/api.js';
let wxparse = require("../../wxParse/wxParse.js");
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        items: {},
        dkcontent: '',
        id: '',
        catid: '',
        comments: [], //反馈列表
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        disabled: true,
        loadMore: true,
        focus: false,
        userInfo: {},
        content: '',
        placeholder: '爱发言的人运气都不会太差',
        reply_username: '',
        pid: 0,
        page: 1,
        likenum: null,
        like: false,
        maskHidden: false,
        codeurl: "",
        commentshow: false,
        modalshow: true,
        imagePath: ''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.showLoading();
        var that = this;
        let _userInfo = wx.getStorageSync('userInfo')
        if (options.scene) {
            let scene = decodeURIComponent(options.scene);
            let info_arr = [];
            info_arr = scene.split(',');
            let _catid = info_arr[0];
            let _id = info_arr[1];
            that.setData({
                userInfo: _userInfo,
                id: _id,
                catid: _catid
            });
        } else {
            that.setData({
                userInfo: _userInfo,
                id: options.id,
                catid: options.catid
            });
        }
        if (wx.getStorageSync('userInfo')) {} else {
            wx.getSetting({
                success: function(res) {
                    if (res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                        wx.getUserInfo({
                            success: function(res) {
                                let _userInfo = res.userInfo;
                                app.globalData.userInfo = _userInfo;
                                wx.setStorageSync('userInfo', _userInfo)
                            },
                            fail: function() {}
                        })
                    }
                }
            });
        }
        that.getData();
        that.commentlists(); //反馈列表
        that.top10(); //top 10推荐
        that.getCode();
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {},
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {},
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {},
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {},
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        var that = this;
        let page = that.data.page + 1;
        that.setData({
            page: page
        });
        if (that.data.loadMore) {
            that.commentlists();
        }
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        return {
            title: this.data.items.title,
            imageUrl: '/assets/images/share.jpg'
        }
    },
    getData: function() {
        var that = this;
        let _params = {
            catid: that.data.catid,
            id: that.data.id
        };
        Api.pageitem(_params).then(res => {
            if (!res.data.code) {
                wx.hideLoading();
                let _data = res.data.data;
                var _tpl = _data.content;
                that.setData({
                    likenum: _data.thumbs_up,
                    items: _data,
                    dkcontent: _tpl
                });
                wxparse.wxParse('dkcontent', 'html', _tpl, that, 5);
            }
        })
    },
    commentBox: function() {
        this.setData({
            commentshow: true,
        })
    },
    wetherLike: function() { //点赞
        var that = this;
        let params = {
            id: that.data.id,
            catid: that.data.catid
        }
        if (!that.data.like) {
            Api.likenum(params).then(res => {
                if (!res.data.code) {
                    let _data = res.data.data;
                    let linknn = parseInt(that.data.likenum)
                    that.setData({
                        likenum: linknn + 1,
                        like: !that.data.like
                    })
                    wx.showToast({
                        title: '感谢您的鼓励！',
                        icon: 'none',
                        duration: 2000
                    })
                }
            });
        }
        if (that.data.like) {
            let linknn = parseInt(that.data.likenum)
            that.setData({
                likenum: linknn - 1,
                like: !that.data.like
            })
            wx.showToast({
                title: '我会继续努力！',
                icon: 'none',
                duration: 2000
            })
        }
    },
    backContent: function(e) { //回复的评论
        let _from = e.currentTarget.dataset.from;
        let _id = e.currentTarget.dataset.pid;
        this.setData({
            placeholder: '回复 ' + _from,
            focus: true,
            reply_username: _from,
            pid: _id,
            commentshow: true
        })
    },
    top10: function() { //推荐阅读
        var that = this;
        let params = {
            pagesize: 5,
            page: 1,
            catid: that.data.catid
        }
        Api.lists(params).then(res => { //文章列表
            if (!res.data.code) {
                let _data = res.data.data;
                that.setData({
                    top10: _data
                });
            }
        })
    },
    articleDetail: function(e) {
        let id = e.currentTarget.dataset.id;
        let catid = e.currentTarget.dataset.catid
        wx.navigateTo({
            url: '../detail/detail?catid=' + catid + '&id=' + id
        });
    },
    commentlists: function(e) {
        var that = this;
        var _page;
        if (e) {
            _page = e.detail.page;
            that.setData({
                page: _page,
                comments: [],
            });
        } else {
            _page = that.data.page;
        }
        let _params = {
            newsid: that.data.id,
            page: _page,
            pagesize: 10
        }
        Api.commentlists(_params).then(res => {
            if (res.data.code == 0) {
                let _data = res.data.data;
                let _count = res.data.count;
                let _arr = that.data.comments.concat(_data);
                that.setData({
                    comments: _arr,
                    count: _count
                });
                if (_data.length < 10) {
                    that.setData({
                        loadMore: false
                    });
                }
            } else {
                wx.showModal({
                    showCancel: false,
                    confirmColor: '#1d8f59',
                    content: '评论加载失败!'
                })
            }
        });
    },
    onPageScroll: function(e) { //返回顶部
        //   if (e.scrollTop > 100) {
        //     this.setData({
        //       backShow: true
        //   });
        // } else {
        //     this.setData({
        //       backShow: false
        //   });
        // }
    },
    makePhoto: function(e) { //点击生成海报
        console.log(333)
        var that = this;
        that.setData({
            modalshow: false
        });
        wx.showToast({
            title: '请骚等...',
            icon: 'loading',
            duration: 1000
        });
        setTimeout(function() {
            that.createNewImg();
            // that.setData({
            //   modalshow: true
            // });
        }, 1000)
    },
    /*
    海报
    */
    createNewImg: function() {
        var that = this;
        var context = wx.createCanvasContext('mycanvas');
        context.setFillStyle("#ffffff")
        context.fillRect(0, 0, 600, 970); //填充一个矩形。用 setFillStyle
        var dataSource = this.data.items;
        var title = dataSource.title;
        var desc = dataSource.description;
        var thumb = dataSource.thumb;
        var qrcodeLoal = that.data.codeurl;
        context.drawImage(thumb, 40, 40, 520, 260); //绘制首图
        //  context.drawImage(qrcodeLoal, 210, 650, 180, 180); //绘制二维码
        context.drawImage(qrcodeLoal, 200, 650, 200, 230); //绘制二维码
        context.setFillStyle("#000000");
        context.setFontSize(20); //设置字体大小
        context.setTextAlign('center'); //设置字体对齐
        // context.fillText("阅读文章,请长按识别二维码", 300, 895);
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

        wx.showToast({
          title: '分享图片生成中...',
          icon: 'loading',
          duration: 1000
        });


        context.draw();
        // 将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
        setTimeout(function() {
            wx.canvasToTempFilePath({
                canvasId: 'mycanvas',
                success: function(res) {
                    var tempFilePath = res.tempFilePath;
                    that.setData({
                        imagePath: tempFilePath,
                        canvasHidden: true,
                        commentShow: false
                    });
                    wx.hideToast()
                },
                fail: function(res) {
                    console.log(res);
                }
            }, this);
        }, 1000);

    },
    //点击保存到相册
    baocun: function() {
        var that = this
        wx.saveImageToPhotosAlbum({
            filePath: that.data.imagePath,
            success(res) {
                wx.showModal({
                    content: '图片已保存到相册，赶紧晒一下吧~',
                    showCancel: false,
                    confirmText: '好的',
                    confirmColor: '#333',
                    success: function(res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                            /* 该隐藏的隐藏 */
                            that.setData({
                                modalshow: true
                            })
                        }
                    },
                    fail: function(res) {
                        console.log(11111)
                    }
                })
            }
        })
    },
    //点击生成
    getCode: function() { //生成二维码
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
})
