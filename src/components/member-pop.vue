<template>
     <div class="pop-content">
        <div class="member-count">已选 {{ selectedMembers.length }} 人</div>
        <div class="member-list flex flex-center" v-for="(member, index) in selectedMembers" :key="index">
            <avatar src="https://img01.yzcdn.cn/vant/cat.jpeg" size="36" :name="member.name"></avatar>
            <van-icon name="cross" color="#5E636E" size="20" @click="removeMember(member)" />
        </div>
    </div>
</template>

<script>
export default {
    name: '',
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
        console.log(this.userIds);
        console.log(this.selectedMembers);
    },
    methods: {}
}

</script>
<style lang='less' scoped>
</style>