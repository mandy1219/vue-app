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
        <van-form @submit="onSubmit" v-if="!loading">
            <van-field
                readonly
                clickable
                name="选择指标"
                v-model="form.indicator"
                :label="$t('task.indicator')"
                :placeholder="$t('task.indicator')"
                @click="showTreePicker()"
                class="filed-picker"
                right-icon="arrow-down"
                :rules="[{ required: true, message: $t('common.select')+$t('task.indicator') }]"
            />
            <van-popup v-model="indicatorPicker" round position="bottom">
                <van-cascader
                    v-model="cascaderValue"
                    :title="$t('common.select')+$t('task.indicator')"
                    :options="collection"
                    @close="indicatorPicker = false"
                    @finish="onFinish"
                    @change="cascaderChange"
                    active-color="#477CFF"
                />
            </van-popup>

             <van-field
                readonly
                clickable
                name="选择模板"
                :value="form.template"
                :label="$t('task.template')"
                :placeholder="$t('task.template')"
                @click="templatePicker = true"
                class="filed-picker"
                right-icon="arrow-down"
                :rules="[{ required: true, message: $t('common.select')+$t('task.template') }]"
            />
            <van-popup v-model="templatePicker" position="bottom">
                <van-picker
                    show-toolbar
                    :columns="templates"
                    value-key="title"
                    @confirm="changeTemplate"
                    @cancel="templatePicker = false"
                />
            </van-popup>

            <van-field name="考核方式" label="考核方式">
                <template #input>
                    <van-radio-group v-model="form.mode" direction="horizontal">
                        <van-radio name="1">自评</van-radio>
                        <van-radio name="2">互评</van-radio>
                        <van-radio name="3">教师评价</van-radio>
                    </van-radio-group>
                </template>
            </van-field>

            <van-field name="是否需要提交" label="是否需要提交" class="filed-date">
                <template #label>
                    <span>是否需要提交</span>
                </template>
                <template #input>
                    <van-radio-group v-model="form.is_commit" direction="horizontal">
                        <van-radio name="1">是</van-radio>
                        <van-radio name="2">否</van-radio>
                    </van-radio-group>
                </template>
            </van-field>

            <!-- <van-field
                v-model="form.username"
                name="用户名"
                label="用户名"
                placeholder="用户名"
                :rules="[{ required: true, message: '请填写用户名' }]"
            /> -->
            <!-- <van-field
                v-model="form.message"
                rows="1"
                autosize
                label="留言"
                type="textarea"
                placeholder="请输入留言"
            /> -->
            
            <!-- <van-field name="checkboxGroup" label="复选框组">
                <template #input>
                    <van-checkbox-group v-model="form.checkbox" direction="horizontal">
                    <van-checkbox name="1" shape="square">复选框 1</van-checkbox>
                    <van-checkbox name="2" shape="square">复选框 2</van-checkbox>
                    </van-checkbox-group>
                </template>
            </van-field> -->

            <van-field
                readonly
                clickable
                name="考核任务周期"
                label="考核任务周期"
                placeholder="点击选择日期"
                class="filed-date"
            >
                <template #label>
                    <span>考核任务周期</span>
                </template>
                <template #input>
                    <input type="text" v-model="form.date" placeholder="起" class="van-field__control mb20" @click="showDate = true"  />
                    <input type="text" v-model="form.date" placeholder="止" class="van-field__control" @click="showDate = true"  />
                </template>
            </van-field>
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

            <!-- <van-field name="uploader" label="文件上传">
                <template #input>
                    <van-uploader v-model="uploader">
                        <van-button icon="plus" type="primary" class="upload-btn" block>上传文件</van-button>
                    </van-uploader>
                </template>
            </van-field> -->

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
                    @click-left="showMember = false"
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
                            <van-checkbox v-model="member.check" shape="square" class="check-list" @change="checkMember($event, member)">
                                <avatar src="https://img01.yzcdn.cn/vant/cat.jpeg" size="36" :name="member.name" :description="member.description"></avatar>
                            </van-checkbox>
                        </van-cell>
                    </div>
                </van-index-bar>
                <van-submit-bar  @submit="onSubmit">
                    <template #default>
                        <van-checkbox v-model="checkAll" shape="square" @click="toggleChange">全选</van-checkbox>
                    </template>
                    <template #button>
                        <div class="member-count flex flex-center" @click="showSelected">已选 {{ selectedMembers.length }} 人<van-icon name="arrow-up" color="#5E636E" size="20" /></div>
                    </template>
                    
                </van-submit-bar>
            </div>
        </van-popup>

        <van-popup 
            v-model="showSelectedMember"
            closeable
            round
            close-icon-position="top-left"
            position="bottom"
            class="member-pop"
            :style="{ height: '90%' }"
        >
            <div class="pop-content">
                <div class="member-count">已选 {{ selectedMembers.length }} 人</div>
                <div class="member-list flex flex-center" v-for="(member, index) in selectedMembers" :key="index">
                    <avatar src="https://img01.yzcdn.cn/vant/cat.jpeg" size="36" :name="member.name"></avatar>
                    <van-icon name="cross" color="#5E636E" size="20" @click="removeMember(member)" />
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import _ from 'lodash';
import avatar from '../../components/avatar.vue';
export default {
    components: { avatar },
    name: 'task-detail',
    data() {
        return {
            loading: true,
            form: {
                indicator: '',
                indicators_id: '',
                template: '',
                template_id: '',
                mode: '1',
                is_commit: '1',
                date: ''
            },
            cascaderValue: '',
            collection: [],
            indicatorPicker: false,
            templatePicker: false,
            templates: [],
            uploader: [],
            showPicker: false,
            showDate: false,
            columns: ['杭州', '宁波', '温州', '绍兴', '湖州', '嘉兴', '金华', '衢州'],
            minDate: new Date(2020, 0, 1),
            maxDate: new Date(2025, 10, 1),
            currentDate: new Date(),
            showMember: false,
            showSelectedMember: false,
            memberName: '',
            checkAll: false,
            memberList: [
                {
                    index: 'A',
                    list: [
                        {
                            id: '1',
                            name: '张三',
                            description: '在职',
                            check: false
                        },
                        {
                            id: '2',
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
                            id: '3',
                            name: '张三',
                            description: '在职',
                            check: false
                        },
                        {
                            id: '4',
                            name: '张三',
                            description: '在职',
                            check: false
                        },
                    ]
                }
            ],
            selectedMembers: []
        };
    },
    created() {
        this.getIndicators();
        this.getTemplates();
    },
    methods: {
        getIndicators() {
            this.loading = true;
            this.$api.get('/v1/indicators.tree')
            .finally(() => {
                this.loading = false;
            })
            .then(res => {
                if(res.error_code == 0) {
                    let list = res.list;
                    list.forEach(first => {
                        first.text = first.title;
                        first.value = first.id;
                        if(first.children_list) {
                            first.children = first.children_list;
                            first.children.forEach(second => {
                                second.text = second.title;
                                second.value = second.id;
                                delete second.children_list;
                            })
                        }
                    });
                    this.collection = list;
                }
            })
        },
        getTemplates() {
            let params = {
                per_page: 20,
                page: 1,
            }
            this.$api.get('/v1/template.list', params)
            .then(res => {
                if(res.error_code == 0) {
                    this.templates = res.data.list;
                }
            })
        },
        showTreePicker() {
            this.indicatorPicker = true;
        },
        onFinish({ selectedOptions }) {
            this.indicatorPicker = false;
        },
        cascaderChange({ value, selectedOptions, tabIndex }) {
            this.form.indicator = selectedOptions.map((option) => option.text).join('/');
            this.form.indicators_id = value;
        },
        changeTemplate(option) {
            this.form.template = option.title;
            this.form.template_id = option.id;
            this.templatePicker = false;
        },
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
             this.showSelectedMember = true;
        },
        confirmMemberPop() {
            this.showMember = false;
        },
        // 成员全选
        toggleChange($event) {
            // console.log(this.checkAll);
            if(this.checkAll) {
                this.memberList.forEach(member => {
                    member.list.forEach(item => {
                        item.check = true;
                    })
                    // this.selectedMembers = this.selectedMembers.concat(member.list);
                })
            }else {
                this.memberList.forEach(member => {
                    member.list.forEach(item => {
                        item.check = false;
                    })
                })
                // this.selectedMembers = [];
            }
        },
        checkMember(value, member) {
            if(value) {
                this.selectedMembers.push(member);
            }else {
                let index = _.findIndex(this.selectedMembers, function(o) { return o.id == member.id; });
                this.selectedMembers.splice(index, 1);
                this.checkAll = false;
            }
        },
        removeMember(member) {
            console.log(member);
        }
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
    .filed-date {
        .van-cell__title {
            width: auto;
        }
        .van-field__control {
            flex-direction: column;
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