<template>
  <section v-loading="showLoading" element-loading-text="请给我点时间..." class="container">
    <el-button class="filter-item" style="margin-bottom: 20px;" type="primary" icon="plus" @click="dialogVisible = true">添加</el-button>
    <el-tabs v-if="category" type="border-card" class="tab" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(value, key) in category" :key="key" :label="value.label" :name="key">
        <el-row v-if="key === 'first'">
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
        <el-table v-if="key !== 'first'" :data="value.list" border fit stripe highlight-current-row style="width: 100%" max-height="600">
          <el-table-column
            width="65"
            align="center"
            label="编号">
            <template scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column
          align="center"
          width="100"
          label="图片">
            <template scope="scope">
              <img :src="scope.row.image + '?imageView2/1/w/45/h/45'" alt="">
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称">
          </el-table-column>
          <el-table-column
            label="所属一级分类">
            <template scope="scope">
              <span v-if="scope.row.first && scope.row.first.name">{{scope.row.first.name}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            label="所属二级分类">
            <template scope="scope">
              <span v-if="scope.row.second && scope.row.second.name">{{scope.row.second.name}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            label="所属三级分类">
            <template scope="scope">
              <span v-if="scope.row.third && scope.row.third.name">{{scope.row.third.name}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template scope="scope">
              <el-button type="text" icon="delete" @click="confirmDel(scope.row.level, scope.$index, scope.row._id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
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

          <el-form-item prop="cat" label="分类" label-width="120px">
            <el-select v-model="form.cat" placeholder="请选择分类" @change="changeCat">
              <el-option v-for="(value, key) in category" :label="value.label" :value="key" :key="key"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="first" v-if="0 < activeIndex" label="所属一级分类" label-width="120px">
            <el-select v-model="form.first" value-key="_id" placeholder="请选择分类" @change="form.second = undefined, form.third = undefined">
              <el-option v-for="(cat, idx) in catLevels[0]" :label="cat.name" :value="cat" :key="idx"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="second" v-if="1 < activeIndex && form.first && form.first._id" label="所属二级分类" label-width="120px">
            <el-select v-model="form.second" value-key="_id" placeholder="请选择分类" @change="form.third = undefined">
              <el-option v-for="(cat, idx) in catLevels[1].filter(v => v.first._id === form.first._id)" :label="cat.name" :value="cat" :key="idx"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="third" v-if="2 < activeIndex && form.second && form.second._id" label="所属三级分类" label-width="120px">
            <el-select v-model="form.third" value-key="_id" placeholder="请选择分类">
              <el-option v-for="(cat, idx) in catLevels[2].filter(v => v.second._id === form.second._id)" :label="cat.name" :value="cat" :key="idx"></el-option>
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
        catLevels: [],
        dialogVisible: false,
        showLoading: false,
        activeName: 'first',
        activeIndex: 0,
        catMapping: [{
          name: '所属一级分类',
          key: 'first'
        }, {
          name: '所属二级分类',
          key: 'second'
        }, {
          name: '所属三级分类',
          key: 'third'
        }, {
          name: '所属四级分类',
          key: 'fourth'
        }],
        category: null,
        form: {
          name: '',
          image: '',
          cat: 'first',
          first: undefined,
          second: undefined,
          third: undefined
        },
        rules: {
          name: [{ required: true, message: '名称不能为空！' }],
          image: [{ required: true, message: '图片不能为空！' }],
          cat: [{ required: true, message: '分类不能为空！' }],
          first: [{ required: true, message: '所属一级分类不能为空！' }],
          second: [{ required: true, message: '所属二级分类不能为空！' }],
          third: [{ required: true, message: '所属三级分类不能为空！' }],
          fourth: [{ required: true, message: '所属四级分类不能为空！' }]
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
      changeCat() {
        for (let i = 0; i < 4; i++) {
          this.form[this.catMapping[i].key] = undefined
          if (this.catMapping[i].key === this.form.cat) {
            this.activeIndex = i
          }
        }
      },
      resetForm() {
        this.$refs['form'].resetFields()
      },
      submit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.activeName = this.form.cat
            this.dialogVisible = false
            this.showLoading = true
            save('category', { type: 'shijuan', name: this.form.name, image: this.form.image, first: this.form.first, second: this.form.second, third: this.form.third, fourth: this.form.fourth, level: this.form.cat }).then(response => {
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
        this.activeIndex = +tab.index
        this.activeName = tab.name
        this.form.cat = tab.name
      }
    },
    created() {
      this.showLoading = true
      fetchList('category/rebuild', { type: 'shijuan' }).then(response => {
        this.showLoading = false
        this.category = response.data || {}
      })

      fetchList('category/rebuild', { type: 'shijuan' }).then((rebuild) => {
        this.showLoading = false
        this.category = rebuild.data || {}
        this.catLevels = [this.category.first.list, this.category.second.list, this.category.third.list, this.category.fourth.list]
      })
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

