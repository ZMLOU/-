<template>
  <div class="user-list">
    <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-form ref="form" :model="filterParams" label-width="80px" :inline="true">
        <el-form-item label="手机号" prop="phone">
          <el-input
          v-model="filterParams.phone"
          clearable
          placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="注册时间" prop="rangeDate">
          <el-date-picker
            v-model="filterParams.rangeDate"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item style="float: right">
          <el-button size="mini" @click="onSubmit" :disabled="isLoading">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="users"
      style="width: 100%">
      <el-table-column
        type="index"
        label="用户ID"
        width="160">
      </el-table-column>
      <el-table-column
        label="头像"
        width="120">
        <template slot-scope="scope">
          <img width="30px" :src="scope.row.portrait || 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'">
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="用户名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="注册时间"
        width="180">
        <!-- <template slot-scope="scope">
          <span>{{ scope.row.createTime | dateFormat }}</span>
        </template> -->
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="180">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="ENABLE"
            inactive-value="DISABLE"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleForbidUser(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleSelectRole(scope.row)"
          >分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
     <!-- 设置分配角色的 Dialog 组件 -->
    <el-dialog
      title="分配角色"
      :visible.sync="dialogVisible"
      width="50%">
      <!-- 下拉菜单组件位置 -->
      <el-select v-model="roleIdList" multiple placeholder="请选择">
        <el-option
          v-for="item in roles"
          :key="item.value"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAllocRole">确 定</el-button>
      </span>
    </el-dialog>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="filterParams.current"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="filterParams.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
      :disabled="isLoading">
    </el-pagination>
  </el-card>
  </div>
</template>

<script>
import { getUserPages, forbidUser } from '@/services/user'
import { allocateUserRoles, getAllRoles, getUserRoles } from '@/services/role'
export default {
  name: 'UserList',
  data () {
    return {
      // 用于存储资源列表数据
      users: [],
      filterParams: {
        currentPage: 1,
        pageSize: 100,
        phone: '',
        startCreateTime: '',
        endCreateTime: '',
        rangeDate: []
      },
      // 数据总数
      totalCount: 0,
      // 用于保存加载状态
      isLoading: false,
      // 用于控制dialog组件是否显示
      dialogVisible: false,
      // 下拉菜单数据
      roles: [],
      // 选中选项的 ID 组成的数组
      roleIdList: [],
      // 当前要进行角色分配的用户 ID
      currentRoleID: null
    }
  },
  created () {
    this.loadUsersPages()
  },
  methods: {
    // 点击用户的分配角色按钮
    async handleSelectRole (userInfo) {
      this.currentRoleID = userInfo.id
      // 显示分配角色对话框
      this.dialogVisible = true
      // 请求所有角色列表数据
      const { data } = await getAllRoles()
      if (data.code === '000000') {
        this.roles = data.data
      }
      // 请求当前用户的已分配角色信息
      const { data: data2 } = await getUserRoles(userInfo.id)
      console.log(data2)
      if (data2.code === '000000') {
        this.roleIdList = data2.data.map(item => item.id)
      }
    },
    // 点击添加按钮触发
    async handleForbidUser (index, user) {
      this.isLoading = true
      const { data } = await forbidUser(user)
      console.log(data)
      this.isLoading = false
    },
    async handleAllocRole () {
      const { data } = await allocateUserRoles({
        userId: this.currentRoleID,
        roleIdList: this.roleIdList
      })
      if (data.code === '000000') {
        // 关闭对话框
        this.dialogVisible = false
        // 提示提交成功
        this.$message.success('提交成功')
      }
    },
    async loadUsersPages () {
      this.isLoading = true
      const { data } = await getUserPages(this.filterParams)
      this.users = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false
    },
    onSubmit () {
      this.filterParams.current = 1
      this.loadUsersPages()
    },
    onSuccess () {
      this.dialogVisible = false
      this.loadUsersPages()
    },
    onCancel () {
      this.dialogVisible = false
    },
    handleSizeChange (val) {
      this.filterParams.current = 1
      this.filterParams.size = val
      this.loadAllUsers()
    },
    handleCurrentChange (val) {
      this.filterParams.current = val
      this.loadAllUsers()
    },
    handlDelete (index, rowData) {
      // this.$confirm('确认删除吗?', '删除提示')
      //   .then(async () => {
      //     const { data } = await deleteUsers(rowData.id)
      //     if (data.code === '000000') {
      //       this.$message.success('删除成功')
      //       this.loadAllUsers()
      //     }
      //   })
      //   .catch(() => {
      //     this.$message.info('已取消删除')
      //   })
    },
    handlEdit (index, role) {
      // this.dialogVisible = true
      // this.isEdit = true
      // this.roleId = role.id
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
