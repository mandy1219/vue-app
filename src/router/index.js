import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Form from '../views/form/form.vue';

import AssessIndex from '../views/assess/index.vue';
import AssessTaskList from '../views/assess/assess-list.vue';
import AssessTaskForm from '../views/assess/assess-form.vue';

import TaskIndex from '../views/task/index.vue';
import TaskList from '../views/task/task-list.vue';
import TaskForm from '../views/task/task-form.vue';

import IndicatorIndex from '../views/indicator/index.vue';
import IndicatorRouter from '../views/indicator/indicator-router.vue';
import IndicatorList from '../views/indicator/indicator-list.vue';
import IndicatorQuery from '../views/indicator/indicator-query.vue';
import IndicatorForm from '../views/indicator/indicator-form.vue';

import TemplateIndex from '../views/template/index.vue';
import TemplateList from '../views/template/template-list.vue';
import TemplateForm from '../views/template/template-form.vue';

import MaterialIndex from '../views/material/index.vue';
import MaterialList from '../views/material/material-list.vue';
import MaterialForm from '../views/material/material-form.vue';

import RoomIndex from '../views/room/index.vue';
import RoomList from '../views/room/room-list.vue';
import RoomForm from '../views/room/room-form.vue';

import RecordIndex from '../views/record/index.vue';
import RecordList from '../views/record/record-list.vue';
import RecordForm from '../views/record/record-form.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '',
    component: Home
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/form',
    name: 'form',
    component: Form
  },
  {
    path: '/assess',
    name: 'assess',
    component: AssessIndex,
    children: [
      {
        path: 'list',
        name: 'assess-list',
        component: AssessTaskList
      },
      {
        path: 'form',
        name: 'assess-form',
        component: AssessTaskForm
      }
    ]
  },
  {
    path: '/task',
    name: 'task',
    component: TaskIndex,
    children: [
      {
        path: 'list',
        name: 'task-list',
        component: TaskList
      },
      {
        path: 'form',
        name: 'task-form',
        component: TaskForm
      }
    ]
  },
  {
    path: '/indicator',
    name: 'indicator',
    component: IndicatorIndex,
    children: [
      {
        path: 'router',
        name: 'indicator-router',
        component: IndicatorRouter
      },
      {
        path: 'list',
        name: 'indicator-list',
        component: IndicatorList
      },
      {
        path: 'query',
        name: 'indicator-query',
        component: IndicatorQuery
      },
      {
        path: 'form',
        name: 'indicator-form',
        component: IndicatorForm
      }
    ]
  },
  {
    path: '/template',
    name: 'template',
    component: TemplateIndex,
    children: [
      {
        path: 'list',
        name: 'template-list',
        component: TemplateList
      },
      {
        path: 'form',
        name: 'template-form',
        component: TemplateForm
      }
    ]
  },
  {
    path: '/material',
    name: 'material',
    component: MaterialIndex,
    children: [
      {
        path: 'list',
        name: 'material-list',
        component: MaterialList
      },
      {
        path: 'form',
        name: 'material-form',
        component: MaterialForm
      }
    ]
  },
  {
    path: '/room',
    name: 'room',
    component: RoomIndex,
    children: [
      {
        path: 'list',
        name: 'room-list',
        component: RoomList
      },
      {
        path: 'form',
        name: 'room-form',
        component: RoomForm
      }
    ]
  },
  {
    path: '/record',
    name: 'record',
    component: RecordIndex,
    children: [
      {
        path: 'list',
        name: 'record-list',
        component: RecordList
      },
      {
        path: 'form',
        name: 'record-form',
        component: RecordForm
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
