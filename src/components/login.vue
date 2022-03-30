<template>
  <div class="login_container">
    <el-card class="box-card" ref="butRef" shadow="hover" >
      <!-- 用户名和密码输入框 -->
        <el-form ref="formRef" class="login_box"  
        :model="loginForm" :rules="rules">
          <!-- 用户名 -->
          <el-form-item class="login_box_user" prop="username">
            <el-input placeholder="用户名"
              prefix-icon="el-icon-user" 
             v-model="loginForm.username" >
            </el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input placeholder="密码" 
            prefix-icon="el-icon-lock" 
            v-model="loginForm.password" 
            show-password>
            </el-input>
          </el-form-item>
      <!-- 登录按钮 -->
      <el-form-item class="box-card_bu">
        <el-button round 
         @click="loginFunc">登录</el-button>
      </el-form-item>
    </el-form>
    </el-card>
    
  </div>
</template>

<script>
export default {
  name: "Login",
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3,  max: 10,message: '用户名至少为3位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15,  message: '密码长度至少为6位', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    /* 点击获取验证是否成功 */
    loginFunc () {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return
        const { data:res } = await this.$http.post("login",this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败');
         this.$message.success('登录成功');
         /* 新建一个键值对在ss上 键为token，值为登录的token */
        window.sessionStorage.setItem ('token',res.data.token);
        this.$router.push('/home')
      });
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: rgba(177, 233, 255, 0.904);
  display: flex;
  align-items: center;
  justify-content: center;
}
.box-card {
  height: 300px;
  width: 450px;
}
.login_box{
  margin: 70px 0 20px 0;
}
.login_box_user {
  margin-bottom: 25px;
}
.box-card_bu {
  margin-left: 160px;
  margin-top: 10px;
}
</style>
