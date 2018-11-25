//index.js
//获取应用实例
import config from "../../config";
Page({
  // 保存当前页面的数据，用于存储和传递数据到 view 层
  data: {},
  onLoad: function (query) {
    // 登录接口，获取到 code 存到 data 里面，用于获取到code传递给服务器端
    wx.login({
      success: codeInfo => {
        console.log(codeInfo);
        this.setData({
          code: codeInfo.code
        });
      }
    });
  },
  // 绑定wxml的button，用户获取用户信息
  getUserInfo: function (userInfo) {
    // 展示登录中加载提示
    wx.showLoading({
      title: "登录中",
      mask: true
    });
    console.log(userInfo)
    // 调用服务端 API
    wx.request({
      url: config.serverHost + '/api/login',
      method: "post",
      data: JSON.stringify({
        code: this.data.code,
        rawData: userInfo.detail.rawData,
        signature: userInfo.detail.signature
      }),
      dataType: "json",
      success: response => {
        wx.hideLoading();
        console.log(response);
        if (response.data.status == 200) {
          // 展示 登录成功 提示框
          wx.showToast({
            title: '登录成功',
            icon: "none",
            duration: 1000
          });
          // 把自定义登录状态 token 缓存到小程序端
          wx.setStorage({
            key: "token",
            data: response.data.data.token
          });
        } else {
          // 展示 错误信息
          wx.showToast({
            title: response.data.message,
            icon: "none",
            duration: 1000
          });
        }
      },
      fail: response => {
        console.log(response)
        wx.showToast({
          title: '登录失败，请重试'
        });
      }
    });
  }
});
