<template>
  <section>
    <div>
      <el-button v-if="cat === 'famousTeacher'" type="text" icon="plus" @click.native="handleAdd">新增</el-button>
    </div>
    <el-table :relist="retrivewFlag" :data="list" v-loading="loading" :element-loading-text="loadingText" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="海报图片" width="150">
        <template scope="scope">
          <el-popover
            placement="right"
            width="200"
            trigger="hover">
            <p>请选择操作......</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click.native="emitPreview(scope.row.post)">查看大图</el-button>
              <el-button type="primary" size="mini" @click.native="emitUpdatePic(scope.row._id)">修改图片</el-button>
            </div>
            <img slot="reference" :src="scope.row.post+'?imageView2/2/w/100'" alt="">
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column min-width="300" label="标题">
        <template scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template scope="scope">
          <el-button type="text" icon="edit" @click.native="handleEdit(scope.row._id, listQuery.cat, listQuery.page)">编辑</el-button>
          <el-button v-if="cat === 'famousTeacher'" type="text" icon="delete" @click.native="handleDelete(scope.row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
 
</template>

<script>
import { fetchList, update, del } from '@/api/restful'

import Sortable from 'sortablejs'

export default {
  props: {
    cat: {
      type: String
    },
    page: {
      type: String
    },
    retrivew: 0
  },
  computed: {
    retrivewFlag() {
      if (this.retrivew) {
        this.getList()
        this.$emit('resetRetrivew')
        return true
      }
      return false
    }
  },
  data() {
    return {
      showPop: false,
      popThis: 1,
      loadingText: '拼命加载中...',
      list: null,
      listQuery: {
        cat: this.cat,
        page: this.page
      },
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    emitUpdatePic(id) {
      this.$emit('updatePic', id)
    },
    emitPreview(url) {
      this.$emit('preview', url)
    },
    handleEdit(id, cat, page) {
      this.$emit('edit', { id: id, cat: cat, page: page })
    },
    handleAdd() {
      this.$emit('add', {})
    },
    handleDelete(id) {
      this.list = this.list.filter(v => v._id !== id)
      del('recommended-mgmt', id).then(response => {
        this.$message.success('删除成功！')
      })
    },
    getList() {
      this.loading = true

      fetchList('recommended-mgmt', this.listQuery).then(response => {
        this.list = response.data[this.listQuery.cat]
        this.$emit('dataList', this.list)
        this.loading = false
        this.$nextTick(() => {
          this.setSort()
        })
      })
    },
    setSort() {
      const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        onEnd: evt => {
          if (evt.oldIndex !== evt.newIndex) {
            const temp = this.list[evt.newIndex]
            this.list[evt.newIndex] = this.list[evt.oldIndex]
            this.list[evt.oldIndex] = temp
            this.loading = true
            this.loadingText = '正在保存排序，请等我一下...'
            update('', {
              cat: this.listQuery.cat,
              page: this.listQuery.page,
              _id: ''
            }, {}).then(response => {
              this.$message.success(response.data.msg)
              this.loading = false
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-table{
    /deep/.cell{
      margin-top: 7px;
    }
  }
</style>
