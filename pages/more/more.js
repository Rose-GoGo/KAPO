// pages/more/more.js
import Api from '/../../utils/config/api.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    postType: '', //提交状态
    images: [],
    bigData: [],
    catid: '',
    disabled: true,
    loadMore: true,
    monthData: {}, //存储月数据
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    isRose: false,
    showEdit: false,
    id: '',
    dataIndex: 0, //为了得到bigdata中的数组，特别是是换年
    aids: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var ss = new Date().getMonth() + 1;
    ss = ss >= 10 ? '' + ss : '0' + ss;
    that.setData({
      catid: options.catid,
      month: ss
    })
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              var userInfo = res.userInfo;
              if (userInfo.nickName == '赵' || userInfo.nickName == '天道酬勤') {
                that.setData({
                  isRose: true
                });
              }
              that.setData({
                username: userInfo.nickName,
                sex: userInfo.gender
              })
            }
          });
        }
      }
    });
    that.getLine();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.loadMore) {
      that.earMonth(); //上个月的时间
      that.getLine();
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '锲而舍之,朽木不折;锲而不舍,金石可镂',
      imageUrl: '/assets/images/share.jpg'
    }
  },
  forTitle: function (e) {
    var that = this;
    let _data = e.detail.value;
    that.setData({
      title: _data
    });
    if (that.data.title && that.data.remark) {
      that.setData({
        disabled: false
      })
    } else {
      that.setData({
        disabled: true
      })
    }
  },
  forRemark: function (e) {
    var that = this;
    let _data = e.detail.value;
    that.setData({
      remark: _data
    });
    if (that.data.title && that.data.remark) {
      that.setData({
        disabled: false
      })
    } else {
      that.setData({
        disabled: true
      })
    }
  },
  earMonth: function (n) { //获取年月
    var ym, year, month;
    var that = this;
    year = that.data.year;
    month = that.data.month;
    ym = year + '-' + month;
    if (new Date(ym).getMonth() == 0) {
      year = year - 1;
      month = 12;
      let big = that.data.bigData;
      let index = this.data.dataIndex + 1
      let datas = {
        [year]: {}
      }
      big.push(datas)
      that.setData({
        dataIndex: index,
        bigData: big
      });
    } else {
      year = year;
      month = month - 1;
    }
    year = '' + year;
    month = month >= 10 ? '' + month : '0' + month
    that.setData({
      year: year,
      month: month
    });
  },
  getLine: function () {
    wx.showLoading();
    var that = this,
      obj = {};
    var year = that.data.year;
    var month = that.data.month;
    var dataIndex = that.data.dataIndex;
    var big = that.data.bigData;
    let _params = {
      year: year,
      month: month,
      catid: that.data.catid,
    }
    Api.showday(_params).then(res => {
      if (!res.data.code) {
        let _data = res.data.data;
        if (that.data.month == '12') { //换年了
          obj = _data;
        } else {
          obj = Object.assign(that.data.monthData, _data); // 月数据
        }
        that.setData({
          monthData: obj
        });
        big[dataIndex] = {
          [year]: obj
        }
        that.setData({
          bigData: big
        })
        if (_data[month].length == 0) { //如果没有月数据，则不加载了，本来是想判断是否已经加载到底了，但是这里可能有半途没添加数据的情况，所以这里的逻辑不是很严谨
          that.setData({
            loadMore: false
          })
        }
        wx.hideLoading();
      }
    });
  },
  bindGetUserInfo: function (e) {
    var that = this;
    var userInfo = e.detail.userInfo;
    that.setData({
      username: userInfo.nickName,
      sex: userInfo.gender
    });
    that.formSubmit();
  },
  editItem: function (e) {
    let showEdit = this.data.showEdit;
    this.setData({
      showEdit: !showEdit
    })
  },
  editOne: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    let remark = e.currentTarget.dataset.remark;
    that.setData({
      postType: 'update',
      title: title,
      remark: remark,
      disabled: false,
      id: id,
      images: []
    });
  },
  deleteOne: function (e) { //删除本条
    var that = this;
    let id = e.currentTarget.dataset.id;
    let _params = {
      catid: that.data.catid,
      id: id
    }
    Api.everydelete(_params).then(res => {
      if (!res.data.code) {
        let month = new Date().getMonth() + 1;
        let year = new Date().getFullYear();
        month = month >= 10 ? '' + month : '0' + month;
        that.setData({
          year: year,
          month: month
        });
        that.getLine();
      }
    });
  },
  removeImage(e) {
    const idx = e.target.dataset.idx;
    let img = this.data.images;
    img.splice(idx, 1);
    this.setData({
      images: img
    })
  },
  imagePreview(e) {
    const idx = e.target.dataset.src;
    // const images = this.data.images
    wx.previewImage({
      current: idx, //当前预览的图片
      urls: idx, //所有要预览的图片
    })
  },
  uploadImg: function () {
    var that = this;
    if (this.data.images.length < 3) {
      wx.chooseImage({
        count: 3, //最多可以选择的图片总数
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          const images = that.data.images.concat(res.tempFilePaths);
          // 限制最多只能留下3张照片
          // that.data.images = images.length <= 3 ? images : images.slice(0, 3)

          var imgCount = 0;
          var aids = [];
          for (var i = 0, h = images.length; i < h; i++) {
            wx.uploadFile({
              url: 'https://www.zhmzjl.com/index.php?m=content&c=punch&a=upload',
              filePath: images[i],
              name: 'file',
              formData: {
                'file': i
              },
              header: {
                // "Content-Type": "multipart/form-data"
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
              },
              success: function (res) {
                var _data = JSON.parse(res.data)
                if (_data.code == 0) {
                  imgCount++;
                  var productInfo = _data.aid;
                  aids.push(productInfo);
                  that.setData({
                    aids: aids
                  });
                }
                if (imgCount == images.length) {
                  wx.hideToast();
                }
              },
              fail: function (res) {
                wx.hideToast();
                wx.showModal({
                  title: '错误提示',
                  content: '上传图片失败',
                  showCancel: false,
                  success: function (res) { }
                })
              }
            }).onProgressUpdate((res) => { //查看进度
              // console.log('上传进度', res.progress)
              // console.log('已经上传的数据长度', res.totalBytesSent)
              // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
            })
            that.setData({
              images: images
            });
          }
        }
      })
    } else {
      wx.showToast({
        title: '最多上传三张图片',
        icon: 'loading',
        duration: 3000
      });
    }
  },
  formSubmit: function () {
    var that = this;
    that.setData({
      disabled: true //想偷懒都不行，这里需要点击按钮后，按钮就设置成disabled, 避免重负提交
    });
    if (that.data.aids.length == 0) {
      return false;
    }
    var aids = that.data.aids.join(';');
    let _params = {
      catid: that.data.catid,
      title: that.data.title,
      remark: that.data.remark,
      username: that.data.username,
      aids: aids //图片
    }
    if (this.data.id) { //如果有id， 则进行更新，否则为新增
      _params.id = this.data.id;
      Api.everyupdate(_params).then(res => {
        if (!res.data.code) {
          wx.showToast({
            title: '更新成功',
            icon: 'success',
            duration: 2000
          });
          let month = new Date().getMonth() + 1;
          let year = new Date().getFullYear();
          month = month >= 10 ? '' + month : '0' + month;
          that.setData({
            id: '',
            title: '',
            remark: '',
            year: year,
            month: month,
            showEdit: false,
            images:[]
          })
          that.getLine();
        }
      });
    } else {
      Api.everyadd(_params).then(res => {
        if (!res.data.code) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          });
          let month = new Date().getMonth() + 1;
          let year = new Date().getFullYear();
          month = month >= 10 ? '' + month : '0' + month;
          that.setData({
            title: '',
            remark: '',
            year: year,
            month: month,
            showEdit: false,
            images:[]
          });
          that.getLine();
        }
      });
    }
  },
})
