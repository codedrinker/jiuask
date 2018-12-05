const app = getApp();
import service from "../../service/service";
import {
  Question
} from "../../service/api";
Page({
  data: {
    userInfo: {},
    subjectList: [],
    pageSize: 10,
    pageOffset: 0
  },
  onLoad: function() {},
  post: function(e) {
    console.log("submit")
    console.log(e.detail.value)
    if (!e.detail.value.title) {
      wx.showToast({
        title: '请输入标题',
      });
      return;
    }

    if (!e.detail.value.content) {
      wx.showToast({
        title: '请输入内容',
      });
      return;
    }
    // 调用服务端 API
    wx.showLoading({
      title: '提交中'
    });
    service({
      ...Question,
        data: {
          title: e.detail.value.title,
          content: e.detail.value.content
        }
      })
      .then(response => {
        wx.hideLoading();
        console.log(response);
        if (response.status == 200) {
          // 展示 登录成功 提示框
          wx.showToast({
            title: '发布成功',
            icon: "success",
            duration: 2000,
            success: res => {
              wx.switchTab({
                url: "list"
              });
            }
          });
        } else {
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
        wx.showToast({
          title: '提交失败'
        });
      });
  }

});