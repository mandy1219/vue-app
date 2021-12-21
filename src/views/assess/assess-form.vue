<template>
    <div>
        <van-nav-bar
            :title="taskId ? disabled ? $t('task.taskDetail') : $t('task.taskEdit') : $t('task.taskAdd')"
            left-arrow
            @click-left="$back"
            @click-right="edit"
            :right-text="disabled ? $t('common.edit') : ''"
            :safe-area-inset-top="true"
            :placeholder="true"
            :fixed="true"
         >
            <template #left>
               <van-icon name="arrow-left" size="22" color="#060C19" />
            </template>
        </van-nav-bar>
        <van-form @submit="onSubmit" v-if="!loadingDetail" ref="formData">
            <van-field
                v-model="form.examine_title"
                name="考核任务"
                :label="$t('task.taskName')"
                :placeholder="$t('task.taskName')"
                :rules="[{ required: true, message: $t('common.fillIn')+$t('task.taskName') }]"
                :readonly="disabled"
            />
            <van-field
                v-if="!loading"
                :readonly="disabled"
                clickable
                name="选择指标"
                v-model="form.indicator"
                :label="$t('task.indicator')"
                :placeholder="$t('task.indicator')"
                @click="indicatorPicker = true"
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
                    active-color="#477CFF"
                />
            </van-popup>

            <van-field
                name="考核对象"
                label="考核对象" 
                :rules="[{ required: true, message: $t('common.select')+$t('task.indicator') }]"
            >
                <template #input>
                    <van-radio-group v-model="form.target" direction="horizontal" @change="targetChange" :disabled="disabled">
                        <van-radio name="1">学生</van-radio>
                        <van-radio name="2">老师</van-radio>
                    </van-radio-group>
                </template>
            </van-field>

            <van-field name="radio" label="考核人员" v-if="form.target" :readonly="disabled">
                <template #input>
                    <div class="flex flex-center w100" @click="showTargetMemberList()">
                        <span class="add"><van-icon name="plus" class="mr10" />选择人员</span>
                        <span>已选 {{ form.user_ids.length }} 人</span>
                    </div>
                    <!-- <div class="flex flex-center w100" @click="showMemberList('target')">
                        <span class="add"><van-icon name="plus" class="mr10" />选择人员</span>
                        <span>已选 {{ form.user_ids.length }} 人</span>
                    </div> -->
                </template>
            </van-field>

            <van-field
                name="考核方式"
                label="考核方式"
                :rules="[{ required: true, message: $t('common.select')+$t('task.template') }]"
            >
                <template #input>
                    <van-radio-group v-model="form.mode" direction="horizontal" @change="modeChange" :disabled="disabled">
                        <van-radio :name="'1'">自评</van-radio>
                        <van-radio :name="'2'">互评</van-radio>
                        <van-radio :name="'3'">教师评价</van-radio>
                    </van-radio-group>
                </template>
            </van-field>

            <van-field name="radio" label="评价人" v-if="form.mode == 2 || form.mode == 3">
                <template #input>
                    <!-- <div class="add" @click="showMemberList('mode')"><van-icon name="plus" class="mr10" />选择人员</div> -->
                    <div class="flex flex-center w100" @click="showModeMemberList()">
                        <span class="add"><van-icon name="plus" class="mr10" />选择人员</span>
                        <span>已选 {{ form.comment_ids.length }} 人</span>
                    </div>
                </template>
            </van-field>

            <van-field name="是否需要提交" label="是否需要提交" class="filed-date">
                <template #label>
                    <span>是否需要提交</span>
                </template>
                <template #input>
                    <van-radio-group v-model="form.is_commit" direction="horizontal" @change="commitChange" :disabled="disabled">
                        <van-radio name="1">是</van-radio>
                        <van-radio name="0">否</van-radio>
                    </van-radio-group>
                </template>
            </van-field>

            <van-field
                v-if="form.is_commit == 1"
                readonly
                clickable
                name="选择模板"
                :value="form.template"
                :label="$t('task.template')"
                :placeholder="$t('task.template')"
                @click="templatePicker = true"
                class="filed-picker"
                right-icon="arrow-down"
                :disabled="disabled"
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

            <!-- <van-field
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
            </van-popup> -->

            <!-- <van-field name="uploader" label="文件上传">
                <template #input>
                    <van-uploader v-model="uploader">
                        <van-button icon="plus" type="primary" class="upload-btn" block>上传文件</van-button>
                    </van-uploader>
                </template>
            </van-field> -->

            <van-field
                v-model="form.content"
                rows="1"
                autosize
                label="考核内容"
                type="textarea"
                placeholder="考核内容"
                :readonly="disabled"
            />

            <div style="margin: 16px;" v-if="!disabled">
                <div class="flex flex-center">
                    <van-button round block plain type="info" @click="submit($event)" :disabled="saving" native-type="button">保存</van-button>
                    <van-button round block type="info" class="ml20" @click="submit($event, true)" :disabled="saving" native-type="button">发布</van-button>
                </div>
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
                    right-text="确定"
                    @click-left="showMember = false"
                    @click-right="showMember = false"
                    :safe-area-inset-top="true"
                    :fixed="true"
                >
                    <template #left>
                        <van-icon name="cross" size="18" color="#060C19" />
                    </template>
                </van-nav-bar>
                <van-search v-model="memberName" placeholder="请输入搜索关键词" />
                <!-- <van-index-bar>
                    <div v-for="(list, index) in memberList" :key="index">
                        <van-index-anchor :index="list.index" />
                        <van-cell class="flex" v-for="(member, _index) in list.list" :key="_index">
                            <van-checkbox v-model="member.check" shape="square" class="check-list" @change="checkMember($event, member)">
                                <avatar src="https://img01.yzcdn.cn/vant/cat.jpeg" size="36" :name="member.name" :description="member.description"></avatar>
                            </van-checkbox>
                        </van-cell>
                    </div>
                </van-index-bar> -->
                <div class="loading" v-if="loadingMember"><van-loading /></div>
                <van-checkbox-group v-model="form.user_ids" ref="checkboxGroup" v-if="!loadingMember && memberPopType == 1">
                    <van-cell-group v-if="form.target == 1">
                        <van-cell
                            class="flex"
                            v-for="(member, index) in students"
                            :key="index"
                            clickable
                            @click="toggle(index, member)"
                        >
                            <van-checkbox ref="checkboxes" shape="square" class="check-list" :name="member.user_id">
                                <avatar src="https://img01.yzcdn.cn/vant/cat.jpeg" size="36" :name="member.name" :description="member.description"></avatar>
                            </van-checkbox>
                        </van-cell>
                    </van-cell-group>
                    <van-cell-group v-if="form.target == 2">
                        <van-cell
                            class="flex"
                            v-for="(member, index) in teachers"
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

                <van-checkbox-group v-model="form.comment_ids" ref="checkboxGroup" v-if="!loadingMember && memberPopType == 2">
                    <van-cell-group v-if="form.mode == 2">
                        <van-cell
                            class="flex"
                            v-for="(member, index) in students"
                            :key="index"
                            clickable
                            @click="toggle(index, member)"
                        >
                            <van-checkbox ref="checkboxes" shape="square" class="check-list" :name="member.user_id">
                                <avatar src="https://img01.yzcdn.cn/vant/cat.jpeg" size="36" :name="member.name" :description="member.description"></avatar>
                            </van-checkbox>
                        </van-cell>
                    </van-cell-group>
                    <van-cell-group v-if="form.mode == 3">
                        <van-cell
                            class="flex"
                            v-for="(member, index) in teachers"
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

                <van-submit-bar  v-if="!loadingMember">
                    <template #default>
                        <div class="check-all">
                            <van-checkbox v-model="checkAll" shape="square" name="checkAll">全选</van-checkbox>
                            <van-button type="primary" @click="toggleChange">全选</van-button>
                        </div>
                    </template>
                    <template #button>
                        <div class="member-count flex flex-center" @click="showSelectedMember = true">
                            <template v-if="memberPopType == 1">已选 {{ form.user_ids.length }} 人</template>
                            <template v-if="memberPopType == 2">已选 {{ form.comment_ids.length }} 人</template>
                            <!-- <template>已选 {{ selectedMembers.length }} 人</template> -->
                            <van-icon name="arrow-up" color="#5E636E" size="20" />
                        </div>
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
    name: 'assess-detail',
    data() {
        return {
            disabled: false,
            loadingDetail: true,
            loading: true,
            saving: false,
            form: {
                examine_title: '',
                indicator: '',
                indicators_id: '',
                template: '',
                template_id: '',
                mode: '',
                is_commit: '',
                content: '',
                target: '',
                user_ids: [],
                comment_ids: [],
                status: 1,
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
            memberList: [],
            selectedMembers: [],
            students: [],
            teachers: [],
            loadingMember: true,
            memberPopType: null
        };
    },
    created() {
        this.taskId = this.$route.query.id;
        this.disabled = this.$route.query.disabled ? true : false;
        if(this.taskId) {
            this.$api.get('/v1/examine.detail', {
                id: this.taskId
            }).then(res => {
                if(res.error_code == '0') {
                    let data = _.cloneDeep(res.data);
                    data.target = String(data.target);
                    data.mode = String(data.mode);
                    data.is_commit = String(data.is_commit);
                    data.indicator = data.indicators.title;
                    data.template = data.template_title;
                    this.cascaderValue = data.indicators.id;
                    this.form = data;
                    this.getIndicators();
                    if(this.form.is_commit == 1) {
                        this.getTemplates();
                    }
                    this.getStudentList();
                    this.getTeacherList();
                }
            }).finally(() => {
                this.loadingDetail = false;
            })
        } else {
            this.loadingDetail = false;
            this.getIndicators();
            this.getStudentList();
            this.getTeacherList();
        }
        
    },
    methods: {
        // 获取指标树
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
                                if(second.children_list) {
                                    second.children = second.children_list;
                                    second.children.forEach(third => {
                                        third.text = third.title;
                                        third.value = third.id;
                                    })
                                }
                            })
                        }
                    });
                    this.collection = list;
                }
            })
        },
        // 获取模板
        getTemplates() {
            if(this.templates.length) {
                return false;
            }
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
        // 完成选择指标
        onFinish({ value, selectedOptions, tabInde }) {
            // this.indicatorPicker = false;
            this.form.indicator = selectedOptions.map((option) => option.text).join('/');
            this.form.indicators_id = value;
            this.indicatorPicker = false;
        },
        // cascaderChange({ value, selectedOptions, tabIndex }) {
        //     this.form.indicator = selectedOptions.map((option) => option.text).join('/');
        //     this.form.indicators_id = value;
        // },
        // 选择模板
        changeTemplate(option) {
            this.form.template = option.title;
            this.form.template_id = option.id;
            this.templatePicker = false;
        },
        // 选择考核对象 判断获取学生列表或教师列表
        targetChange() {
            this.memberPopType = 1;
            this.form.user_ids = [];
            this.defaultFn();
        },
        modeChange() {
            this.memberPopType = 2;
            this.form.comment_ids = [];
            this.defaultFn();
        },
        // 是否需要提交 是的话选择模板
        commitChange(name) {
            if(name == 1) {
                if(!this.templates.length) {
                    this.getTemplates();
                }
            }
        },
        // 获取所有学生
        async getStudentList() {
            this.loadingMember = true;
            this.$api.get('/v1/examine.student.list', {
                id: '1'
            })
            .finally(() => {
                this.loadingMember = false;
            })
            .then(res => {
                if(res.error_code == '0') {
                    this.students = res.list;
                    this.memberList = this.students;
                }
            });
        },
        // 获取所有教师
        async getTeacherList() {
            this.loadingMember = true;
            this.$api.get('/v1/examine.teacher.list', {
                id: '1'
            })
            .finally(() => {
                this.loadingMember = false;
            })
            .then(res => {
                if(res.error_code == '0') {
                    this.teachers = res.list;
                    this.memberList = this.teachers;
                }
            });
        },
        submit(event, type) {
            this.form.status = type ? 1 : 0;
            this.$refs.formData.submit();
        },
        // 提交表单
        onSubmit() {
            this.saving = true;
            let form = _.omit(this.form, ['users', 'comments', 'template', 'indicator']);
            // console.log(form);
            let url = '';
            if(this.taskId) {
                url = '/v1/examine.update';
            } else {
                url = '/v1/examine.create';
            }
            this.$api.post(url, form)
            .finally(() => {
                this.saving = false;
            })
            .then(res => {
                if(res.error_code == '0') {
                    if(form.status == 1) {
                        this.$toast.success(this.taskId ? this.$t('common.save')+this.$t('common.success') : this.$t('common.add')+this.$t('common.success'));
                    } else {
                        this.$toast.success('保存成功');
                    }
                    this.$back();
                }
            });
        },
        // 打开考核对象pop
        showTargetMemberList() {
            this.memberPopType = 1;
            if(this.form.target == 1) {
                this.memberList = this.students;
            } else {
                this.memberList = this.teachers;
            }
            if(this.form.user_ids.length == this.memberList.length) {
                if(this.$refs.checkboxGroup) {
                    this.$refs.checkboxGroup.toggleAll(false);
                }
                this.checkAll = true;
            } else {
                this.checkAll = false;
            }
            this.showMember = true;
            // console.log(this.selectedMembers);
        },
        // 打开评价人pop
        showModeMemberList() {
            this.memberPopType = 2;
            if(this.form.mode == 2) {
                this.memberList = this.students;
            } else {
                this.memberList = this.teachers;
            }
            if(this.form.comment_ids == this.memberList.length) {
                this.$refs.checkboxGroup.toggleAll(true);
                this.checkAll = true;
            } else {
                this.checkAll = false;
            }
            this.showMember = true;
        },
        defaultFn() {
            this.checkAll = false;
            this.selectedMembers = [];
            if(this.$refs.checkboxGroup) {
                this.$refs.checkboxGroup.toggleAll(false);
            }
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
        removeMember(member) {
            console.log(member);
        },
        edit() {
            this.disabled = false;
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