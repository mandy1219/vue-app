<template>
    <div>
        <van-nav-bar
            :title="$t('template.templateManage')"
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
        </van-nav-bar>
        <van-list
            v-if="listData.length"
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="getList"
            class="card-list"
            :offset="'0'"
        >
            <div class="card" v-for="(item) in listData" :key="item.id" @click="edit($event, item)">
                <div class="card-info">
                    <div class="flex flex-center">
                        <p class="title ellipsis">{{ item.title }}</p>
                        <div class="flex"><van-tag round type="primary">{{ item.indicators_name }}</van-tag></div>
                    </div>
                    <div class="content">

                    </div>
                </div>
                <div class="card-handle flex flex-center">
                    <span class="time">{{ item.updated_at }}</span>
                    <div class="flex">
                        <van-icon name="ellipsis" size="20" color="#323842" @click.stop="item.showPop = true" />
                        <van-popover
                            v-model="item.showPop"
                            trigger="click"
                            placement="left"
                            :actions="actions"
                            @select="edit($event, item)"
                        >
                        </van-popover>
                    </div>
                </div>
            </div>
        </van-list>
        <van-empty v-if="!loading && !listData.length" description="暂无数据" />
    </div>
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';
export default {
    name: '',
    ...mapState(['language']),
    data() {
        return {
            page: 1,
            per_page: 20,
            listData: [],
            actions: [
                { text: this.$t('common.view'), icon: 'orders-o', type: 'detail' }, 
                { text: this.$t('common.edit'), icon: 'edit', type: 'edit' },
                { text: this.$t('common.delete'), icon: 'delete-o', type: 'delete' }
            ],
            loading: false,
            finished: false,
            total: 0,
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
            }
            if (this.listData.length >= this.total) {
                this.finished = true;
            }
            this.$api.get('/v1/template.list', params)
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
        },
        add() {
            this.$router.push('/template/form');
        },
        edit(event, item) {
            switch(event.type) {
                case 'edit':
                    this.$router.push({ path: '/template/form?id='+item.id});
                    break;
                case 'delete':
                    console.log(item);
                    this.$dialog.confirm({
                        title: '',
                        message: this.$t('template.deleteConfirm'),
                        beforeClose: (action, done) => {
                            if (action === 'confirm') {
                                this.$api.get('/v1/template.delete', {
                                    id: item.id
                                }).then(res => {
                                    if(res.error_code == '0') {
                                        this.$toast.success(this.$t('common.delete')+this.$t('common.success'));
                                        this.loading = true;
                                        this.finished = false;
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
                    this.$router.push({ path: '/template/form', query: { id: item.id,  disabled: true }});
                    break;
            }
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