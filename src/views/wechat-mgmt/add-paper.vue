<template>
  <section class="container" v-loading="showLoading">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="试卷标题" prop="title">
        <el-input placeholder="请输入试卷标题" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="试卷分类">
        <el-select v-model="form.firstCat" value-key="id" clearable placeholder="请选择">
          <el-option
            v-for="item in catOptions"
            :key="item.id"
            :label="item.name"
            :value="item">
          </el-option>
        </el-select>
        <el-select v-model="form.secondCat" value-key="id" clearable placeholder="请选择">
          <el-option
            v-for="item in subCatOptions"
            :key="item.id"
            :label="item.name"
            :value="item">
          </el-option>
        </el-select>
        <el-select v-model="form.thirdCat" value-key="id" clearable placeholder="请选择">
          <el-option
            v-for="item in thirdCatOptions"
            :key="item.id"
            :label="item.name"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="试卷图标" prop="image">
        <Upload v-model="form.image" class="post"></Upload>
      </el-form-item>
      <el-form-item label="试题管理">
        <div>
          <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="试题名称" v-model="listQuery.keyword">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
          </div>
          <el-table :key='1' :data="tempQuestions" border fit stripe highlight-current-row style="width: 100%" max-height="600">
            <el-table-column
              width="65"
              align="center"
              label="编号">
              <template scope="scope">
                <span>{{scope.$index+1+(listQuery.page-1)*listQuery.limit}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="title"
              label="试题名称">
            </el-table-column>
            <el-table-column
              prop="secondCat"
              label="题型分类">
            </el-table-column>
            <el-table-column
              label="试题分数">
              <template scope="scope">
                <el-input style="width: 60px;" class="filter-item" placeholder="请输入试题分数" v-model="scope.row.points">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="试题管理">
              <template scope="scope">
                <el-button type="text" icon="delete" @click="deleteQuestion(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="showDialog = true">添加试题</el-button>
        <el-button type="primary" @click="submitForm('form')">保存并发布</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="添加试题" 
      :visible.sync="showDialog">
      
      <div class="app-container calendar-list-container">
        <div class="filter-container">
          <el-input @keyup.enter.native="getList" style="width: 200px;" class="filter-item" placeholder="试卷标题" v-model="dialogListQuery.keyword">
          </el-input>

          <el-select @change='getList' style="width: 120px" class="filter-item" v-model="dialogListQuery['firstCat.id']" placeholder="类别">
            <el-option v-for="item in dialogCatOptions" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>

          <el-select @change='getList' style="width: 120px" class="filter-item" v-model="dialogListQuery['secondCat.id']" placeholder="类别">
            <el-option v-for="item in dialogSubCatOptions" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>

          <el-button class="filter-item" type="primary" icon="search" @click="getList">搜索</el-button>
        </div>

        <el-table :data="dialogList" v-loading="listLoading" element-loading-text="拼命加载中..." border fit stripe highlight-current-row style="width: 100%" 
        max-height="300">
          <el-table-column
            label="标题">
            <template scope="scope">
              <span>{{scope.row.title}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="试题分类"
            prop="firstCat.name"></el-table-column>
          <el-table-column
            label="题型分类"
            prop="secondCat.name"></el-table-column>
          <el-table-column
            label="选择">
            <template scope="scope">
              <el-button @click="selectQuestion(scope.row)">选择</el-button>  
            </template>
          </el-table-column>
        </el-table>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="showDialog = false">确 定</el-button>
      </span>
    </el-dialog>  
  </section>
</template>

<script>
  import { fetchList, update, save, get } from '@/api/restful'
  import Upload from '@/components/Upload/singleImage4'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  export default {
    directives: {
      waves
    },
    components: {
      Upload
    },
    data() {
      return {
        listQuery: {
          keyword: undefined,
          page: 1,
          limit: 20
        },
        dialogListQuery: {
          'firstCat.id': undefined,
          'secondCat.id': undefined,
          keyword: undefined
        },
        dialogCatOptions: undefined,
        dialogSubCatOptions: undefined,
        dialogList: [],
        listLoading: false,
        showDialog: false,
        showLoading: false,
        catOptions: [],
        subCatOptions: [],
        thirdCatOptions: [],
        tempQuestions: [],
        form: {
          title: '',
          firstCat: '',
          secondCat: '',
          thirdCat: '',
          image: '',
          questions: []
        },
        rules: {
          title: [
            { required: true, message: '请输入试卷标题！' }
          ],
          image: [
            { required: true, message: '请上传试卷图标！' }
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
      deleteQuestion(id) {
        this.$confirm('确认删除该试题?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.form.questions = this.form.questions.filter(v => v.id !== id)
          this.handleFilter()
          this.$message('已临时删除该试题，点击保存并发布后将永久删除！')
        }).catch(() => {})
      },
      selectQuestion(obj) {
        this.$prompt('请输入分数！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[0-9]/,
          inputErrorMessage: '格式不正确'
        }).then(({ value }) => {
          this.form.questions.push({
            id: obj._id,
            title: obj.title,
            firstCat: obj.firstCat.name,
            secondCat: obj.secondCat.name,
            points: value
          })
          this.handleFilter()
          this.$message({
            type: 'success',
            message: '试题已临时加入试卷中，请记得点击保存并发布'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '未输入分数'
          })
        })
      },
      getList() {
        fetchList('question', this.dialogListQuery).then(res => {
          this.dialogList = res.data.list
        })
      },
      removeAnswer(item) {
        var index = this.form.answers.indexOf(item)
        if (index !== -1) {
          this.form.answers.splice(index, 1)
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
        get('paper', this.$route.params.id).then(res => {
          this.form = {
            title: res.data.title,
            firstCat: res.data.firstCat,
            secondCat: res.data.secondCat,
            thirdCat: res.data.thirdCat,
            questions: res.data.questions,
            image: res.data.image
          }
          this.tempQuestions = [].concat(this.form.questions)
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.showLoading = true
            let opt

            if (this.isEdit) {
              opt = update('paper', this.$route.params.id, this.form)
            } else {
              opt = save('paper', this.form)
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
      },
      handleFilter() {
        const reg = new RegExp(this.listQuery.keyword)
        this.tempQuestions = this.form.questions.filter(v => reg.test(v.title))
      }
    },
    created() {
      fetchList('category', { type: 'shijuan', level: 'first' }).then(res => {
        this.catOptions = res.data.list.map(v => {
          const obj = {}
          obj.id = v._id
          obj.name = v.name

          return obj
        })
      })
      fetchList('category', { type: 'shijuan', level: 'second' }).then(res => {
        this.subCatOptions = res.data.list.map(v => {
          const obj = {}
          obj.id = v._id
          obj.name = v.name

          return obj
        })
      })
      fetchList('category', { type: 'shiti', level: 'first' }).then(res => {
        this.dialogCatOptions = res.data.list.map(v => {
          const obj = {}
          obj.id = v._id
          obj.name = v.name

          return obj
        })
      })
      fetchList('category', { type: 'shiti', level: 'second' }).then(res => {
        this.dialogSubCatOptions = res.data.list.map(v => {
          const obj = {}
          obj.id = v._id
          obj.name = v.name

          return obj
        })
      })
      fetchList('category', { type: 'shijuan', level: 'third' }).then(res => {
        this.thirdCatOptions = res.data.list.map(v => {
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
