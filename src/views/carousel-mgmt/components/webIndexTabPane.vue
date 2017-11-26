<template>
  <section>
    <el-table :data="list" v-loading="loading" :element-loading-text="loadingText" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="海报图片" width="150">
        <template scope="scope">
          <el-popover
            placement="right"
            width="200"
            trigger="hover">
            <p>请选择操作......</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click.native="emitPreview(scope.row.post)">查看大图</el-button>
              <el-button type="primary" size="mini" @click.native="emitUpdatePic(scope.row.id)">修改图片</el-button>
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

      <el-table-column align="center" label="操作" width="100">
        <template scope="scope">
          <el-button type="text" icon="edit" @click.native="handleEdit(scope.row.id, listQuery.type)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
 
</template>

<script>
import { fetchList, update } from '@/api/carousel-mgmt'

import Sortable from 'sortablejs'

export default {
  props: {
    type: {
      type: String,
      default: 'indexCarousels'
    }
  },
  data() {
    return {
      showPop: false,
      popThis: 1,
      loadingText: '拼命加载中...',
      list: null,
      listQuery: {
        type: this.type
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
    handleEdit(id, type) {
      this.$emit('edit', { id, type })
    },
    getList() {
      this.loading = true

      fetchList(this.listQuery).then(response => {
        this.list = response.data.data[this.listQuery.type]
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

            console.log(this.list)
            this.loading = true
            this.loadingText = '正在保存排序，请等我一下...'
            update({
              type: this.listQuery.type,
              data: this.list
            }).then(response => {
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

