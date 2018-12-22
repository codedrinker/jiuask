//index.js
//获取应用实例
const app = getApp();
import service from "../service/service";
import {
  Login
} from "../service/api";
Page({
  // 保存当前页面的数据，用于存储和传递数据到 view 层
  data: {},
  onLoad: function (query) {
    if (app.globalData.token) {
      wx.switchTab({
        url: "question/list"
      });
    }
  },
  // 绑定wxml的button，用户获取用户信息
  getUserInfo: function(userInfo) {
    if (app.globalData.token) {
      // 已经登录成功，不需要再次登录，等待跳转逻辑
      wx.showToast({
        title: "您已登录",
        icon: "success",
        duration: 2000
      });

      wx.switchTab({
        url: "question/list"
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
    service({
        ...Login,
        data: {
          code: app.globalData.code,
          rawData: userInfo.detail.rawData,
          signature: userInfo.detail.signature
        }
      })
      .then(response => {
        wx.hideLoading();
        console.log(response);
        if (response.status == 200) {
          // 展示 登录成功 提示框
          wx.showToast({
            title: '登录成功',
            icon: "success",
            duration: 1000
          });
          // 把自定义登录状态 token 缓存到小程序端
          wx.setStorage({
            key: "token",
            data: response.data.token,
            success: data => {
              app.globalData.token = response.data.token;
            }
          });
          wx.switchTab({
            url: "question/list"
          });
        } else {
          // 登录如果服务端产生异常如果重新获取 code，因为code 只能使用一次
          app.login();
          // 展示 错误信息
          wx.showToast({
            title: response.message,
            icon: "none",
            duration: 1000
          });
        }
      })
      .catch(error => {
        console.log(error);
        // 登录如果服务端产生异常如果重新获取 code，因为code 只能使用一次
        app.login();
        wx.showToast({
          title: error.message,
          icon: 'none'
        });
      });
  }
});