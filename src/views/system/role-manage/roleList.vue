<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        :placeholder="'请输入' + tempDesc.name"
        style="width: 200px;margin-right: 20px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="handleFilter">
        刷新
      </el-button>
      <el-button
        v-waves
        v-has="'roleList:add'"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        {{ $t('table.add') }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="tempDesc.code">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tempDesc.name">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tempDesc.remarks">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="tempDesc.isRelatedSysUser" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isRelatedSysUser == 1 ? 'success' : 'danger'" hit>
            {{ scope.row.isRelatedSysUser == 1 ? '&nbsp;&nbsp;是&nbsp;&nbsp;' : '&nbsp;&nbsp;否&nbsp;&nbsp;' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="tempDesc.isRelatedSysPermission" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isRelatedSysPermission == 1 ? 'success' : 'danger'" hit>
            {{ scope.row.isRelatedSysPermission == 1 ? '&nbsp;&nbsp;是&nbsp;&nbsp;' : '&nbsp;&nbsp;否&nbsp;&nbsp;' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="tempDesc.isRelatedWxAccount" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isRelatedWxAccount == 1 ? 'success' : 'danger'" hit>
            {{ scope.row.isRelatedWxAccount == 1 ? '&nbsp;&nbsp;是&nbsp;&nbsp;' : '&nbsp;&nbsp;否&nbsp;&nbsp;' }}
          </el-tag>
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

      <el-table-column v-if="checkBtnPermission(['roleList:edit','roleList:rolesetting','roleList:delete'])" :label="$t('table.actions')" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-has="'roleList:edit'" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)">
            {{ $t('table.edit') }}
          </el-button>
          <router-link :to="'/sysUserManage/roleSetting/'+scope.row.id">
            <el-button v-has="'roleList:rolesetting'" type="primary" size="mini" style="width: 100px;margin-left: 10px;margin-right: 10px;" icon="el-icon-setting">
              权限设置
            </el-button>
          </router-link>
          <el-button v-has="'roleList:delete'" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="tempDesc.code" prop="code">
          <el-input v-model="temp.code" :placeholder="'请输入' + tempDesc.code" :disabled="dialogStatus !='create'" />
        </el-form-item>
        <el-form-item :label="tempDesc.name" prop="name">
          <el-input v-model="temp.name" :placeholder="'请输入' + tempDesc.name" />
        </el-form-item>
        <el-form-item :label="tempDesc.remarks" prop="remarks">
          <el-input v-model="temp.remarks" type="textarea" :rows="7" :placeholder="'请输入' + tempDesc.remarks" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import { checkBtnPermission } from '@/utils/permission' // 权限判断函数
import { fetchList, createRow, updateRow, deleteRow } from '@/api/sys-role'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

// 常量title
const tempDesc = {
  'id': '',
  'code': '角色编码',
  'name': '角色名称',
  'remarks': '备注',
  'createTime': '创建时间',
  'updateTime': '更新时间',
  'isRelatedSysUser': '是否已关联系统用户',
  'isRelatedSysPermission': '是否已关联系统资源',
  'isRelatedWxAccount': '是否已关联微信账号'
}

export default {
  // name: 'ComplexTable',
  components: { Pagination },
  directives: { waves, permission },
  filters: {},
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        name: ''
      },
      showReviewer: false,
      temp: {
        'id': '',
        'code': '',
        'name': '',
        'remarks': '',
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
      rules: {
        code: [
          { required: true, message: '请输入' + tempDesc.code, trigger: 'blur' },
          { min: 1, max: 25, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入' + tempDesc.name, trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        remarks: [
          { max: 200, message: '长度最多200个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkBtnPermission,
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        'id': '',
        'code': '',
        'name': '',
        'remarks': '',
        'createTime': '',
        'updateTime': ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createRow(this.temp).then(() => {
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
          updateRow(tempData).then(() => {
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
      if (row.isRelatedSysUser == '1' || row.isRelatedSysPermission == '1' || row.isRelatedWxAccount == '1') {
        this.$message({ message: '请先解除关联', type: 'warning' })
        return false
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var params = { 'id': row.id }
          deleteRow(params).then(() => {
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
<style>
  #roleSettingDialog .el-dialog__body{
    /*min-height: 400px;overflow: auto;*/
  }
</style>
