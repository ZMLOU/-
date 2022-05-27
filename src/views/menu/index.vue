<template>
  <div class="menu">
    <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>菜单列表</span>
    <el-button style="float: right; size: mini;" @click="$router.push({name: 'menu-create'})">添加菜单</el-button>
  </div>
  <el-table
      :data="menus"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="菜单名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="level"
        label="菜单级数">
      </el-table-column>
      <el-table-column
        prop="icon"
        label="前端图标">
      </el-table-column>
      <el-table-column
        prop="orderNum"
        label="排序">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button @click="handlDelete(scope.$index, scope.row)" size="small">删除</el-button>
          <el-button @click="handlEdit(scope.$index, scope.row)" type="danger" size="small">编辑</el-button>
      </template>
      </el-table-column>
    </el-table>
</el-card>
  </div>
</template>

<script>
import { getAllMenu, deleteMenu } from '@/services/menu'
export default {
  name: 'MenuCreate',
  data () {
    return {
      menus: []
    }
  },
  created () {
    this.loadAllMenu()
  },
  methods: {
    async loadAllMenu () {
      const { data } = await getAllMenu()
      this.menus = data.data
    },
    handlDelete (index, rowData) {
      this.$confirm('确认删除吗?', '删除提示')
        .then(async () => {
          const { data } = await deleteMenu(rowData.id)
          if (data.code === '000000') {
            this.$message.success('删除成功')
            this.loadAllMenu()
          }
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    handlEdit (index, rowData) {
      this.$router.push({
        name: 'menu-edit',
        params: {
          id: rowData.id
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
</style>
