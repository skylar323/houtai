<template>
<!-- 头部区域 -->
  <el-container>
  <el-header>
    <el-button type="info" @click="change">
    </el-button>
  </el-header>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-main>Main</el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  name:'Home',
  data() {
    return {
      
    }
  },
  methods: {
    change(){
      window.sessionStorage.clear();
      this.$router.push('/login')
    }
  },
}
</script>

<style>
.el-container{
  height: 100%;
}
.el-header{
  background-color: rgba(19, 111, 148, 0.774);
}
.el-aside{
  background-color: rgba(19, 111, 148, 0.774);
}
</style>