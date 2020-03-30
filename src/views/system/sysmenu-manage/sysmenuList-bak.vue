<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate()"
      >
        {{ $t('table.add') }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-refresh"
        @click="handleFilter()"
      >
        刷新
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="handleExpand()"
      >
        展开全部
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="handleClose()"
      >
        折叠全部
      </el-button>
    </div>
    <tree-table v-loading="listLoading" :data="menuTree" :columns="columns" border :default-expand-all="expandAll">
      <el-table-column :label="tempDesc.resources">
        <template slot-scope="scope">
          <span>{{ scope.row.resources }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column :label="tempDesc.level">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ scope.row.level }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column :label="tempDesc.sortNo">
        <template slot-scope="scope">
          <span>{{ scope.row.sortNo }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tempDesc.icon">
        <template slot-scope="scope">
          <span>{{ scope.row.icon }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tempDesc.type" :formatter="formatMenuType" />
      <el-table-column :label="tempDesc.remarks">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tempDesc.createTime" width="160px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tempDesc.updateTime" width="160px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-show="scope.row.type == 'menu'" type="primary" size="mini" style="width: 80px;" @click="handleCreate(scope.row)">
            添加下级
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
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
          <el-input v-model="temp.resources" :placeholder="'请输入' + tempDesc.resources" :disabled="dialogStatus !='create'" />
        </el-form-item>
        <el-form-item :label="tempDesc.title" prop="title">
          <el-input v-model="temp.title" :placeholder="'请输入' + tempDesc.title" />
        </el-form-item>
        <el-form-item :label="tempDesc.sortNo" prop="sortNo">
          <el-input v-model="temp.sortNo" type="number" :placeholder="'请输入' + tempDesc.sortNo" />
        </el-form-item>
        <el-form-item :label="tempDesc.icon" prop="icon">
          <el-input v-model="temp.icon" :placeholder="'请输入' + tempDesc.icon" />
        </el-form-item>
        <el-form-item :label="tempDesc.type" prop="type">
          <el-select v-model="temp.type" class="filter-item" :placeholder="'请选择' + tempDesc.type" style="width: 280px;" clearable>
            <el-option v-for="item in menuTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
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
import { fetchAllAccount } from '@/api/wx-account'
import { fetchAllTextTpl } from '@/api/wx-text-template'
import { fetchAllNewsTpl } from '@/api/wx-news-template'
import { fetchList, createRow, updateRow, deleteRow, listTreePermission } from '@/api/sys-permission'
import waves from '@/directive/waves' // Waves directive
import treeTable from '@/components/TreeTable'
import { validateCh } from '@/utils/validate'
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
  directives: { waves },
  data() {
    const _validateCh = (rule, value, callback) => {
      if (!!value && validateCh(value)) {
        callback(new Error('不能包含中文'))
      }
      callback()
    }
    return {
      expandAll: false,
      tempDesc: tempDesc,
      listLoading: true,
      columns: [
        {
          text: tempDesc.title,
          value: 'title',
          width: 200
        }
      ],
      menuList: [
      ],
      menuTree: [
      ],
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
        sortNo: [
          { required: true, message: '请输入' + tempDesc.sortNo, trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择' + tempDesc.type, trigger: 'blur' }
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
      this.temp = Object.assign({}, row) // copy obj
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
          return '菜单'
          break
        case 'button':
          return '按钮'
          break
      }
    },
    findTreeNode(id) {
      var node = this._.find(this.menuList, { id: parseInt(id) })
      return node
    },
    handleExpand() {
      this.expandAll = true
    },
    handleClose() {
      this.expandAll = false
    }
  }

}
</script>
