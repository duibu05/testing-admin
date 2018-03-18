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
import { save, fetchList } from '@/api/restful'

export default {
  components: { uploadExcel },
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    buildPaper(data) {
      const paper = {
        title: data.results[0]['试卷标题'],
        firstCat: {
          id: '',
          name: data.results[0]['初级分类']
        },
        secondCat: {
          id: '',
          name: data.results[0]['次级分类']
        },
        thirdCat: {
          id: '',
          name: data.results[0]['三级分类']
        },
        fourthCat: {
          id: '',
          name: data.results[0]['四级分类']
        }
      }
      const questionKeyMap = {
        title: '试题标题',
        body: '题干',
        firstCat: '试题分类',
        secondCat: '题型分类',
        rightAnswer: '正确答案',
        analysis: '试题分析',
        points: '试题分数',
        answers: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
      }
      const qArr = []
      const questions = data.results

      for (let i = 0, len = questions.length; i < len; i++) {
        const obj = {
          title: questions[i][questionKeyMap.title],
          points: +questions[i][questionKeyMap.points],
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

      paper.questions = qArr

      return paper
    },
    selected(data) {
      this.tableData = data.results
      this.tableHeader = data.header
      const paper = this.buildPaper(data)
      const pArr = []
      const rArr = []
      const cArr = []
      for (let i = 0, len = paper.questions.length; i < len; i++) {
        pArr.push(save('question/upload', paper.questions[i]).catch(e => {
          cArr.push({
            index: i,
            error: e
          })
        }))
        rArr.push(`p${i}`)
      }

      Promise.all(pArr).then((rArr) => {
        Promise.all([
          fetchList('category', { type: 'shijuan', level: 'first', name: paper.firstCat.name }),
          fetchList('category', { type: 'shijuan', level: 'second', name: paper.secondCat.name }),
          fetchList('category', { type: 'shijuan', level: 'third', name: paper.thirdCat.name }),
          fetchList('category', { type: 'shijuan', level: 'fourth', name: paper.fourthCat.name })
        ]).then(([p1, p2, p3, p4]) => {
          const pObj = {
            title: data.results[0]['试卷标题'],
            firstCat: {
              id: p1.data.list[0]._id,
              name: data.results[0]['初级分类']
            },
            secondCat: {
              id: p2.data.list[0]._id,
              name: data.results[0]['次级分类']
            },
            thirdCat: {
              id: p3.data.list[0]._id,
              name: data.results[0]['三级分类']
            },
            fourthCat: {
              id: p4.data.list[0]._id,
              name: data.results[0]['四级分类']
            },
            image: 'https://cdn.gdpassing.com/FgsvWqXmgOu8RLvUd4usTL0M7iec',
            questions: []
          }

          for (let i = 0, len = rArr.length; i < len; i++) {
            if (rArr[i]) {
              pObj.questions.push({
                id: rArr[i].data._id,
                title: rArr[i].data.title,
                firstCat: rArr[i].data.firstCat.name,
                secondCat: rArr[i].data.secondCat.name,
                points: +paper.questions[i].points
              })
            }
          }
          if (pObj.questions.length) {
            save('paper', pObj).then(res => {
              if (cArr.length) {
                return this.$notify({
                  title: '错误',
                  message: '上传过程中发生错误，部分试题上传失败，请检查: 第' + cArr.map(v => v.index + 1).join(',') + '行， 以上行数上传失败，请修改后手动添加，本试卷及其他试题上传成功！',
                  type: 'error',
                  duration: 0
                })
              }
              return this.$notify({
                title: '成功',
                message: '试卷上传成功！',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            this.$notify({
              title: '错误',
              message: '上传过程中发生错误，请重试！',
              type: 'error',
              duration: 0
            })
          }
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
