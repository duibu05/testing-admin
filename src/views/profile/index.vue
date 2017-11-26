<template>
  <section class="container">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="我的昵称" prop="name">
        <el-input placeholder="请输入昵称" v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input placeholder="请输入联系方式" v-model="ruleForm.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        ruleForm: {
          name: '',
          phone: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入昵称', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入联系方式', trigger: 'blur' }
          ]
        }
      }
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

