<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="试题名称" v-model="listQuery.keyword">
      </el-input>

      <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.cat" placeholder="试题分类">
        <el-option v-for="item in catOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>

      <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.qtype" placeholder="题型子类">
        <el-option v-for="item in qtypeOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>

      <el-select @change='handleFilter' style="width: 160px" class="filter-item" v-model="listQuery.sort" placeholder="排序">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="plus" @click="goToAddQuestion('add')">新增试题</el-button>
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
        label="试题名称"
        width="400">
      </el-table-column>
      <el-table-column
        prop="firstCat.name"
        label="试题分类">
      </el-table-column>
      <el-table-column
        prop="secondCat.name"
        label="题型分类">
      </el-table-column>
      <el-table-column
        prop="createdAt"
        label="创建时间">
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template scope="scope">
          <el-button type="text" icon="edit" @click="goToAddQuestion('edit', scope.row._id)">编辑</el-button>
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
import { fetchList } from '@/api/restful'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'questions-table',
  directives: {
    waves
  },
  data() {
    return {
      sortOptions: [{ label: '按创建时间升序', key: '+id' }, { label: '按创建时间降序', key: '-id' }],
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
        cat: undefined
      },
      catOptions: [],
      qtypeOptions: [],
      tableKey: 0
    }
  },
  created() {
    fetchList('category', { type: 'shiti', level: 'first' }).then(res => {
      this.catOptions = res.data.list.map(v => {
        const obj = {}
        obj.value = v._id
        obj.label = v.name

        return obj
      })
    })
    fetchList('category', { type: 'shiti', level: 'second' }).then(res => {
      this.qtypeOptions = res.data.list.map(v => {
        const obj = {}
        obj.value = v._id
        obj.label = v.name

        return obj
      })
    })
    this.getList()
  },
  methods: {
    goToAddQuestion(action, id = '') {
      this.$router.push({ path: `/wechat-mgmt/question-mgmt/${action}/${id}` })
    },
    getList() {
      this.listLoading = true
      fetchList('question', this.listQuery).then(response => {
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
