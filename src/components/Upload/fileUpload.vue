<template>
  <el-upload
    class="upload-file"
    :data="dataObj" 
    :multiple="true" 
    :action="QINIU_UPLOAD_DOMAIN"
    :before-upload="beforeUpload"
    :on-success="handleImageScucess"
    :on-remove="handleRemove"
    :file-list="fileList">
    <el-button size="small" type="primary" icon="upload" :loading="loading">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">不超过2M</div>
  </el-upload>
</template>

<script>
  import { getToken } from '@/api/qiniu'

  export default {
    data() {
      return {
        fileList: [],
        loading: false,
        QINIU_UPLOAD_DOMAIN: process.env.QINIU_UPLOAD_DOMAIN,
        dataObj: { token: '' },
        obj: {}
      }
    },
    methods: {
      handleRemove(file) {
        delete this.obj[file.response.hash]
        this.emitInput(this.obj)
      },
      emitInput(val) {
        this.$emit('input', val)
      },
      handleImageScucess(file, fileList) {
        this.obj[fileList.response.hash] = fileList.name
        this.loading = false
        this.emitInput(this.obj)
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
