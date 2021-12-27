<template>
    <div>
        <van-nav-bar
            title="考核结果"
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
        <van-tabs v-model="active" @click="onClick" color="#477CFF" class="tab-fixed">
            <!-- <van-tab title="全部"></van-tab> -->
            <van-tab title="待提交" :name="'0'"></van-tab>
            <van-tab title="待评价" :name="'1'"></van-tab>
            <van-tab title="已评价" :name="'2'"></van-tab>
            <van-tab title="被质疑" :name="'3'"></van-tab>
        </van-tabs>
        <van-list
            v-if="listData.length"
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="getList"
            class="card-list"
            :offset="'0'"
        >
            <div class="card" v-for="(item) in listData" :key="item.id" @click="toDetail(item)">
                <div class="card-info">
                    <div class="flex flex-center">
                        <p class="title ellipsis">{{ item.examine_title }}</p>
                        <div class="flex"><van-tag round type="primary">{{ item.status_m }}</van-tag></div>
                    </div>
                    <div class="content">
                        <span class="mr20">
                            指标:<i class="text">{{ item.indicators_title }}</i>
                        </span>
                        <span>
                            被考核人:<i class="text">{{ item.user_name }}</i>
                        </span>
                        <span v-if="active == 2">
                            分数:<i class="text">{{ item.score }}</i>
                        </span>
                    </div>
                </div>
                <div class="card-handle flex flex-center">
                    <span class="time">{{ item.created_at }}</span>
                    <div class="flex">
                        <van-icon name="ellipsis" size="22" @click.stop="showPop(item)" />
                        <van-popover
                            v-model="item.showPop"
                            trigger="click"
                            placement="left"
                            :actions="actions"
                            @select="onSelect($event, item)"
                        >
                        </van-popover>
                    </div>
                </div>
            </div>
        </van-list>
        <van-empty v-if="!loading && !listData.length" description="暂无数据" />
        <router-view></router-view>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'record-list',
    data() {
        return {
            active: 0,
            page: 1,
            per_page: 20,
            total: 0,
            listData: [],
            loading: false,
            finished: false,
            token: '',
            actions: [],
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            this.loading = true;
            let params = {
                per_page: this.per_page,
                page: this.page,
                status: this.active
            }
            this.$api.get(`/v1/examine.record.list`, params)
            .then(res => {
                if(res.error_code == 0) {
                    this.listData = this.listData.concat(res.data.list);
                    this.total = res.data.paginate.total;
                    if (this.listData.length >= this.total) {
                        this.finished = true;
                    } else {
                        this.finished = false;
                        this.page = this.page + 1
                    }
                    this.loading = false
                } else {
                    this.$toast.fail(res.error_desc);
                }
            })
            .catch(error => {
                this.$toast('请求错误');
            })
            
        },
        toDetail(item) {
            this.$router.push({ path: '/record/form', query: { id: item.id, disabled: true }});
        },
        onClick() {
            this.page = 1;
            this.listData = [];
            this.getList();
        },
        onClickLeft() {
            this.$router.go(-1)
        },
        add() {
            this.$router.push({ path: '/assess/form'});
        },
        onSelect(event, item) {
            switch(event.type) {
                case 'evaluation': // 评价
                    this.$router.push({ path: '/record/form', query: { id: item.id, disabled: true, handle: 1 }});
                    break;
                case 'question': // 质疑
                    this.$router.push({ path: '/record/form', query: { id: item.id, disabled: true, handle: 2 }});
                    break;
                default:
                    this.$router.push({ path: '/record/form', query: { id: item.id, disabled: true }});
                    break;
            }
        },
        showPop(item) {
            if(item.status == 1) {
                this.actions = [
                    { text: this.$t('common.view'), icon: 'orders-o', type: 'detail' },
                    { text: this.$t('common.evaluation'), icon: 'edit', type: 'evaluation' },
                    { text: this.$t('common.question'), icon: 'exchange', type: 'question' }
                ];
            } else if(item.status == 2){
                this.actions = [
                    { text: this.$t('common.view'), icon: 'orders-o', type: 'detail' },
                    { text: this.$t('common.question'), icon: 'exchange', type: 'question' }
                ];
            } else {
                this.actions = [
                    { text: this.$t('common.view'), icon: 'orders-o', type: 'detail' }
                ];
            }
            item.showPop = true;
        }
    }
}

</script>
<style lang='less' scoped>
/deep/ .tab-fixed {
    position: fixed !important;
    width: 100%;
    background: #fff;
    z-index: 1;
}
.card-list {
    padding: 108px 0 20px;
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
            .content {
                margin-top: 20px;
                .van-icon {
                    margin-right: 5px;
                }
                .text {
                    margin: 0 5px;
                    font-style: normal;
                    font-weight: bold;
                }
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