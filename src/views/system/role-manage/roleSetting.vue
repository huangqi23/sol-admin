<template>
  <div class="app-container">
    <div style="display: block;height: 10px" />
    <span style="font-size: 25px;font-weight: bold;">角色 ： {{ roleData.name }}</span>
    <div style="display: block;height: 20px" />
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="分配用户" name="allotUser">
        <el-button v-show="userList.length > 0" type="primary" style="margin-bottom: 20px;margin-left: 20px;" @click="saveRoleUser">
          保存
        </el-button>
        <el-tree ref="userTree" :check-strictly="true" :data="userTree" :props="defaultPropsUser" :default-checked-keys="defaultCheckedKeysUser" show-checkbox node-key="id" class="permission-tree" />
      </el-tab-pane>
      <el-tab-pane label="分配菜单" name="allotMenu">
        <el-button v-show="menuList.length > 0" type="primary" style="margin-bottom: 20px;margin-left: 20px;" @click="saveRoleMenu">
          保存
        </el-button>
        <el-tree ref="menuTree" :check-strictly="true" :data="menuTree" :props="defaultPropsMenu" :default-checked-keys="defaultCheckedKeysMenu" show-checkbox node-key="id" class="permission-tree" />
      </el-tab-pane>
      <el-tab-pane label="分配公众号" name="allotWxAccount">
        <el-button v-show="wxAccountList.length > 0" type="primary" style="margin-bottom: 20px;margin-left: 20px;" @click="saveRoleWxAccount">
          保存
        </el-button>
        <el-tree ref="wxAccountTree" :check-strictly="true" :data="wxAccountTree" :props="defaultPropsWxAccount" :default-checked-keys="defaultCheckedKeysWxAccount" show-checkbox node-key="id" class="permission-tree" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import { getRow, getRoleUserByRole, getRolePermissionByRole, getRoleWxAccountByRole, saveRoleUser, saveRoleMenu, saveRoleWxAccount } from '@/api/sys-role'
import { listTreeUser } from '@/api/sys-user'
import { listTreePermission } from '@/api/sys-permission'
import { listTreeWxAccount } from '@/api/wx-account'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  // name: 'ComplexTable',
  components: { Pagination },
  directives: { waves, permission },
  filters: {},
  data() {
    return {
      roleId: '',
      roleData: {
        'id': '',
        'code': '',
        'name': '',
        'remarks': '',
        'createTime': '',
        'updateTime': ''
      },
      activeName: 'allotUser',

      defaultPropsUser: {
        children: 'children',
        label: 'nickName'
      },
      defaultCheckedKeysUser: [],
      userList: [],
      userTree: [],

      defaultPropsMenu: {
        children: 'children',
        label: 'title'
      },
      defaultCheckedKeysMenu: [],
      menuList: [],
      menuTree: [],

      defaultPropsWxAccount: {
        children: 'children',
        label: 'name'
      },
      defaultCheckedKeysWxAccount: [],
      wxAccountList: [],
      wxAccountTree: []
    }
  },
  created() {
    this.roleId = this.$route.params.id
    this.getData()
    this.getUserTabData()
    this.getMenuTabData()
    this.getWxAccountTabData()
  },
  methods: {
    getData() {
      var params = { 'id': this.roleId }
      getRow(params).then(res => {
        this.roleData = res.data
      })
    },
    getUserTabData() {
      // 获取树节点数据
      this.listTreeUser()
      // 获取树节点选中数据
      this.getRoleUserByRole()
    },
    listTreeUser() {
      listTreeUser().then(response => {
        this.userList = response.data.userList
        this.userTree = response.data.userTree
      })
    },
    getRoleUserByRole() {
      var params = { 'roleId': this.roleId }
      getRoleUserByRole(params).then(response => {
        if (response.data && response.data.length > 0) {
          this.defaultCheckedKeysUser = this._.map(response.data, 'userId')
        }
      })
    },
    getMenuTabData() {
      // 获取树节点数据
      this.listTreePermission()
      // 获取树节点选中数据
      this.getRolePermissionByRole()
    },
    listTreePermission() {
      listTreePermission().then(response => {
        this.menuList = response.data.menuList
        this.menuTree = response.data.menuTree
      })
    },
    getRolePermissionByRole() {
      var params = { 'roleId': this.roleId }
      getRolePermissionByRole(params).then(response => {
        if (response.data && response.data.length > 0) {
          this.defaultCheckedKeysMenu = this._.map(response.data, 'permissionId')
        }
      })
    },
    getWxAccountTabData() {
      // 获取树节点数据
      this.listTreeWxAccount()
      // 获取树节点选中数据
      this.getRoleWxAccountByRole()
    },
    listTreeWxAccount() {
      listTreeWxAccount().then(response => {
        this.wxAccountList = response.data.wxAccountList
        this.wxAccountTree = response.data.wxAccountTree
      })
    },
    getRoleWxAccountByRole() {
      var params = { 'roleId': this.roleId }
      getRoleWxAccountByRole(params).then(response => {
        if (response.data && response.data.length > 0) {
          this.defaultCheckedKeysWxAccount = this._.map(response.data, 'wxAccountId')
        }
      })
    },
    handleTabClick(tab, event) {
      //        if(this.activeName === 'allotUser'){
      //          this.getUserTabData();
      //        }
      //        if(this.activeName === 'allotMenu'){
      //          this.getMenuTabData();
      //        }
      //        if(this.activeName === 'allotWxAccount'){
      //          this.getWxAccountTabData();
      //        }
    },
    saveRoleUser() {
      var selectedIds = this.$refs.userTree.getCheckedKeys()
      var params = { 'roleId': this.roleId, 'ids': selectedIds.join(',') }
      saveRoleUser(params).then(() => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    saveRoleMenu() {
      var selectedIds = this.$refs.menuTree.getCheckedKeys()
      var params = { 'roleId': this.roleId, 'ids': selectedIds.join(',') }
      saveRoleMenu(params).then(() => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    saveRoleWxAccount() {
      var selectedIds = this.$refs.wxAccountTree.getCheckedKeys()
      var params = { 'roleId': this.roleId, 'ids': selectedIds.join(',') }
      saveRoleWxAccount(params).then(() => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
