<template>
  <div class="app-container calendar-list-container">
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
        label="头像">
      </el-table-column>
      <el-table-column
        prop="pname"
        label="昵称">
      </el-table-column>
      <el-table-column
        prop="stdPhone"
        label="手机号码">
      </el-table-column>
      <el-table-column
        prop="meta.joinAt"
        label="注册时间">
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template scope="scope">
          <el-button type="text" icon="edit">编辑</el-button>
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
        limit: 20
      },
      tableKey: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
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
    }
  }
}
</script>
