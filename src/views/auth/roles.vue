<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="plus" @click="addRole('add')">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" :element-loading-text="loadingText" border fit stripe highlight-current-row style="width: 100%" max-height="600">
      <el-table-column
        width="65"
        align="center"
        label="编号">
        <template scope="scope">
          <span>{{scope.$index+1+(listQuery.page-1)*listQuery.limit}}</span>
        </template>
      </el-table-column>
      
      <el-table-column
        prop="name"
        label="角色名称">
      </el-table-column>
      
      <el-table-column
        label="报名管理">
        <template scope="scope">
          <span v-if="scope.row.body">
            {{scope.row.body['joiner-mgmt']}}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column
        label="推荐管理">
        <template scope="scope">
          <span v-if="scope.row.body">
            {{scope.row.body['carousel-mgmt']}}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column
        label="网站管理">
        <template scope="scope">
          <span v-if="scope.row.body">
            {{scope.row.body['website-mgmt']}}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column
        label="微信管理">
        <template scope="scope">
          <span v-if="scope.row.body">
            {{scope.row.body['wechat-mgmt']}}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column
        label="素材管理">
        <template scope="scope">
          <span v-if="scope.row.body">
            {{scope.row.body['material-mgmt']}}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column
        label="分类管理">
        <template scope="scope">
          <span v-if="scope.row.body">
            {{scope.row.body['category-mgmt']}}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column
        label="用户管理">
        <template scope="scope">
          <span v-if="scope.row.body">
            {{scope.row.body['user-mgmt']}}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column
        label="账号管理">
        <template scope="scope">
          <span v-if="scope.row.body">
            {{scope.row.body['auth']}}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="操作" width="300">
        <template scope="scope">
          <el-button type="text" icon="edit" @click="addRole('edit', scope.row._id)">编辑</el-button>
          <el-button type="text" icon="delete" @click="deleteRole(scope.row._id)">删除</el-button>
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
import { fetchList, del } from '@/api/role'
import waves from '@/directive/waves/index.js' // 水波纹指令

export default {
  name: 'roles-table',
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      loadingText: '拼命加载中...',
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
    deleteRole(id) {
      this.$confirm('此操作将永久删除该角色，并导致相关管理员无法登陆，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        this.loadingText = '正在删除...'
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
    addRole(action, _id = '') {
      this.$router.push({ path: `/auth/roles/${action}/${_id}` })
    },
    getList() {
      this.listLoading = true
      this.loadingText = '拼命加载中...'
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
