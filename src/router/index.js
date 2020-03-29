import Vue from 'vue';
import VueRouter from 'vue-router';
// 登录
import login from '@/views/login';
// 首页
import index from '@/views/index';
/**
 * 系统管理
 */
// 用户管理
import user from '@/views/system/user';
// 菜单管理
import Module from '../views/system/Module';
// 角色管理
import Role from '@/views/system/Role';
// 公司管理
import Dept from '@/views/system/Dept';
// 系统环境变量
import Variable from '@/views/system/Variable';
// 权限管理
import Permission from '@/views/system/Permission';

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
        children: [{
            path: '/system/Dept',
            name: '公司管理',
            component: Dept,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/sysmenuList',
            name: '菜单管理',
            component: Module,
            meta: {
                requireAuth: true
            }
        }
        // , {
        //     path: '/system/user',
        //     name: '用户管理',
        //     component: user,
        //     meta: {
        //         requireAuth: true
        //     }
        // }, {
        //     path: '/system/Module',
        //     name: '菜单管理',
        //     component: Module,
        //     meta: {
        //         requireAuth: true
        //     }
        // }, {
        //     path: '/system/Role',
        //     name: '角色管理',
        //     component: Role,
        //     meta: {
        //         requireAuth: true
        //     }
        // }, {
        //     path: '/system/Variable',
        //     name: '系统环境变量',
        //     component: Variable,
        //     meta: {
        //         requireAuth: true
        //     }
        // }, {
        //     path: '/system/Permission',
        //     name: '权限管理',
        //     component: Permission,
        //     meta: {
        //         requireAuth: true
        //     }
        // }
        ]
    }
]

const router = new VueRouter({
    mode: 'hash',
    base: '/data/web/sol-admin/',
  routes
})

export default router
