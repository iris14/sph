import Vue from 'vue'
import App from './App.vue'
//三级联动组件——全局组件
import TypeNav from '@/components/TypeNav'
import Carousel from '@/components/Carousel'
import Pagination from '@/components/Pagination'
// 引入element-ui
import { Button,MessageBox } from 'element-ui';


Vue.component(TypeNav.name, TypeNav);
Vue.component(Carousel.name, Carousel);
Vue.component(Pagination.name, Pagination)

Vue.component(Button.name, Button);
// ，采用挂在原型上的方法来注册组件
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;


//引入路由
import router from '@/rooter'
// 引入仓库
import store  from '@/store';
//引入Mockjs
import '@/mock/mockServe'
// 引入swiper样式
import "swiper/css/swiper.css"
// 统一接口api文件夹里面全部请求函数
// 统一引入
import * as API from '@/api'

Vue.config.productionTip = false


new Vue({
  render: h => h(App),
  beforeCreate(){
    Vue.prototype.$bus = this;
    Vue.prototype.$API = API
  },
  // 注册路由
  router,
  store,
}).$mount('#app')
