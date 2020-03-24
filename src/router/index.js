import Vue from 'vue';
import VueRouter from 'vue-router';
// 登录
import login from '@/views/login';
// 首页
import index from '@/views/index';

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: '',
        component: login,
        hidden: true,
        meta: {
            requireAuth: false
        }
    },
    {
        path: '/index',
        name: '首页',
        component: index,
        iconCls: 'el-icon-tickets',
    }
]

const router = new VueRouter({
    mode: 'hash',
    base: '/data/web/sol-admin/',
  routes
})

export default router
