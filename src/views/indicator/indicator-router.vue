<template>
    <div>
        <van-nav-bar
          :title="$t('indicator.indicatorManage')"
          left-arrow
          @click-left="$back"
          :safe-area-inset-top="true"
          :placeholder="true"
          :fixed="true"
        >
          <template #left>
              <van-icon name="arrow-left" size="22" color="#060C19" />
          </template>
      </van-nav-bar>
        <van-grid clickable :column-num="2">
            <van-grid-item text="指标列表" icon="label-o" to="/indicator/list" />
            <van-grid-item text="全国指标" icon="label-o" to="/indicator/query" />
        </van-grid>
    </div>
</template>

<script>
export default {
    name: 'indicator-router',
    data() {
        return {
        };
    },
    created() {},
    methods: {}
}

</script>
<style lang='scss' scoped>
</style>