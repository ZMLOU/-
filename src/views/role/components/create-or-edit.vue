<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="角色名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="角色编码">
        <el-input v-model="form.code"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { saveOrUpdate, getRoleById } from '@/services/role'
export default {
  name: 'CreateOrEdit',
  props: {
    isEdit: {
      default: false,
      type: Boolean
    },
    roleId: {
      type: Number
    }
  },
  data () {
    return {
      form: {
        name: '',
        code: '',
        description: ''
      }
    }
  },
  created () {
    if (this.isEdit) {
      this.loadRole()
    }
  },
  methods: {
    async loadRole () {
      const { data } = await getRoleById(this.roleId)
      if (data.code === '000000') {
        this.form = data.data
      }
    },
    async onSubmit () {
      const { data } = await saveOrUpdate(this.form)
      if (data.code === '000000') {
        this.$message.success('提交成功')
        // 子组件出发事件
        this.$emit('success')
        // 清空form
        this.form = {}
      }
    },
    onCancel () {
      this.$emit('cancel')
      this.form = {}
    }
  }
}
</script>

<style lang="scss" scoped></style>
