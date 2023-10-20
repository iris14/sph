// 配置路由的地方
import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import store from "@/store";
Vue.use(VueRouter);

let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;

VueRouter.prototype.push = function (location, resolve, reject) {
  if (resolve && reject) {
    originPush.call(this, location, resolve, reject);
  } else {
    originPush.call(
      this,
      location,
      () => {},
      () => {}
    );
  }
};

VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    originReplace.call(this, location, resolve, reject);
  } else {
    originReplace.call(
      this,
      location,
      () => {},
      () => {}
    );
  }
};

let router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { y: 0 };
  },
});

// 全局守卫：前置守卫
router.beforeEach(async (to, from, next) => {
  next();
  // 获取用户的token和信息
  let token = store.state.user.token;
  let name = store.state.user.userInfo.name;
  // 用户已经登录
  if (token) {
    // 用户已经登录了还想去Login【不能放行，停留在首页】
    if (to.path == "/login" || to.path == "/register") {
      next("/home");
    } else {
      // 登录去的不是login
      // 如果用户名已有
      if (name) {
        // 放行
        next();
      } else {
        try {
          // 获取用户信息成功
          await store.dispatch("getUserInfo");
          // 放行
          next();
        } catch (error) {
          // token失效了获取不到用户信息，重新登录
          // 清除token
          await store.dispatch("userLogout");
          next("/login");
        }
      }
    }
  } else {
    // 用户未登录去登录相关，不能去支付相关
    let toPath = to.path;
    if (toPath.indexOf("/trade") != -1 || toPath.indexOf("/pay") != -1 || toPath.indexOf("/center") != -1) {
      next("/login?redirect=" + toPath);
    }else{
      next();
    }
  }
});
export default router;
