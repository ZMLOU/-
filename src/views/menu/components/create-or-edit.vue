<template>
  <div class="menu-create-or-edit">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ isEdit ? '编辑菜单' : '创建菜单'}}</span>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item
        prop="name"
        label="菜单名称"
        v-model="form.name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input v-model="form.href"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select
          v-model="form.parentId"
          placeholder="请选择上级菜单"
          >
            <el-option label="无上级菜单" :value="-1"></el-option>
            <el-option
            :label="item.name"
            :value="item.id"
            v-for="item in parentMenuList"
            :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="前端图标">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="form.shown">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="form.orderNum"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button
          v-if="!isEdit">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { saveOrUpdate, getEditMenuInfo } from '@/services/menu'
export default {
  name: 'CreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      // 默认为添加功能
      default: false
    }
  },
  data () {
    return {
      form: {
        parentId: -1,
        name: '',
        href: '',
        icon: '',
        orderNum: 0,
        description: '',
        shown: false
      },
      // 存储上级菜单信息
      parentMenuList: [],
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.loadMenuInfo()
  },
  methods: {
    async onSubmit () {
      const { data } = await saveOrUpdate(this.form)
      console.log(data)
      // 检测是否提交成功
      if (data.code === '000000') {
        this.$message.success('添加成功')
        this.$router.push({
          name: 'menu'
        })
      }
    },
    async loadMenuInfo () {
      const id = this.$route.params.id || -1
      const { data } = await getEditMenuInfo(id)
      if (data.data.menuInfo) {
        this.form = data.data.menuInfo
      }
      if (data.code === '000000') {
        this.parentMenuList = data.data.parentMenuList
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
