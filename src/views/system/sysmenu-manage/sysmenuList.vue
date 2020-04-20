<template>

  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row style="margin-top:20px">
    <el-col :span="4"> </el-col>
    <el-col :span="6">
      <div class="mod-btnbox" style="margin-bottom: 20px;">
        <el-button
          size="small"
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-refresh"
          @click="handleFilter()"
        >
          刷新
        </el-button>
        <el-button
          size="small"
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          :icon="expandAll ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"
          @click="handleExpand()"
        >
          {{ expandAllTitle }}
        </el-button>
        <el-button
          size="small"
          v-has="'sysmenuList:add'"

          class="filter-item"

          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >
          添加
        </el-button>
      </div>
      <!--<el-tree class="treeclass" ref="tree" :data="treeData" default-expand-all="" :props="defaultProps" @node-click="nodeclick" @check-change="handleClick" check-strictly node-key="id" show-checkbox></el-tree>-->
    </el-col>

    </el-row>

    <!--<div class="filter-container">-->
      <!--<el-button-->
        <!--size="small"-->
        <!--class="filter-item"-->
        <!--style="margin-left: 10px;"-->
        <!--type="primary"-->
        <!--icon="el-icon-refresh"-->
        <!--@click="handleFilter()"-->
      <!--&gt;-->
        <!--刷新-->
      <!--</el-button>-->
      <!--<el-button-->
        <!--size="small"-->
        <!--class="filter-item"-->
        <!--style="margin-left: 10px;"-->
        <!--type="primary"-->
        <!--:icon="expandAll ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"-->
        <!--@click="handleExpand()"-->
      <!--&gt;-->
        <!--{{ expandAllTitle }}-->
      <!--</el-button>-->
      <!--<el-button-->
        <!--size="small"-->
        <!--v-has="'sysmenuList:add'"-->

        <!--class="filter-item"-->

        <!--type="primary"-->
        <!--icon="el-icon-plus"-->
        <!--@click="handleCreate()"-->
      <!--&gt;-->
        <!--添加-->
      <!--</el-button>-->
    <!--</div>-->
    <tree-table
      :data="menuTree"
      :default-expand-all="expandAll"
      :columns="columns"
      border
      default-children="children"
    >
      <template slot="type" slot-scope="{scope}">
        <span>{{ formatMenuType(scope.row) }}</span>
      </template>

      <template slot="operation" slot-scope="{scope}">
        <el-button v-show="scope.row.type == 'menu'" v-has="'sysmenuList:addsub'" type="primary" size="mini" style="width: 100px;" icon="el-icon-plus" @click="handleCreate(scope.row)">
          添加下级
        </el-button>
        <el-button v-has="'sysmenuList:edit'" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)">
          编辑
        </el-button>
        <el-button v-has="'sysmenuList:delete'" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">
          删除
        </el-button>
      </template>
    </tree-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item v-show="parseInt(temp.level) != 1" :label="tempDesc.parentName" prop="parentName">
          <el-input v-model="temp.parentName" :placeholder="'请输入' + tempDesc.parentName" disabled />
        </el-form-item>
        <el-form-item :label="tempDesc.resources" prop="resources">
          <el-input
            v-model="temp.resources"
            :placeholder="'请输入' + tempDesc.resources"
            :disabled="dialogStatus !='create'"
          />
        </el-form-item>
        <el-form-item :label="tempDesc.title" prop="title">
          <el-input v-model="temp.title" :placeholder="'请输入' + tempDesc.title" />
        </el-form-item>
        <el-form-item :label="tempDesc.type" prop="type">
          <el-select
            v-model="temp.type"
            class="filter-item"
            :placeholder="'请选择' + tempDesc.type"
            style="width: 280px;"
            clearable
          >
            <el-option v-for="item in menuTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="tempDesc.icon" prop="icon">
          <el-input v-model="temp.icon" :placeholder="'请输入' + tempDesc.icon" />
        </el-form-item>
        <el-form-item :label="tempDesc.sortNo" prop="sortNo">
          <el-input v-model="temp.sortNo" type="number" :placeholder="'请输入' + tempDesc.sortNo" />
        </el-form-item>
        <el-form-item :label="tempDesc.remarks" prop="remarks">
          <el-input v-model="temp.remarks" type="textarea" :rows="7" :placeholder="'请输入' + tempDesc.remarks" />
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
import { checkBtnPermission } from '../../../utils/permission' // 权限判断函数
import { fetchList, createRow, updateRow, deleteRow, listTreePermission } from '../../../utils/actions'
// import waves from '@/directive/waves' // Waves directive
import treeTable from '../../../components/TreeTable'
import { validateCh } from '../../../utils/validate'
// 常量title
const tempDesc = {
  'id': '',
  'parentId': '',
  'resources': '编码',
  'title': '名称',
  'level': '级别',
  'sortNo': '排序',
  'icon': '图标',
  'type': '类型',
  'remarks': '备注',
  'createTime': '创建时间',
  'updateTime': '更新时间',
  'parentName': '上级菜单'
}

const menuTypeOptions = [
  { key: 'menu', display_name: '菜单' },
  { key: 'button', display_name: '按钮' }
]

export default {
  components: { treeTable },
  // directives: { waves },
  data() {
    const _validateCh = (rule, value, callback) => {
      if (!!value && validateCh(value)) {
        callback(new Error('不能包含中文'))
      }
      callback()
    }
    return {
      expandAll: false,
      expandAllTitle: '展开全部',
      tempDesc: tempDesc,
      listLoading: true,
      columns: [
        {
          label: tempDesc.title,
          key: 'title',
          width: 220,
          expand: true,
          align: 'left',
          headerAlign: 'center'
        },
        {
          label: tempDesc.resources,
          key: 'resources'
        },
        {
          label: tempDesc.type,
          key: 'type'
        },
        {
          label: tempDesc.icon,
          key: 'icon'
        },
        {
          label: tempDesc.sortNo,
          key: 'sortNo'
        },
        {
          label: tempDesc.remarks,
          key: 'remarks'
        }
        //          {
        //            label: tempDesc.createTime,
        //            key: 'createTime',
        //            width:160
        //          },
        //          {
        //            label: tempDesc.updateTime,
        //            key: 'updateTime',
        //            width:160
        //          },
        //          {
        //            label: '操作',
        //            key: 'operation',
        //            width:300
        //          }
      ],
      menuList: [],
      menuTree: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '增加'
      },
      temp: {
        'id': '',
        'parentId': '',
        'resources': '',
        'title': '',
        'level': '',
        'sortNo': '',
        'icon': '',
        'type': '',
        'remarks': '',
        'createTime': '',
        'updateTime': '',
        'parentName': ''
      },
      menuTypeOptions,
      rules: {
        resources: [
          { required: true, message: '请输入' + tempDesc.resources, trigger: 'blur' },
          { min: 1, max: 25, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          { validator: _validateCh, trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入' + tempDesc.title, trigger: 'blur' },
          { min: 1, max: 25, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择' + tempDesc.type, trigger: 'blur' }
        ],
        sortNo: [
          { required: true, message: '请输入' + tempDesc.sortNo, trigger: 'blur' }
        ],
        remarks: [
          { max: 200, message: '长度最多200个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.checkBtnPermission(['sysmenuList:addsub', 'sysmenuList:edit', 'sysmenuList:delete'])) {
      this.columns.push({ label: '操作', key: 'operation', width: 320 })
    }
    this.getList()
  },
  methods: {
    checkBtnPermission,
    getList() {
      this.listLoading = true
      listTreePermission().then(response => {
        this.menuList = response.data.menuList
        this.menuTree = response.data.menuTree
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.getList()
    },
    resetTemp() {
      this.temp = {
        'id': '',
        'parentId': '',
        'resources': '',
        'title': '',
        'level': '',
        'sortNo': '',
        'icon': '',
        'type': '',
        'remarks': '',
        'createTime': '',
        'updateTime': '',
        'parentName': ''
      }
    },
    handleCreate(row) {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true

      if (!row) { // 一级菜单
        this.temp.level = '1'// 默认一级菜单
        this.temp.parentId = '0'
      }
      if (row) { // 子菜单
        this.temp.level = parseInt(row.level) + 1
        this.temp.parentId = row.id
        this.temp.parentName = row.title
      }

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
      // this.temp = Object.assign({}, row) // copy obj

      this.temp.id = row.id
      this.temp.parentId = row.parentId
      this.temp.title = row.title
      this.temp.resources = row.resources
      this.temp.type = row.type
      this.temp.icon = row.icon
      this.temp.sortNo = row.sortNo
      this.temp.remarks = row.remarks

      this.dialogStatus = 'update'
      this.dialogFormVisible = true

      var parentNode = this.findTreeNode(row.parentId)

      if (parentNode) {
        this.temp.parentName = parentNode.title
      }

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
    },
    formatMenuType(row, column) {
      switch (row.type) {
        case 'menu':
          return '菜单';

        case 'button':
          return '按钮';

      }
    },
    findTreeNode(id) {
      var node = this._.find(this.menuList, { id: parseInt(id) })
      return node
    },
    handleExpand() {
      this.expandAll = !this.expandAll
      this.expandAllTitle = this.expandAll ? '折叠全部' : '展开全部'
    }
  }

}
</script>

<style>
  .modt-box {
    width: 100%;
    height: 60px;
    line-height: 60px;
    background-color: #f0f2f5;
    text-align: center;
    color: #334157;
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 24px;
  }
</style>
