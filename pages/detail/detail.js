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
        show: false, //不显示分享
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
        placeholder: '留言鼓励一下...',
        reply_username: '',
        pid: 0,
        page: 1,
        likenum: null,
        like: false,
        code: "E7AI98",
        // inputValue:"",
        maskHidden: false,
        name: "",
        touxiang: "",
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.showLoading();
        var that = this;
        let _userInfo = wx.getStorageSync('userInfo')
        that.setData({
            userInfo: _userInfo,
            id: options.id,
            catid: options.catid
        });
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
    backContent: function(e) { //回复的评论
        let _from = e.currentTarget.dataset.from;
        let _id = e.currentTarget.dataset.pid;
        this.setData({
            placeholder: '回复 ' + _from,
            focus: true,
            reply_username: _from,
            pid: _id
        });
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
    postComments: function() {
        var that = this;
        if (!that.data.content) {
            wx.showModal({
                showCancel: false,
                confirmColor: '#1d8f59',
                content: '评论不能为空!'
            });
            return false;
        }
        if (!that.data.userInfo) return false;
        wx.showLoading();
        let _params = {
            newsid: that.data.id, // 博客文章ID
            pid: that.data.pid, // 父评论ID，默认为0
            from_username: that.data.userInfo.nickName, // 评论者用户名
            from_avatar: that.data.userInfo.avatarUrl, // 评论者头像
            reply_username: that.data.reply_username, // 回复了谁，pid不为0时，不允许未空
            reply_avatar: "", // 回复了谁的头像，允许为空
            content: that.data.content
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
                    content: '',
                    page: 1,
                    comments: [],
                    reply_username: '',
                    pid: 0,
                    placeholder: '点击评论回复...',
                    disabled: true
                });
                that.commentlists();
            }
        });
    },
    commentlists: function() {
        var that = this;
        let _params = {
            newsid: that.data.id,
            page: this.data.page,
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
    rewardRose: function() {
        var that = this;
        that.setData({
            show: true
        })
    },
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
        that.postComments()
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
    modalCancel: function() { //关闭分享
        this.setData({
            show: false
        })
    },
    onPageScroll: function(e) {
        // if (e.scrollTop > 100) {
        //   this.setData({
        //     backShow: true
        //   });
        // } else {
        //   this.setData({
        //     backShow: false
        //   });
        // }
    },
    goHome: function() {
        wx.switchTab({
            url: '../index/index'
        });
    },
    createNewImg: function() {
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
        setTimeout(function() {
            wx.canvasToTempFilePath({
                canvasId: 'mycanvas',
                success: function(res) {
                    var tempFilePath = res.tempFilePath;
                    that.setData({
                        imagePath: tempFilePath,
                        canvasHidden: true
                    });
                },
                fail: function(res) {
                    console.log(res);
                }
            });
        }, 200);
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
                                maskHidden: false
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
    formSubmit: function(e) {
        var that = this;
        this.setData({
            maskHidden: false
        });
        wx.showToast({
            title: '装逼中...',
            icon: 'loading',
            duration: 1000
        });
        setTimeout(function() {
            wx.hideToast()
            that.createNewImg();
            that.setData({
                maskHidden: true
            });
        }, 1000)
    }
})
