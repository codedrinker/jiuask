const app = getApp();
import service from "../../service/service";
import util from "../../service/util";
import {
  QuestionInfo,
  CreateComment,
  ListComment
} from "../../service/api";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    question: {},
    comments: [],
    size: 10,
    page: 0,
    placeholder: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    this.setData({
      page: 0,
      comments: []
    });
    service({
        ...QuestionInfo,
        data: {
          id: options.id ? options.id : 39
        }
      })
      .then(resp => {
        wx.hideLoading();
        resp.data.gmtCreate = util.formatTime(resp.data.gmtCreate);
        this.setData({
          question: resp.data
        });
        this.listComment();
      })
      .catch(error => {
        console.log("请求失败", error);
      });
  },
  clickComment: function(e) {
    var id = e.currentTarget.dataset.id;
    var userNick = e.currentTarget.dataset.usernick;
    var userId = e.currentTarget.dataset.userid;
    this.setData({
      placeholder: "回复" + userNick + ":",
      replyUserId: userId,
      replyId: id
    });
  },
  onReachBottom: function() {
    this.setData({
      page: this.data.page + 1
    });
    this.listComment();
  },
  listComment: function() {
    service({
        ...ListComment,
        data: {
          questionId: this.data.question.id,
          page: this.data.page,
          size: this.data.size
        }
      })
      .then(resp => {
        var concat = this.data.comments.concat(resp.data);
        this.setData({
          comments: concat
        });
      })
      .catch(error => {
        console.log("请求失败", error);
      });
  },

  comment: function(e) {
    service({
        ...CreateComment,
        data: {
          content: this.data.content,
          questionId: this.data.question.id,
          replyUserId: this.data.replyUserId,
          replyId: this.data.replyId,
          formId: e.detail.formId
        }
      })
      .then(resp => {
        this.setData({
          content: "",
          replyId: "",
          placeholder: "",
          replyUserId: ""
        });
        this.onLoad({
          id: this.data.question.id
        });
      })
      .catch(error => {
        wx.showToast({
          title: error.message,
          icon: 'none',
          duration: 1500
        })
        console.log("请求失败", error);
      });
  },

  textarea: function(e) {
    this.setData({
      content: e.detail.value
    });
  }
})