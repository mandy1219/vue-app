<template>
    <div>
        <van-nav-bar
            :title="parentId ? disabled ? $t('indicator.indicatorDetail') : $t('indicator.indicatorEdit') : $t('indicator.indicatorAdd')"
            left-arrow
            :right-text="disabled ? $t('common.edit') : ''"
            @click-left="$back"
             @click-right="edit"
            :safe-area-inset-top="true"
            :placeholder="true"
            :fixed="true"
         >
            <template #left>
                <van-icon name="arrow-left" size="22" color="#060C19" />
            </template>
        </van-nav-bar>
        <van-form @submit="onSubmit" class="form" v-if="!loading">
            <van-field
                v-model="form.title"
                name="指标名称"
                :label="$t('indicator.indicatorName')"
                :placeholder="$t('indicator.indicatorName')"
                :rules="[{ required: true, message: $t('common.fillIn')+$t('indicator.indicatorName') }]"
                :readonly="disabled"
            />

            <van-field
                v-model="form.score"
                type="score"
                name="指标分值"
                :label="$t('indicator.indicatorScore')"
                :placeholder="$t('indicator.indicatorScore')"
                :rules="[{ required: true, message: $t('common.fillIn')+$t('indicator.indicatorScore') }]"
                :readonly="disabled"
            />

            <van-field name="配置等级" :label="$t('indicator.level')" class="chose-value">
                <template #label>
                  <div class="flex flex-center">
                    <span>{{ $t('indicator.level') }}</span>
                    
                    <div class="flex flex-center"  @click="addValue" v-if="form.is_level && !disabled">
                      <van-icon name="plus" />{{ $t('common.addValue') }}
                    </div>
                  </div>
                </template>
                <template #input>
                    <div class="flex mb20">
                        <van-switch v-model="form.is_level" size="20" @change="changeLevel" :disabled="disabled" />
                    </div>
                    <template v-if="form.is_level">
                        <div class="flex flex-center step-input" v-for="(step, index) in form.level_config" :key="index">
                            <div class="flex-1 flex flex-center">
                                <span>等级</span>
                                <input type="text" v-model="step.level" placeholder="等级" class="van-field__control"  />
                            </div>
                            <div class="flex-2 flex step-field">
                                <span>范围</span>
                                <input type="number" v-model="step.min" placeholder="范围" class="van-field__control"  />
                                <i>~</i>
                                <input type="number" v-model="step.max" placeholder="范围" class="van-field__control"  />
                                <!-- <van-stepper integer v-model="step.min" /> -->
                                <!-- <van-stepper integer v-model="step.max" :min="step.min" /> -->
                            </div>
                            <van-icon name="clear" size="20" @click="removeValue(step, index)" class="ml20" v-if="!disabled" />
                        </div>
                    </template>
                </template>
            </van-field>
            <van-field
                readonly
                clickable
                name="选择父级"
                v-model="form.parent"
                :label="$t('indicator.indicatorParent')"
                :placeholder="$t('indicator.indicatorParent')"
                @click="showPicker()"
                class="filed-picker"
                right-icon="arrow-down"
            />
            <van-popup v-model="picker" round position="bottom">
                <van-cascader
                    v-model="cascaderValue"
                    :title="$t('common.select')+$t('indicator.indicatorParent')"
                    :options="collection"
                    @close="picker = false"
                    @finish="onFinish"
                    @change="cascaderChange"
                    active-color="#477CFF"
                />
            </van-popup>
            <!-- <van-field
                readonly
                clickable
                :value="form.weight"
                name="指标权重"
                :label="$t('indicator.indicatorWeight')"
                :placeholder="$t('indicator.indicatorWeight')"
                @touchstart.native.stop="showWeight"
                :rules="[{ required: true, message: $t('common.fillIn')+$t('indicator.indicatorWeight') }]"
            />
            <van-number-keyboard
                v-model="form.weight"
                :show="show"
                :maxlength="6"
                @blur="show = false"
            /> -->

            <!-- <van-field name="radio" :label="$t('indicator.indicatorScoreType')" :readonly="disabled">
                <template #input>
                    <van-radio-group v-model="form.score_type" direction="horizontal" :disabled="disabled">
                        <van-radio v-for="item in scoreType" :key="item.value" :name="item.value">{{ item.text }}</van-radio>
                    </van-radio-group>
                </template>
            </van-field> -->

            <van-field
                v-model="form.content"
                rows="2"
                autosize
                name="指标内容"
                :label="$t('indicator.indicatorContent')"
                type="textarea"
                :placeholder="$t('indicator.indicatorContent')"
                :readonly="disabled"
            />
            <van-field
                v-model="form.introduce"
                rows="2"
                autosize
                name="指标简介"
                :label="$t('indicator.indicatorIntroduce')"
                type="textarea"
                :placeholder="$t('indicator.indicatorIntroduce')"
                :readonly="disabled"
            />

            <!-- <van-field
                readonly
                clickable
                name="picker"
                :value="form.picker"
                label="佐证材料"
                placeholder="佐证材料"
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
            </van-popup> -->

            <div style="margin: 30px 20px" v-if="!disabled">
                <van-button round block type="info" native-type="submit" :loading="saving" :loading-text="$t('common.loading')">{{ parentId ? $t('common.save') : $t('common.add') }}</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
const level = [
    {
        'level': 'A',
        'min': 90,
        'max': 100
    },
    {
        'level': 'B',
        'min': 80,
        'max': 90
    },
    {
        'level': 'C',
        'min': 60,
        'max': 79
    },
    {
        'level': 'D',
        'min': 0,
        'max': 59
    }
];
import _ from 'lodash';
import { mapState, mapGetters } from 'vuex';
export default {
    name: 'indicator-form',
    computed: {
      ...mapGetters(['indicatorsTree']),
      ...mapState(['language']),
	},
    data() {
        return {
            loading: true,
            parentId: null,
            disabled: false,
            saving: false,
            collection: [
                {
                    text: this.$t('common.null'),
                    value: '0'  
                }
            ],
            switchValue: false,
            form: {
                title: '',
                score: '',
                is_level: false,
                level_config: [],
                parent: this.$t('common.null'),
                parent_id: '0',
                score_type: 1,
                content: '',
                introduce: ''
            },
            scoreType: [
                {
                    text: this.$t('indicator.score'),
                    value: 1
                },
                {
                    text: this.$t('indicator.star'),
                    value: 2
                }
            ],
            show: false,
            picker: false,
            cascaderValue: '0',
            columns: ['需要', '不需要'],
        };
    },
    created() {
        // console.log(this.$route);
        console.log(this.language);
        this.parentId = this.$route.query.id;
        this.disabled = this.$route.query.disabled ? true : false;
        const tree = _.cloneDeep(this.indicatorsTree);
        const list = tree && tree.length ? tree : [];
        // console.log(tree);
        list.forEach(first => {
            first.text = first.title;
            first.value = first.id;
            if(first.childlist) {
                first.children = first.childlist;
                first.children.forEach(second => {
                    second.text = second.title;
                    second.value = second.id;
                    delete second.childlist;
                })
            }
        });
        this.collection = this.collection.concat(tree);
        // console.log(this.collection);

        if(this.parentId) {
            this.$api.get('/v1/indicators.detail', {
                id: this.parentId
            }).then(res => {
                if(res.error_code == '0') {
                    let data = _.cloneDeep(res.data);
                    // data.weight = String(data.weight);
                    data.is_level = data.is_level == 1 ? true : false;
                    if(data.parents) {
                        if(data.parents.parents) {
                            data.parent = `${data.parents.parents.title}/${data.parents.title}`;
                        } else {
                            data.parent = `${data.parents.title}`;
                        }
                    } else {
                        data.parent = '无';
                    }
                    this.cascaderValue = String(data.parent_id);
                    this.form = data;
                }
            }).finally(() => {
                this.loading = false;
            })
        } else {
            this.loading = false;
        }
    },
    methods: {
        onSubmit() {
            console.log(this.form);
            let form = _.cloneDeep(this.form);
            form.is_level = form.is_level ? 1 : 0;
            this.saving = true;
            let url = '';
            if(this.parentId) {
                url = '/v1/indicators.update';
            } else {
                url = '/v1/indicators.create';
            }
            this.$api.post(url, this.form)
            .finally(() => {
                this.saving = false;
            })
            .then(res => {
                if(res.error_code == '0') {
                    this.$toast.success(this.parentId ? this.$t('common.save')+this.$t('common.success') : this.$t('common.add')+this.$t('common.success'));
                    this.$back();
                } else{
                    // Toast.fail(res);
                }
            });
        },
        onFinish({ selectedOptions }) {
            this.picker = false;
            // this.form.parent = selectedOptions.map((option) => option.text).join('/');
            // console.log(selectedOptions);
        },
        cascaderChange({ value, selectedOptions, tabIndex }) {
            // this.picker = false;
            this.form.parent = selectedOptions.map((option) => option.text).join('/');
            this.form.parent_id = value;
            console.log(value);
            console.log(selectedOptions);
        },
        onConfirm() {
        },
        showPicker() {
            if(this.disabled) {
                return false;
            }
            this.picker = true;
        },
        showWeight() {
            if(this.disabled) {
                return false;
            }
            this.show = true;
        },
        changeLevel(event) {
            if(event) {
                this.form.level_config = level;
            } else {
                this.form.level_config = [];
            }
        },
        removeValue(option, index) {
            if(index == 0) {
                this.$toast('至少配置一个等级！');
                return;
            }
            this.form.level_config.splice(index, 1);
        },
        addValue() {
            let obj = {
                level: '',
                min: 0,
                max: 0
            };
            this.form.level_config.push(obj);
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
            width: auto;
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
            right: 20px;
        }
    }
    .add {
        color: #477CFF;
    }
    .chose-value {
        .van-field__control {
        flex-direction: column;
        .flex {
            width: 100%;
        }
        }
    }
    .step-input {
        margin-bottom: 20px;
        .van-field__control {
            width: 140px;
        }
        .van-stepper__input {
            padding: 0 !important;
            width: 80px;
        }
        .step-field {
            padding-left: 20px;
            align-items: center;
            justify-content: space-around;
        }
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