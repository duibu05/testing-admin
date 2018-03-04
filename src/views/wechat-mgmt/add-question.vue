<template>
  <section class="container">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="试题标题" prop="title">
        <el-input placeholder="请输入试题标题" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="试题分类" prop="firstCat">
        <el-select v-model="form.firstCat" value-key="id" clearable placeholder="请选择">
          <el-option
            v-for="item in catOptions"
            :key="item.id"
            :label="item.name"
            :value="item">
          </el-option>
        </el-select>
        <el-select v-model="form.secondCat"  value-key="id" clearable placeholder="请选择">
          <el-option
            v-for="item in subCatOptions"
            :key="item.id"
            :label="item.name"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="题干内容" prop="body">
        <textarea style="width: 550px;" name="" id="" cols="30" rows="10" v-model="form.body"></textarea>
      </el-form-item>

      <el-form-item label="试题选项" prop="answers">
        <section class="keywords" v-for="(answer, index) in form.answers"
          :key="answer.key">
          <el-input style="width: 65px;" placeholder="选项" v-model="answer.options"></el-input>
          <el-input placeholder="选项内容" v-model="answer.content"></el-input>
          <el-button-group>
            <el-button v-if="index !== 0 || form.answers.length > 2" @click.prevent="removeAnswer(answer)" size="mini" icon="delete" type="primary"></el-button>
            <el-button @click.prevent="addAnswer(answer)" size="mini" type="primary" icon="plus"></el-button>
          </el-button-group>
        </section>
      </el-form-item>

      <el-form-item label="正确答案" prop="rightAnswer">
        <el-checkbox-group v-model="form.rightAnswer">
          <el-checkbox :label="answer.options" v-for="answer in form.answers" :key="answer.key"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="答案解析" prop="analysis">
        <textarea style="width: 550px;" name="" id="" cols="30" rows="10" v-model="form.analysis"></textarea>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
  import { fetchList, update, save, get } from '@/api/restful'
  export default {
    data() {
      const validateCat = (rule, value, callback) => {
        if (this.form.firstCat === '' || this.form.firstCat.id === '') {
          callback(new Error('请选择试题分类'))
        }
        if (this.form.secondCat === '' || this.form.secondCat.id === '') {
          callback(new Error('请选择题型分类'))
        }
        callback()
      }
      return {
        catOptions: [],
        subCatOptions: [],
        form: {
          rightAnswer: [],
          title: '',
          answers: [{
            options: 'A',
            content: ''
          }, {
            options: 'B',
            content: ''
          }, {
            options: 'C',
            content: ''
          }, {
            options: 'D',
            content: ''
          }],
          firstCat: '',
          secondCat: '',
          body: '',
          analysis: ''
        },
        rules: {
          title: [
            { required: true, message: '请输入试题标题！' }
          ],
          rightAnswer: [
            { required: true, message: '请选择正确答案！' }
          ],
          answers: [
            { required: true, message: '请输入选项！' }
          ],
          firstCat: [
            { required: true, message: '请选择试题分类！' },
            { validator: validateCat, message: '请选择试题分类' }
          ],
          secondCat: [
            { required: true, message: '请选择题型分类！' },
            { validator: validateCat, message: '请选择题型分类' }
          ],
          body: [
            { required: true, message: '请输入题干！' }
          ],
          analysis: [
            { required: true, message: '请输入答案解析！' }
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
      removeAnswer(item) {
        var index = this.form.answers.indexOf(item)
        if (index !== -1) {
          this.form.answers.splice(index, 1)
        }

        var rightAnswerIndex = this.form.rightAnswer.indexOf(item.options)
        if (rightAnswerIndex !== -1) {
          this.form.rightAnswer.splice(rightAnswerIndex, 1)
        }
      },
      addAnswer() {
        this.form.answers.push({
          options: '',
          content: '',
          key: Date.now()
        })
      },
      fetchData() {
        // 通过接口获取数据
        get('question', this.$route.params.id).then(res => {
          this.form = {
            rightAnswer: res.data.rightAnswer,
            title: res.data.title,
            answers: res.data.answers,
            firstCat: res.data.firstCat,
            secondCat: res.data.secondCat,
            body: res.data.body,
            analysis: res.data.analysis
          }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          const answersContentNotFinished = this.form.answers.filter(v => !v.content).map(v => v.options)
          if (valid) {
            if (answersContentNotFinished && answersContentNotFinished.length) {
              return this.$message.error(`选项${answersContentNotFinished.join(',')}内容不能为空！`)
            }
            this.showLoading = true
            let opt

            if (this.isEdit) {
              opt = update('question', this.$route.params.id, this.form)
            } else {
              opt = save('question', this.form)
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
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    },
    created() {
      fetchList('category', { type: 'shiti', level: 'first' }).then(res => {
        this.catOptions = res.data.list.map(v => {
          const obj = {}
          obj.id = v._id
          obj.name = v.name

          return obj
        })
      })
      fetchList('category', { type: 'shiti', level: 'second' }).then(res => {
        this.subCatOptions = res.data.list.map(v => {
          const obj = {}
          obj.id = v._id
          obj.name = v.name

          return obj
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
