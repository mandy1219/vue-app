<template>
    <div class="flex flex-center avatar">
        <van-image
            round
            :width="size"
            :height="size"
            :src="src"
        />
        <div class="info">
            <p v-if="name" class="name">{{ name }}</p>
            <p v-if="description" class="description">{{ description }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'avatar',
    props: {
        size: {
            type: String,
            default: '36'
        },
        src: {
            type: String
        },
        name: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: ''
        }
    },
    data() {
      return {
      };
    },
    created() {},
    methods: {}
}

</script>
<style lang='less' scoped>
.avatar {
    .info {
        margin-left: 24px;
        display: flex;
        flex-direction: column;

        .name {
            font-size: 32px;
            color: #323842;
        }
        .description {
            font-size: 26px;
            color: #8F9197;
        }
    }
}
</style>