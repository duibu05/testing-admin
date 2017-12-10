<template>
  <section class="container" v-loading="showLoading" :element-loading-text="loadingText">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="角色名称" prop="name">
        <el-input placeholder="请输入角色名称" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item v-for="part in parts" :key="part.value" :label="part.name">
        <el-select v-model="form[part.value]" clearable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
  import { save, get, update } from '@/api/role'

  export default {
    data() {
      return {
        parts: [{
          name: '报名管理',
          value: 'joiner-mgmt'
        }, {
          name: '推荐管理',
          value: 'carousel-mgmt'
        }, {
          name: '网站管理',
          value: 'website-mgmt'
        }, {
          name: '微信管理',
          value: 'wechat-mgmt'
        }, {
          name: '素材管理',
          value: 'material-mgmt'
        }, {
          name: '分类管理',
          value: 'category-mgmt'
        }, {
          name: '用户管理',
          value: 'user-mgmt'
        }, {
          name: '权限管理',
          value: 'auth'
        }],
        options: [{
          label: '无权限',
          value: '无权限'
        }, {
          label: '浏览',
          value: '浏览'
        }, {
          label: '管理',
          value: '管理'
        }],
        showLoading: false,
        loadingText: '拼命加载中...',
        form: {
          name: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入角色名称！' }
          ]
        }
      }
    },
    computed: {
      isEdit() {
        return this.$route.meta.isEdit
      }
    },
    methods: {
      fetchData() {
        this.showLoading = true
        this.loadingText = '拼命加载中...'
        // 通过接口获取数据
        get(this.$route.params.id).then(res => {
          const data = res.data.body || {}
          data.name = res.data.name
          this.form = data
          this.showLoading = false
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.showLoading = true
            this.loadingText = '拼命提交中...'
            let opt
            const data = {
              name: this.form.name
            }
            data.body = this.form
            delete data.body.name

            if (this.isEdit) {
              opt = update(this.$route.params.id, data)
            } else {
              opt = save(data)
            }
            opt.then(res => {
              if (res.code === 0) {
                this.$message.success('提交成功！')
                this.showLoading = false
                history.back()
              } else {
                this.showLoading = false
                this.$message.error('提交失败！')
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
    },
    created() {
      if (this.isEdit) {
        this.fetchData()
      }
    }
  }
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
  .container{
    margin: 30px;
    max-width: 1024px;
    .keywords{
      margin: 0 10px 10px 0;

      .el-input{
        max-width: 300px;
      }
    }
    .upload-file{
      max-width: 300px;
    }
  }
</style>
