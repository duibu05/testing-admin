<template>
  <div class="app-container">
    <upload-excel @on-selected-file='selected'></upload-excel>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for='item of tableHeader' :prop="item" :label="item" :key='item'>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import uploadExcel from 'components/UploadExcel/index.vue'
import { save } from '@/api/restful'

export default {
  components: { uploadExcel },
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    buildQuestions(data) {
      const questionKeyMap = {
        title: '试题标题',
        body: '题干',
        firstCat: '试题分类',
        secondCat: '题型分类',
        rightAnswer: '正确答案',
        analysis: '试题分析',
        answers: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
      }
      const qArr = []
      const questions = data.results

      for (let i = 0, len = questions.length; i < len; i++) {
        const obj = {
          title: questions[i][questionKeyMap.title],
          body: questions[i][questionKeyMap.body],
          firstCat: { id: '', name: questions[i][questionKeyMap.firstCat] },
          secondCat: { id: '', name: questions[i][questionKeyMap.secondCat] },
          answers: (() => {
            const answersOpts = questionKeyMap.answers.filter(v => {
              if (questions[i][v]) {
                return true
              }

              return false
            })

            return answersOpts.map(v => ({ options: v, content: questions[i][v] }))
          })(),
          rightAnswer: questions[i][questionKeyMap.rightAnswer].split(/[,，]/),
          analysis: questions[i][questionKeyMap.analysis]
        }

        qArr.push(obj)
      }

      return qArr
    },
    selected(data) {
      this.tableData = data.results
      this.tableHeader = data.header
      const questions = this.buildQuestions(data)
      const pArr = []
      const rArr = []
      for (let i = 0, len = questions.length; i < len; i++) {
        pArr.push(save('question/upload', questions[i]))
        rArr.push(`p${i}`)
      }

      Promise.all(pArr).then((rArr) => {
        this.$notify({
          title: '成功',
          message: '上传成功！',
          type: 'success'
        })
      }).catch(() => {
        this.$notify({
          title: '错误',
          message: '上传过程中发生错误，部分试题可能上传失败！',
          type: 'error',
          duration: 0
        })
      })
    }
  }
}
</script>
