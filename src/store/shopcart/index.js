
import {reqCartList, reqDeleteCartById, reqUpdateCheckedById} from '@/api'
const state = {
    cartList:[],
} 
const mutations = {
    GETCARTLIST(state, cartList){
        state.cartList = cartList
    }
}
const actions = {
    // 获取购物车列表的数据
    async getCartList({commit}){
        let result = await reqCartList();
        // console.log("getCartList",result)
        if(result.code === 200){
            commit('GETCARTLIST', result.data)
        }
    },
    // 删除购物车某一个产品
    async deleteCartListBySkuId({commit}, skuId){
        let result = await reqDeleteCartById(skuId);
        // console.log("getCartList",result)
        if(result.code === 200){
            return 'ok'
        }else{
            return Promise.reject(new Error('faile'))
        }
    },
    // 修改购物车某产品的选中状态
    async updateCheckedById({commit}, {skuId, isChecked}){
        let result = await reqUpdateCheckedById(skuId, isChecked);
        console.log(skuId, isChecked)
        console.log(result)
        if(result.code === 200){
            return 'ok'
        }else{
            return Promise.reject(new Error('faile'))
        }
    },
    // 删除全部勾选的产品
    deleteAllCheckedCart({dispatch, getters}, ){
        let PromiseAll = [];
        getters.cartList.cartInfoList.forEach(item => {
            let promise = item.isChecked?dispatch("deleteCartListBySkuId", item.skuId):'';
            PromiseAll.push(promise)
        });
        return Promise.all(PromiseAll)
    },
    // 修改全部产品的勾选状况
    updateAllCartIsChecked({dispatch, state}, isChecked){
        console.log(state)
        console.log(isChecked)
        let promiseAll = []
        state.cartList[0].cartInfoList.forEach(item=>{
            let promise = dispatch("updateCheckedById", {
                skuId: item.skuId,
                isChecked
            });
            promiseAll.push(promise)
        })
        return Promise.all(promiseAll)
    }
}
const getters = {
    cartList(state){
        return state.cartList[0] || []
    },
    // cartInfoList(state){
    //     return state.cartList[0].cartList
    // }
}


export default {
    state,
    mutations,
    actions,
    getters
}