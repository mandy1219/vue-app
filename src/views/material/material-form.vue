<template>
    <div>
        <van-nav-bar
            :title="materialId ? disabled ? $t('material.materialDetail') : $t('material.materialEdit') : $t('material.materialAdd')"
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
                name="物资名称"
                :label="$t('material.materialName')"
                :placeholder="$t('material.materialName')"
                :rules="[{ required: true, message: $t('common.fillIn')+$t('material.materialName') }]"
                :readonly="disabled"
            />

            <van-field
                readonly
                clickable
                :value="form.count"
                name="数量"
                :label="$t('material.materialCount')"
                :placeholder="$t('material.materialCount')"
                @touchstart.native.stop="showKeyboard = true"
                :rules="[{ required: true, message: $t('common.fillIn')+$t('material.materialCount') }]"
            />
            <van-number-keyboard
                v-model="form.weight"
                :show="showKeyboard"
                :maxlength="6"
                @blur="showKeyboard = false"
            />

            <van-field
                readonly
                clickable
                name="购买日期"
                :value="form.buy_at"
                label="购买日期"
                placeholder="购买日期"
                @click="showPicker = true"
            />
            <van-popup v-model="showPicker" position="bottom">
                <van-datetime-picker
                    v-model="currentDate"
                    type="date"
                    title="选择年月日"
                    @cancel="showPicker = false"
                    @confirm="confirm"
                 />
            </van-popup>

            <van-field
                v-model="form.status"
                name="状态"
                :label="$t('material.materialStatus')"
                :placeholder="$t('material.materialStatus')"
                :readonly="disabled"
            />
            <!-- :rules="[{ required: true, message: $t('common.fillIn')+$t('material.materialStatus') }]" -->

            <van-field name="是否需要归还" label="是否需要归还">
                <template #input>
                    <van-radio-group v-model="form.is_return" direction="horizontal">
                    <van-radio :name="1">是</van-radio>
                    <van-radio :name="2">否</van-radio>
                    </van-radio-group>
                </template>
            </van-field>

            <van-field
                v-model="form.instructions"
                rows="2"
                autosize
                name="物资说明"
                :label="$t('material.instructions')"
                type="textarea"
                :placeholder="$t('material.instructions')"
                :readonly="disabled"
            />


            <div style="margin: 30px 20px" v-if="!disabled">
              <van-button round block type="info" native-type="submit" :loading="saving" :loading-text="$t('common.loading')">{{ materialId ? $t('common.save') : $t('common.add') }}</van-button>
          </div>
        </van-form>
    </div>
</template>

<script>
export default {
    name: 'material-form',
    data() {
        return {
            loading: true,
            materialId: null,
            disabled: false,
            saving: false,
            form: {
                title: '',
                count: '',
                buy_at: '',
                status: '',
                is_return: 1,
                instructions: ''
            },
            showKeyboard: false,
            showPicker: false,
            currentDate: new Date(2021, 0, 17),
        };
    },
    created() {
        this.materialId = this.$route.query.id;
        this.disabled = this.$route.query.disabled ? true : false;
        this.loading = false;
    },
    methods: {
        onSubmit() {

        },
        edit() {
            this.disabled = false;
        },
        cancel() {},
        confirm() {
            this.showPicker = false;
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
    .field-folding {
        padding: 0 50px;
        .van-field__control {
            display: block;
        }
        .van-cell {
            padding: 20px 10px;
            display: flex;
            justify-content: space-between;
            .van-cell__title {
                margin: 0;

                span {
                    font-weight: normal;
                    font-size: 28px;
                }
            }
        }
        .van-collapse-item__content {
            padding: 0 30px;
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
}
</style>