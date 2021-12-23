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
                @click="showPicker"
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
                    <div class="flex flex-center w100" @click="showTargetMemberList()" v-if="!disabled">
                        <span class="add"><van-icon name="plus" class="mr10" />选择人员</span>
                        <span>已选 {{ form.user_ids.length }} 人</span>
                    </div>
                    <div v-else>
                        <span class="flex flex-center w100">已选 {{ form.user_ids.length }} 人<van-icon name="arrow-up" color="#5E636E" size="20" /></span>
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
                    <div class="flex flex-center w100" @click="showModeMemberList()"  v-if="!disabled">
                        <span class="add"><van-icon name="plus" class="mr10" />选择人员</span>
                        <span>已选 {{ form.comment_ids.length }} 人</span>
                    </div>
                    <div v-else>
                        <span class="flex flex-center w100">已选 {{ form.comment_ids.length }} 人<van-icon name="arrow-up" color="#5E636E" size="20" /></span>
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
                @click="showTemplatePicker"
                class="filed-picker"
                right-icon="arrow-down"
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
            <div class="loading" v-if="loadingMember"><van-loading /></div>
            <template  v-if="!loadingMember">
                <member-list v-if="show && form.target == 1" title="选择考核对象" :member-list="students" :user-ids="form.user_ids" @close="closeMember" @confirm="confirmMember" :selected-list="form.user_names"></member-list> 
                <member-list v-if="show && form.target == 2" title="选择考核对象" :member-list="teachers" :user-ids="form.user_ids" @close="closeMember" @confirm="confirmMember" :selected-list="form.user_names"></member-list> 
            </template>
        </van-popup>

        <van-popup 
            v-model="showComment"
            position="bottom"
            class="select-member-pop"
            :style="{ height: '100%' }"
        >
            <div class="loading" v-if="loadingMember"><van-loading /></div>
            <template  v-if="!loadingMember">
                <member-list v-if="show && form.mode == 2" title="选择评价人员" :member-list="students" :user-ids="form.comment_ids" @close="closeComment" @confirm="confirmComment" :selected-list="form.comment_names"></member-list> 
                <member-list v-if="show && form.mode == 3" title="选择评价人员" :member-list="teachers" :user-ids="form.comment_ids" @close="closeComment" @confirm="confirmComment" :selected-list="form.comment_names"></member-list> 
            </template>
        </van-popup>

    </div>
</template>

<script>
import _ from 'lodash';
import avatar from '../../components/avatar.vue';
import memberList from '../../components/member-list.vue';
export default {
    components: { memberList },
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
            showMember: false,
            showComment: false,
            showSelectedMember: false,
            members: [],
            students: [],
            teachers: [],
            loadingMember: true,
            show: false
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
        showPicker() {
            if(this.disabled) {
                return false;
            }
            this.indicatorPicker = true;
        },
        showTemplatePicker() {
            if(this.disabled) {
                return false;
            }
            this.templatePicker = true;
        },
        // 选择模板
        changeTemplate(option) {
            this.form.template = option.title;
            this.form.template_id = option.id;
            this.templatePicker = false;
        },
        // 选择考核对象 判断获取学生列表或教师列表
        targetChange() {
            this.form.user_ids = [];
            this.show = false;
        },
        modeChange() {
            this.form.comment_ids = [];
            this.show = false;
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
            this.showMember = true;
            this.show = true; // 此处加show是为了让组件每次打开都触发created
        },
        // 打开评价人pop
        showModeMemberList() {
            this.showComment = true;
            this.show = true;
        },
        removeMember(member) {
            // console.log(member);
        },
        // 详情页编辑
        edit() {
            this.disabled = false;
        },
        // 关闭选人弹窗
        closeMember() {
            this.showMember = false;
             this.show = false;
        },
        // 选人确定
        confirmMember(userIds) {
            this.form.user_ids = userIds;
            this.showMember = false;
        },
        // 关闭选人弹窗
        closeComment() {
            this.showComment = false;
            this.show = false;
        },
        // 选人确定
        confirmComment(userIds) {
            this.form.comment_ids = userIds;
            this.showComment = false;
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
/deep/ .member-pop {
    .member-count {
        padding-left: 40px;
        height: 90px;
        line-height: 90px;
        font-size: 36px;
    }
    .member-list {
        height: 100px;
        padding: 0 40px;
        // border-bottom: 1px solid #ebedf0;
    }
}

</style>