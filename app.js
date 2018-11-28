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
      wx.login({
        success: codeInfo => {
          console.log(codeInfo);
          this.globalData.code = codeInfo.code;
        }
      });
    }
  }
});