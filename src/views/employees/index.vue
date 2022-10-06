<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template #after>
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import?type=user')"
            >导入</el-button
          >
          <el-button size="small" type="danger" @click="exportData"
            >导出</el-button
          >
          <el-button size="small" type="primary" @click="showDialog = true"
            >新增员工</el-button
          >
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="list">
          <!-- //border:显示边框,:border="true" -->
          <el-table-column
            label="序号"
            sortable=""
            type="index"
            align="center"
          />
          <!-- //sortable是可排序的意思:规范写法sortable,只写属性名，代表:sortable="true" -->
          <!-- label列名 -->
          <el-table-column
            label="姓名"
            sortable=""
            prop="username"
            align="center"
          />
          <el-table-column label="头像" align="center">
            <template slot-scope="{ row }">
              <img
                v-imagerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto"
                style="
                  border-radius: 50%;
                  width: 100px;
                  height: 100px;
                  padding: 10px;
                "
                alt=""
                @click="showQrCode(row.staffPhoto)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="工号"
            sortable=""
            prop="workNumber"
            align="center"
          />
          <el-table-column
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
            align="center"
            :formatter="formatEmployment"
          />
          <el-table-column
            label="部门"
            sortable=""
            prop="departmentName"
            align="center"
          />
          <el-table-column label="入职时间" sortable="" align="center">
            <template slot-scope="{ row }">{{
              row.timeOfEntry | formatDate
            }}</template>
          </el-table-column>
          <el-table-column
            label="账户状态"
            sortable=""
            prop="enableState"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            sortable=""
            fixed="right"
            width="280"
            align="center"
          >
            <template slot-scope="{ row }">
              <!-- //table-column嵌套其他标签,需要用template,不需要写插槽名，默认插槽 -->
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
              >
                查看
              </el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <add-employee :show-dialog.sync="showDialog" @addOk="addOk" />
    <!-- 头像弹出层 -->
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getEmployeeList, delEmployee, addEmployee } from "@/api/employees";
import employeeEnum from "@/api/constant/employees.js";
import AddEmployee from "./components/add-employee.vue";
import { formatDate } from "@/filters";
import QrCode from "qrcode";
export default {
  // 组件名称
  name: "Employees",
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: {
    AddEmployee,
  },
  // 组件状态值
  data() {
    return {
      showCodeDialog: false,
      list: [],
      loading: false,
      page: {
        page: 1,
        size: 10,
        total: 0,
      },
      showDialog: false,
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    // 分页方法
    changePage(newPage) {
      this.page.page = newPage;
      this.getEmployeeList();
    },
    // 获取员工列表
    async getEmployeeList() {
      this.loading = true;
      const { rows, total } = await getEmployeeList(this.page);
      this.page.total = total;
      this.list = rows;
      this.loading = false;
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      const arr = employeeEnum.hireType.find((item) => item.id == cellValue);
      return arr ? arr.value : "未知";
    },
    // 删除员工的方法
    async delEmployee(id) {
      try {
        await this.$confirm("确定要删除该员工吗?");
        await delEmployee(id);
        this.getEmployeeList();
        this.$$message.success("删除员工成功");
      } catch (error) {
        console.log(error);
      }
    },
    // 子组件点完确定传过来的
    addOk() {
      // 重新渲染页面;
      this.getEmployeeList();
      // 关闭弹窗
      this.showDialog = false;
    },
    // 点击导出后的方法
    exportData() {
      const headers = {
        姓名: "username",
        手机号: "mobile",
        入职日期: "timeOfEntry",
        聘用形式: "formOfEmployment",
        转正日期: "correctionTime",
        工号: "workNumber",
        部门: "departmentName",
      };
      import("@/vendor/Export2Excel").then(async (excel) => {
        const { rows } = await getEmployeeList({
          page: 1,
          size: this.page.total,
        });
        const data = this.formatJson(headers, rows);
        //复杂表头
        const multiHeader = [["姓名", "主要信息", "", "", "", "", "部门"]];
        //合并选项
        const merges = ["A1:A2", "B1:F1", "G1:G2"];
        excel.export_json_to_excel({
          header: Object.keys(headers),
          header: Object.keys(headers),
          data,
          filename: "员工资料表",
          multiHeader, // 复杂表头
          merges, // 合并选项
        });
      });
    },
    formatJson(headers, rows) {
      return rows.map((item) => {
        return Object.keys(headers).map((key) => {
          if (
            headers[key] === "timeOfEntry" ||
            headers[key] === "correctionTime"
          ) {
            return formatDate(item[headers[key]]);
          } else if (headers[key] === "formOfEmployment") {
            const obj = employeeEnum.hireType.find(
              (obj) => obj.id === item[headers[key]]
            );
            return obj ? obj.value : "未知";
          }
          return item[headers[key]];
        });
      });
    },
    // 点击头像弹出二维码弹窗的方法
    showQrCode(url) {
      if (url) {
        this.showCodeDialog = true;
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url);
        });
      } else {
        this.$message.warning("用户未上传头像");
      }
    },
  },
  // 以下是生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created() {
    this.getEmployeeList();
  },
  /**
   * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
   */
  mounted() {},
};
</script> 

<style scoped lang="less">
</style>