<template>
  <div class="container" v-loading="fetchLoading">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <sticky :className="'sub-navbar '+postForm.status">
        <section>
          <div style="display:inline-block">

            <el-button style="margin-left: 10px;" type="success" @click="submitForm()">保存</el-button>
          </div>
        </section>

      </sticky>

      <div class="main-container">

        <div class="postInfo-container" v-loading="loading">
          <el-row>

            <el-col :span="10">
                <el-form-item label-width="100px" label="联系电话:" class="postInfo-container-item" prop="phone">
                  <el-input placeholder="联系电话" style='min-width:150px;' v-model="postForm.phone" required></el-input>
                </el-form-item>
            </el-col>

            <el-col :span="10">
                <el-form-item label-width="100px" label="企业QQ:" class="postInfo-container-item" prop="qq">
                  <el-input width="200" placeholder="企业QQ" style='min-width:150px;' v-model="postForm.qq" required></el-input>
                </el-form-item>
            </el-col>
            
          </el-row>

          <el-row>

            <el-col :span="10" >
                <el-form-item label-width="100px" label="微信:" class="postInfo-container-item" prop="wechatQRCodeURL">
                  <Upload v-model="postForm.wechatQRCodeURL" ></Upload>
                </el-form-item>
            </el-col>

            <el-col :span="10">
                <el-form-item label-width="100px" label="地址:" class="postInfo-container-item" prop="addressMapURL">
                  <Upload v-model="postForm.addressMapURL"></Upload>
                </el-form-item>
            </el-col>

          </el-row>

        </div>

      </div>
    </el-form>

  </div>
</template>

<script>
  import Upload from '@/components/Upload/singleImage4'
  import { fetchSidebar, saveSidebar } from '@/api/right-sidebar.js'
  import Sticky from '@/components/Sticky' // 粘性header组件
  
  import { validateURL } from '@/utils/validate'
  
  export default {
    name: 'articleDetail',
    components: { Upload, Sticky },
    data() {
      const validateSourceUri = (rule, value, callback) => {
        if (value) {
          if (validateURL(value)) {
            callback()
          } else {
            this.$message({
              message: '图片url不正确',
              type: 'error'
            })
            callback(null)
          }
        } else {
          callback()
        }
      }
      return {
        postForm: {
          phone: '',
          qq: '',
          addressMapURL: '',
          wechatQRCodeURL: ''
        },
        fetchLoading: false,
        loading: false,
        rules: {
          qq: [{ required: true, trigger: 'blur', message: '企业QQ不能为空！' }],
          phone: [{ required: true, trigger: 'blur', message: '联系电话不能为空！' }],
          wechatQRCodeURL: [
            { validator: validateSourceUri, message: '333' },
            { required: true, message: '微信为必填项！' }
          ],
          addressMapURL: [
            { validator: validateSourceUri, message: '444' },
            { required: true, message: '地址为必填项！' }
          ]
        }
      }
    },
    created() {
      this.fetchLoading = true
      this.fetchData()
    },
    methods: {
      fetchData() {
        fetchSidebar().then(response => {
          const data = response.data.data
          this.postForm.phone = data.phone
          this.postForm.qq = data.qq
          this.postForm.wechatQRCodeURL = data.wechatQRCodeURL
          this.postForm.addressMapURL = data.addressMapURL
          this.fetchLoading = false
        }).catch(err => {
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
            saveSidebar(this.postForm).then(response => {
              this.loading = false
              this.$message.success('保存成功！')
            }).catch(err => console.log(err))
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

