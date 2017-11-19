<template>
  <div class="tab-container" v-loading="bodyLoading" element-loading-text="请给我点时间...">
    <el-tabs style='margin-top:15px;' v-model="activeName">
      <el-tab-pane v-for="item in tabMapOptions" :label="item.label" :key='item.key' :name="item.key">
        <keep-alive>
          <tab-pane v-if='activeName==item.key' :type='item.key' @edit='handleEdit' @preview="handlePreviewImg" @updatePic="handleUpdatePic" @dataList="list = $event"></tab-pane>
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
      top="5%"
      :visible.sync="showUploadDialog"
      :before-close="cancelUploading">
      <div class="editor-container">
        <dropzone v-on:dropzone-removedFile="dropzoneR" :maxFiles="1" v-on:dropzone-success="dropzoneS" v-loading="uploadLoading" element-loading-text="正在上传..." @uploadBegin="showUploadLoading" id="myVueDropzone" :url="QINIU_UPLOAD_DOMAIN"></dropzone>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUploading">取 消</el-button>
        <el-button type="primary" :disabled="!newImgURL" @click="updatingImg">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编 辑" 
      size="tiny"
      :visible.sync="showDialog" 
      :before-close="clearDialog">
      
      <div class="app-container calendar-list-container">
        <div class="filter-container">
          <el-input @keyup.enter.native="getList" style="width: 200px;" class="filter-item" placeholder="学员姓名" v-model="listQuery.keyword">
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
              <span>{{scope.row.stdName}}</span>
              <i class="el-icon-check success" v-show="selectWhichOne.id === scope.row.id"></i>
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

  import { fetchList } from '@/api/joiner'

  export default {
    name: 'tabEdit',
    components: { tabPane, Dropzone },
    directives: {
      waves
    },
    data() {
      return {
        QINIU_UPLOAD_DOMAIN: process.env.QINIU_UPLOAD_DOMAIN,
        newImgURL: '',
        targetId: 0,
        showUploadDialog: false,
        showPreview: false,
        previewURL: '',
        bodyLoading: false,
        tabMapOptions: [
          { label: '司法考试轮播', key: 'indexCarousels' },
          { label: '名师阵容', key: 'recommendedLesson' }
        ],
        activeName: 'indexCarousels',
        showDialog: false,
        dialogList: null,
        list: null,
        listLoading: false,
        listQuery: {
          title: '',
          type: ''
        },
        ptypeOptions: [{ label: '网站内容', key: '' }, { label: '精品课程', key: 'lesson' }, { label: '新闻中心', key: 'news' }, { label: '教师资格', key: 'teacher_qe' }, { label: '司法考试', key: 'judcial_exam' }],
        tableKey: 0,
        selectWhichOne: {},
        uploadLoading: false
      }
    },
    methods: {
      showUploadLoading() {
        this.uploadLoading = true
      },
      updatingImg() {
        this.bodyLoading = true
        this.showUploadDialog = false
  
        // 模拟接口提交
        const _this = this
        setTimeout(() => {
          _this.list.map(v => {
            if (v.id === _this.targetId) {
              v.post = process.env.QINIU_DOWNLOAD_DOMAIN + _this.newImgURL
              _this.bodyLoading = false
              _this.targetId = 0
              _this.newImgURL = ''
            }
          })
        }, 1500)
      },
      dropzoneS(file) {
        this.uploadLoading = false
        this.newImgURL = JSON.parse(file.xhr.response).hash
        this.$message({ message: '上传成功', type: 'success' })
      },
      dropzoneR(file) {
        this.$message({ message: '删除成功', type: 'success' })
      },
      closeUploadDialog() {
        this.showUploadDialog = false
        this.targetId = 0
        this.newImgURL = ''
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
      closePreview() {
        this.showPreview = false
        this.previewURL = ''
      },
      closeDialog() {
        this.dialogList = []
        this.showDialog = false
        this.selectWhichOne = {}
      },
      clearDialog() {
        if (this.selectWhichOne && this.selectWhichOne.id) {
          this.$confirm('确认关闭？')
            .then(_ => {
              this.closeDialog()
            })
            .catch(_ => {})
          return
        }

        this.closeDialog()
      },
      submitDialog() {
        this.bodyLoading = true
        // console.log(this.selectWhichOne)
        this.closeDialog()

        // 模拟借口调用
        setTimeout(() => {
          this.bodyLoading = false
          this.$message.success('修改成功啦！')
        }, 2000)
      },
      handleEdit(e) {
        // console.log(e)
        this.showDialog = true
      },
      handleSelectAction(crow, oldrow) {
        if (crow) {
          // console.log(crow)
          this.selectWhichOne = crow
        } else {
          this.selectWhichOne = {}
        }
      },
      getList() {
        this.listLoading = true
        this.selectWhichOne = {}
        fetchList(this.listQuery).then(response => {
          this.dialogList = response.data.data.list
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
