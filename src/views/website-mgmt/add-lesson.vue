<template>
  <section class="container">
    <el-form :inline="true" :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="课程名称" prop="title">
        <el-input placeholder="请输入课程名称" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="课程分类">
        <el-select v-model="form.cat" clearable placeholder="请选择">
          <el-option
            v-for="item in catOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程海报" class="item-fluid">
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
        <el-input placeholder="请输入开课时间" v-model="form.startTime"></el-input>
      </el-form-item>
      <el-form-item label="报名费用" prop="cost">
        <el-input placeholder="请输入报名费用" v-model="form.cost"></el-input>
      </el-form-item>
      <el-form-item label="课程简介" class="item-fluid">
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
      <el-form-item label="相关课程" class="item-fluid" prop="releatedLesson">
        <el-transfer
          filterable
          :titles="['所有课程', '相关课程']"
          :filter-method="filterMethod"
          filter-placeholder="请输入课程名称"
          v-model="form.releatedLesson"
          :data="releatedLessonData">
        </el-transfer>
      </el-form-item>
      <el-form-item style="margin-left: 100px;">
        <el-button type="primary" @click="submitForm('form')">保存并上架</el-button>
        <el-button type="default" @click="submitForm('form')">仅保存</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import Upload from '@/components/Upload/singleImage4'

  export default {
    components: {
      Tinymce,
      Upload
    },
    data() {
      const generateData2 = _ => {
        const data = []
        const cities = ['课程一', '课程二', '课程三', '课程四', '课程五', '课程六', '课程七']
        const pinyin = ['kechengyi', 'kechenger', 'kechengsan', 'kechengsi', 'kechengwu', 'kechengliu', 'kechengqi']
        cities.forEach((city, index) => {
          data.push({
            label: city,
            key: index,
            pinyin: pinyin[index]
          })
        })
        return data
      }
      return {
        catOptions: [],
        releatedLessonData: generateData2(),
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
          releatedLesson: []
        },
        rules: {
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
        return item.pinyin.indexOf(query) > -1
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
