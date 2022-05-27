<template>
  <div class="role-list">
    <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-form ref="form" :model="form" label-width="80px" :inline="true">
        <el-form-item label="角色名称" prop="name">
          <el-input
          v-model="form.name"
          clearable
          placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button size="mini" @click="onSet" :disabled="isLoading">重置</el-button>
          <el-button type="primary" size="mini" @click="onSubmit" :disabled="isLoading">查询搜索</el-button>
        </el-form-item>
        <el-button @click="handleAdd">添加角色</el-button>
      </el-form>
    </div>
    <el-table
      :data="roles"
      style="width: 100%">
      <el-table-column
        type="index"
        label="编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="角色名称"
        width="180">
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
          <el-button @click="$router.push({name: 'alloc-menu', params: {roleId: scope.row.id}})" size="small" type="text">分配菜单</el-button>
          <el-button @click="handlEdit(scope.$index, scope.row)" size="small" type="text">分配资源</el-button>
          <el-button @click="handlDelete(scope.$index, scope.row)" size="small" type="text">删除</el-button>
          <el-button @click="handlEdit(scope.$index, scope.row)" size="small" type="text">编辑</el-button>
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
  <el-dialog
    :title="isEdit ? '编辑角色' : '添加角色'"
    :visible.sync="dialogVisible"
    width="30%">
    <create-or-edit
    :is-edit="isEdit"
    :role-id="roleId"
    @success="onSuccess"
    @cancel="onCancel"></create-or-edit>
  </el-dialog>
  </div>
</template>

<script>
import createOrEdit from './create-or-edit'
import { getRoles, deleteRoles } from '@/services/role'
export default {
  components: { createOrEdit },
  name: 'ResourceList',
  data () {
    return {
      // 用于存储资源列表数据
      roles: [],
      form: {
        name: '',
        current: 1,
        size: 10
      },
      // 数据总数
      totalCount: 0,
      // 用于保存加载状态
      isLoading: false,
      // 用于控制dialog组件是否显示
      dialogVisible: false,
      // 是否是编辑页面
      isEdit: false,
      // 当前编辑的角色id
      roleId: null
    }
  },
  created () {
    this.loadAllRoles()
  },
  methods: {
    // 点击添加按钮触发
    handleAdd () {
      this.dialogVisible = true
      this.isEdit = false
    },
    async loadAllRoles () {
      this.isLoading = true
      const { data } = await getRoles(this.form)
      this.roles = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false
    },
    onSubmit () {
      this.form.current = 1
      this.loadAllRoles()
    },
    onSet () {
      this.$refs.form.resetFields()
    },
    onSuccess () {
      this.dialogVisible = false
      this.loadAllRoles()
    },
    onCancel () {
      this.dialogVisible = false
    },
    handleSizeChange (val) {
      this.form.current = 1
      this.form.size = val
      this.loadAllRoles()
    },
    handleCurrentChange (val) {
      this.form.current = val
      this.loadAllRoles()
    },
    handlDelete (index, rowData) {
      this.$confirm('确认删除吗?', '删除提示')
        .then(async () => {
          const { data } = await deleteRoles(rowData.id)
          if (data.code === '000000') {
            this.$message.success('删除成功')
            this.loadAllRoles()
          }
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    handlEdit (index, role) {
      this.dialogVisible = true
      this.isEdit = true
      this.roleId = role.id
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
