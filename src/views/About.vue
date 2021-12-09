<template>
    <div class="btn">
      <van-button type="primary" block @click="toAdd">新增指标</van-button>
    </div>
</template>

<script>
export default {
    name: '',
    data() {
      return {
        value: ''
      };
    },
    created() {
      
    },
    methods: {
      toAdd() {
        this.$router.push('form');
      }
    }
}

</script>
<style lang='less' scoped>
.btn {
  padding: 20px;
}
</style>