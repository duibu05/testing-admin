<template>
  <div :ref="id" :action="url" class="dropzone" :id="id">
    <input type="file" name="file">
  </div>
</template>

<script>
import Dropzone from 'dropzone'
import 'dropzone/dist/dropzone.css'
import { getToken } from 'api/qiniu'

Dropzone.autoDiscover = false

export default {
  data() {
    return {
      dropzone: '',
      initOnce: true
    }
  },
  mounted() {
    const element = document.getElementById(this.id)
    const vm = this
    this.dropzone = new Dropzone(element, {
      clickable: this.clickable,
      thumbnailWidth: this.thumbnailWidth,
      thumbnailHeight: this.thumbnailHeight,
      maxFiles: this.maxFiles,
      maxFilesize: this.maxFilesize,
      dictRemoveFile: 'Remove',
      addRemoveLinks: this.showRemoveLink,
      acceptedFiles: this.acceptedFiles,
      autoProcessQueue: this.autoProcessQueue,
      dictDefaultMessage: '<i style="margin-top: 3em;display: inline-block" class="material-icons">' + this.defaultMsg + '</i><br>点击上传或者拖动文件到此处上传',
      dictMaxFilesExceeded: '只能一个图',
      previewTemplate: '<div style="width: 70%;" ><img data-dz-thumbnail style="width: 100%;" /></div>',
      init() {
        const val = vm.defaultImg
        if (!val) return
        if (Array.isArray(val)) {
          if (val.length === 0) return
          val.map((v, i) => {
            const mockFile = { name: 'name' + i, size: 12345, url: v }
            this.options.addedfile.call(this, mockFile)
            this.options.thumbnail.call(this, mockFile, v)
            mockFile.previewElement.classList.add('dz-success')
            mockFile.previewElement.classList.add('dz-complete')
            vm.initOnce = false
            return true
          })
        } else {
          const mockFile = { name: 'name', size: 12345, url: val }
          this.options.addedfile.call(this, mockFile)
          this.options.thumbnail.call(this, mockFile, val)
          mockFile.previewElement.classList.add('dz-success')
          mockFile.previewElement.classList.add('dz-complete')
          vm.initOnce = false
        }
      },
      accept: (file, done) => {
        /* 七牛*/
        const token = this.$store.getters.token
        getToken(token).then(response => {
          file.token = response.data.token
          done()
        })
        // done()
      },
      sending: (file, xhr, formData) => {
        vm.$emit('uploadBegin')
        formData.append('token', file.token)
        // formData.append('key', file.key);
        // 测试七牛upload
        // formData.append('token', 'UO5pdFQPksPCtSlJfGIWf47VdYMZiv1lyaEc9Id4:gGR1sXktHXp8AOBZyWpOCteFsGs=:eyJzY29wZSI6ImppYW5saSIsImRlYWRsaW5lIjoxNTEwNTAwMzc2fQ==')
        vm.initOnce = false
      }
    })

    if (this.couldPaste) {
      document.addEventListener('paste', this.pasteImg)
    }

    this.dropzone.on('success', file => {
      vm.$emit('dropzone-success', file, vm.dropzone.element)
    })
    this.dropzone.on('addedfile', file => {
      vm.$emit('dropzone-fileAdded', file)
    })
    this.dropzone.on('removedfile', file => {
      vm.$emit('dropzone-removedFile', file)
    })
    this.dropzone.on('error', (file, error, xhr) => {
      vm.$emit('dropzone-error', file, error, xhr)
    })
    this.dropzone.on('successmultiple', (file, error, xhr) => {
      vm.$emit('dropzone-successmultiple', file, error, xhr)
    })
  },
  methods: {
    removeAllFiles() {
      this.dropzone.removeAllFiles(true)
    },
    processQueue() {
      this.dropzone.processQueue()
    },
    pasteImg(event) {
      const items = (event.clipboardData || event.originalEvent.clipboardData).items
      if (items[0].kind === 'file') {
        this.dropzone.addFile(items[0].getAsFile())
      }
    },
    initImages(val) {
      if (!val) return
      if (Array.isArray(val)) {
        val.map((v, i) => {
          const mockFile = { name: 'name' + i, size: 12345, url: v }
          this.dropzone.options.addedfile.call(this.dropzone, mockFile)
          this.dropzone.options.thumbnail.call(this.dropzone, mockFile, v)
          mockFile.previewElement.classList.add('dz-success')
          mockFile.previewElement.classList.add('dz-complete')
          return true
        })
      } else {
        const mockFile = { name: 'name', size: 12345, url: val }
        this.dropzone.options.addedfile.call(this.dropzone, mockFile)
        this.dropzone.options.thumbnail.call(this.dropzone, mockFile, val)
        mockFile.previewElement.classList.add('dz-success')
        mockFile.previewElement.classList.add('dz-complete')
      }
    }

  },
  destroyed() {
    document.removeEventListener('paste', this.pasteImg)
    this.dropzone.destroy()
  },
  watch: {
    defaultImg(val) {
      if (val.length === 0) {
        this.initOnce = false
        return
      }
      if (!this.initOnce) return
      this.initImages(val)
      this.initOnce = false
    }
  },
  props: {
    id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    clickable: {
      type: Boolean,
      default: true
    },
    defaultMsg: {
      type: String,
      default: '上传图片'
    },
    acceptedFiles: {
      type: String
    },
    thumbnailHeight: {
      type: Number,
      default: null
    },
    thumbnailWidth: {
      type: Number,
      default: null
    },
    showRemoveLink: {
      type: Boolean,
      default: false
    },
    maxFilesize: {
      type: Number,
      default: 2
    },
    maxFiles: {
      type: Number,
      default: 3
    },
    autoProcessQueue: {
      type: Boolean,
      default: true
    },
    useCustomDropzoneOptions: {
      type: Boolean,
      default: false
    },
    defaultImg: {
      default: false
    },
    couldPaste: {
      default: false
    }
  }
}
</script>

<style scoped>
    .dropzone {
        border: 2px solid #E5E5E5;
        font-family: 'Roboto', sans-serif;
        color: #777;
        transition: background-color .2s linear;
        padding: 5px;
    }

    .dropzone:hover {
        background-color: #F6F6F6;
    }

    i{
        color: #CCC;
    }

    .dropzone input[name='file'] {
        display: none;
    }
</style>
