<template>
  <div class="resource-list">
    <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-form ref="form" :model="form" label-width="80px" :inline="true">
        <el-form-item label="资源名称" prop="name">
          <el-input
          v-model="form.name"
          clearable
          placeholder="请输入资源名称"></el-input>
        </el-form-item>
        <el-form-item label="资源路径" prop="url">
          <el-input
          v-model="form.url"
          clearable
          placeholder="请输入资源路径"></el-input>
        </el-form-item>
        <el-form-item label="资源分类" prop="categoryId">
          <el-select
          v-model="form.categoryId"
          placeholder="全部"
          clearable
          >
            <el-option
            v-for="item in resourceCategories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button size="mini" @click="onSet" :disabled="isLoading">重置</el-button>
          <el-button type="primary" size="mini" @click="onSubmit" :disabled="isLoading">查询搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="resources"
      style="width: 100%">
      <el-table-column
        type="index"
        label="编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="资源名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="url"
        label="资源路径">
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        width="180">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="添加时间"
        width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | dateFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button @click="handlDelete(scope.$index, scope.row)" size="small">删除</el-button>
          <el-button @click="handlEdit(scope.$index, scope.row)" type="danger" size="small">编辑</el-button>
      </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="form.current"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="form.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
      :disabled="isLoading">
    </el-pagination>
  </el-card>
  </div>
</template>

<script>
import { getResourcePages, getResourceCategories } from '@/services/resource'
export default {
  name: 'ResourceList',
  data () {
    return {
      // 用于存储资源列表数据
      resources: [],
      form: {
        name: '',
        url: '',
        categoryId: '',
        current: 1,
        size: 10
      },
      // 数据总数
      totalCount: 0,
      // 存储资源分类信息
      resourceCategories: [],
      // 用于保存加载状态
      isLoading: false
    }
  },
  created () {
    this.loadAllResource()
    this.loadResourceCategories()
  },
  methods: {
    async loadAllResource () {
      this.isLoading = true
      const { data } = await getResourcePages(this.form)
      this.resources = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false
    },
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      if (data.code === '000000') {
        this.resourceCategories = data.data
      }
    },
    onSubmit () {
      this.form.current = 1
      this.loadAllResource()
    },
    onSet () {
      this.$refs.form.resetFields()
    },
    handleSizeChange (val) {
      this.form.current = 1
      this.form.size = val
      this.loadAllResource()
    },
    handleCurrentChange (val) {
      this.form.current = val
      this.loadAllResource()
    },
    handlDelete (index, rowData) {
      // this.$confirm('确认删除吗?', '删除提示')
      //   .then(async () => {
      //     const { data } = await deleteMenu(rowData.id)
      //     if (data.code === '000000') {
      //       this.$message.success('删除成功')
      //       this.loadAllMenu()
      //     }
      //   })
      //   .catch(() => {
      //     this.$message.info('已取消删除')
      //   })
    },
    handlEdit (index, rowData) {
      // this.$router.push({
      //   name: ' resource-edit',
      //   params: {
      //     id: rowData.id
      //   }
      // })
    }
  },
  filters: {
    // 日期过滤器
    dateFormat (date) {
      date = new Date(date)
      return `
        ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 
        ${date.getHours()}:${date.getMinutes()}:${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}
      `
    }
  }
}
</script>

<style lang="scss" scoped></style>
