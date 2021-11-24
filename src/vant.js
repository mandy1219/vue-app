//以这种方式引入自己需要的组件
import Vue from 'vue'
import {
    Button,
    RadioGroup,
    Cell,
    CellGroup,
    Search
} from 'vant';

const components = [
    Button,
    RadioGroup,
    Cell,
    CellGroup,
    Search
];

components.forEach(component => {
    Vue.use(component)
})
