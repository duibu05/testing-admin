<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="课程名称" v-model="listQuery.keyword">
      </el-input>

      <el-select clearable @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.status" placeholder="课程状态">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>

      <el-select clearable @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.cat" placeholder="课程分类">
        <el-option v-for="item in catOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>

      <el-select clearable @change='handleFilter' style="width: 160px" class="filter-item" v-model="listQuery.sort" placeholder="排序">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="plus" @click="goToAddLesson('add')">添加</el-button>
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
        label="课程名称">
      </el-table-column>
      <el-table-column
        label="课程状态">
        <template scope="scope">{{scope.row.status === 1?'招生中':'已下架'}}</template>
      </el-table-column>
      <el-table-column
        prop="cat"
        label="课程分类">
      </el-table-column>
      <el-table-column
        label="开课时间">
        <template scope="scope">{{new Date(scope.row.startTime).getTime() / 1000 | formatTime('{y}-{m}-{d} {h}:{i}')}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template scope="scope">
          <el-button type="text" icon="edit" @click="goToAddLesson('edit', scope.row._id)">编辑</el-button>
          <el-button type="text" v-if="scope.row.status === 1" icon="setting" @click="toggleLesson(scope.row._id, 0)">下架</el-button>
          <el-button type="text" v-if="scope.row.status !== 1" icon="setting" @click="toggleLesson(scope.row._id, 1)">上架</el-button>
          <el-button type="text" icon="delete" @click="deleteLesson(scope.row._id)">删除</el-button>
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
import { fetchList, del, update } from '@/api/restful'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'joiner-table',
  directives: {
    waves
  },
  data() {
    return {
      sortOptions: [{ label: '按开课时间升序', key: '+startTime' }, { label: '按开课时间降序', key: '-startTime' }],
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        sort: undefined,
        cat: undefined,
        status: undefined
      },
      catOptions: [],
      statusOptions: [{ label: '招生中', key: 1 }, { label: '已下架', key: 0 }],
      tableKey: 0
    }
  },
  created() {
    this.getList()
    fetchList('category/rebuild', { type: 'web-content' }).then(res => {
      this.catOptions = res.data.first.list.map(v => v.name)
    })
  },
  methods: {
    deleteLesson(id) {
      this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del('lesson', id).then(res => {
          this.$message.success('操作成功！')
          this.getList()
        })
      }).catch(() => {})
    },
    toggleLesson(id, status) {
      const tips = status === 0 ? '此操作将下架该课程, 是否继续?' : '此操作将上架该课程, 是否继续?'
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        update('lesson', id, { status: status }).then(res => {
          this.$message.success('操作成功！')
          this.getList()
        })
      }).catch(() => {})
    },
    goToAddLesson(action, id = '') {
      this.$router.push({ path: `/website-mgmt/lesson-mgmt/${action}/${id}` })
    },
    getList() {
      this.listLoading = true
      fetchList('lessons', this.listQuery).then(response => {
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
