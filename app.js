//app.js
App({
  globalData: {},
  onLaunch: function(e) {
    this.login();
  },
  login: function() {
    let token = wx.getStorageSync("token") || "";
    this.globalData.token = token;
    // 登录接口，获取到 code 存到 data 里面，用于获取到code传递给服务器端
    if (!token) {
      // 如果没有登录，获取code 放到  globalData 里面
      wx.login({
        success: codeInfo => {
          console.log(codeInfo);
          this.globalData.code = codeInfo.code;
        }
      });
    }
  },
  reLogin: function() {
    try {
      wx.removeStorageSync('token');
      this.login();
    } catch (e) {}
  }
});