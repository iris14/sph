//当前这个模块，API进行统一管理
import requests from "./ajax";
import mockRequest from "./mockAjax";
//三级联动接口
///api/product/getBaseCategoryList get 无参数

// export const reqCategoryList = ()=> requests({url:'/product/getBaseCategoryList', method:'get'});
export const reqCategoryList = () => requests.get("/product/getBaseCategoryList");



export const reqGetBannerList = () => mockRequest.get("/banner");

export const reqFloorList = () => mockRequest.get("/floor");

// 模拟获取用户地址
export const reqAddressInfo = () => mockRequest.get("/address");

// 模拟获取11.我的订单列表
export const reqPaysOrder = (orderId) => requests({url:`/payment/weixin/queryPayStatus/${orderId}` , method:'get'})

// 这个函数需要接收外部传递的参数
// 接口的参数至少是一个空对象
export const reqGetSearchInfo = (params) => requests({url:'/list', method:"post", data:params})

// 获取产品详情接口  /api/item/{ skuId } GET
export const reqGoodsInfo = (skuId) => requests({url:`/item/${skuId}`, method:'get'})

// 将产品添加到购物车中（获取更新某一个产品的个数）
export const reqAddOrUpdateShopCart = (skuId, skuNum) =>requests({url:`/cart/addToCart/${ skuId }/${ skuNum }`, method: 'post'})

// 将产品添加到购物车中（获取更新某一个产品的个数）
export const reqCartList = () =>requests({url:'/cart/cartList', method: 'get'})

// 将产品删除购物车中（获取更新某一个产品的个数）
export const reqDeleteCartById= (skuId) =>requests({url:`/cart/deleteCart/${skuId}`, method: 'DELETE'})

//修改购物车中的产品
export const reqUpdateCheckedById= (skuId,isChecked)=>requests({url:`/cart/checkCart/${skuId}/${isChecked}`,method:'get'});

// 获取验证码
export const reqGetCode = (phone)=>requests({url:`/user/passport/sendCode/${phone}`,method:'get'});

// 注册接口
export const reqUserRegister = (data)=>requests({url:`/user/passport/register`, data, method:'post'})

// 登录
export const reqUserLogin = (data)=>requests({url:`/user/passport/login`, data, method:'post'})

// 获取用户信息
export const reqUserInfo = (data)=>requests({url:`/user/passport/auth/getUserInfo`, data, method:'get'})

// 退出登录
export const reqLogout = ()=>requests({url:'/user/passport/logout', method:'get'});

// /api/user/userAddress/auth/findUserAddressList 获取用户地址信息 get  [没数据，换成mock]
// export const reqAddressInfo = () => requests({url:'/user/userAddress/auth/findUserAddressList', method:'get'})

// 获取商品清单
export const reqOrderInfo = () =>requests({url:'/order/auth/trade', method:'get'})

// 提交订单的接口
export const reqSubmitOrder = (tradeNo, data) => requests({url:`/order/auth/submitOrder?tradeNo=${tradeNo}`, data, method:'post'})

export const reqPayInfo = (orderId) => requests({url:`/payment/weixin/createNative/${orderId}` , method:'get'})

// 查询支付订单状态
export const reqPayStatus = (orderId) => requests({url:`/payment/weixin/queryPayStatus/${orderId}` , method:'get'})

