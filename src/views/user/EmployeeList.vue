<template>
  <div>
    <el-row :gutter="20" style="margin-top: 10px">
      <el-col :span="22" :offset="1">
        <el-button type="primary" plain @click="addVisible = true">添 &nbsp; 加</el-button>
        <el-button type="danger" plain @click="deleteBatch" :disabled="multiple">批量删除</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 5px">
      <el-col :span="22" :offset="1">
        <el-table
          :data="empList"
          style="width: 100%"
          ref="multipleTable"
          @selection-change="handleSelectChange"
        >
          <el-table-column
            type="selection"
            align="center"
          />
          <el-table-column
            label=""
            width="80"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="学工号"
            width="180"
          >
            <template slot-scope="scope">
              <span style="margin-right: 10px">{{ scope.row.kwEmpid }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="姓名"
            width="180"
          >
            <template slot-scope="scope">
              <el-tag size="medium">{{ scope.row.kwName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="部门名称"
            width="180"
          >
            <template slot-scope="scope">
              <span size="medium">{{ scope.row.departmentName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="用户类型"
            width="180"
          >
            <template slot-scope="scope">
              <span size="medium">{{ scope.row.employeeTypeName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="启用日期"
            width="180"
          >
            <template slot-scope="scope">
              <span size="medium">{{ scope.row.kwBeginDate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="失效日期"
            width="180"
          >
            <template slot-scope="scope">
              <span size="medium">{{ scope.row.kwEndDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          style="margin-top: 10px"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100, 200]"
          :current-page="pageNo"
          :page-size="pageSize"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          @prev-click="getEmployeePage(pageNo-1,pageSize)"
          @next-click="getEmployeePage(pageNo+1,pageSize)"
        />
      </el-col>
    </el-row>
    <!--    添加用户弹出层-->
    <el-dialog
      title="添加用户"
      :visible.sync="addVisible"
      width="30%"
    >
      <el-form ref="formRef" :rules="empRules" :model="emp" label-width="80px">
        <el-form-item label="用户卡号" prop="kwEmpid">
          <el-input v-model="emp.kwEmpid"/>
        </el-form-item>
        <el-form-item label="姓名" prop="kwName">
          <el-input v-model="emp.kwName"/>
        </el-form-item>
        <el-form-item label="部门" prop="kwDepartment">
          <el-select v-model="emp.kwDepartment" placeholder="请选择部门">
            <el-option v-for="(dept,index) in departmentList" :key="index" :label="dept.kwDepartmentname" :value="dept.oid"/>
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型" prop="kwEmployeetype">
          <el-select v-model="emp.kwEmployeetype" placeholder="请选择类型">
            <el-option v-for="(empType,index) in employeeTypeList" :key="index" :label="empType.kwEmployeetypename" :value="empType.oid"/>
          </el-select>
        </el-form-item>
        <el-form-item label="登记日期" prop="kwBeginDate">
          <el-col :span="11">
            <el-date-picker
              v-model="emp.kwBeginDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="失效日期" prop="kwEndDate">
          <el-col :span="11">
            <el-date-picker
              v-model="emp.kwEndDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add('formRef')">添加</el-button>
          <el-button @click="restForm('formRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--   修改用户弹出层-->
    <el-dialog
      title="修改用户"
      :visible.sync="editVisible"
      width="30%"
    >
      <el-form ref="formRef" :rules="empRules" :model="emp" label-width="80px">
        <el-form-item label="用户卡号" prop="kwEmpid">
          <el-input v-model="emp.kwEmpid" :disabled="true"/>
        </el-form-item>
        <el-form-item label="姓名" prop="kwName">
          <el-input v-model="emp.kwName"/>
        </el-form-item>
        <el-form-item label="部门" prop="kwDepartment">
          <el-select v-model="emp.kwDepartment" placeholder="请选择部门">
            <el-option v-for="(dept,index) in departmentList" :key="index" :label="dept.kwDepartmentname" :value="dept.oid" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型" prop="kwEmployeetype">
          <el-select  v-model="emp.kwEmployeetype" placeholder="请选择类型">
            <el-option v-for="(empType,index) in employeeTypeList" :key="index" :label="empType.kwEmployeetypename" :value="empType.oid" />
          </el-select>
        </el-form-item>
        <el-form-item label="登记日期" prop="kwBeginDate">
          <el-col :span="11">
            <el-date-picker
              v-model="emp.kwBeginDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="失效日期" prop="kwEndDate">
          <el-col :span="11">
            <el-date-picker
              v-model="emp.kwEndDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="edit('formRef')">修改</el-button>
          <el-button @click="restForm('formRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'EmployeeList',
  data() {
    return {
      empList: [],
      departmentList: [],
      employeeTypeList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      pages: 0,
      addVisible: false,
      editVisible: false,
      emp: {
        kwEmpid: '',
        kwName: '',
        kwDepartment: '',
        kwEmployeetype: '',
        kwBeginDate: '',
        kwEndDate: ''
      },
      empRules: {
        kwEmpid: [
          {
            required: true, message: '请输入学工号', trigger: 'blur'
          }, {
            min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'
          }
        ],
        kwName: [
          {
            required: true, message: '请输入姓名', trigger: 'blur'
          }, {
            min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'
          }
        ],
        kwDepartment: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        kwEmployeetype: [
          { required: true, message: '请选择用户类型', trigger: 'change' }
        ]
      },
      multipleSelection: [],
      ids: [],
      // 非多个禁用
      multiple: true,
      single: true
    }
  },
  mounted() {
    this.getEmployeePage(this.pageNo, this.pageSize)
    this.getDepartments()
    this.getEmployeeTypes()
  },
  activated() {
    this.getEmployeePage(this.pageNo, this.pageSize)
  },
  methods: {
    deleteBatch() {
      const that = this
      console.log(that.ids)
      that.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post('http://localhost:8080/emp/batchDeleteEmp', that.ids).then(function(resp) {
          console.log(resp)
          if (resp.data.code === '2000') {
            that.$message({
              type: 'success',
              message: '删除成功!'
            })
            that.getEmployeePage(that.pageNo, that.pageSize)
            that.ids = []
          } else {
            that.$message(resp.data.msg)
          }
        })
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 批量操作
    handleSelectChange(val) {
      const that = this
      that.multipleSelection = val
      // console.log(this.multipleSelection)
      val.forEach(e => that.ids.push(e.kwEmpid))
      // console.log(that.ids)
      that.single = val.length !== 1
      that.multiple = !val.length
    },
    // 修改用户
    handleEdit(index, row) {
      // console.log(index, row.kwEmpid)
      const that = this
      that.editVisible = true
      // console.log(row)
      axios.get('http://localhost:8080/emp/employee', {
        params: {
          kwEmpid: row.kwEmpid
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(response) {
        console.log(response)
        that.emp = response.data.data
      })
    },
    edit(formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.post('http://localhost:8080/emp/updateEmploy', JSON.stringify(that.emp), {
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(function(response) {
            if (response.data.code === '2000') {
              that.$message({
                message: '修改成功',
                center: true,
                type: 'success'
              })
              that.getEmployeePage(that.pageNo, that.pageSize)
              that.editVisible = false
            } else {
              that.$message(response.data.msg)
            }
          })
        } else {
          this.$message('参数不合法')
          return false
        }
      })
    },
    // 添加用户
    add(formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.post('http://localhost:8080/emp/insertEmp', JSON.stringify(that.emp), {
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(function(response) {
            if (response.data.code === '2000') {
              that.$message({
                message: '添加成功',
                center: true,
                type: 'success'
              })
              that.getEmployeePage(that.pageNo, that.pageSize)
              that.addVisible = false
            } else {
              that.$message(response.data.msg)
            }
          })
        } else {
          this.$message('参数不合法')
          return false
        }
      })
    },
    // 重置表单
    restForm(formName) {
      this.$refs[formName].resetFields()
    },
    getEmployeeTypes() {
      const that = this
      axios.get('http://localhost:8080/empType/empTypeList').then(function(response) {
        // console.log(response)
        if (response.data.code === '2000') {
          that.employeeTypeList = response.data.data
        } else {
          that.$message(response.data.msg)
        }
      })
    },
    getDepartments() {
      const that = this
      axios.get('http://localhost:8080/dept/deptList').then(function(response) {
        if (response.data.code === '2000') {
          that.departmentList = response.data.data
        } else {
          that.$message(response.data.msg)
        }
      })
    },
    getEmployeePage(pn, ps) {
      const that = this
      that.pageNo = pn
      that.pagesize = ps
      axios.get('http://localhost:8080/emp/employees', {
        params: {
          pageNo: pn,
          pageSize: ps
        }
      }).then(function(resp) {
        that.empList = resp.data.data.list
        that.total = resp.data.data.total
        that.pages = resp.data.data.pages
      })
    },
    // 改变每页数据的数量
    handleSizeChange(val) {
      this.pageSize = val
      this.getEmployeePage(this.pageNo, val)
    },
    // 改变当前页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.pageNo = val
      this.getEmployeePage(val, this.pageSize)
    },
    // 删除用户
    handleDelete(index, row) {
      // console.log(index, row.kwEmpid)
      const that = this
      that.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.get('http://localhost:8080/emp/deleteEmpByEmpId', {
          params: {
            kwEmpid: row.kwEmpid
          }
        }).then(function(resp) {
          // console.log(resp)
          if (resp.data.code === '2000') {
            that.$message({
              type: 'success',
              message: '删除成功!'
            })
            that.getEmployeePage(that.pageNo, that.pageSize)
          } else {
            that.$message(resp.data.msg)
          }
        })
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
