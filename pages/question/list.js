const app = getApp();
import service from "../../service/service";
import {
  ListQuestion
} from "../../service/api";

Page({
  data: {
    list: [],
    size: 10,
    page: 0
  },

  // 加载页面的时候获取列表数据
  onLoad: function () {
    this.list();
  },
  post: function() {
    wx.navigateTo({
      url: 'post',
    });
  },
  /**
   * 当页面滑动到底部，加载下一页
   */
  onReachBottom: function() {
    this.list();
  },

  /**
   * 下拉刷新动作
   */
  onPullDownRefresh: function() {
    console.log("下拉刷新");
    this.setData({
      page: 0,
      list: []
    });
    this.list();
    wx.stopPullDownRefresh();
  },
  clickQuestion: function(e) {
    const id = e.currentTarget.dataset.id;
    console.log("点击问题", id);
    wx.navigateTo({
      url: 'info?id=' + id,
    });
  },
  list: function() {
    const page = this.data.page;
    const size = this.data.size;
    service({
        ...ListQuestion,
        data: {
          page: page,
          size: size,
        }
      })
      .then(resp => {
        var concat = this.data.list.concat(resp.data);
        concat.forEach((item, index) => {
          if (item.title && item.title.length > 16) {
            item.title = item.title.substring(0, 16) + "...";
          }
        });
        this.setData({
          list: concat,
          page: page + 1
        });
        if (resp.data.length != 0) {
          wx.showToast({
            title: "加载第" + (page + 1) + "页成功",
            icon: "success"
          });
        } else {
          wx.showToast({
            title: "我是有底线的",
            icon: "none"
          });
        }
      })
      .catch(error => {
        console.log("请求列表失败", error);
        wx.showToast({
          title: error.message,
          icon: "none"
        });
      });
  }
});