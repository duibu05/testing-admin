<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="学员姓名" v-model="listQuery.keyword">
      </el-input>

      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="手机号码" v-model="listQuery.cellphone">
      </el-input>
      
      <el-select clearable @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery['joinIn.category']" placeholder="类别">
        <el-option v-for="item in ptypeOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="拼命加载中..." border fit stripe highlight-current-row style="width: 100%" max-height="600">
      <el-table-column
        width="65"
        align="center"
        label="序号">
        <template scope="scope">
          <span>{{scope.$index+1+(listQuery.page-1)*listQuery.limit}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="学员姓名">
      </el-table-column>
      <el-table-column
        prop="cellphone"
        label="手机号码">
      </el-table-column>
      <el-table-column
        prop="joinIn.category"
        label="分类">
      </el-table-column>
      <el-table-column
        prop="joinIn.sn"
        label="项目编号">
      </el-table-column>
      <el-table-column
        prop="joinIn.name"
        label="报名项目">
      </el-table-column>
      <el-table-column
        prop="from"
        label="报名渠道">
      </el-table-column>
      <el-table-column
        prop="joinAt"
        label="报名时间">
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
  name: 'joiner-table',
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
        cellphone: undefined,
        'joinIn.category': undefined
      },
      ptypeOptions: [{ label: '全部', key: '' }, { label: '考试辅导', key: '考试辅导' }],
      tableKey: 0
    }
  },
  created() {
    this.getList()
    fetchList('category/rebuild', { type: 'web-content' }).then(res => {
      res.data.first.list.forEach(v => {
        return this.ptypeOptions.push({
          label: v.name,
          key: v.name
        })
      })
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList('joiners', this.listQuery).then(response => {
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
