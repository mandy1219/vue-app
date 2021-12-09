<template>
    <div>
        <van-nav-bar
            title="考核详情"
            left-arrow
            @click-left="$back"
            @click-right="onClickRight"
            :safe-area-inset-top="true"
            :placeholder="true"
            :fixed="true"
         >
            <template #left>
               <van-icon name="arrow-left" size="22" color="#060C19" />
            </template>
        </van-nav-bar>
        <van-form @submit="onSubmit">
            <van-field
                v-model="form.username"
                name="用户名"
                label="用户名"
                placeholder="用户名"
                :rules="[{ required: true, message: '请填写用户名' }]"
            />
            <van-field
                v-model="form.password"
                type="password"
                name="密码"
                label="密码"
                placeholder="密码"
                :rules="[{ required: true, message: '请填写密码' }]"
            />
            <van-field
                v-model="form.message"
                rows="1"
                autosize
                label="留言"
                type="textarea"
                placeholder="请输入留言"
            />
            <van-field name="radio" label="单选框">
                <template #input>
                    <van-radio-group v-model="form.radio" direction="horizontal">
                        <van-radio name="1">单选框 1</van-radio>
                        <van-radio name="2">单选框 2</van-radio>
                    </van-radio-group>
                </template>
            </van-field>
            <van-field name="checkboxGroup" label="复选框组">
                <template #input>
                    <van-checkbox-group v-model="form.checkbox" direction="horizontal">
                    <van-checkbox name="1" shape="square">复选框 1</van-checkbox>
                    <van-checkbox name="2" shape="square">复选框 2</van-checkbox>
                    </van-checkbox-group>
                </template>
            </van-field>

            <van-field
                readonly
                clickable
                name="picker"
                :value="form.picker"
                label="选择器"
                placeholder="点击选择城市"
                @click="showPicker = true"
                class="filed-picker"
                right-icon="arrow-down"
            />
            <van-popup v-model="showPicker" position="bottom">
                <van-picker
                    show-toolbar
                    :columns="columns"
                    @confirm="onConfirm"
                    @cancel="showPicker = false"
                />
            </van-popup>

            <van-field
                readonly
                clickable
                name="picker"
                :value="form.date"
                label="选择器"
                placeholder="点击选择日期"
                @click="showDate = true"
                class="filed-picker"
                right-icon="arrow-down"
            />
            <van-popup v-model="showDate" position="bottom">
                <van-datetime-picker
                    type="date"
                    title="选择年月日"
                    v-model="currentDate"
                    :min-date="minDate"
                    :max-date="maxDate"
                    @confirm="dateConfirm"
                    @cancel="showDate = false"
                    :formatter="formatter"
                />
            </van-popup>

            <van-field name="uploader" label="文件上传">
                <template #input>
                    <van-uploader v-model="uploader">
                        <van-button icon="plus" type="primary" class="upload-btn" block>上传文件</van-button>
                    </van-uploader>
                </template>
            </van-field>

            <van-field name="radio" label="选择成员">
                <template #input>
                    <div class="add" @click="selectMember"><van-icon name="plus" class="mr10" />选择成员</div>
                </template>
            </van-field>

            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">提交</van-button>
            </div>
        </van-form>

        <van-popup 
            v-model="showMember"
            position="bottom"
            class="select-member-pop"
            :style="{ height: '100%' }"
        >
            <div class="pop-content">
                <van-nav-bar
                    title="选择成员"
                    left-arrow
                    right-text="完成"
                    @click-left="closeMemberPop"
                    @click-right="confirmMemberPop"
                    :safe-area-inset-top="true"
                    :fixed="true"
                >
                    <template #left>
                        <van-icon name="cross" size="18" color="#060C19" />
                    </template>
                </van-nav-bar>
                <van-search v-model="memberName" placeholder="请输入搜索关键词" />
                <van-index-bar>
                    <div v-for="(list, index) in memberList" :key="index">
                        <van-index-anchor :index="list.index" />
                        <van-cell class="flex" v-for="(member, _index) in list.list" :key="_index">
                            <van-checkbox v-model="member.check" shape="square" class="check-list">
                                <avatar src="https://img01.yzcdn.cn/vant/cat.jpeg" size="36" :name="member.name" :description="member.description"></avatar>
                            </van-checkbox>
                        </van-cell>
                    </div>
                </van-index-bar>
                <van-submit-bar  @submit="onSubmit">
                    <template #default>
                        <van-checkbox v-model="checkAll" shape="square">全选</van-checkbox>
                    </template>
                    <template #button>
                        <div class="member-count flex flex-center" @click="showSelected">已选 12 人<van-icon name="arrow-up" color="#5E636E" size="20" /></div>
                    </template>
                    
                </van-submit-bar>
            </div>
        </van-popup>

        <van-popup 
            v-model="selectedMember"
            closeable
            round
            close-icon-position="top-left"
            position="bottom"
            class="member-pop"
            :style="{ height: '90%' }"
        >
            <div class="pop-content">
                <div class="member-count">已选 12 人</div>
                <div class="member-list flex flex-center" v-for="(member, index) in 5" :key="index">
                    <avatar src="https://img01.yzcdn.cn/vant/cat.jpeg" size="36" name="张三"></avatar>
                    <van-icon name="cross" color="#5E636E" size="20" />
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import avatar from '../../components/avatar.vue';
export default {
    components: { avatar },
    name: 'task-detail',
    data() {
        return {
            form: {
                username: '',
                password: '',
                message: '',
                radio: '1',
                checkbox: [],
                picker: '',
                date: ''
            },
            uploader: [],
            showPicker: false,
            showDate: false,
            columns: ['杭州', '宁波', '温州', '绍兴', '湖州', '嘉兴', '金华', '衢州'],
            minDate: new Date(2020, 0, 1),
            maxDate: new Date(2025, 10, 1),
            currentDate: new Date(),
            showMember: false,
            selectedMember: false,
            memberName: '',
            checkAll: false,
            memberList: [
                {
                    index: 'A',
                    list: [
                        {
                            name: '张三',
                            description: '在职',
                            check: false
                        },
                        {
                            name: '张三',
                            description: '在职',
                            check: false
                        },
                    ]
                },
                {
                    index: 'B',
                    list: [
                        {
                            name: '张三',
                            description: '在职',
                            check: false
                        },
                        {
                            name: '张三',
                            description: '在职',
                            check: false
                        },
                    ]
                }
            ]
        };
    },
    created() {},
    methods: {
        onSubmit() {},
        onClickLeft() {
            this.$router.go(-1)
        },
        onClickRight() {},
        onConfirm(value) {
            this.form.picker = value;
            this.showPicker = false;
        },
        dateConfirm(time) {
            this.form.date = this.moment(time).format('YYYY-DD-MM');
            this.showDate = false;
        },
        formatter(type, val) {
            if (type === 'year') {
                return val + '年';
            }
            if (type === 'month') {
                return val + '月';
            }
            if (type === 'day') {
                return val + '日';
            }
            return val;
        },
        selectMember() {
            this.showMember = true;
        },
        showSelected() {
             this.selectedMember = true;
        },
        closeMemberPop() {
            this.showMember = false;
        },
        confirmMemberPop() {
            this.showMember = false;
        },
    }
}

</script>
<style lang='less' scoped>
/deep/ .van-form {
    .van-cell {
        display: block;
        
        &::after {
            border: 0;
        }
        .van-cell__title {
            margin-bottom: 24px;
            span {
                font-size: 32px;
                font-weight: bold;
                color: #060C19;
            }
        }
        .van-field__body {
            input {
                padding: 0 24px;
                height: 80px;
                border: 2px solid #D3D5DB;
                border-radius: 12px;
            }
            textarea {
                min-height: 192px;
                padding: 24px;
                border: 2px solid #D3D5DB;
                border-radius: 12px;
            }
        }
        .van-radio-group, .van-checkbox-group {
            width: 100%;
            display: block;
            border-radius: 12px;
            border: 2px solid #D3D5DB;

            .van-radio, .van-checkbox {
                margin: 0;
                height: 80px;
                padding-left: 24px;
                border-bottom: 2px solid #D3D5DB;
                &:last-child {
                    border-bottom: 0;
                }
            }
        }
        .van-uploader, .van-uploader__wrapper {
            display: block;
            width: 100%;
            
            .upload-btn {
                display: block;
                width: 100%;
                height: 80px;
                border: 2px dashed #D3D5DB;
                background: none;
                color: #5E636E;
            }
        }
    }
    .filed-picker {
        .van-field__right-icon {
            position: absolute;
            right: 10px;
        }
    }
    .add {
        color: #477CFF;
    }
}
.pop-content {
    padding-top: 90px;
}
/deep/ .select-member-pop {
    .van-index-anchor {
        background: #F3F4F8;
    }
    .check-list {
        .van-checkbox__label {
            margin-left: 32px;
        }
    }
    .van-submit-bar {
        border-top: 2px solid #E4E6EB;
    }
    .van-submit-bar__bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 32px;
    }
    .member-count {
        font-size: 32px;
        color: #5E636E;
    }
}
.member-pop {
    .member-count {
        padding-left: 40px;
        height: 90px;
        line-height: 90px;
        font-size: 36px;
    }
    .member-list {
        height: 120px;
        padding: 0 40px
    }
}
</style>