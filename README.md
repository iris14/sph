# 尚品汇——frontEnd

## 项目配置
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



## 模块开发顺序

1. 先静态页面+静态组件拆分出来(注意拆分组件顺序：HTML+CSS+图片资源+引入+注册+使用)
2. 发请求(API)
3. vuex (三连环)
4. 组件获取仓库数据，动态展示数据



## 项目笔记

### v-if和v-show

v-if：频繁操作DOM、耗性能
v-show:通过样式将元素显示或隐藏，性能更好

#### 当组件数量增多判断冗余时，可以使用路由元信息meta进行自定义信息输入

```
<Footer v-show="$route.meta.showFooter"></Footer>
{
    path: '/register',
    component: Register,
    meta: { showFooter: false }
},

```

### 路由

#### 路由跳转

1. 声明式导航：router-link（务必要有to属性）
2. 编程式导航：主要利用的是组件实例的$router.push | replace方法，可以书写一些自己的业务

#### 路由传参

1. params参数：属于路径中的一部分，在配置路由的时候需要占位

   ```
   route.js中
   path: '/search/:keyWord',
   传参：
   this.$router.push("/search/" + this.keyWord)
   ```

   

2. query参数：不属于路径的一部分，类似于Ajax中的querystring ，不需要占位 /home?k=v&kv=

```
两种写法
1.普通写法
this.$router.push("/search/"  + this.keyWord + "?k=" + this.keyWord.toUpperCase())
2.模板字符串写法
this.$router.push(`/search/${this.keyWord}?k=${this.keyWord.toUpperCase()}`)
```

两种合在一起传参：

```
对象写法
this.$router.push({name:"search",params:{keyWord:this.keyWord},query:{k:this.keyWord.toUpperCase()}})
```

##### 需要注意的问题

1. ##### 如何指定params参数可传可不传?

   ```
   已占位，但是不传递，路径会存在问题
   配置可传可不传：加？
   path: '/search/:keyWord?'
   ```

2. ##### params参数可传可不传，若传递为空串，如何解决？

   ```
   路径会存在问题。
   解决：使用undefined解决
   params:{keyWord:'' || undefined}
   ```

   

3. **编程式路由组件跳转到当前路由多次执行会弹出NavigationDuplicated警告错误**

   ```
   多次点击搜索按钮会出现（声明式不会出现该问题，vue底层已解决）
   原因：最新的"vue-router": "^3.5.3"引入了promise，编程式导航具有其返回值，失败成功的回调
   解决：给push方法添加两个回调参数
   this.$router.push({name:"search",params:{keyWord:this.keyWord},query:{k:this.keyWord.toUpperCase()}},()=>{},()=>{})
   ```

缺陷：只解决单个编程式导航
重写push方法

![image-20231020103659502](https://github.com/iris14/sph/blob/main/images/image-20231020103659502.png)

4. **路由组件能否传递props数据**
   1. 布尔值写法：只能传递params参数。
   2. 对象写法：额外的给路由组件传递一些props
   3. 函数写法（常用）：params、query参数都可传递

#### 路由守卫

#### 解决问题

1. 多个组件展示用户信息需要在每一个组件的mounted中触发，效率不高
2. 用户已经登陆，不应该出现在登录页

##### 登录页面的重定向

若用户未登录则不能跳转到某些页面，若此时用户登录后应该重新调回到用户原本想跳转的页面。

```javascript
// 获取用户去往的页面
        let toPath = to.path
        if (toPath.indexOf('/trade') != -1 || toPath.indexOf('/pay') != -1 || toPath.indexOf('/center') != -1){
            // 把未登录的时候想去而没有去成的信息，存储于地址栏中
            next(`/login?redirect=${toPath}`)
        }
// 登录的路由组件：看路由中是否有query参数，有，跳转到query参数指定的路由中，没有跳到home
let toPath = this.$route.query.redirect || "/home";
this.$route.push(toPath)
```

##### 路由独享与组件内守卫

用户已经登录的情况下，不能去支付成功等页面, 只有从购物车界面才能跳转到交易页面( 创建订单)

```javascript
// route.js
{
        path: '/trade',
        component: Trade,
        meta: { showFooter: true },
        // 路由独享守卫
        beforeEnter: (to, from, next) => {
            if (from.path == '/shopcart') {
                next()
            } else {
                // 从哪来回哪去
                next(false)
            }
        }

    },
```





### axios二次封装

#### 原因

为了使用拦截器，请求拦截器（在发请求之前可以处理业务），响应拦截器（服务器数据返回之后处理业务）

#### 配置截图

```
// axios二次封装
import axios from 'axios'

const requests = axios.create({
    baseURL:"/api",
    timeout:5000
})

// 请求拦截器
requests.interceptors.request.use((config)=>{
    return config
})

// 响应拦截器
requests.interceptors.response.use((res)=>{
    return res.data
},(error)=>{
    return Promise.reject(new Error('faile'))
})

//对外暴露
export default requests

```



### 接口统一管理

项目小：可以在组件的生命周期函数中发请求
项目大：axios.get

### 跨域问题

#### 是什么

由于协议、域名、端口号不同请求。例如在这个项目当中，

http://localhost:8080/#/home 前端本地服务器
http://39.98.123.211 后台服务器地址

####  如何解决

- JSONP: 借助script标签里面的src属性，引入外部资源的时候不受同源策略限制来实现。而且只能解决get请求的跨域问题。

- CORS:写服务器的人在返回响应的时候，给你几个特殊的响应头。浏览器解析到特殊响应头的时候，就会放行该响应。（CORS机制只能用于浏览器端，即仅限于XMLHttpRequest和Fetch API这两种请求。）

- 代理: 在vue-cli脚手架中使用了devServer.proxy的配置

```
module.exports = {
    lintOnSave:false,
    //代理跨域
    devServer:{
        proxy:{
            '/api':{
                target: 'http://39.98.123.211',
                // pathRewrite:{'^/api':''}
            }
        }
    }
}
```

### 请求加载进度条nprogress

```
// 引入进度条
import nprogress from 'nprogress'
// 引入进度条样式
import "nprogress/nprogress.css" 

// 请求拦截器
requests.interceptors.request.use((config)=>{
    nprogress.start()
    return config
})

// 响应拦截器
requests.interceptors.response.use((res)=>{
    nprogress.done()
    return res.data
},(error)=>{
    return Promise.reject(new Error('faile'))
})


```

### 卡顿现象

#### 表现

- 非正常情况 (用户操作很快)本身全部的级分类都应该触发鼠标进入事件，但是经过测试，只有部分h3触发了.由于用户行为过快，导致浏览器反应不过来  如果当前回调函数中有一些大量业务，有可能出现卡顿现象

#### 防抖和节流

- **防抖：** 前面的所有的触发都被取消，最后一次执行在规定的时间之后才会触发，也就是说如果连续快速的触发只会执行一次(例子:输入框搜索 输入完内容之后 一秒后才发送一次请求)

  - **解决：** ladash插件，封装函数的防抖与节流业务（闭包+延迟器）

- **节流：** 在规定的间隔时间范围内不会审复触发回调，只有大于这个时间间隔才会触发回调，把频繁触发变为少量触发(例子：计数器限定一秒内不管用户点击按钮多少次，数值只能加一)

  - **解决：** _throttle()

  - ```
    // 引入
    import throttle from 'lodash/throttle'
    ```

- 区别

  - 防抖：用户操作很频繁，但是只是执行一次
  - 节流：用户操作很频繁，但是把频繁的操作变为少量操作[可以给浏览器有充裕的时间解析代码]

#### 三级联动的路由跳转和传参

- **问题**

  - 如果使用声明式导航router-link，可以实现路由的跳转与传递参数，但是会出现卡顿现象。
    - 点击的标签不能精确指定为a标签
    - 如何确定是几级a标签

- **原因**

  - router-link为一个组件，当服务器的数据返回之后，循环出很多的router-link组件（需要创建组件实例）1000+ 数量较多。 创建组件实例的时候，一瞬间创建上千个十分耗内存，因此出现卡顿现象。

- **解决**

  - 采用编程式导航+事件委派，避开循环语句，放置事件。
    - 把子节点当中a标签，加上自定义属性data-categoryName, 其余的子节点不存在
    - 利用事件触发event，获取到当前触发这个事件的节点【h3,a,dt,dl】，但只需要带有data-categoryName的节点，即为a标签
    - 节点有个属性dataset属性， 可以获取节点的自定义属性与属性值

  ```
  // template中
  <a :data-categoryName="c3.categoryName" ：data-category3Id="c3.categoryId">{{ c3.categoryName }}</a>
  
  // js中
  //进行路由跳转的回调函数
      goSearch(event) {
        //event.target:获取到的是出发事件的元素(div、h3、a、em、dt、dl)
        let node = event.target;
        //给a标签添加自定义属性data-categoryName,全部的字标签当中只有a标签带有自定义属性，别的标签名字----dataset纯属扯淡
        let {
          categoryname,
          category1id,
          category2id,
          category3id,
        } = node.dataset;
        //第二个问题解决了：点击的到底是不是a标签（只要这个标签身上带有categoryname）一定是a标签
        //当前这个if语句：一定是a标签才会进入
        if (categoryname) {
          //准备路由跳转的参数对象
          let loction = { name: "search" };
          let query = { categoryName: categoryname };
          //一定是a标签：一级目录
          if (category1id) {
            query.category1Id = category1id;
            //一定是a标签：二级目录
          } else if (category2id) {
            query.category2Id = category2id;
            //一定是a标签：三级目录
          } else {
            query.category3Id = category3id;
          }
          //判断：如果路由跳转的时候，带有params参数，捎带脚传递过去
          if (this.$route.params) {
            loction.params = this.$route.params;
            //动态给location配置对象添加query属性
            loction.query = query;
            //路由跳转
            this.$router.push(loction);
          }
        }
      },
  
  ```

### 过度动画

#### 前提

组件元素务必要有v-if或v-show指令才可以进行

```HTML
<transition name="sort"> 
     <!-- 三级联动 -->
     <div class="sort" v-show="showSort">
     </div>
</transition>
<!-- 属性名name写了之后，不需要使用v-xxx -->
```

```CSS
// 属性名name写了之后，不需要使用v-xxx
// 过渡动画样式
    // 开始状态
    .sort-enter {
      height: 0;
    }
    // 结束状态
    .sort-enter-to {
      height: 461px;
    }
    // 定义动画时间、速率
    .sort-enter-active {
      transition: all 0.5s linear;
    }

```

### 性能优化问题

#### 问题

组件切换过程多次向服务器发送请求

#### 解决

APP的mounted只会执行一次

### Mock数据

#### 是什么& 作用

服务器接口不存在的数据如何模拟，利用mock.js
作用：生成随机数据，拦截AJAX请求

webpack默认对外暴露：图片、JSON数据格式

#### 安装

```
npm i --save mockjs  
```

#### 步骤

1. 在项目当中src文件夹中创建mock文件夹
2. 第一步准备JSON数据(mock 文件夹中创建相应的JSON文件) ----格式化一下，别留有空格(跑不起来的)
3. mock数据需要的图片放置到public文件夹中[public文件夹在打包的时候，会把相应的资源原封不动打包到dist文件夹
4. 创建mockServe . js通过mockjs插件实现模拟数据

``` 
import Mock from 'mockjs'
import banner from './banner.json'
import floor from './floor.json'

// 第一个参数：请求地址 第二个参数：请求数据
Mock.mock("/mock/banner", { code: 200, data: banner })
Mock.mock("/mock/floor", { code: 200, data: floor })
```

### 轮播图：swiper

### 步骤

引包+引样式+结构+实例

```
var mySwiper = new Swiper ('.swiper', {
    direction: 'vertical', // 垂直切换选项
    loop: true, // 循环模式选项
    
    // 如果需要分页器
    pagination: {
      el: '.swiper-pagination',
    },
    
    // 如果需要前进后退按钮
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    
    // 如果需要滚动条
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  })        
```

#### 存在的问题

在new Swpier实例之前，页面中结构必须的有[现在把new Swiper实例放在mounte这里发现不行]

**原因**：因为dispatch当中涉及到异步语句，导致v- for遍历的时候结构还没有完全

**解决**： 

- updata能解决，若有别的数据更新，同时触发了响应内容，冗余

- setTimeout定时器解决，但过时效才能显示分页器效果

- **watch+nectTick**： wahtch只能保证数据已经存在，不能保证结构是否完整

  - nectTick：在下次DOM更新（服务器数据已返回）
  - 循环结束之后（v-for执行结束 结构已完整）执行延迟回调。在修改数据之后（服务器数据回来）立即使用这个方法，获取更新后的DOM。

  ```
  watch: {
      bannerList: {
        handler(newValue, oldValue) {
          this.$nextTick(()=>{
            var mySwiper = new Swiper(this.$refs.mySwiper, {
            loop: true, // 循环模式选项
  
            // 如果需要分页器
            pagination: {
              el: ".swiper-pagination",
            },
            // 如果需要前进后退按钮
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
            });
          })
        },
      },
    },
  ```

  ### 组件通信方式

  - 父子组件通信
    - props
    - 自定义事件: @on @emit 可以 实现子给父通信
    - 全局事件总线: $bus全能 **(vue3取消了，由于安全性低)**
  - 全能
    - pubsub-js: vue当中儿乎不用
    - vuex
  - 插槽

### vuex中的getter使用

**作用**

为了简化数据，使用方便

**配置**

```javascript
//引入
import {mapGetters} from 'vuex'
//使用
computed:{
      ...mapGetters(['goodsList'])
}


// 计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {
    // 当前形参state，是当前仓库中的state
    goodsList(state){
        return state.searchList.goodsList
    },
    trademarkList(state) {
        return state.searchList.trademarkList
    },
    attrsList(state) {
        return state.searchList.attrsList
    },
}
// 防止没有网络：
goodsList(state){
        // 考虑没有网络
        return state.searchList.goodsList || []
},
```

### 合并对象 （ES6新语法）

```
beforeMount() {
    Object.assign(this.searchParams,this.$route.query,this.$route.params)
  },
```


### 懒加载

#### 图片懒加载

在请求服务器结束前 加载默认设置的图片

```
npm i vue-lazyload
```

####  路由懒加载

当路由被访问的时候才加载对应组件

```
{
        path: '/center',
        component: () => import('@/pages/Center'),
        meta: { showFooter: true },
}
```

### 表单验证插件

```javascript
import Vue from 'vue'
import VeeValidate from 'vee-validate';
// 中文提示信息
import zh_CN from 'vee-validate/dist/locale/zh_CN'
Vue.use(VeeValidate)

// 11表单验证
VeeValidate.validator.localize('zh. CN', {
    messages: {
        ...zh_CN.messages,
        is: (field) => `${field}必须与密码相同`//修改内置规则的message, 让确认密码和密码相同
    },
    attributes: {
        //给校验的field 属性名映射中文名称
        phone: '手机号',
        code: '验证码',
        password: '密码',
        password1: '确认密码',
        agree: '协议',
    }
})
```

**使用**

```html
 <input
          placeholder="请输入你的手机号"
          v-model="phone"
          name="phone"
          v-validate="{ required: true, regex: /^1\d{10}$/ }"
          :class="{ invalid: errors.has('phone') }"
        />
        <span class="error-msg">{{ errors.first("phone") }}</span>
<!-- 手机号：regex: /^1\d{10}$/ -->
<!-- 密码：regex: /^[0-9A-Za-z]{8-20}$/ -->
<!-- 确认密码与原始密码相同：is:password -->
```

**自定义校验规则**

```javascript
VeeValidate.Validator.extend("agree",{
    validate:(value)=>{
        return value
    },
    getMessage:(field)=>field + '必须同意'
})

```

**使用**

```HTML
<input
          name="agree"
          type="checkbox"
          v-validate="{ required: true, 'agree': true }"
          :class="{ invalid: errors.has('agree') }"
        />
        <span>同意协议并注册《用户协议》</span>
        <span class="error-msg">{{ errors.first("agree") }}</span>

```

**完成注册**

```
 async userRegister() {
      const success = await this.$validator.validateAll();
      if (success) {
        try {
          const { phone, code, password, password1 } = this;
            (await this.$store.dispatch("userRegister", {
              phone,
              code,
              password,
            }));
          this.$router.push("/login");
        } catch (error) {
          alert(error.message);
        }
      }
    },
```





## 参考资料

> https://blog.csdn.net/qq_41863447/article/details/121713424
>
> https://www.cnblogs.com/YYang333/p/16845953.html
>
> https://blog.csdn.net/Echo__h/article/details/130468399
