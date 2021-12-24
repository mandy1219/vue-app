<template>
    <div>
        <van-nav-bar
            title="考核任务"
            left-arrow
            @click-left="$back"
            :safe-area-inset-top="true"
            :placeholder="true"
            :fixed="true"
         >
            <template #left>
               <van-icon name="arrow-left" size="22" color="#060C19" />
            </template>
        </van-nav-bar>
        <van-form @submit="onSubmit" class="form" v-if="!loading">
            <div v-for="(field, index) in form" :key="index">
                <template v-if="field.type == 'text'">
                    <van-field
                        :readonly="disabled"
                        v-model="field.value[0]"
                        :name="field.type"
                        :label="field.label"
                        :placeholder="field.label"
                        :rules="[{ required: field.is_require == '1' ? true : false, message: '请填写用户名' }]"
                    >
                    <template #label>
                        <div class="flex flex-center">
                            <span class="flex flex-center">
                                <i class="required" v-if="field.is_require == '1'">*</i>
                                {{ field.label }}
                                <van-icon v-if="field.tip" name="question" class="ml10" color="#ccc" @click="showTips(field)" />
                            </span>
                        </div>
                    </template>
                    </van-field>
                </template>
                <template v-if="field.type == 'radio'">
                    <van-field
                        :name="field.type"
                        :label="field.label"
                        :rules="[{ required: field.is_require == '1' ? true : false, message: '请填写用户名' }]"
                    >
                        <template #label>
                            <div class="flex flex-center">
                                <span class="flex flex-center">
                                    <i class="required" v-if="field.is_require == '1'">*</i>
                                    {{ field.label }}
                                    <van-icon v-if="field.tip" name="question" class="ml10" color="#ccc" @click="showTips(field)" />
                                </span>
                            </div>
                        </template>
                        <template #input>
                            <van-radio-group v-model="field.value[0]" direction="horizontal" :disabled="disabled">
                                <van-radio :name="radio.key" v-for="radio in field.options" :key="radio.value">{{ radio.value }}</van-radio>
                            </van-radio-group>
                        </template>
                    </van-field>
                </template>
                <template v-if="field.type == 'checkbox'">
                    <van-field
                        :name="field.type"
                        :label="field.label"
                        :rules="[{ required: field.is_require == '1' ? true : false, message: '请填写用户名' }]"
                    >
                        <template #label>
                            <div class="flex flex-center">
                                <span class="flex flex-center">
                                    <i class="required" v-if="field.is_require == '1'">*</i>
                                    {{ field.label }}
                                    <van-icon v-if="field.tip" name="question" class="ml10" color="#ccc" @click="showTips(field)" />
                                </span>
                            </div>
                        </template>
                        <template #input>
                            <van-checkbox-group v-model="field.value" direction="horizontal" :disabled="disabled">
                                <van-checkbox shape="square" :name="checkBox.key" v-for="checkBox in field.options" :key="checkBox.value">{{ checkBox.value }}</van-checkbox>
                            </van-checkbox-group>
                        </template>
                    </van-field>
                </template>
                <template v-if="field.type == 'select'">
                    <van-field
                        readonly
                        clickable
                        :name="field.type"
                        :label="field.label"
                        :value="field.text"
                        :placeholder="field.label"
                        @click="showPicker = true"
                        :rules="[{ required: field.is_require == '1' ? true : false, message: '请填写用户名' }]"
                    >
                        <template #label>
                            <div class="flex flex-center">
                                <span class="flex flex-center">
                                    <i class="required" v-if="field.is_require == '1'">*</i>
                                    {{ field.label }}
                                    <van-icon v-if="field.tip" name="question" class="ml10" color="#ccc" @click.stop="showTips(field)" />
                                </span>
                            </div>
                        </template>
                    </van-field>
                    <van-popup v-model="showPicker" position="bottom">
                        <van-picker
                            show-toolbar
                            value-key="value"
                            :columns="field.options"
                            @confirm="pickerConfirm($event, field)"
                            @cancel="showPicker = false"
                        />
                    </van-popup>
                </template>
                <template v-if="field.type == 'editor'">
                    <van-field
                        rows="2"
                        autosize
                        :name="field.type"
                        :label="field.label"
                        :value="field.text"
                        type="textarea"
                        :placeholder="field.label"
                        :rules="[{ required: field.is_require == '1' ? true : false, message: '请填写用户名' }]"
                    >
                        <template #label>
                            <div class="flex flex-center">
                                <span class="flex flex-center">
                                    <i class="required" v-if="field.is_require == '1'">*</i>
                                    {{ field.label }}
                                    <van-icon v-if="field.tip" name="question" class="ml10" color="#ccc" @click="showTips(field)" />
                                </span>
                            </div>
                        </template>
                    </van-field>
                </template>
                <template v-if="field.type == 'file'">
                    <van-field
                        :name="field.type"
                        :label="field.label"
                        :rules="[{ required: field.is_require == '1' ? true : false, message: '请填写用户名' }]"
                    >
                        <template #label>
                            <div class="flex flex-center">
                                <span class="flex flex-center">
                                    <i class="required" v-if="field.is_require == '1'">*</i>
                                    {{ field.label }}
                                    <van-icon v-if="field.tip" name="question" class="ml10" color="#ccc" @click="showTips(field)" />
                                </span>
                            </div>
                        </template>
                        <template #input>
                            <van-uploader
                                v-model="field.files"
                                :disabled="disabled"
                                :after-read="afterReadFile(field)"
                                accept=".jpg, .jpeg, .png, .xlsx, .txt, .docx, .pdf, .doc, .xls "
                            >
                                <van-button icon="plus" class="van-uploader__upload"></van-button>
                                <!-- <div class="van-uploader__upload">
                                    <van-icon name="plus"></van-icon>{{ $t('template.uploadFile') }}
                                </div> -->
                            </van-uploader>
                        </template>
                    </van-field>
                </template>
                <template v-if="field.type == 'img'">
                    <van-field
                        :name="field.type"
                        :label="field.label"
                        :rules="[{ required: field.is_require == '1' ? true : false, message: '请填写用户名' }]"
                    >
                        <template #label>
                            <div class="flex flex-center">
                                <span class="flex flex-center">
                                    <i class="required" v-if="field.is_require == '1'">*</i>
                                    {{ field.label }}
                                    <van-icon v-if="field.tip" name="question" class="ml10" color="#ccc" @click="showTips(field)" />
                                </span>
                            </div>
                        </template>
                        <template #input>
                            <van-uploader v-model="field.files" :disabled="disabled" :after-read="afterReadFile(field)" />
                        </template>
                    </van-field>
                </template>
            </div>

            <div style="margin: 30px 20px" v-if="!disabled">
                <van-button round block type="info" native-type="submit" :loading="saving" :loading-text="$t('common.loading')">提交</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
import _ from 'lodash';
import axios from 'axios';
export default {
    components: { },
    name: 'task-detail',
    data() {
        return {
            taskId: '',
            disabled: false,
            loading: true,
            detail: {},
            form: [],
            saving: false,
            showPicker: false,
            uploader: [],
			uploaderImg: []
        };
    },
    created() {
        this.taskId = this.$route.query.id;
        if(this.taskId) {
            this.$api.get('/v1/examine.record.detail', { id: this.taskId })
            .finally(() => {
                this.loading = false;
            })
            .then(res => {
                if(res.error_code == '0') {
                    this.detail = res.data;
                    this.form = res.data.template ? res.data.template.form : []
                    this.form.forEach(item => {
                        if(!item.value) {
                            item.value = [];
                        }
                    })
                    // this.form = res.data.form;
                }
            });
        }
    },
    methods: {
        onSubmit(){
            this.saving = true;
            let form = _.cloneDeep(this.form);
            form.forEach(item => {
                if(item.type == 'file' || item.type == 'img') {
                    if(item.files && item.files.length) {
                        item.files.forEach(file => {
                            item.value.push(file.url);
                        })
                        delete item.files;
                    }
                }
            })
            console.log(form);
            
            this.$api.post('/v1/examine.record.create', {
                id: this.taskId,
                form: form
            })
            .finally(() => {
                this.saving = false;
            })
            .then(res => {
                if(res.error_code == '0') {
                    this.$toast.success(this.$t('common.submit')+this.$t('common.success'));
                    this.$back();
                } else {
                    this.$toast.fail(res.error_code);
                }
            })
        },
        // 点击问号显示tips
        showTips(field) {
            this.$toast(field.tip);
        },
        afterReadFile(field) {
            return file => {
                let formData = new FormData();
                formData.append('file', file.file);
                // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
                axios.post(`${this.$serviceUrl}/v1/upload`, formData)
                .then(res => {
                    if(res.error_code == '0') {
                        file.url = res.data;
                    }
                })
            }
        },
        afterReadImg(file) {
            // console.log(file);
            // console.log(this.form);
        },
        pickerConfirm(event, field) {
            // console.log(event);
            field.text = event.value;
            field.value.push(event.key);
            this.showPicker = false;
        }
    }
}

</script>
<style lang='less' scoped>
/deep/ .van-form {
    .required {
		margin-right: 10px;
		color: #f95252d9;
	}
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
            color: #5E636E;
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
</style>