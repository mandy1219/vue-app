<template>
    <van-form @submit="onSubmit" class="form">
        <van-field
            v-model="form.name"
            name="指标名称"
            label="指标名称"
            placeholder="指标名称"
            :rules="[{ required: true, message: '请填写指标名称' }]"
        />
        <van-field
            v-model="form.score"
            type="score"
            name="指标分值"
            label="指标分值"
            placeholder="指标分值"
            :rules="[{ required: true, message: '请填写指标分值' }]"
        />
        <van-field
            v-model="form.parent"
            is-link
            readonly
            label="父级"
            placeholder="请选择父级"
            @click="picker = true"
            />
            <van-popup v-model="picker" round position="bottom">
            <van-cascader
                v-model="cascaderValue"
                title="请选择所在地区"
                :options="options"
                @close="picker = false"
                @finish="onFinish"
            />
        </van-popup>
        <van-field
            readonly
            clickable
            :value="form.weight"
            name="指标权重"
            label="指标权重"
            placeholder="指标权重"
            @touchstart.native.stop="show = true"
        />
        <van-number-keyboard
            v-model="form.weight"
            :show="show"
            :maxlength="6"
            @blur="show = false"
        />
        <van-field name="radio" label="打分方式">
            <template #input>
                <van-radio-group v-model="form.way" direction="horizontal">
                <van-radio name="1">分数</van-radio>
                <van-radio name="2">打星</van-radio>
                </van-radio-group>
            </template>
        </van-field>

        <van-field
            v-model="form.content"
            rows="2"
            autosize
            label="指标内容"
            type="textarea"
            placeholder="请输入指标内容"
        />
        <van-field
            v-model="form.introduce"
            rows="2"
            autosize
            label="指标简介"
            type="textarea"
            placeholder="请输入指标简介"
        />
        <div style="margin: 50px 20px">
            <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
    </van-form>
</template>

<script>
export default {
    name: '',
    data() {
      return {
          form: {
              name: '',
              score: '',
              parent: '',
              weight: '',
              way: '1',
              content: '',
              introduce: ''
          },
          show: false,
          picker: false,
          cascaderValue: '',
          options: [
            {
                text: '浙江省',
                value: '330000',
                children: [{ text: '杭州市', value: '330100' }],
            },
            {
                text: '江苏省',
                value: '320000',
                children: [{ text: '南京市', value: '320100' }],
            },
            {
                text: '北京',
                value: '100000',
            },
        ],
      };
    },
    created() {},
    methods: {
        onSubmit(values) {
            // console.log(this.form);
        },
        onFinish({ selectedOptions }) {
            this.picker = false;
            this.form.parent = selectedOptions.map((option) => option.text).join('/');
            // if(selectedOptions.length > 1) {
            //     this.form = 
            // }
            
            console.log(selectedOptions);
        }
    }
}

</script>
<style lang='less' scoped>
.form {
    padding-top: 50px;
}
</style>