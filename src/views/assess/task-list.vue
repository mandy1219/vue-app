<template>
    <div>
        <van-nav-bar
            title="考核"
            left-arrow
            :right-text="$t('common.add')"
            @click-left="$back"
            @click-right="add"
            :safe-area-inset-top="true"
            :placeholder="true"
            :fixed="true"
         >
            <template #left>
               <van-icon name="arrow-left" size="22" color="#060C19" />
            </template>
            <template #right>
               <!-- <van-icon name="arrow-left" size="22" color="#060C19" /> -->
            </template>
        </van-nav-bar>
        <van-tabs v-model="active" @click="onClick" color="#477CFF">
            <van-tab title="全部"></van-tab>
            <van-tab title="待完成"></van-tab>
            <van-tab title="已完成"></van-tab>
        </van-tabs>
        <div class="card-list">
            <div class="card" v-for="(item) in listData" :key="item.id" @click="toDetail(item)">
                <div class="card-info">
                    <div class="flex flex-center">
                        <p class="title ellipsis">{{ item.indicators.title }}</p>
                        <div class="flex"><van-tag round type="primary">{{ item.examine.ch_mode }}</van-tag></div>
                    </div>
                    <div class="content">

                    </div>
                </div>
                <div class="card-handle flex flex-center">
                    <span class="time">{{ item.examine.examine_start_time }}</span>
                    <span class="arrow">
                        详情<van-icon name="arrow" />
                    </span>
                </div>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'task-list',
    data() {
      return {
          active: 0,
          page: 1,
          per_page: 20,
          listData: [],
          status: 0
      };
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            let params = {
                per_page: this.per_page,
                page: this.page,
                status: this.status
            }
            this.$api.get('/v1/examine.record.user.list', params)
            .then(res => {
                if(res.error_code == 0) {
                    this.listData = res.data.list;
                }
            })
        },
        toDetail(item) {
            this.$router.push({ path: '/assess/form', query: { id: item.id }});
        },
        onClick() {

        },
        onClickLeft() {
            this.$router.go(-1)
        },
        add() {
            this.$router.push({ path: '/assess/form'});
        }
    }
}

</script>
<style lang='less'>
.card-list {
    padding: 20px 0;
    .card {
        margin-bottom: 22px;
        background: #fff;
        .card-info {
            padding: 32px 20px;
            .title {
                flex: 1;
                max-width: 85%;
                font-size: 36px;
                color: #323842;
                font-weight: bold;
            }
        }
        .card-handle {
            padding: 26px 20px;
            border-top: 1px solid #F6F8FA;
            .time {
                color: #9398A1;
            }
            .arrow {
                color: #9398A1;
                font-size: 28px;
                font-weight: bold;
            }

        }
    }
}
</style>