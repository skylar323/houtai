<template>
  <!-- 头部区域 -->
  <el-container>
    <el-header>
      <div>
        <img src="../logo_jw_w.png">
        <span>后台管理系统</span>
      </div>
      <el-button @click="change">退出
      </el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="220px">
        <el-menu class="el-menu-vertical-demo"
         background-color="#3a8ec7"
         text-color="#fff" margin-left=30px unique-opened 
          router :default-active="activePath" >
        <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" 
          :key="item.id">
            <template slot="title">
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path"
            v-for="subItem in item.children" :key="subItem.id" 
            @click="saveNavState('/' + subItem.path)" >
            <template slot="title">
              <span>{{subItem.authName}}</span>
            </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  created () {
    this.getMenu()
  },
  data () {
    return {
      menulist: [],
      activePath: ''
    }
  },
  methods: {
    change () {
      window.sessionStorage.clear();
      this.$router.push('/login')
    },
    async getMenu() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}

</script>

 <style lang="less" scoped>

.el-container {
  height: 100%;
  
}
.el-header {
  background-color: #348ac4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  font-size: 25px;
}
.el-header > div {
  display: flex;
  align-items: center;
  margin-left: 17px;
}
.el-header > div span {
  margin-bottom: 3px;
  margin-left: 9px;
}
.el-aside {
  background-color:#3a8ec7;
  .el-menu{
  border-right:none;
}
}
.el-main{
  background-color: #eaedf1;
}



</style>