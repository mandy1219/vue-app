<template>
    <div>
        <van-nav-bar
            title="我的任务"
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
        <van-tabs v-model="active" @click="onClick" color="#477CFF">
            <!-- <van-tab title="全部"></van-tab> -->
            <van-tab title="待提交" :name="'1'"></van-tab>
            <van-tab title="待评价" :name="'2'"></van-tab>
            <van-tab title="已评价" :name="'3'"></van-tab>
            <van-tab title="被质疑" :name="'4'"></van-tab>
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
            <template v-if="listData.length">
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
                            <!-- <span>
                                模板:<i class="text">{{ item.template_title }}</i>
                            </span> -->
                        </div>
                    </div>
                    <div class="card-handle flex flex-center">
                        <span class="time">{{ item.created_at }}</span>
                        <span class="arrow">
                            详情<van-icon name="arrow" />
                        </span>
                    </div>
                </div>
            </template>
            
        </van-list>
        <van-empty v-else description="暂无数据" />
        <router-view></router-view>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'task-list',
    data() {
        return {
            active: 1,
            page: 1,
            per_page: 10,
            total: 0,
            listData: [],
            loading: false,
            finished: false,
            token: ''
        };
    },
    created() {
        this.login();
        // this.getList();
    },
    methods: {
        login() {
            this.$api.post('/v1/login', { user_id: '3143688' })
            .then(res => {
                if(res.error_code == '0') {
                    this.token = res.token;
                    this.getList();
                } else {

                }
            });
        },
        getList() {
            this.loading = true;
            let params = {
                per_page: this.per_page,
                page: this.page,
                status: this.active
            }
            console.log(this.$serviceUrl);
            axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
            axios.defaults.headers.common['Authorization'] = this.token;
            axios.get(`${this.$serviceUrl}/v1/examine.record.user.list`, { params: params })
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
            this.$router.push({ path: '/task/form', query: { id: item.id }});
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