<template>
  <section class="container">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
      <el-form-item label="旧密码" prop="oldpass">
        <el-input placeholder="请输入旧密码" type="password" v-model="form.oldpass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="pass">
        <el-input placeholder="请输入新密码" type="password" v-model="form.pass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input placeholder="请确认密码" type="password" v-model="form.checkPass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { resetPassword, checkPassword } from '@/api/user'

  export default {
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
        showLoading: false,
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
    computed: {
      ...mapGetters([
        'id'
      ])
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.showLoading = true
            checkPassword(this.id, { password: this.form.oldpass }).then(res => {
              if (res.code === 0) {
                resetPassword(this.id, { password: this.form.pass }).then(res => {
                  if (res.code === 0) {
                    this.$alert('修改成功，请重新登录！', '提示', {
                      confirmButtonText: '确定'
                    }).then(() => {
                      this.$store.dispatch('FedLogOut').then(() => {
                        location.reload() // 为了重新实例化vue-router对象 避免bug
                      })
                    }).catch(() => {
                      this.$store.dispatch('FedLogOut').then(() => {
                        location.reload() // 为了重新实例化vue-router对象 避免bug
                      })
                    })
                  }
                })
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .container{
    margin: 30px;
    .el-input{
      width: 300px;
    }
  }
</style>

