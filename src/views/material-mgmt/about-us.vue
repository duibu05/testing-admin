<template>
  <div class="createPost-container" v-loading="showLoading">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <sticky :className="'sub-navbar '+postForm.status">
        <template v-if="fetchSuccess">
          <div style="display:inline-block">
            <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm()">发布
            </el-button>
          </div>
        </template>

      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="18">
            <el-row>

              <el-col :span="8">
                <el-form-item label="咨询热线" prop="hotline">
                  <el-input placeholder="请输入咨询热线" v-model="postForm.hotline"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="投诉电话" prop="complaintPhone">
                  <el-input placeholder="请输入投诉电话" v-model="postForm.complaintPhone"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="E-mail" prop="email">
                  <el-input placeholder="请输入E-mail" v-model="postForm.email"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="地址" prop="address">
                  <el-input placeholder="请输入地址" v-model="postForm.address"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-form-item class="input" prop="addressMap">
              <Upload class="upload" v-model="postForm.addressMap" ></Upload>
            </el-form-item>
          </el-col>
        </el-row>
        

        <div class="editor-container">
          <tinymce :height=400 ref="editor" v-model="postForm.comBrief"></tinymce>
        </div>

      </div>
    </el-form>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleImage4'
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchList, save } from '@/api/restful'

export default {
  name: 'articleDetail',
  components: { Tinymce, Upload, Sticky },
  data() {
    return {
      showLoading: false,
      postForm: {
        hotline: '',
        comBrief: '请输入公司介绍......',
        complaintPhone: '',
        email: '',
        address: '',
        addressMap: ''
      },
      fetchSuccess: true,
      loading: false,
      rules: {
        hotline: [{ required: true, message: '咨询热线不能为空！' }],
        complaintPhone: [{ required: true, message: '投诉电话不能为空！' }],
        email: [{ required: true, message: 'E-mail不能为空！' }],
        address: [{ required: true, message: '地址不能为空！' }],
        addressMap: [{ required: true, message: '位置照片不能为空！' }]
      }
    }
  },
  created() {
    this.showLoading = true
    this.fetchData()
  },
  methods: {
    fetchData() {
      fetchList('about-us', { page: 1, limit: 1 }).then(res => {
        this.showLoading = false
        if (res.code === 0 && res.data && res.data.list) {
          const data = res.data.list[0]
          this.postForm = {
            hotline: data.hotline,
            comBrief: data.comBrief,
            complaintPhone: data.complaintPhone,
            email: data.email,
            address: data.address,
            addressMap: data.addressMap
          }
        }
      }).catch(() => {
        this.showLoading = false
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          save('about-us', this.postForm).then(res => {
            if (res.code === 0) {
              this.$notify({
                title: '成功',
                message: '发布成功',
                type: 'success',
                duration: 2000
              })
              this.postForm.status = 'published'
              this.loading = false
            }
          })
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
  .title-prompt{
    position: absolute;
    right: 0px;
    font-size: 12px;
    top:10px;
    color:#ff4949;
  }
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;

      .input {
        margin-bottom: 20px; 
        margin-top: 20px;
        margin-right: 15px;
          .upload{
            width: 200px;
            height: 200px;
            box-sizing: border-box;
            overflow: hidden;
            /deep/.el-upload-dragger{
              border-radius: 100%;
            }
            /deep/ img {
              border-radius: 100%;
            }
          }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
            text-align: right;
            margin-right: 10px;
            .editor-upload-btn {
                display: inline-block;
            }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
</style>

