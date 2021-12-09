<template>
  <div id="app">
    <!-- <van-tabs v-model="active" @click="onClick">
      <van-tab title="home"></van-tab>
      <van-tab title="about"></van-tab>
    </van-tabs> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: '',
  components: {
  },
  data() {
    return {
      active: 'home'
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style>
@import './assets/css/reset.less';
@import './assets/css/common.less';
body {
  background: #F3F4F8;
  font-size: 24px !important;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
}
</style>
