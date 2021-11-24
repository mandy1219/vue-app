<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <van-button type="primary">主要按钮</van-button>
    <van-cell-group>
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" label="描述信息" />
    </van-cell-group>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    // HelloWorld
  },
  created() {
    // this.$api.post('/v1/indicators.list')
    //   .then(res => {
    //       console.log(res);
    //   })
  },
}
</script>
<style scoped lang="less">
.home {
  .btn {
    color: #000;
  }
}
</style>
