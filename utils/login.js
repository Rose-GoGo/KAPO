const login = n => {

  // if (wx.getStorageSync('loginSessionkey')) return;

  wx.login({
    success: (res) => {
      if (res.code) {
        wx.request({
          method: 'post',
          url: "http://119.29.161.36:3000/login",
          data: {
            jscode: res.code
          },
          success: (res) => {
            var _data = res.data.data.openid;
            wx.setStorageSync('loginSessionkey', _data);
          }
        })
      }
    }
  })
}
module.exports.login = login;
