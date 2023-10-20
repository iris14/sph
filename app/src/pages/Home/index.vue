<template>
  <div>
    <!-- 三级联动全局组件不需要引入 -->
    <TypeNav/> 
    <ListContainer/>
    <Recommend/>
    <Rank/>
    <Like/>
    <Floor v-for="(floor, index) in floorList" :key="floor.id" :list="floor"/>
    <Brand/>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import ListContainer from '@/pages/Home/ListContainer'
import Recommend from '@/pages/Home/Recommend'
import Rank from '@/pages/Home/Rank'
import Like from '@/pages/Home/Like'
import Floor from '@/pages/Home/Floor'
import Brand from '@/pages/Home/Brand'
export default {
  name:'',
  components:{
    ListContainer,
    Recommend,
    Rank,
    Like,
    Floor,
    Brand
  },
  mounted(){
    // 
    this.$store.dispatch("getFloorList");
    // // 获取用户信息展示在首页
    // this.$store.dispatch("getUserInfo")
  },
  computed:{
    ...mapState({
      floorList:state=>state.home.floorList
    })
  }

}
</script>

<style>

</style>