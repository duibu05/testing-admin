<template>
  <section class="container">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="新闻标题" prop="title">
        <el-input placeholder="请输入新闻标题" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item
        label="关键词">
        <section class="keywords" v-for="(keyword, index) in form.keywords"
        :key="keyword.key">
        <el-input placeholder="请输入关键词" v-model="keyword.value"></el-input>
        <el-button-group>
          <el-button v-if="index !== 0 || form.keywords.length > 1" @click.prevent="removeKeyword(keyword)" size="mini" icon="delete" type="primary"></el-button>
          <el-button @click.prevent="addKeyword(keyword)" size="mini" type="primary" icon="plus"></el-button>
        </el-button-group>
        </section>
      </el-form-item>
      <el-form-item label="附件" prop="attachments">
        <Upload v-model="form.attachments" :files="form.attachments || {}"></Upload>
      </el-form-item>
      <el-form-item label="新闻详情" prop="content">
        <tinymce :height=200 ref="editor" v-model="form.content"></tinymce>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import Upload from '@/components/Upload/fileUpload'
  import { save, get, update } from '@/api/news'

  export default {
    components: {
      Tinymce,
      Upload
    },
    data() {
      return {
        form: {
          title: '',
          keywords: [{
            value: ''
          }],
          attachments: {},
          content: ''
        },
        rules: {
          title: [
            { required: true, message: '请输入新闻标题！' }
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
      removeKeyword(item) {
        var index = this.form.keywords.indexOf(item)
        if (index !== -1) {
          this.form.keywords.splice(index, 1)
        }
      },
      addKeyword() {
        this.form.keywords.push({
          value: '',
          key: Date.now()
        })
      },
      fetchData() {
        // 通过接口获取数据
        get(this.$route.params.id).then(res => {
          this.form.title = res.data.data.title
          this.form.keywords = res.data.data.keywords
          this.form.attachments = res.data.data.attachments
          this.form.content = res.data.data.content
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let opt
            if (this.isEdit) {
              opt = update(this.$route.params.id, this.form)
            } else {
              opt = save(this.form)
            }
            opt.then(res => {
              if (res.data.code === 0 || res.status === 204) {
                this.$message.success('提交成功！')
                history.back()
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
