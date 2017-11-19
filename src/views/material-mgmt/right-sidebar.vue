<template>
  <div class="container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <div class="main-container">

        <div class="postInfo-container">
          <el-row>

            <el-col :span="8">
                <el-form-item label-width="50px" label="来源:" class="postInfo-container-item">
                  <el-input placeholder="将替换作者" style='min-width:150px;' v-model="postForm.source_name">
                  </el-input>
                </el-form-item>
            </el-col>

            <el-col :span="8">
                <el-form-item label-width="50px" label="来源:" class="postInfo-container-item">
                  <el-input placeholder="将替换作者" style='min-width:150px;' v-model="postForm.source_name">
                  </el-input>
                </el-form-item>
            </el-col>
            
          </el-row>
        </div>

        <div style="margin-bottom: 20px;">
          <Upload v-model="postForm.wechatQRCodeURL"></Upload>
        </div>
        <div style="margin-bottom: 20px;">
          <Upload v-model="postForm.addressMapURL"></Upload>
        </div>
      </div>
    </el-form>

  </div>
</template>

<script>
import Upload from '@/components/Upload/singleImage2'
import { fetchSidebar } from '@/api/right-sidebar.js'

export default {
  name: 'articleDetail',
  components: { Upload },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(null)
      } else {
        callback()
      }
    }
    return {
      postForm: {
        source_name: '', // 文章外部作者
        addressMapURL: '',
        wechatQRCodeURL: ''
      },
      loading: false,
      rules: {
        image_uri: [{ validator: validateRequire }]
      }
    }
  },
  created() {
    if (this.isEdit) {
      this.fetchData()
    }
  },
  methods: {
    fetchData() {
      fetchSidebar().then(response => {
        this.postForm = response.data
        console.log(response.data)
      }).catch(err => {
        this.fetchSuccess = false
        this.$message({
          message: '请求失败，请稍后重试...',
          type: 'error'
        })
        console.log(err)
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '发布成功',
            type: 'success',
            duration: 2000
          })
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .container {
    position: relative;
    .main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
    }
  }
</style>

