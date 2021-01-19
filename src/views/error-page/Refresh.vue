<template>
  <div>
    <!-- 刷新路由 -->
  </div>
</template>
<script>
export default {
  created() {
    const rot = this.$route.params.routeName;
    this.$router.replace({
      name: rot
    })
  },
}
</script>