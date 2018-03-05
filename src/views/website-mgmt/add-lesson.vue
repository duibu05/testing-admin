<template>
  <section class="container" v-loading="showLoading">
    <el-form :inline="true" :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="课程名称" prop="title">
        <el-input placeholder="请输入课程名称" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="课程分类" prop="cat">
        <el-select v-model="form.cat" clearable placeholder="请选择">
          <el-option
            v-for="item in catOptions"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程海报" class="item-fluid" prop="post">
        <Upload class="post-image" v-model="form.post"></Upload>
      </el-form-item>
      <el-form-item label="课程数" prop="kecheng">
        <el-input placeholder="请输入课程数" v-model="form.kecheng"></el-input>
      </el-form-item>
      <el-form-item label="课时" prop="keshi">
        <el-input placeholder="请输入课时" v-model="form.keshi"></el-input>
      </el-form-item>
      <el-form-item label="课程形式" prop="xingshi">
        <el-input placeholder="请输入课程形式" v-model="form.xingshi"></el-input>
      </el-form-item>
      <el-form-item label="上课地点" prop="place">
        <el-input placeholder="请输入上课地点" v-model="form.place"></el-input>
      </el-form-item>
      <el-form-item label="开课时间" prop="startTime">
        <el-date-picker
          v-model="form.startTime"
          type="datetime"
          placeholder="选择开课时间"
          align="right"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="报名费用" prop="cost">
        <el-input placeholder="请输入报名费用" v-model="form.cost"></el-input>
      </el-form-item>
      <el-form-item label="课程简介" class="item-fluid" prop="brief">
        <el-input
          type="textarea"
          style="min-width: 740px"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入课程简介"
          v-model="form.brief">
        </el-input>
      </el-form-item>
      <el-form-item label="课程详情" class="item-fluid" prop="content">
        <tinymce style="min-width: 740px" :height=200 ref="editor" v-model="form.content"></tinymce>
      </el-form-item>
      <el-form-item v-if="releatedLessonData.length" label="相关课程" class="item-fluid">
        <el-transfer
          filterable
          :titles="['所有课程', '相关课程']"
          :props="{
            key: 'id',
            label: 'title'
          }"
          :filter-method="filterMethod"
          filter-placeholder="请输入课程名称"
          v-model="form.releatedLesson"
          :data="releatedLessonData">
        </el-transfer>
      </el-form-item>
      <el-form-item style="margin-left: 100px;">
        <el-button type="primary" @click="submitForm('form', 1)">保存并上架</el-button>
        <el-button type="default" @click="submitForm('form', 0)">仅保存</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
  import { fetchList, save, update, get } from '@/api/restful'
  import Tinymce from '@/components/Tinymce'
  import Upload from '@/components/Upload/singleImage4'

  export default {
    components: {
      Tinymce,
      Upload
    },
    watch: {
      'form.cat': function() {
        this.fetchRelatedLessons()
      }
    },
    data() {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '明天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: '一周后',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }]
        },
        showLoading: false,
        catOptions: [],
        releatedLessonData: [],
        form: {
          title: '',
          cat: '',
          brief: '',
          post: '',
          content: '',
          kecheng: '',
          keshi: '',
          xingshi: '',
          place: '',
          startTime: '',
          cost: '',
          status: 1, // 默认上架
          releatedLesson: []
        },
        rules: {
          brief: [
            { required: true, message: '请输入课程简介' }
          ],
          cat: [
            { required: true, message: '请选择课程分类' }
          ],
          post: [
            { required: true, message: '请上传课程海报' }
          ],
          title: [
            { required: true, message: '请输入课程名称！' }
          ],
          kecheng: [
            { required: true, message: '请输入课程数！' }
          ],
          keshi: [
            { required: true, message: '请输入课时！' }
          ],
          xingshi: [
            { required: true, message: '请输入课程形式！' }
          ],
          place: [
            { required: true, message: '请输入上课地点！' }
          ],
          startTime: [
            { required: true, message: '请输入开课时间' }
          ],
          cost: [
            { required: true, message: '请输入报名费用' }
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
      filterMethod(query, item) {
        return item.title.indexOf(query) > -1
      },
      fetchData() {
        this.showLoading = true
        // 通过接口获取数据
        get('lesson', this.$route.params.id).then(res => {
          this.showLoading = false
          this.form = {
            title: res.data.title,
            cat: res.data.cat,
            brief: res.data.brief,
            post: res.data.post,
            content: res.data.content,
            kecheng: res.data.kecheng,
            keshi: res.data.keshi,
            xingshi: res.data.xingshi,
            place: res.data.place,
            startTime: res.data.startTime,
            cost: res.data.cost,
            releatedLesson: res.data.releatedLesson
          }
        }).catch(() => {
          this.showLoading = false
        })
      },
      submitForm(formName, status) {
        this.form.status = status
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.showLoading = true
            let opt

            if (this.isEdit) {
              opt = update('lesson', this.$route.params.id, this.form)
            } else {
              opt = save('lesson', this.form)
            }
            opt.then(res => {
              this.$message.success('提交成功！')
              this.showLoading = false
              history.back()
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      fetchRelatedLessons() {
        fetchList('lessons', { cat: this.form.cat }).then(res => {
          this.releatedLessonData = res.data.list.map(v => {
            return {
              id: v._id,
              post: v.post,
              cost: v.cost,
              place: v.place,
              title: v.title
            }
          })
          if (this.isEdit) {
            this.releatedLessonData = this.releatedLessonData.filter(v => v.id !== this.$route.params.id)
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    },
    created() {
      fetchList('category/rebuild', { type: 'web-content' }).then(res => {
        this.catOptions = res.data.first.list.map(v => v.name)

        this.catOptions.push('暂不分类')
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

    .item-fluid{
      width: 100%;
    }

    .keywords{
      margin: 0 10px 10px 0;

      .el-input{
        max-width: 300px;
      }
    }
    .post-image{
      width: 200px;
      height: 200px;
    }
    /deep/ .el-transfer-panel{
      box-sizing: content-box;
      padding-bottom: 20px;
      width: 300px;
    }
  }

  
</style>
