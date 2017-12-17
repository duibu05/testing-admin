<template>
  <section class="container" v-loading="showLoading">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="我的昵称" prop="nickname">
        <el-input placeholder="请输入昵称" v-model="ruleForm.nickname"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input placeholder="请输入联系方式" v-model="ruleForm.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { update } from '@/api/user'
  
  export default {
    data() {
      return {
        showLoading: false,
        ruleForm: {
          nickname: this.nickname,
          phone: this.phone
        },
        rules: {
          nickname: [
            { required: true, message: '请输入昵称', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入联系方式', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'id',
        'nickname',
        'phone'
      ])
    },
    methods: {
      submitForm(formName) {
        const data = {
          nickname: this.ruleForm.nickname,
          phone: this.ruleForm.phone
        }

        if (data.nickname === this.nickname && this.phone === data.phone) {
          this.$message.warning('没有任何修改！')
          return
        }

        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.showLoading = true
            update(this.id, data).then(res => {
              this.showLoading = false
              this.$message.success('修改成功！')
              this.$store.dispatch('ChangeUserInfo', data)
              this.ruleForm = data
            }).catch(() => {
              this.showLoading = false
            })
            this.resetForm(formName)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    },
    created() {
      this.ruleForm.nickname = this.nickname
      this.ruleForm.phone = this.phone
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

