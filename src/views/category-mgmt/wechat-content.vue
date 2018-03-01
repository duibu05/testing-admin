<template>
  <section v-loading="showLoading" element-loading-text="请给我点时间..." class="container">
    <el-button class="filter-item" style="margin-bottom: 20px;" type="primary" icon="plus" @click="dialogVisible = true">添加</el-button>
    <el-tabs v-if="category" type="border-card" class="tab" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(value, key) in category" :key="key" :label="value.label" :name="key">
        <el-row>
          <el-col :span="4" v-for="(cat, index) in value.list" :key="index">
            <el-card style="margin-right: 10px;" :body-style="{ padding: '10px' }">
              <img :src="cat.image + '?imageView2/1/w/200/h/200'" class="image" style="width: 100%;">
              <div class="category-name">
                <span>{{cat.name}}</span>
                <div class="bottom clearfix">
                  <el-button type="text" @click="confirmDel(key, index, cat._id)" class="button">
                    <i class="el-icon-delete"></i>
                  </el-button>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col v-if="!value.list || (value.list && value.list.length === 0)"><span style="color: #99A9BF;">暂无数据！</span></el-col>

        </el-row>
      </el-tab-pane>

      <el-dialog
        title="添加分类"
        :visible.sync="dialogVisible"
        size="small"
        :before-close="handleClose">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item prop="name" label="分类名称" label-width="120px">
            <el-input v-model="form.name" placeholder="请输入分类名称"></el-input>
          </el-form-item>

          <el-form-item prop="cat" label="所属分类" label-width="120px">
            <el-select v-model="form.cat" placeholder="请选择分类">
              <el-option v-for="(value, key) in category" :label="value.label" :value="key" :key="key"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="image" label="上传图片" label-width="120px">
            <Upload class="upload" v-model="form.image" ></Upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit" :disabled="disabled">添 加</el-button>
        </span>
      </el-dialog>
    </el-tabs>
  </section>
</template>
<script>
  import { fetchList, save, del } from '@/api/restful'
  import Upload from '@/components/Upload/singleImage4'

  export default {
    components: { Upload },
    data() {
      return {
        dialogVisible: false,
        showLoading: false,
        activeName: 'first',
        category: null,
        form: {
          name: '',
          image: '',
          cat: ''
        },
        rules: {
          name: [{ required: true, message: '名称不能为空！' }],
          image: [{ required: true, message: '图片不能为空！' }],
          cat: [{ required: true, message: '所属分类不能为空！' }]
        },
        disabled: true
      }
    },
    computed: {
    },
    watch: {
      form: {
        handler: function() {
          this.disabled = !(this.form.name && this.form.image && this.form.cat)
        },
        deep: true
      }
    },
    methods: {
      resetForm() {
        this.$refs['form'].resetFields()
      },
      submit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.activeName = this.form.cat
            this.dialogVisible = false
            this.showLoading = true
            save('category', { type: 'wechat-content', name: this.form.name, image: this.form.image }).then(response => {
              this.showLoading = false
              this.category[this.form.cat].list.push(response.data)
              this.resetForm()
            })
          }
        })
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
            this.resetForm()
          })
          .catch(_ => {})
      },
      confirmDel(key, index, id) {
        this.$confirm('确认删除？')
          .then(_ => {
            this.showLoading = true
            del('category', id).then(response => {
              this.category[key].list = this.category[key].list.filter((v, idx) => idx !== index)
              this.showLoading = false
              this.$message.success('删除成功！')
            })
          })
          .catch(_ => {})
      },
      handleClick(tab, event) {
        // console.log(tab, event)
      },
      fetchData() {
        this.showLoading = true
        fetchList('category/rebuild', { type: 'wechat-content' }).then(response => {
          this.showLoading = false
          this.category = response.data || {}
        })
      }
    },
    created() {
      this.fetchData()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .container{
    margin: 30px;
    .tab{
      min-height: 500px;

      .el-input,
      .el-select{
        width: 300px;
      }

      .upload{
        width: 200px;
        height: 200px;
        box-sizing: border-box;
        overflow: hidden;
      }

      .category-name{
        display: flex;
        padding: 14px;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
</style>

