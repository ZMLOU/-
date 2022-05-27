<template>
  <div class="course-section">
    <el-card>
      <div slot="header">课程名称</div>
      <el-tree
        v-loading="isLoading"
        :data="sectionAndLessons"
        :props="defaultProps"
        draggable
        :allow-drop="handleAllowDrop"
        @node-drop="handleDrop">
          <span class="inner" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span v-if="data.sectionName" class="action">
              <el-button>编辑</el-button>
              <el-button>添加课时</el-button>
              <el-button>状态</el-button>
            </span>
            <span v-else class="action">
              <el-button>编辑</el-button>
              <el-button @click="$router.push({name: 'course-video', param: courseId, query: {
                lessonId: data.id
              }})">上传视频</el-button>
              <el-button>状态</el-button>
            </span>
          </span>
        </el-tree>
    </el-card>
  </div>
</template>

<script>
import { getSectionAndLesson, saveOrUpdateSection, saveOrUpdateLesson } from '@/services/course-section'
export default {
  // 设置路由后，通过props接收路由参数
  props: {
    courseId: {
      type: [Number, String],
      required: true
    }
  },
  name: 'CourseSection',
  data () {
    return {
      isLoading: false,
      sectionAndLessons: [],
      defaultProps: {
        children: 'lessonDTOS',
        label (data) {
          return data.sectionName || data.theme
        }
      }
    }
  },
  created () {
    this.loadSectionAndLesson()
  },
  methods: {
    async handleDrop (draggingNode, dropNode) {
      try {
        this.isLoading = true
        await Promise.all(dropNode.parent.childNodes.map((item, index) => {
          // 遍历章节
          if (draggingNode.data.sectionId) {
            return saveOrUpdateLesson({
              id: item.data.id,
              orderNum: index
            })
            // // 遍历课时
          } else {
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index
            })
          }
        }))
        this.$message.success('数据更新成功')
      } catch (err) {
        console.log(err)
        this.$message.info('数据更新失败', err)
      }
      this.isLoading = false
    },
    handleAllowDrop (draggingNode, dropNode, type) {
      return type !== 'inner' && draggingNode.data.sectionId === dropNode.data.sectionId
    },
    async loadSectionAndLesson () {
      const { data } = await getSectionAndLesson(this.courseId)
      this.sectionAndLessons = data.data
    }
  }
}
</script>

<style lang="scss" scoped>
.inner {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
}

::v-deep .el-tree-node__content {
  height: auto;
}
</style>
