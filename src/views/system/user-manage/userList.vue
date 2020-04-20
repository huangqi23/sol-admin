<template>

  <div class="app-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row style="margin-top:20px">
      <el-col :span="4"> </el-col>
      <el-col :span="8">
        <div class="mod-btnbox" style="margin-bottom: 20px;">
          <el-input
            size="small"
            v-model="listQuery.username"
            :placeholder="'请输入' + tempDesc.username"
            style="width: 200px;margin-right: 20px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-button  size="small" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button
            size="small"
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            icon="el-icon-refresh"
            @click="handleFilter"
          >
            刷新
          </el-button>
          <el-button
            size="small"
            v-has="'userList:add'"
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            icon="el-icon-plus"
            @click="handleCreate"
          >
            添加
          </el-button>
        </div>
        <!--<el-tree class="treeclass" ref="tree" :data="treeData" default-expand-all="" :props="defaultProps" @node-click="nodeclick" @check-change="handleClick" check-strictly node-key="id" show-checkbox></el-tree>-->
      </el-col>

    </el-row>

    <el-table
      :key="tableKey"

      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="tempDesc.username" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column :label="tempDesc.pwd" show-overflow-tooltip>-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ scope.row.pwd }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column :label="tempDesc.nickName" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tempDesc.avatar" width="120px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>
            <img :src="scope.row.avatar" alt="" style="width: 50px;height: 50px">
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="tempDesc.sex" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.sex==0 ? '男':'女' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tempDesc.flag" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag :type="scope.row.flag == 1 ? 'success' : 'danger'" hit>
            {{ scope.row.flag == 1 ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="tempDesc.phone" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tempDesc.email" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column :label="tempDesc.createTime" width="160px" show-overflow-tooltip>-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{ scope.row.createTime }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column :label="tempDesc.updateTime" width="160px" show-overflow-tooltip>-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{ scope.row.updateTime }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column v-if="checkBtnPermission(['userList:edit','userList:delete'])" label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-has="'userList:edit'" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)">
            编辑
          </el-button>
          <el-button v-has="'userList:delete'" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="listQuery" @callFather="callFather"></Pagination>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="tempDesc.username" prop="username">
          <el-input v-model="temp.username" :placeholder="'请输入' + tempDesc.username" :disabled="dialogStatus !='create'" />
        </el-form-item>
        <el-form-item :label="tempDesc.nickName" prop="nickName">
          <el-input v-model="temp.nickName" :placeholder="'请输入' + tempDesc.nickName" />
        </el-form-item>
        <el-form-item :label="tempDesc.avatar" prop="avatar">
          <span>
            <img :src="temp.avatar" alt="" style="width: 50px;height: 50px">
          </span>
        </el-form-item>
        <el-form-item :label="tempDesc.pwd" prop="pwd">
          <el-input v-model="temp.pwd" type="password" :placeholder="'请输入' + tempDesc.pwd" autocomplete="off" />
          <span v-show="dialogStatus !='create'" style="font-size: 12px;color: #909399">Tips : 密码若不修改，请留空</span>
        </el-form-item>
        <el-form-item :label="tempDesc.confirmPwd" prop="confirmPwd">
          <el-input v-model="temp.confirmPwd" type="password" :placeholder="'请输入' + tempDesc.confirmPwd" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="tempDesc.sex" prop="sex">
          <el-select v-model="temp.sex" class="filter-item" :placeholder="'请选择' + tempDesc.sex" style="width: 280px;">
            <el-option v-for="item in sexOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="tempDesc.flag" prop="flag">
          <el-select v-model="temp.flag" class="filter-item" :placeholder="'请选择' + tempDesc.flag" style="width: 280px;">
            <el-option v-for="item in flagOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="tempDesc.phone" prop="phone">
          <el-input v-model="temp.phone" :placeholder="'请输入' + tempDesc.phone" />
        </el-form-item>
        <el-form-item :label="tempDesc.email" prop="email">
          <el-input v-model="temp.email" :placeholder="'请输入' + tempDesc.email" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import permission from '@/directive/permission/index.js' // 权限判断指令
import { checkBtnPermission } from '../../../utils/permission' // 权限判断函数
import { fetchUserList, createUser, updateUser, deleteUser } from '../../../utils/actions'
// import waves from '@/directive/waves' // Waves directive
import Pagination from '../../../components/Pagination' // Secondary package based on el-pagination
import { validatePhone, validEmail } from '../../../utils/validate'
// 常量title
const tempDesc = {
  'id': '',
  'username': '登录名',
  'pwd': '密码',
  'confirmPwd': '确认密码',
  'nickName': '昵称',
  'sex': '性别',
  'phone': '手机号',
  'email': '邮箱',
  'avatar': '头像地址',
  'flag': '状态',
  'createTime': '创建时间',
  'updateTime': '更新时间'
}

const sexOptions = [
  { key: '0', display_name: '男' },
  { key: '1', display_name: '女' }
]

const flagOptions = [
  { key: '1', display_name: '启用' },
  { key: '0', display_name: '停用' }
]

export default {
  // name: 'ComplexTable',
  components: { Pagination },
  filters: {},
  data() {
    const validatePwd = (rule, value, callback) => {
      if (this.dialogStatus == 'create') {
        if (!value) {
          callback(new Error('请输入密码'))
        } else {
          if (value.length < 6 || value.length > 15) {
            callback(new Error('密码长度6-15位'))
          }
          if (this.temp.confirmPwd) {
            this.$refs.dataForm.validateField('confirmPwd')
          }
        }
        callback()
      }
      if (this.dialogStatus != 'create') {
        if (!value) {
          callback()
        } else {
          if (value.length < 6 || value.length > 15) {
            callback(new Error('密码长度6-15位'))
          }
          if (this.temp.confirmPwd) {
            this.$refs.dataForm.validateField('confirmPwd')
          }
        }
        callback()
      }
    }
    const validatePwd2 = (rule, value, callback) => {
      if (this.dialogStatus == 'create') {
        if (!value) {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.temp.pwd) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      if (this.dialogStatus != 'create') {
        if (!value) {
          callback()
        } else if (value !== this.temp.pwd) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
    }
    const _validatePhone = (rule, value, callback) => {
      if (!!value && !validatePhone(value)) {
        callback(new Error('请输入11位手机号'))
      }
      callback()
    }
    const _validateEmail = (rule, value, callback) => {
      if (!!value && !validEmail(value)) {
        callback(new Error('请输入正确的邮箱格式'))
      }
      callback()
    }
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
          currentPage: 0,
          pageSize: 10,
          total:0,
        username: ''
      },
      showReviewer: false,
      temp: {
        'id': '',
        'username': '',
        'pwd': '',
        'confirmPwd': '',
        'nickName': '',
        'sex': '',
        'phone': '',
        'email': '',
        'avatar': '',
        'flag': '',
        'createTime': '',
        'updateTime': ''
      },
      tempDesc: tempDesc,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '增加'
      },
      sexOptions,
      flagOptions,
      rules: {
        username: [
          { required: true, message: '请输入' + tempDesc.username, trigger: 'blur' },
          { min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur' }
        ],
        nickName: [{ required: true, message: '请输入' + tempDesc.nickName, trigger: 'blur' }],
        avatar: [{ required: true, message: '请输入' + tempDesc.avatar, trigger: 'blur' }],
        sex: [{ required: true, message: '请选择' + tempDesc.sex, trigger: 'blur' }],
        flag: [{ required: true, message: '请选择' + tempDesc.flag, trigger: 'blur' }],
        pwd: [{ validator: validatePwd, trigger: 'blur' }],
        confirmPwd: [{ validator: validatePwd2, trigger: 'blur' }],
        phone: [{ validator: _validatePhone, trigger: 'blur' }],
        email: [{ validator: _validateEmail, trigger: 'blur' }]
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkBtnPermission,
      // 分页插件事件
      callFather(parm) {
          this.listQuery.currentPage = parm.currentPage
          this.listQuery.pageSize = parm.pageSize
          this.getList(this.listQuery)
      },
    getList() {
      this.listLoading = true
      fetchUserList(this.listQuery).then(response => {
        this.list = response.data.content
          this.listQuery.total = response.data.totalElements
      })
    },
    handleFilter() {
      this.listQuery.currentPage = 0
      this.getList()
    },
    resetTemp() {
      this.temp = {
        'id': '',
        'username': '',
        'pwd': '',
        'nickName': '',
        'sex': '',
        'phone': '',
        'email': '',
        'avatar': '',
        'flag': '',
        'createTime': '',
        'updateTime': ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.temp.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createUser(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateUser(tempData).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var params = { 'id': row.id }
          deleteUser(params).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        })
    }
  }
}
</script>
