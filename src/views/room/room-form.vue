<template>
    <div>
        <van-nav-bar
            :title="roomId ? disabled ? $t('room.roomDetail') : $t('room.roomEdit') : $t('room.roomAdd')"
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
                name="房间名称"
                :label="$t('room.roomName')"
                :placeholder="$t('room.roomName')"
                :rules="[{ required: true, message: $t('common.fillIn')+$t('room.roomName') }]"
                :readonly="disabled"
            />

            <van-field
                readonly
                clickable
                :value="form.count"
                name="数量"
                :label="$t('room.roomCount')"
                :placeholder="$t('room.roomCount')"
                @touchstart.native.stop="showKeyboard = true"
                :rules="[{ required: true, message: $t('common.fillIn')+$t('room.roomCount') }]"
            >
            </van-field>
            <van-number-keyboard
                v-model="form.count"
                :show="showKeyboard"
                :maxlength="6"
                @blur="showKeyboard = false"
            />

           <van-field
                v-model="form.description"
                name="房间描述"
                :label="$t('room.description')"
                :placeholder="$t('room.description')"
                :readonly="disabled"
            />


            <van-field
                v-model="form.status"
                name="状态"
                :label="$t('room.roomStatus')"
                :placeholder="$t('room.roomStatus')"
                :readonly="disabled"
            />
            <!-- :rules="[{ required: true, message: $t('common.fillIn')+$t('room.roomStatus') }]" -->

            <van-field
                v-model="form.instructions"
                rows="2"
                autosize
                name="房间说明"
                :label="$t('room.instructions')"
                type="textarea"
                :placeholder="$t('room.instructions')"
                :readonly="disabled"
            />


            <div style="margin: 30px 20px" v-if="!disabled">
              <van-button round block type="info" native-type="submit" :loading="saving" :loading-text="$t('common.loading')">{{ roomId ? $t('common.save') : $t('common.add') }}</van-button>
          </div>
        </van-form>
    </div>
</template>

<script>
export default {
    name: 'room-form',
    data() {
        return {
            loading: true,
            roomId: null,
            disabled: false,
            saving: false,
            form: {
                title: '',
                count: '',
                buy_at: '',
                status: '',
                is_return: 1,
                description: '',
                instructions: ''
            },
            showKeyboard: false,
            showPicker: false,
            currentDate: new Date(2021, 0, 17),
        };
    },
    created() {
        this.roomId = this.$route.query.id;
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