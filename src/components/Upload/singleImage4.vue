<template>
    <div class="upload-container" v-loading="loading" element-loading-text="文件上传中...">
        <el-upload class="image-uploader" :data="dataObj" drag :multiple="false" :show-file-list="false" :action="QINIU_UPLOAD_DOMAIN" :before-upload="beforeUpload" :on-success="handleImageScucess">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div class="image-preview" v-show="imageUrl">
            <div class="image-preview-wrapper" v-show="imageUrl">
                <img @load="loading = false" :src="imageUrl+'?imageView2/1/w/200/h/200'">
                <div class="image-preview-action">
                    <i @click="rmImage" class="el-icon-delete"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getToken } from '@/api/qiniu'

export default {
  name: 'singleImageUpload',
  props: ['value'],
  data() {
    return {
      loading: false,
      QINIU_UPLOAD_DOMAIN: process.env.QINIU_UPLOAD_DOMAIN,
      dataObj: { token: '' }
    }
  },
  computed: {
    imageUrl() {
      return this.value
    }
  },
  methods: {
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleImageScucess(file) {
      this.emitInput(process.env.QINIU_DOWNLOAD_DOMAIN + file.hash)
    },
    beforeUpload() {
      this.loading = true
      const _self = this
      return new Promise((resolve, reject) => {
        getToken().then(response => {
          _self._data.dataObj.token = response.data.token
          resolve(true)
        }).catch(err => {
          this.loading = false
          console.log(err)
          reject(false)
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/mixin.scss";
    .upload-container {
        box-sizing: border-box;
        width: 100%;
        position: relative;
        @include clearfix;
        .image-uploader {
            width: 100%;
            box-sizing: border-box;
            float: left;
        }
        .image-preview {
            box-sizing: border-box;
            position: absolute;
            float: left;
            .image-preview-wrapper {
                position: relative;
                box-sizing: border-box;
                img {
                    height: 200px;
                    border-radius: 6px;
                    width: 200px; 
                    background: white;
                }
            }
            .image-preview-action {
                position: absolute;
                box-sizing: border-box;
                width: 100%;
                left: 0;
                top: 0;
                cursor: default;
                text-align: center;
                color: #fff;
                opacity: 0;
                font-size: 20px;
                background-color: rgba(0, 0, 0, .5);
                border-radius: 6px;
                transition: opacity .3s;
                cursor: pointer;
                text-align: center;
                line-height: 200px;
                .el-icon-delete {
                    font-size: 36px;
                }
            }
            &:hover {
                .image-preview-action {
                    opacity: 1;
                }
            }
        }
    }

</style>
