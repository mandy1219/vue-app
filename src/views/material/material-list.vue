<template>
    <div>
        <van-nav-bar
            :title="$t('material.materialManage')"
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
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            class="card-list"
        >
            <div class="card" v-for="(item) in listData" :key="item.id" @click="edit($event, item)">
                <div class="card-info">
                    <div class="flex flex-center">
                        <p class="title ellipsis">{{ item.title }}</p>
                        <div class="flex">
                            <van-tag round type="primary">{{ item.is_return == 1 ? '需要归还' : '不需要归还' }}</van-tag>
                        </div>
                    </div>
                    <div class="content">
                        <span class="mr20">
                            <van-icon name="flag-o" size="15" />数量<i class="text">{{ item.count }}</i>
                        </span>
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
    </div>
</template>

<script>
export default {
    name: 'material-list',
    data() {
        return {
            page: 1,
            per_page: 20,
            total: 0,
            listData: [
                {
                    title: '打印机',
                    count: 20,
                    is_return: 1,
                    updated_at: '2021-12-07 08:58:55',
                    id: '1'
                }
            ],
            loading: false,
            finished: false,
            actions: [
                { text: this.$t('common.view'), icon: 'orders-o', type: 'detail' }, 
                { text: this.$t('common.edit'), icon: 'edit', type: 'edit' },
                { text: this.$t('common.delete'), icon: 'delete-o', type: 'delete' }
            ],
        };
    },
    created() {},
    methods: {
        add() {
             this.$router.push('/material/form');
        },
        onLoad() {
            this.finished = true;
            // if (this.listData.length >= this.total) {
            //     this.finished = true;
            // }
            // let params = {
            //     per_page: this.per_page,
            //     page: this.page,
            //     status: this.status
            // }
            // this.$api.get('/v1/examine.record.user.list', params)
            // .then(res => {
            //     if(res.error_code == 0) {
            //         this.listData = res.data.list;
            //     }
            // })
        },
        edit(event, item) {
            switch(event.type) {
                case 'edit':
                    this.$router.push({ path: '/material/form?id='+item.id});
                    break;
                case 'delete':
                    console.log(item);
                    this.$dialog.confirm({
                        title: '',
                        message: this.$t('indicator.deleteConfirm'),
                        beforeClose: (action, done) => {
                            if (action === 'confirm') {
                                // this.$api.get('/v1/indicators.delete', {
                                //     id: item.id
                                // }).then(res => {
                                //     if(res.error_code == '0') {
                                //         this.$toast.success(this.$t('common.delete')+this.$t('common.success'));
                                //         this.getList();
                                //         done();
                                //     }
                                // })
                            } else {
                                done();
                            }
                        }
                    })
                    break;
                default:
                    this.$router.push({ path: '/material/form', query: { id: item.id,  disabled: true }});
                    break;
            }
        }
    }
}

</script>
<style lang='scss' scoped>
</style>