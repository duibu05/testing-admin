<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="内容标题" v-model="listQuery.title">
      </el-input>

      <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.cat" placeholder="内容分类">
        <el-option v-for="item in catOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>

      <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.subcat" placeholder="内容子类">
        <el-option v-for="item in subcatOptions" :key="item.key" :label="item.label" :value="item.key">
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
            <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="stdName"
        label="内容标题"
        width="500">
      </el-table-column>
      <el-table-column
        prop="pname"
        label="内容分类">
      </el-table-column>
      <el-table-column
        prop="joinFrom"
        label="内容子类">
      </el-table-column>
      <el-table-column
        prop="meta.joinAt"
        label="发布时间">
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template scope="scope">
          <el-button type="text" icon="edit" @click="goToAddWContent('edit')">编辑</el-button>
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
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        title: undefined,
        cat: undefined,
        subcat: undefined
      },
      catOptions: [{ label: '教师资格', key: '' }, { label: '司法考试', key: 'test' }, { label: '暂未分类', key: 'lesson' }],
      subcatOptions: [{ label: '资格介绍', key: '' }, { label: '暂未分类', key: 'test' }],
      tableKey: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    goToAddWContent(action) {
      this.$router.push({ path: '/website-mgmt/website-content/' + action })
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
