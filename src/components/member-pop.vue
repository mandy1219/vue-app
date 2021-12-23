<template>
     <div class="pop-content">
        <!-- <div class="member-count">已选 {{ memberList.length }} 人</div> -->
        <div class="member-list flex flex-center" v-for="(member, index) in memberList" :key="index">
            <avatar src="https://img01.yzcdn.cn/vant/cat.jpeg" size="36" :name="member.name"></avatar>
            <!-- <van-icon name="cross" color="#5E636E" size="20" @click="removeMember(member)" /> -->
        </div>
    </div>
</template>

<script>
import avatar from './avatar.vue';
export default {
    name: '',
    components: { avatar },
    props: {
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
            selectedMembers: []
        };
    },
    created() {
        // this.selectedMembers = this.memberList;
        // console.log(this.userIds);
        // console.log(this.memberList);
    },
    methods: {}
}

</script>
<style lang='less' scoped>
.pop-content {
    padding: 90px 0;
}
</style>