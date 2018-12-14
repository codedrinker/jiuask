//获取应用实例
const app = getApp();
const service = options => {
  wx.showNavigationBarLoading();
  wx.showLoading({
    title: "加载中",
    mask: true
  });
  options = {
    dataType: "json",
    ...options,
    method: options.method ? options.method.toUpperCase() : "GET",
    header: {
      "token": wx.getStorageSync("token") || ""
    },
  };
  const result = new Promise(function(resolve, reject) {
    //做一些异步操作
    const optionsData = {
      success: res => {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
        if (res.data.status == 1005) {
          wx.showModal({
            title: '请登陆',
            content: '您还未登录，请授权登陆',
            success: res => {
              app.reLogin();
              wx.redirectTo({
                url: '/pages/index',
              });
            }
          });
        } else if (res.data.status != 200) {
          reject(res.data);
        } else {
          resolve(res.data);
        }
      },
      fail: error => {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
        if (error.errMsg == 'request:fail timeout') {
          error = {
            message: "请求超时，请重试"
          };
          reject(error);
        } else if (error.errMsg == 'request:fail ') {
          error = {
            message: "请求超时，请重试"
          };
          reject(error);
        } else {
          reject(error);
        }
      },
      ...options
    };

    let token = wx.getStorageSync("token") || "";
    if (!token) {
      if (optionsData.url.indexOf('api/login') == -1) {
        wx.showModal({
          title: '请登陆',
          content: '您还未登录，请授权登陆',
          success: res => {
            app.reLogin();
            wx.redirectTo({
              url: '/index',
            });
          }
        });
        reject(error);
        return;
      }
    }

    wx.request(optionsData);
  });
  return result;
};

export default service;