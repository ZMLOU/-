<template>
  <div class="menu-edit">
    <!-- 将添加功能封装到了单独组件 ./components/CreateOrEdit.vue 中 -->
    <create-or-edit :isEdit=true></create-or-edit>
  </div>
</template>

<script>
import CreateOrEdit from './components/create-or-edit'
export default {
  name: 'MenuEdit',
  components: {
    CreateOrEdit
  }
}
</script>

<style lang="scss" scoped></style>
