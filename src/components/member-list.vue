<template>
    <div class="pop-content">
        <van-nav-bar
            :title="title"
            left-arrow
            right-text="确定"
            @click-left="close"
            @click-right="confirm"
            :safe-area-inset-top="true"
            :fixed="true"
        >
            <template #left>
                <van-icon name="cross" size="18" color="#060C19" />
            </template>
        </van-nav-bar>
        <van-search v-model="memberName" placeholder="请输入搜索关键词" />
        <!-- <div class="loading" v-if="!memberList.length"><van-loading /></div> -->
        <van-checkbox-group v-model="users" ref="checkboxGroup">
            <van-cell-group>
                <van-cell
                    class="flex"
                    v-for="(member, index) in memberList"
                    :key="index"
                    clickable
                    @click="toggle(index, member)"
                >
                    <van-checkbox ref="checkboxes" shape="square" class="check-list" :name="member.user_id">
                        <avatar src="https://img01.yzcdn.cn/vant/cat.jpeg" size="36" :name="member.name" :description="member.description"></avatar>
                    </van-checkbox>
                </van-cell>
            </van-cell-group>
        </van-checkbox-group>

        <van-submit-bar>
            <template #default>
                <div class="check-all">
                    <van-checkbox v-model="checkAll" shape="square" name="checkAll">全选</van-checkbox>
                    <van-button type="primary" @click="toggleChange">全选</van-button>
                </div>
            </template>
            <template #button>
                <div class="member-count flex flex-center" @click="showSelectedMember = true">
                    {{ users.length }} 人
                    <!-- <template>已选 {{ selectedMembers.length }} 人</template> -->
                    <van-icon name="arrow-up" color="#5E636E" size="20" />
                </div>
            </template>
        </van-submit-bar>

         <van-popup 
            v-model="showSelectedMember"
            closeable
            round
            close-icon-position="top-left"
            position="bottom"
            class="member-pop"
            :style="{ height: '90%' }"
        >
            <member-pop :member-list="memberList" :user-ids="users"></member-pop>
        </van-popup>
    </div>
</template>

<script>
import avatar from './avatar.vue';
import memberPop from './member-pop.vue';
export default {
    name: '',
    components: { avatar, memberPop },
    props: {
        title: {
            type: String,
            default: ''
        },
        memberList: {
            type: Array,
            default: () => []
        },
        userIds: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            users: [],
            checkAll: false,
            showSelectedMember: false,
            selectedMembers: [],
            memberName: ''
        };
    },
    created() {
        this.users = this.userIds;
        if(this.userIds.length == this.memberList.length) {
            this.checkAll = true;
        } else {
            this.checkAll = false;
        }
        this.showSelectedMember = false;
        console.log(this.userIds);
    },
    methods: {
        close() {
            this.$emit('close');
        },
        confirm() {
            this.$emit('confirm', this.users);
        },
        // 成员全选
        toggleChange() {
            if(this.checkAll) {
                this.$refs.checkboxGroup.toggleAll(false);
                this.checkAll = false;
                this.selectedMembers = [];
            } else {
                this.$refs.checkboxGroup.toggleAll(true);
                this.checkAll = true;
                this.selectedMembers = _.cloneDeep(this.memberList);
            }
        },
        // checkbox事件
        toggle(index, member) {
            this.$refs.checkboxes[index].toggle(); // 切换每个checkbox状态
            if(this.$refs.checkboxes[index].checked) {
                let index = _.findIndex(this.selectedMembers, function(o) { return o.id == member.id; });
                this.selectedMembers.splice(index, 1);
            } else {
                this.selectedMembers.push(member);
            }
            // 判断所有人和已选人数量是否一样
            if(this.selectedMembers.length == this.memberList.length) {
                this.checkAll = true;
            } else {
                this.checkAll = false;
            }
        },
    }
}

</script>
<style lang='less' scoped>
.pop-content {
    padding-top: 90px;
}
.check-all {
    position: relative;

    .van-button {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: none;
        opacity: 0;
    }
}
</style>