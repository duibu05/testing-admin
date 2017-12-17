<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="内容标题" v-model="listQuery.keyword">
      </el-input>

      <el-select clearable @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.cat" placeholder="内容分类">
        <el-option v-for="item in catOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>

      <el-select clearable @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.subCat" placeholder="内容子类">
        <el-option v-for="item in subCatOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="plus" @click="goToAddWContent('add')">添加</el-button>
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
        label="内容标题"
        width="500">
      </el-table-column>
      <el-table-column
        prop="cat"
        label="内容分类">
      </el-table-column>
      <el-table-column
        prop="subCat"
        label="内容子类">
      </el-table-column>
      <el-table-column
        label="发布时间">
        <template scope="scope">{{new Date(scope.row.createdAt).getTime() | parseTime}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template scope="scope">
          <el-button type="text" icon="edit" @click="goToAddWContent('edit', scope.row._id)">编辑</el-button>
          <el-button type="text" icon="delete" @click="deleteContent(scope.row._id)">删除</el-button>
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
import { fetchList, del } from '@/api/restful'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'webcontent-table',
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        cat: undefined,
        subCat: undefined
      },
      catOptions: [],
      subCatOptions: [],
      tableKey: 0
    }
  },
  created() {
    this.getList()
    fetchList('category/rebuild', { type: 'web-content' }).then(res => {
      this.catOptions = res.data.first.list.map(v => v.name)
      this.catOptions.push('暂未分类')
      this.subCatOptions = res.data.second.list.map(v => v.name)
      this.subCatOptions.push('暂未分类')
    })
  },
  methods: {
    deleteContent(id) {
      this.$confirm('此操作将永久删除该内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del('web-content', id).then(res => {
          this.$message.success('删除成功！')
          this.getList()
        })
      }).catch(() => {})
    },
    goToAddWContent(action, id = '') {
      this.$router.push({ path: `/website-mgmt/website-content/${action}/${id}` })
    },
    getList() {
      this.listLoading = true
      fetchList('web-content', this.listQuery).then(response => {
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
