<template>
    <div class="upload-container">
        <el-upload class="image-uploader" :data="dataObj" drag :multiple="false" :show-file-list="false" :action="QINIU_UPLOAD_DOMAIN" :before-upload="beforeUpload" :on-success="handleImageScucess">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div class="image-preview">
            <div class="image-preview-wrapper" v-show="imageUrl">
                <img :src="imageUrl+'?imageView2/1/w/200/h/200'">
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
  props: {
    value: String,
    type: String
  },
  data() {
    return {
      imageUrl: '',
      QINIU_UPLOAD_DOMAIN: process.env.QINIU_UPLOAD_DOMAIN,
      dataObj: { token: '', key: '' }
    }
  },
  methods: {
    rmImage() {
      this.imageUrl = ''
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', {
        url: val,
        type: this.type
      })
    },
    handleImageScucess(file) {
      this.imageUrl = process.env.QINIU_DOWNLOAD_DOMAIN + file.hash
      this.emitInput(this.imageUrl)
    },
    beforeUpload() {
      const _self = this
      return new Promise((resolve, reject) => {
        getToken().then(response => {
          _self._data.dataObj.token = response.data.token
          resolve(true)
        }).catch(err => {
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
        width: 100%;
        position: relative;
        @include clearfix;
        .image-uploader {
            width: 60%;
            float: left;
        }
        .image-preview {
            width: 200px;
            height: 200px;
            position: relative;
            border: 1px dashed #d9d9d9;
            float: left;
            margin-left: 50px;
            .image-preview-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .image-preview-action {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                cursor: default;
                text-align: center;
                color: #fff;
                opacity: 0;
                font-size: 20px;
                background-color: rgba(0, 0, 0, .5);
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
