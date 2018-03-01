<template>
  <div class="tab-container" v-loading="bodyLoading" element-loading-text="请给我点时间...">
    <el-tabs style='margin-top:15px;' v-model="activeName">
      <el-tab-pane v-for="item in tabMapOptions" :label="item.label" :key='item.key' :name="item.key">
        <keep-alive>
          <tab-pane v-if='activeName==item.key' :retrivew="retrivew" :page="page" :cat='item.key' @edit='handleEdit' @add="handleAdd" @preview="handlePreviewImg" @updatePic="handleUpdatePic" @dataList="handleDataList" @resetRetrivew="resetRetrivew"></tab-pane>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="预 览" 
      top="5%"
      :visible.sync="showPreview" 
      :before-close="closePreview">
      <img :src="previewURL" alt="海报预览" class="full">
    </el-dialog>

    <el-dialog
      title="修改图片"
      size="tiny"
      top="5%"
      :visible.sync="showUploadDialog"
      :before-close="cancelUploading">
      <div class="editor-container">
        <dropzone :needClearDZFiles="clearDZFiles" :showRemoveLink="true" :maxFiles="1" v-on:dropzone-success="dropzoneS" v-loading="uploadLoading" element-loading-text="正在上传..." @uploadBegin="showUploadLoading" id="myVueDropzone" :url="QINIU_UPLOAD_DOMAIN"></dropzone>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUploading">取 消</el-button>
        <el-button type="primary" :disabled="!newImgURL" @click="updatingImg">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="editWhichOne.id ? '编 辑' : '新 增'" 
      size="small"
      :visible.sync="showDialog" 
      :before-close="clearDialog">
      
      <div class="app-container calendar-list-container">
        <div class="filter-container">
          <el-input @keyup.enter.native="getList" style="width: 200px;" class="filter-item" placeholder="请输入关键字" v-model="listQuery.keyword">
          </el-input>

          <el-select @change='getList' style="width: 120px" class="filter-item" v-model="listQuery.type" placeholder="类别">
            <el-option v-for="item in ptypeOptions" :key="item.key" :label="item.label" :value="item.key">
            </el-option>
          </el-select>

          <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">搜索</el-button>
        </div>

        <el-table :key='tableKey' :data="dialogList" v-loading="listLoading" element-loading-text="拼命加载中..." border fit stripe highlight-current-row style="width: 100%" 
        max-height="300" @current-change="handleSelectAction">
          <el-table-column
            label="标题">
            <template scope="scope">
              <span>{{scope.row.title}}</span>
              <i class="el-icon-check success" v-show="selectWhichOne._id === scope.row._id"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="clearDialog">取 消</el-button>
        <el-button type="primary" :disabled="!selectWhichOne" @click="submitDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import tabPane from './components/webIndexTabPane'
  import Dropzone from '@/components/Dropzone'

  import waves from '@/directive/waves/index.js' // 水波纹指令

  import { fetchList, update, save } from '@/api/restful'

  export default {
    name: 'tabEdit',
    components: { tabPane, Dropzone },
    directives: {
      waves
    },
    data() {
      return {
        clearDZFiles: false,
        QINIU_UPLOAD_DOMAIN: process.env.QINIU_UPLOAD_DOMAIN,
        newImgURL: '',
        targetId: 0,
        showUploadDialog: false,
        showPreview: false,
        previewURL: '',
        bodyLoading: false,
        tabMapOptions: [
          { label: '教师资格轮播', key: 'carousels' },
          { label: '名师阵容', key: 'famousTeacher' }
        ],
        activeName: 'carousels',
        showDialog: false,
        dialogList: null,
        list: null,
        listLoading: false,
        listQuery: {
          type: 'web-content'
        },
        ptypeOptions: [{ label: '网站内容', key: 'web-content' }, { label: '精品课程', key: 'lesson' }, { label: '新闻中心', key: 'news' }],
        tableKey: 0,
        selectWhichOne: {},
        editWhichOne: {},
        uploadLoading: false,
        page: 'teacherQE',
        dataList: [],
        retrivew: 0
      }
    },
    methods: {
      showUploadLoading() {
        this.uploadLoading = true
        this.clearDZFiles = false
      },
      updatingImg() {
        this.bodyLoading = true
        this.showUploadDialog = false
  
        this.updateItem(this.targetId, {
          post: process.env.QINIU_DOWNLOAD_DOMAIN + this.newImgURL
        })
      },
      dropzoneS(file) {
        this.newImgURL = JSON.parse(file.xhr.response).hash
        this.uploadLoading = false
        this.$message({ message: '上传成功', type: 'success' })
      },
      closeUploadDialog() {
        this.showUploadDialog = false
        this.targetId = 0
        this.newImgURL = ''
        this.clearDZFiles = true
      },
      cancelUploading() {
        this.$confirm('确认关闭？')
            .then(_ => {
              this.closeUploadDialog()
            })
            .catch(_ => {})
      },
      handleUpdatePic(id) {
        this.showUploadDialog = true
        this.targetId = id
      },
      handlePreviewImg(url) {
        this.showPreview = true
        this.previewURL = url
      },
      handleDataList(list) {
        this.dataList = list
      },
      closePreview() {
        this.showPreview = false
        this.previewURL = ''
      },
      closeDialog() {
        this.dialogList = []
        this.showDialog = false
        this.selectWhichOne = {}
      },
      clearDialog(done) {
        if (this.selectWhichOne && this.selectWhichOne.id) {
          this.$confirm('确认关闭？')
            .then(_ => {
              this.closeDialog()
              done()
            })
            .catch(_ => {})
          return
        }

        this.closeDialog()
      },
      resetRetrivew() {
        this.retrivew = 0
      },
      submitDialog() {
        this.bodyLoading = true
        this.updateItem(this.editWhichOne.id, {
          title: this.selectWhichOne.title,
          type: this.listQuery.type,
          target_id: this.selectWhichOne._id
        })
        this.closeDialog()
      },
      updateItem(id, data) {
        let req
        if (id) {
          req = update('recommended-mgmts', id, data)
        } else {
          data.post = 'http://cdn.gdpassing.com/FoTy_372n_9CQp2_r3r_jY3Kt3uJ'
          data.page = this.page
          data.cat = 'famousTeacher'
          req = save('recommended-mgmts', data)
        }
        req.then(res => {
          const str = id ? '修改' : '新增'
          this.$message.success(str + '成功！')
          this.bodyLoading = false
          this.retrivew = 1
          this.clearDZFiles = true
        })
      },
      handleAdd() {
        this.showDialog = true
        this.editWhichOne = {}
      },
      handleEdit(e) {
        this.showDialog = true
        this.editWhichOne = e
      },
      handleSelectAction(crow, oldrow) {
        if (crow) {
          this.selectWhichOne = crow
        } else {
          this.selectWhichOne = {}
        }
      },
      getList() {
        this.listLoading = true
        this.selectWhichOne = {}
        fetchList(this.listQuery.type, { keyword: this.listQuery.keyword }).then(response => {
          this.dialogList = response.data.list
          this.listLoading = false
        })
      }
    }
  }
</script>

<style scoped>
  .tab-container{
    margin: 30px;
  }
  .success{
    color: #13CE66;
  }
  .full{
    width: 100%;
  }
</style>
