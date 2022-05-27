<template>
  <div class="alloc-menu">
    <el-card>
      <el-tree
      ref="menu-tree"
      node-key="id"
      :data="menus"
      :props="defaultProps"
      :default-expand-all="true"
      :default-checked-keys="checkedKeys"
      show-checkbox></el-tree>
      <div style="margin: 20px;">
        <el-button @click="resetChecked">清空</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu'
export default {
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  name: 'AllocMenu',
  data () {
    return {
      menus: [],
      // 选中菜单的id
      checkedKeys: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      }
    }
  },
  created () {
    this.loadMenu()
    this.loadRoleMenus()
  },
  methods: {
    resetChecked () {
      this.$refs['menu-tree'].setCheckedKeys([])
    },
    getCheckedKeys (menus) {
      menus.forEach(menu => {
        if (menu.subMenuList) {
          return this.getCheckedKeys(menu.subMenuList)
        }
        if (menu.selected) {
          this.checkedKeys = [...this.checkedKeys, menu.id]
        }
      })
    },
    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      if (data.code === '000000') {
        this.getCheckedKeys(data.data)
      }
    },
    async loadMenu () {
      const { data } = await getMenuNodeList()
      this.menus = data.data
    },
    async onSave () {
      const { data } = await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList: this.$refs['menu-tree'].getCheckedKeys()
      })
      if (data.code === '000000') {
        this.$message.success('分配成功')
        this.$router.push('/role')
      }
    },
    handleNodeClick (data) {
      console.log(data)
    }
  }
}
</script>
<style lang="scss" scoped></style>
