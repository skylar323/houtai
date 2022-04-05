<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query"
           clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" 
            @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" border style="width: 100%">
        <!-- 第一栏 -->
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" 
            @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="role_name" width="180px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"
             @click="showEditDialog(scope.row.id)">
            </el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"
            @click="removeUserById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色"
             placement="top" :enterable="false" >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @current-change="handleCurrentChange" 
      :current-page="queryInfo.pagenum" :page-size="queryInfo.pagesize"
        layout="total,  prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addVisible" 
    width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addrules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" 
    width="50%" @close="editDialogClosed ">
      <el-form :model="editForm" :rules="editFormRules" 
      ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <!-- <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible"
     width="50%" @close="setRoleDialogClosed">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog> -->

  </div>
</template>

<script>
export default {
  data () {
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
    return {
      queryInfo: {
        query: '',
        /*当前页数  */
        pagenum: 1,
        /* 每页显示多少条 */
        pagesize: 2
      },
      userlist: [],
      total: 0,
      /* 控制添加用户窗口隐藏和显示 */
      addVisible: false,
      addForm: {
        name: '',
        password: "",
        email: "",
        mobile: ''
      },
      /* 验证规则 */
      addrules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }

        ],
        mobile: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }

        ]
      },
      // 控制分配角色对话框的显示与隐藏
     /*  setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色Id值
      selectedRoleId: '',    */  
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户名失败');
      this.userlist = res.data.users
      this.total = res.data.total
    },
    /* 监听页面改变 */
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      /* 当前页数更新后更新本地列表 */
      this.getUserList();
    },
    /* 监听数据状态改变获取最新状态 然后调用api借口同步到后台 */
    async userStateChange (userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新状态失败');
      }
      this.$message.success('更新状态成功')
    },
    /* 监听对话框关闭 */
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addUser () {
      /* validate是校验表单的方法 校验后会执行回调函数 */
      this.$refs.editformRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 200) return this.$message.error('添加失败');
        this.$message.success('添加成功');
        // 隐藏添加用户的对话框
        this.addVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    /*点击修改按钮后 展示用户编辑对话框 */
    async showEditDialog (id) {
      /* 短的可以直接用+拼接 长一点用模板字符串 */
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status != 200) {
        return this.$message.error('查询用户信息失败')
      }
      /* 成功的话把对话框展示出来 并且把后台传过来的当前数据赋值给本地数据  */
      this.editForm = res.data ,
      this.editDialogVisible = true
    },
     editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    /* 点击确定修改后  */
    editUserInfo () {
      /* 验证表单后执行 */
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        /* 根据接口1.3.5写的  把input里的输入值 两个参数 传入至后台 */
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id, 
          {
          email:this.editForm.email,
          mobile:this.editForm.mobile
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新状态失败')
        }
      this.editDialogVisible = false;
      /* 更新展示的数据 */
      this.getUserList ();
        this.$message.success('更新用户信息成功！')
      })
    },
   async removeUserById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消')
      }
      const { data: res } = await this.$http.delete('users/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }

      this.$message.success('删除用户成功！')
      this.getUserList()
    },
  }
  /* setRoleDialogClosed(){

  },
  saveRoleInfo(){

  },
  // 展示分配角色的对话框
  async setRole(userInfo) {
      this.userInfo = userInfo
    },
 */
}
</script>

<style>
.el-breadcrumb {
  margin-bottom: 25px;
  font-size: 12px;
}
.el-table {
  margin-top: 25px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
</style>