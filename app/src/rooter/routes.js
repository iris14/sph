import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Detail from '@/pages/Detail'
import AddCartSuccess from '@/pages/AddCartSuccess'
import ShopCart from '@/pages/ShopCart'
import Trade from '@/pages/Trade'
import Pay from '@/pages/Pay'
import PaySuccess from '@/pages/PaySuccess'
import Center from '@/pages/Center'

// 引入二级路由
import MyOrder from '@/pages/Center/myOrder'
import GroupOrder from '@/pages/Center/groupOrder'
export default [
    {
        path:'/addcartsuccess',
        name:'addcartsuccess',
        component:AddCartSuccess,
        meta:{isHideFooter:true}
    },
    {
        path:'/home',
        component:Home,
        meta:{isHideFooter:false}
    },
    {
        name:"search",
        path:'/search/:keyword?',
        component:Search,
        meta:{isHideFooter:false},
        
    },
    {
        path:'/login',
        component:Login,
        meta:{isHideFooter:true}
    },
    {
        path:'/register',
        component:Register,
        meta:{isHideFooter:true}
    },
    {
        path:'/detail/:skuid',
        component:Detail,
        meta:{isHideFooter:false}
    },
    {
        path:'/shopcart',
        name:'shopcart',
        component:ShopCart,
        meta:{isHideFooter:false}
    },
    {
        path:'/trade',
        name:'trade',
        component:Trade,
        meta:{isHideFooter:false},
        beforeEnter:(to, from, next) =>{
            if(from.path == "/shopcart"){
                next();
            }else{
                next(false)
            }
        }
    },
    {
        path:'/pay',
        name:'pay',
        component:Pay,
        meta:{isHideFooter:true},
        beforeEnter:(to, from, next) =>{
            if(from.path == "/trade"){
                next();
            }else{
                next(false)
            }
        }
    },
    {
        path:'/paysuccess',
        name:'paysuccess',
        component:PaySuccess,
        meta:{isHideFooter:true}
    },
    {
        path:'/center',
        name:'center',
        component:Center,
        children:[
            {
                path:'myorder',
                component:MyOrder
            },
            {
                path:'grouporder',
                component:GroupOrder
            },
            {
                path:'/center',
                redirect:'/center/myorder'
            }
        ],
        meta:{isHideFooter:true}
    },
    
]