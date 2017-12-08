<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="课程名称" v-model="listQuery.stdName">
      </el-input>

      <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.status" placeholder="课程状态">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>

      <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.cat" placeholder="课程分类">
        <el-option v-for="item in catOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>

      <el-select @change='handleFilter' style="width: 160px" class="filter-item" v-model="listQuery.sort" placeholder="排序">
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
            <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="stdName"
        label="课程名称">
      </el-table-column>
      <el-table-column
        prop="ptype"
        label="课程状态">
      </el-table-column>
      <el-table-column
        prop="ptype"
        label="课程分类">
      </el-table-column>
      <el-table-column
        prop="meta.joinAt"
        label="开课时间">
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template scope="scope">
          <el-button type="text" icon="edit" @click="goToAddLesson('edit')">编辑</el-button>
          <el-button type="text" icon="setting">下架</el-button>
          <el-button type="text" icon="delete">删除</el-button>
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
import { fetchList } from '@/api/joiner'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'joiner-table',
  directives: {
    waves
  },
  data() {
    return {
      sortOptions: [{ label: '按开课时间升序', key: '+id' }, { label: '按开课时间降序', key: '-id' }],
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        stdName: undefined,
        stdPhone: undefined,
        sort: undefined,
        type: undefined,
        cat: undefined,
        status: undefined
      },
      catOptions: [{ label: '教师资格', key: '' }, { label: '司法考试', key: 'test' }],
      statusOptions: [{ label: '招生中', key: '' }, { label: '已下架', key: 'test' }],
      ptypeOptions: [{ label: '全部', key: '' }, { label: '考试报名', key: 'test' }, { label: '课程报名', key: 'lesson' }],
      tableKey: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    goToAddLesson(action) {
      this.$router.push({ path: '/website-mgmt/lesson-mgmt/' + action })
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
