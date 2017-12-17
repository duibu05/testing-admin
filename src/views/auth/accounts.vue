<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入昵称" v-model="listQuery.keyword">
      </el-input>

      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="手机号码" v-model="listQuery.phone">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="plus" @click="showAddAdminDialog">新增管理员</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" :element-loading-text="loadingText" border fit stripe highlight-current-row style="width: 100%" max-height="600">
      <el-table-column
        width="65"
        align="center"
        label="编号">
        <template scope="scope">
          <span>{{scope.$index+1+(listQuery.page-1)*listQuery.limit}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="昵称">
      </el-table-column>
      <el-table-column
        prop="role.name"
        label="角色">
      </el-table-column>
      <el-table-column
        prop="account"
        label="登录账号">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="联系方式">
      </el-table-column>
      <el-table-column
        label="账号状态">
        <template scope="scope">
          <span>{{scope.row.status === 1? '已启用' : '已关闭'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="300" align="center" label="操作">
        <template scope="scope">
          <el-button v-if="scope.row.status === 1" type="text" class="circle-close" @click="disOrEnableAccount(scope.row._id, 0)">关闭</el-button>
          <el-button v-if="scope.row.status === 0" type="text" class="circle-close" @click="disOrEnableAccount(scope.row._id, 1)">开启</el-button>
          <el-button type="text" icon="edit" @click="showUpdateAdminDialog(scope.row._id)">编辑</el-button>
          <el-button type="text" icon="delete" @click="delAccount(scope.row._id)">删除</el-button>
          <el-button type="text" icon="setting" @click="showResetPwdDialog(scope.row._id)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog
      title="添加管理员"
      :visible.sync="addDialogVisible"
      size="tiny">
      <el-form :model="addform" :rules="addAdminRules" ref="addform" label-width="100px">
        <el-form-item label="昵称" prop="nickname">
          <el-input type="text" v-model="addform.nickname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input type="text" v-model="addform.account" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleName">
          <el-select v-model="addform.roleName" clearable placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input type="text" v-model="addform.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addform.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="addCheckPass">
          <el-input type="password" v-model="addform.addCheckPass" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAdmin('addform')">提交</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改管理员"
      :visible.sync="updateDialogVisible"
      size="tiny">
      <el-form v-loading="showUpdateLoading" :rules="updateAdminRules" :model="updateform" ref="updateform" label-width="100px">
        <el-form-item label="昵称" prop="nickname">
          <el-input type="text" v-model="updateform.nickname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="账号">
          <el-input type="text" :disabled="true" v-model="updateform.account" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="updateform.role.name" placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input type="text" v-model="updateform.phone" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateAdmin('updateform')">提交</el-button>
      </span>
    </el-dialog>

    <el-dialog
        title="重置密码"
        :visible.sync="dialogVisible"
        size="tiny">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
          <el-form-item label="新密码" prop="pass">
            <el-input type="password" v-model="form.pass" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="form.checkPass" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchList, resetPassword, save, roles, update, del } from '@/api/user'
import waves from '@/directive/waves/index.js' // 水波纹指令

export default {
  name: 'users-table',
  directives: {
    waves
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码不能小于6位！'))
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.form.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码不能小于6位！'))
      } else {
        if (this.addform.checkPass !== '') {
          this.$refs.addform.validateField('addCheckPass')
        }
        callback()
      }
    }
    const validatePassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.addform.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      loadingText: '拼命加载中...',
      showUpdateLoading: false,
      currentUserId: '',
      dialogVisible: false,
      addDialogVisible: false,
      updateDialogVisible: false,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        phone: '',
        keyword: ''
      },
      roles: [],
      tableKey: 0,
      addform: {
        nickname: '',
        account: '',
        role: {
          name: ''
        },
        roleName: '',
        phone: '',
        password: '',
        checkPass: ''
      },
      updateform: {
        _id: '',
        nickname: '',
        account: '',
        role: {
          name: ''
        },
        phone: ''
      },
      form: {
        pass: '',
        checkPass: '',
        oldpass: ''
      },
      updateAdminRules: {
        nickname: [{ required: true, message: '昵称为必填项！' }],
        phone: [{ required: true, message: '联系方式为必填项！' }]
      },
      addAdminRules: {
        password: [
          { required: true, message: '密码为必填项！' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '昵称为必填项！' }
        ],
        account: [
          { required: true, message: '账户为必填项！' }
        ],
        phone: [
          { required: true, message: '联系方式为必填项！' }
        ],
        roleName: [
          { required: true, message: '角色为必填项！' }
        ],
        addCheckPass: [
          { required: true, message: '确认密码为必填项！' },
          { validator: validatePassword2, trigger: 'blur' }
        ]
      },
      rules: {
        pass: [
          { required: true, message: '新密码为必填项！' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '确认密码为必填项！' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  computed: {
    ...mapGetters([
      'id'
    ])
  },
  methods: {
    disOrEnableAccount(id, status) {
      const tips = status === 0 ? '此操作将停用该账号，并导致相关管理员无法登陆，是否继续?' : '此操作将启用该账号，是否继续?'
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        update(id, { status: status, token: '' }).then(res => {
          this.$message.success('操作成功！')
          this.getList()
        })
      }).catch(() => {
        this.$message.warning('操作取消！')
      })
    },
    delAccount(id) {
      this.$confirm('此操作将永久删除该账户，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(id).then(res => {
          this.$message.success('删除成功！')
          this.getList()
        })
      }).catch(() => {
        this.$message.warning('操作取消！')
      })
    },
    addAdmin(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addform.role.name = this.addform.roleName
          delete this.addform.roleName

          this.addDialogVisible = false
          this.listLoading = true
          this.loadingText = '拼命提交中...'
          save(this.addform)
            .then(res => {
              this.$message.success('添加成功！')
              this.listLoading = false
              this.$refs[formName].resetFields()
              this.getList()
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateAdmin(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateDialogVisible = false
          this.listLoading = true
          this.loadingText = '拼命提交中...'
          const id = this.updateform._id
          delete this.updateform._id
          update(id, this.updateform)
            .then(res => {
              this.$message.success('修改成功！')
              if (this.id === id) {
                this.$store.dispatch('ChangeNicknme', this.updateform.nickname)
              }
              this.listLoading = false
              this.$refs[formName].resetFields()
              this.getList()
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showAddAdminDialog() {
      this.addDialogVisible = true
      this.$refs.addform && this.$refs.addform.resetFields()
      roles().then(res => {
        this.roles = res.data.list
      })
    },
    showUpdateAdminDialog(id) {
      if (id) {
        this.showUpdateLoading = true
        fetchList({ _id: id }).then(res => {
          this.showUpdateLoading = false
          if (res.code === 0 && res.data.list.length > 0) {
            const data = res.data.list[0]
            this.updateform._id = data._id
            this.updateform.nickname = data.nickname
            this.updateform.account = data.account
            this.updateform.role.name = data.role.name
            this.updateform.phone = data.phone
          }
        })
      }
      this.updateDialogVisible = true
      this.$refs.updateform && this.$refs.updateform.resetFields()
      roles().then(res => {
        this.roles = res.data.list
      })
    },
    showResetPwdDialog(id) {
      this.dialogVisible = true
      this.currentUserId = id
      this.$refs.form && this.$refs.form.resetFields()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          this.listLoading = true
          this.loadingText = '拼命提交中...'
          resetPassword(this.currentUserId, { password: this.form.pass })
            .then(res => {
              this.$message.success('修改成功！')
              this.listLoading = false
              this.$refs[formName].resetFields()

              // 如果修改的是自己的密码，则强制登出
              if (this.id === this.currentUserId) {
                this.$message.warning('您修改了自己的密码，请重新登录！')
                this.$store.dispatch('LogOut').then(() => {
                  location.reload()// 为了重新实例化vue-router对象 避免bug
                })
              }
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getList() {
      this.listLoading = true
      this.loadingText = '拼命加载中...'
      fetchList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total || 0
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    }
  }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
  .app-container{
    el-input{
      width: 300px;
    }
  }
</style>
