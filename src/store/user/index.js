// 登录注册模块
import { reqGetCode, reqUserRegister, reqUserLogin, reqUserInfo, reqLogout} from "@/api";
import {setToken, getToken, removeToken} from "@/utils/token"
const state = {
  code: "",
  token:getToken(),
  userInfo:{}
};
const mutations = {
  GETCODE(state, code) {
    state.code = code;
  },
  USERLOGIN(state, token){
    state.token = token
  },
  GETUSERINFO(state, userInfo){
    state.userInfo = userInfo
  },
  CLEAR(state){
    // 帮仓库中相关用户信息清空
    state.token = '';
    state.userInfo = {};
    removeToken()

  }
};
const actions = {
  // 获取验证码
  async getCode({ commit }, phone) {
    // 这里是将验证码直接返回但是正常情况是将验证码发到手机上
    let result = await reqGetCode(phone);
    if (result.code === 200) {
      commit("GETCODE", result.data);
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },
  // 用户注册
  async userRegister({commit}, user){
    let result = await reqUserRegister(user)
    if(result.code === 200){
      return 'ok'
    }else{
      return Promise.reject(new Error('faile'))
    }
  },
  // 登录
  async userLogin({commit}, data){
    let result = await reqUserLogin(data)
    if(result.code === 200){
      commit("USERLOGIN", result.data.token)
      // 持久化存储token
      setToken(result.data.token)
      return 'ok'
    }else{
      return Promise.reject(new Error('faile'))
    }
  },
  // 获取用户信息
  async getUserInfo({commit}) {
    // 这里是将验证码直接返回但是正常情况是将验证码发到手机上
    let result = await reqUserInfo();
    if (result.code === 200) {
      commit("GETUSERINFO", result.data);
      return "ok";
    }else {
      return Promise.reject(new Error('faile'));
    }
  },
  // 退出登录
  async userLogout({commit}){
    // 只是向服务器发起一次请求，通知服务器清除token
    let result = await reqLogout();
    if(result.code === 200){
      commit("CLEAR")
      return 'ok'
    }else{
      return Promise.reject(new Error('faile'))
    }
  }
};
const getters = {};

export default {
  state,
  mutations,
  actions,
  getters,
};
