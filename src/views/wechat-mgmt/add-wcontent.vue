<template>
  <section class="container">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" v-loading="showLoading" element-loading-text="请给我点时间...">
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
        <el-select @change="changeCat" v-model="form.cat" clearable placeholder="请选择">
          <el-option
            v-for="item in catOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-tooltip class="item" effect="dark" content="内容分类如果是“考试辅导”，必须完善内容海报" placement="right">
          <i class="el-icon-warning" style="color: #F7BA2A;"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="内容海报" prop="post">
        <Upload v-model="form.post" class="post"></Upload>
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
  import Upload from '@/components/Upload/singleImage4'
  import { fetchList, get, save, update } from '@/api/restful'

  export default {
    components: {
      Tinymce,
      Upload
    },
    data() {
      return {
        showLoading: false,
        catOptions: [],
        form: {
          title: '',
          keywords: [{
            value: ''
          }],
          cat: '',
          post: '',
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
      changeCat(cat) {
        if (cat === '选项3') {
          this.rules.post = [
            { required: true, message: '请上传内容海报！' }
          ]
        } else {
          delete this.rules.post
        }
      },
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
        this.showLoading = true
        // 通过接口获取数据
        get('wechat-content', this.$route.params.id)
          .then(res => {
            this.form = res.data
            this.showLoading = false
          })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.showLoading = true
            let opt

            if (this.isEdit) {
              opt = update('wechat-content', this.$route.params.id, this.form)
            } else {
              opt = save('wechat-content', this.form)
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
      fetchList('category', { type: 'wechat-content', level: 'first' })
        .then(res => {
          this.catOptions = res.data.list.map(v => {
            const obj = {}
            obj.value = v._id
            obj.label = v.name

            return obj
          })
          this.catOptions.push({
            value: '',
            label: '暂不分类'
          })
        })

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
    .post{
      width: 200px;
      height: 200px;
    }
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
