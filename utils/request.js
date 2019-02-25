/*
  域名
*/
const GLOBAL_API_DOMAIN = "https://www.zhmzjl.com";
/*
  封装request
*/
function sendRrquest(url, method, data, header) {
  let promise = new Promise(function (resolve, reject) {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.request({
      url: url,
      data: data,
      method: method,
      header: header,
      success: resolve,
      fail: reject,
      complete: function () {
        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh(); //停止下拉刷新
      },
      fail: function (res) {
        wx.showModal({
          showCancel: false,
          confirmColor: '#1d8f59',
          content: '数据加载失败，请检查您的网络，点击确定重新加载数据!',
          success: function (res) {
            if (res.confirm) {
              sendRrquest(url, method, data, header);
            }
          }
        });
        wx.hideLoading();
       // return false; //如果进来的时候数据加载失败，停止请求
      },
    })
  });
  return promise;
};

/*
  多参数合并
*/
function MyHttp(defaultParams, ALL_API) {
  let _build_url = GLOBAL_API_DOMAIN;
  let resource = {};
  for (let actionName in ALL_API) {
    let _config = ALL_API[actionName];
    resource[actionName] = (pdata) => {
      let _params_data = pdata;
      return sendRrquest(_build_url + _config.url, _config.method, _params_data, {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8;Authorization;'
      });
    }
  }
  return resource;
}
export default MyHttp;
