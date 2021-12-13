<template>
    <div>
      <van-nav-bar
          :title="templateId ? disabled ? $t('template.templateDetail') : $t('template.templateEdit') : $t('template.templateAdd')"
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
      <!-- 新增模板表单 start -->
      <van-form @submit="onSubmit" class="form" v-if="!loading">
          <van-field
              v-model="templateForm.title"
              name="模板名称"
              :label="$t('template.templateName')"
              :placeholder="$t('template.templateName')"
              :rules="[{ required: true, message: $t('common.fillIn')+$t('template.templateName') }]"
              :readonly="disabled"
          />

          <div class="add-element center" v-if="!disabled">
            <span @click="addElement"><van-icon name="plus" />增加元素</span>
          </div>

          <div v-for="(field, index) in templateForm.form" :key="index">
            <template v-if="field.type == 'text'">
              <van-field
                readonly
                v-model="field.value"
                :name="field.type"
                :label="field.label"
                placeholder="标题"
              >
                <template #label>
                  <div class="flex flex-center">
                    <span class="flex flex-center">
                      <i class="required" v-if="field.is_require == '1'">*</i>
					  					{{ field.label }}
                      <van-icon v-if="field.tip" name="question" class="ml10" color="#ccc" @click="showTips(field)" />
                    </span>
                    <div class="flex" v-if="!disabled">
                      <van-popover
                        v-model="field.showPop"
                        trigger="click"
                        placement="left"
                        :actions="actions"
                        @select="editElement($event, field, index)"
                      >
                        <template #reference>
                          <van-icon name="ellipsis" size="16" color="#323842" />
                        </template>
                      </van-popover>
                    </div>
                  </div>
                  
                </template>
              </van-field>
            </template>
            <template v-if="field.type == 'radio'">
              <van-field :name="field.type" :label="field.label">
                <template #label>
                  <div class="flex flex-center">
                    <span class="flex flex-center">
											<i class="required" v-if="field.is_require == '1'">*</i>
                    	{{ field.label }}
                      <van-icon v-if="field.tip" name="question" class="ml10" color="#ccc" @click="showTips(field)" />
                    </span>
                    <div class="flex" v-if="!disabled">
                      <van-popover
                        v-model="field.showPop"
                        trigger="click"
                        placement="left"
                        :actions="actions"
                        @select="editElement($event, field, index)"
                      >
                        <template #reference>
                          <van-icon name="ellipsis" size="16" color="#323842" />
                        </template>
                      </van-popover>
                    </div>
                  </div>
                </template>
                <template #input>
                  <van-radio-group v-model="field.value" direction="horizontal" :disabled="disabled">
                    <van-radio :name="radio.key" v-for="radio in field.options" :key="radio.value">{{ radio.value }}</van-radio>
                  </van-radio-group>
                </template>
              </van-field>
            </template>
            <template v-if="field.type == 'checkbox'">
              <van-field :name="field.type" :label="field.label">
                <template #label>
                  <div class="flex flex-center">
                    <span class="flex flex-center">
											<i class="required" v-if="field.is_require == '1'">*</i>
                      {{ field.label }}
                      <van-icon v-if="field.tip" name="question" class="ml10" color="#ccc" @click="showTips(field)" />
                    </span>
                    <div class="flex" v-if="!disabled">
                      <van-popover
                        v-model="field.showPop"
                        trigger="click"
                        placement="left"
                        :actions="actions"
                        @select="editElement($event, field, index)"
                      >
                        <template #reference>
                          <van-icon name="ellipsis" size="16" color="#323842" />
                        </template>
                      </van-popover>
                    </div>
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
                :value="field.value"
                :placeholder="field.label"
                @click="showFieldPicker = true"
              >
                <template #label>
                  <div class="flex flex-center">
                    <span class="flex flex-center">
											<i class="required" v-if="field.is_require == '1'">*</i>
                      {{ field.label }}
                      <van-icon v-if="field.tip" name="question" class="ml10" color="#ccc" @click.stop="showTips(field)" />
                    </span>
                    <div class="flex" v-if="!disabled" @click.stop="field.showPop = true">
											<van-icon name="ellipsis" size="16" color="#323842" />
                      <van-popover
                        v-model="field.showPop"
                        trigger="click"
                        placement="left"
                        :actions="actions"
                        @select="editElement($event, field, index)"
                      >
                      </van-popover>
                    </div>
                  </div>
                </template>
              </van-field>
              <van-popup v-model="showFieldPicker" position="bottom">
                <van-picker
                  show-toolbar
                  value-key="value"
                  :columns="field.options"
                  @confirm="showFieldPicker = false"
                  @cancel="showFieldPicker = false"
                />
              </van-popup>
            </template>
            <template v-if="field.type == 'editor'">
              <van-field
                  v-model="field.value"
                  rows="2"
                  autosize
                  :name="field.type"
                  :label="field.label"
                  type="textarea"
                  :placeholder="field.label"
              >
                <template #label>
                  <div class="flex flex-center">
                    <span class="flex flex-center">
											<i class="required" v-if="field.is_require == '1'">*</i>
                      {{ field.label }}
                      <van-icon v-if="field.tip" name="question" class="ml10" color="#ccc" @click="showTips(field)" />
                    </span>
                    <div class="flex" v-if="!disabled">
                      <van-popover
                        v-model="field.showPop"
                        trigger="click"
                        placement="left"
                        :actions="actions"
                        @select="editElement($event, field, index)"
                      >
                        <template #reference>
                          <van-icon name="ellipsis" size="16" color="#323842" />
                        </template>
                      </van-popover>
                    </div>
                  </div>
                </template>
              </van-field>
            </template>
						<template v-if="field.type == 'file'">
							<van-field :name="field.type" :label="field.label">
								<template #input>
									<van-uploader v-model="uploader" :disabled="true">
										<van-button icon="plus">上传文件</van-button>
									</van-uploader>
								</template>
							</van-field>
						</template>
						<template v-if="field.type == 'img'">
							<van-field :name="field.type" :label="field.label">
								<template #input>
									<van-uploader v-model="uploaderImg" :disabled="true" />
								</template>
							</van-field>
						</template>
          </div>

          <div style="margin: 30px 20px" v-if="!disabled">
              <van-button round block type="info" native-type="submit" :loading="saving" :loading-text="$t('common.loading')">{{ templateId ? $t('common.save') : $t('common.add') }}</van-button>
          </div>
      </van-form>
       <!-- 新增模板表单 end -->

      <!-- 添加元素 start -->
      <van-popup closeable v-model="showComponent" position="bottom" :style="{ height: '100%' }">
        <div class="pop-content">
          <van-form @submit="submitElement" ref="elementForm" name="elementForm">
            <van-field
              v-model="elementForm.label"
              name="标题"
              label="标题"
              placeholder="标题"
              :rules="[{ required: true, message: '请填写标题' }]"
            />

            <van-field
              readonly
              clickable
              name="picker"
              :value="elementForm.value"
              :label="$t('template.templateType')"
              :placeholder="$t('template.templateType')"
              :rules="[{ required: true, message: $t('common.fillIn')+$t('template.templateType') }]"
              @click="showPicker = true"
            />
            <van-popup v-model="showPicker" position="bottom">
              <van-picker
                show-toolbar
                :columns="columns"
                @confirm="onConfirm"
                @cancel="showPicker = false"
              />
            </van-popup>

            <template v-if="elementForm.type == 'radio' || elementForm.type == 'checkbox' || elementForm.type == 'select'">
              <van-field
                name="值"
                placeholder="值"
                class="chose-value"
              >
                <template #label>
                  <div class="flex flex-center">
                    <span>值</span>
                    <div class="flex flex-center"  @click="addValue">
                      <van-icon name="plus" />{{ $t('common.addValue') }}
                    </div>
                  </div>
                </template>
                <template #input>
                  <div v-for="(option, index) in elementForm.options" :key="index" class="flex flex-center mb20">
                    <input v-model="elementForm.options[index]" type="text" :name="option" placeholder="值" class="van-field__control"  />
                    <van-icon name="clear" size="20" @click="removeValue(option, index)" class="ml20" />
                  </div>
                </template>
              </van-field>
            </template>

            <van-field
              v-model="elementForm.score"
              name="分数"
              type="number"
              label="分数"
              placeholder="分数"
            />

            <van-field
              v-model="elementForm.tip"
              name="提示语"
              label="提示语"
              placeholder="提示语"
            />

            <van-field name="radio" label="是否必填">
              <template #input>
                <van-radio-group v-model="elementForm.is_require" direction="horizontal">
                  <van-radio :name="1">是</van-radio>
                  <van-radio :name="2">否</van-radio>
                </van-radio-group>
              </template>
            </van-field>


            <div style="margin: 16px;">
              <van-button round block type="info" native-type="submit">确定</van-button>
            </div>
          </van-form>
        </div>
      </van-popup>
      <!-- 添加元素 end -->
    </div>
</template>

<script>
const format = {
  label: '',
  type: '',
  value: '',
  score: '',
  options: [null],
  tip: '',
  is_require: 1
};
import _ from 'lodash';
import { mapState, mapGetters } from 'vuex';
export default {
    name: 'template-form',
    data() {
      return {
        loading: true,
        templateId: null,
        disabled: false,
        saving: false,
        templateForm: {
          title: '',
          form: []

        },
        showPicker: false,
        showComponent: false,
        actions: [
           { text: this.$t('common.edit'), icon: 'edit', type: 'edit' },
           { text: this.$t('common.delete'), icon: 'delete-o', type: 'delete' }
        ],
        columns: [
          {
            text: '文本',
            value: 'text'
          },
          {
            text: '单选',
            value: 'radio'
          },
          {
            text: '多选',
            value: 'checkbox'
          },
          {
            text: '下拉框',
            value: 'select'
          },
					{
            text: '文本域',
            value: 'editor'
          },
          {
            text: '文件',
            value: 'file'
          },
          {
            text: '图片',
            value: 'img'
          }
        ],
        elementForm: format,
        showFieldPicker: false,
				uploader: [],
				uploaderImg: []
      };
    },
    computed: {
        ...mapState(['language']),
    },
    created() {
      this.templateId = this.$route.query.id;
      this.disabled = this.$route.query.disabled ? true : false;
      this.fetch();
    },
    methods: {
       fetch() {
        if(this.templateId) {
          this.$api.get('/v1/template.detail', {
            id: this.templateId
          }).then(res => {
              if(res.error_code == '0') {
                this.templateForm = res.data;
              }
          }).finally(() => {
              this.loading = false;
          })
        } else {
          this.loading = false;
        }
      },
      // 新增 编辑模板
      onSubmit() {
        this.saving = true;
        console.log(this.templateForm);
        let url = '';
        if(this.templateId) {
            url = '/v1/template.update';
        } else {
            url = '/v1/template.create';
        }
        this.$api.post(url, this.templateForm)
        .finally(() => {
          this.saving = false;
        })
        .then(res => {
          this.$toast.success(this.templateId ? this.$t('common.save')+this.$t('common.success') : this.$t('common.add')+this.$t('common.success'));
          this.$back();
        })
      },
      onConfirm(option) {
        this.elementForm.type = option.value;
        this.elementForm.value = option.text;
        this.showPicker = false;
      },
      // 增加元素
      addElement() {
        this.elementForm = _.cloneDeep(format);
        this.showComponent = true;
      },
      // 编辑元素
      editElement(event, field, index) {
				if(event.type == 'edit') {
					this.elementForm = field;
					this.elementForm.id = index;
					this.elementForm.value = this.columns.find((o) => {return o.value == this.elementForm.type}).text;
					if(this.elementForm.options.length) {
						let option = this.elementForm.options;
						this.elementForm.options = [];
						option.map(item => {
							this.elementForm.options.push(item.value);
						})
					}
					this.showComponent = true;
				} else if (event.type == 'delete') {
					this.templateForm.form.splice(index, 1);
				}
      },
      submitElement() {
        const form = _.cloneDeep(this.elementForm);
        let option = form.options;
        if(option.length) {
          form.options = [];
          option.map((item, index) => {
            let obj = {};
            obj.key = 'o' + (index + 1);
            obj.value = item;
            form.options.push(obj);
          })
        }
        delete form.value;
        if(form.id) {
          this.$set(this.templateForm.form, index, form);
        } else {
          this.templateForm.form.push(form);
        }
        this.showComponent = false;
        // console.log(this.templateForm);
      },
      addValue() {
        this.elementForm.options.push('');
      },
      removeValue(option, index) {
        if(index == 0) {
          this.$toast('至少有一个值！');
          return;
        }
        this.elementForm.options.splice(index, 1);
      },
      showTips(field) {
        this.$toast(field.tip);
      },
      edit() {
        this.disabled = false;
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
            margin-right: 0;
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
}
.add-element {
  padding: 20px 0;
  font-size: 28px;
  background: #fff;
}
/deep/ .pop-content {
  padding-top: 98px;

  .chose-value {
    .van-field__control {
      flex-direction: column;
      .flex {
        width: 100%;
      }
    }
  }
}
</style>