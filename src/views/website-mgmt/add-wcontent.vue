<template>
  <section class="container">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="内容标题" prop="title">
        <el-input placeholder="请输入内容标题" v-model="form.title"></el-input>
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
      <el-form-item label="内容分类">
        <el-select v-model="form.cat" clearable placeholder="请选择">
          <el-option
            v-for="item in catOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="form.subCat" clearable placeholder="请选择">
          <el-option
            v-for="item in subCatOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="附件">
        <Upload v-model="form.attachments"></Upload>
      </el-form-item>
      <el-form-item label="内容详情" prop="content">
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

  export default {
    components: {
      Tinymce,
      Upload
    },
    data() {
      return {
        catOptions: [],
        subCatOptions: [],
        form: {
          title: '',
          keywords: [{
            value: ''
          }],
          cat: '',
          subCat: '',
          attachments: {},
          content: ''
        },
        rules: {
          title: [
            { required: true, message: '请输入内容标题！' }
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
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!')
            console.log(this.form)
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
      this.catOptions = [{
        value: '选项1',
        label: '教师资格'
      }, {
        value: '选项2',
        label: '司法考试'
      }, {
        value: '选项3',
        label: '暂不分类'
      }]
      this.subCatOptions = [{
        value: '选项1',
        label: '资格介绍'
      }, {
        value: '选项2',
        label: '考试指南'
      }, {
        value: '选项3',
        label: '答疑专区'
      }, {
        value: '选项4',
        label: '考试技巧'
      }, {
        value: '选项5',
        label: '备考资料'
      }, {
        value: 'werewr',
        label: '历年真题'
      }]
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
