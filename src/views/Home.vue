<template>
  <div class="home">
    <van-grid :column-num="3">
      <van-grid-item v-for="item in grid" :key="item.name" icon="photo-o" :text="item.name" @click="toPath(item.path)" />
    </van-grid>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {
    // HelloWorld
  },
  data() {
    return {
      show: false,
      grid: [
        {
          name: '考核管理',
          path: 'assess/list'
        },
        {
          name: '指标管理',
          path: 'indicator/router'
        },
        {
          name: '评价管理',
          path: 'template/list'
        },
        {
          name: '物资管理',
          path: 'material/list'
        },
        {
          name: '房间管理',
          path: 'room/list'
        },
        {
          name: '我的任务',
          path: 'task/list'
        },
      ]
    }
  },
  created() {
  },
  methods: {
    toPath(path) {
      this.$router.push(path);
    }
  }
}
</script>
<style scoped lang="less">
.home {
  .btn {
    color: #000;
  }
}
</style>
