//引入mockjs模块
import Mock from 'mockjs'
//把json数据格式引入进来
//webpack默认对外暴露的：图片、JSON数据格式、
import banner from './banner.json'
import floor from './floor.json'
import address from './address.json'
import order from './order.json'
//mock data:第一个参数是请求地址，第二个参数是请求数据
Mock.mock("/mock/banner", {code:200, data:banner})
Mock.mock("/mock/floor", {code:200, data:floor})
Mock.mock("/mock/address", {code:200, data:address})
Mock.mock("/mock/order", {code:200, data:order})