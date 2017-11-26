<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入用户昵称" v-model="listQuery.stdName">
      </el-input>

      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="手机号码" v-model="listQuery.stdPhone">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="拼命加载中..." border fit stripe highlight-current-row style="width: 100%" max-height="600">
      <el-table-column
        width="65"
        align="center"
        label="编号">
        <template scope="scope">
            <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="stdName"
        label="头像">
      </el-table-column>
      <el-table-column
        prop="pname"
        label="昵称">
      </el-table-column>
      <el-table-column
        prop="stdPhone"
        label="手机号码">
      </el-table-column>
      <el-table-column
        prop="meta.joinAt"
        label="注册时间">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button type="text" class="circle-close"> 关闭</el-button>
          <el-button type="text" icon="edit">编辑</el-button>
          <el-button type="text" icon="delete">删除</el-button>
          <el-button type="text" icon="setting" @click="dialogVisible = true">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog
        title="重置密码"
        :visible.sync="dialogVisible"
        size="tiny">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
          <el-form-item label="密码" prop="pass">
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
import { fetchList } from '@/api/joiner'
import waves from '@/directive/waves/index.js' // 水波纹指令

export default {
  name: 'joiner-table',
  directives: {
    waves
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
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

    return {
      dialogVisible: false,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      tableKey: 0,
      form: {
        pass: '',
        checkPass: '',
        oldpass: ''
      },
      rules: {
        pass: [
          { required: true, message: '新密码为必填项！' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '确认密码为必填项！' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        oldpass: [
          { required: true, message: '旧密码为必填项！' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.total || 0
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
