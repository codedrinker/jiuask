/**
 * 接口定义
 */
import config from "../config";
// 登录注册接口
const Login = {
  url: config.serverHost + "/api/login",
  method: "post"
};

// 提交问题
const Question = {
  url: config.serverHost + "/api/question",
  method: "post"
};

// 获取问题列表
const ListQuestion = {
  url: config.serverHost + "/api/question/list",
  method: "get"
};

export {
  Login,
  Question,
  ListQuestion
};