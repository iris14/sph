// 对axios进行二次封装
import axios from "axios";
//引入进度条/样式
import nprogress from 'nprogress'
import "nprogress/nprogress.css"
console.log(nprogress)
const requests = axios.create({
    //配置对象
    //基础路径，发送请求时路径当中会出现api
    baseURL:"/mock",
    // 代表请求超时的时间5s
    timeout:5000
});

// 请求拦截器： 在发送请求之前，请求拦截器可以检测到可以在请求发送之前做一些事情
requests.interceptors.request.use((config)=>{
    nprogress.start();
    return config;
})

requests.interceptors.response.use((res)=>{
    //成功的回调函数，服务器响应数据回来以后，响应拦截器可以检测到做一些事情
    nprogress.done();
    return res.data;
},(error)=>{
    //响应失败的回调函数
    return Promise.reject(new Error('faile'))
});

export default requests;