<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="新闻标题" v-model="listQuery.keyword">
      </el-input>

      <el-select clearable @change='handleFilter' style="width: 160px" class="filter-item" v-model="listQuery.sort" placeholder="排序">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="plus" @click="goToAddNews('add')">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="拼命加载中..." border fit stripe highlight-current-row style="width: 100%" max-height="600">
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
        label="新闻标题">
      </el-table-column>
      <el-table-column
        label="新闻分类">
        <template scope="scope">
          <span>新闻中心</span>
        </template>
      </el-table-column>
      <el-table-column
        label="发布时间">
        <template scope="scope">
          <span>{{new Date(scope.row.createdAt).getTime() | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template scope="scope">
          <el-button type="text" icon="edit" @click="goToAddNews('edit', scope.row._id)">编辑</el-button>
          <el-button type="text" icon="delete" @click="delNews(scope.row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { fetchList, del } from '@/api/news'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'news-table',
  directives: {
    waves
  },
  data() {
    return {
      sortOptions: [{ label: '最新发布', key: '-createdAt' }, { label: '最早发布', key: '+createdAt' }],
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        sort: undefined
      },
      ptypeOptions: [{ label: '全部', key: '' }, { label: '考试报名', key: 'test' }, { label: '课程报名', key: 'lesson' }],
      tableKey: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    delNews(id) {
      this.$confirm('此操作将永久删除该新闻, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(id).then(res => {
          if (res.code === 0) {
            this.$message.success('删除成功！')
            this.getList()
          } else {
            this.$message.error('删除失败！')
          }
        })
        .catch(() => this.$message.error('删除失败！!'))
      }).catch(() => {})
    },
    goToAddNews(action, _id = '') {
      this.$router.push({ path: `/website-mgmt/news-center/${action}/${_id}` })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total || 0
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
