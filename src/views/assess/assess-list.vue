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
        <van-tabs v-model="active" @click="tabChange" color="#477CFF" stick="true" class="tab-fixed"> 
            <!-- <van-tab title="全部"></van-tab> -->
            <van-tab title="已发布" :name="'1'"></van-tab>
            <van-tab title="未发布" :name="'0'"></van-tab>
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
                        <span class="mr20">
                            考核对象:<i class="text">{{ item.target_m }}</i>
                        </span>
                        <span>
                            考核方式:<i class="text">{{ item.mode_m }}</i>
                        </span>
                    </div>
                    <div class="content">
                        <span class="mr20">
                            模板:<i class="text">{{ item.template_title ? item.template_title : '无' }}</i>
                        </span>
                        <span>
                            是否需要提交:<i class="text">{{ item.is_commit_m }}</i>
                        </span>
                    </div>
                </div>
                <div class="card-handle flex flex-center">
                    <span class="time">{{ item.created_at }}</span>
                    <div class="flex">
                        <van-icon name="ellipsis" size="22" @click.stop="item.showPop = true" />
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
export default {
    name: 'assess-list',
    data() {
        return {
            active: 1,
            loading: false,
            finished: false,
            page: 1,
            per_page: 20,
            listData: [],
            actions: [
                { text: this.$t('common.view'), icon: 'orders-o', type: 'detail' }, 
                { text: this.$t('common.edit'), icon: 'edit', type: 'edit' },
                { text: this.$t('common.delete'), icon: 'delete-o', type: 'delete' }
            ],
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
            this.$api.get('/v1/examine.list', params)
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
            this.$router.push({ path: '/assess/form', query: { id: item.id, disabled: true }});
        },
        tabChange(value) {
            // console.log(this.active);
            this.page = 1;
            this.listData = [];
            this.getList();
        },
        add() {
            this.$router.push({ path: '/assess/form'});
        },
        onSelect(event, item) {
            switch(event.type) {
            case 'edit':
                this.$router.push({ path: '/assess/form?id='+item.id});
                break;
            case 'delete':
                console.log(item);
                this.$dialog.confirm({
                    title: '',
                    message: this.$t('indicator.deleteConfirm'),
                    beforeClose: (action, done) => {
                        if (action === 'confirm') {
                        this.$api.get('/v1/examine.delete', {
                            id: item.id
                        }).then(res => {
                            if(res.error_code == '0') {
                                this.$toast.success(this.$t('common.delete')+this.$t('common.success'));
                                this.getList();
                                done();
                            }
                        })
                        } else {
                            done();
                        }
                    }
                })
                break;
            default:
                this.$router.push({ path: '/assess/form', query: { id: item.id, disabled: true }});
                break;
            }
        },
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
        margin-bottom: 20px;
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