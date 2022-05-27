<template>
  <div class="user">用户
    <user-list></user-list>
  </div>
</template>

<script>
import UserList from './components/list.vue'
export default {
  name: 'UserIndex',
  components: {
    UserList
  }
}
</script>

<style lang="scss" scoped></style>
