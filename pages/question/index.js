//index.js
//获取应用实例
import config from "../../config";
const app = getApp();
Page({
  // 保存当前页面的数据，用于存储和传递数据到 view 层
  data: {},
  onLoad: function (query) {
  },
  // 绑定wxml的button，用户获取用户信息
  getUserInfo: function (userInfo) {
    if (app.globalData.token){
      // 已经登录成功，不需要再次登录，等待跳转逻辑
      wx.showToast({
        title: "您已登录",
        icon: "success",
        duration: 2000
      });
      return;
    }

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
        code: app.globalData.code,
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
            icon: "success",
            duration: 1000
          });
          // 把自定义登录状态 token 缓存到小程序端
          wx.setStorage({
            key: "token",
            data: response.data.data.token,
            success: data => {
              app.globalData.token = response.data.data.token;
            }
          });
        } else {
          // 登录如果服务端产生异常如果重新获取 code，因为code 只能使用一次
          app.login();
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
