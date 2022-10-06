<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height: 60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
                >新增角色</el-button
              >
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column
                align="center"
                label="序号"
                width="120"
                type="index"
              />
              <el-table-column
                align="center"
                label="角色名称"
                width="240"
                prop="name"
              />
              <el-table-column align="center" label="描述" prop="description" />
              <el-table-column label="操作" align="center">
                <template slot-scope="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                    >编辑</el-button
                  >
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRole(row.id)"
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
              <!-- 分页组件 -->
              <el-pagination
                :current-page="page.page"
                :total="page.total"
                layout="prev,pager,next"
                @current-change="changePage"
                :page-size="page.pagesize"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="fromData.name"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="fromData.companyAddress"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="fromData.mailbox"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                  v-model="fromData.remarks"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 弹出层编辑员工信息 -->
    <el-dialog title="编辑弹层" :visible="showDialog" close="btnCancel">
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  updateRole,
  getRoleDetail,
  addRole,
} from "@/api/setting";
import { mapGetters } from "vuex";
export default {
  // 组件名称
  name: "",
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: {},
  // 组件状态值
  data() {
    return {
      list: [], // 承接数组
      page: {
        // 放置页码及相关数据
        page: 1, // 也有团队第1页的页码是0
        pagesize: 10,
        total: 0, // 记录总数
      },
      fromData: {},
      showDialog: false,
      roleForm: {},
      rules: {
        name: [
          { required: true, message: "角色姓名不能为空", trigger: "blur" },
        ],
      },
    };
  },
  // 计算属性
  computed: {
    ...mapGetters(["companyId"]),
  },
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    // 获取员工列表信息
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page);
      this.list = rows;
      this.page.total = total;
    },
    // 分页页码处理
    changePage(newPage) {
      console.log(newPage);
      this.page.page = newPage;
      this.getRoleList();
    },
    // 获取企业数据
    async getCompanyInfo() {
      this.fromData = (await getCompanyInfo(this.companyId)) || {};
    },
    // 删除角色方法
    async deleteRole(id) {
      try {
        await this.$confirm("确定删除该角色吗");
        // 只有点了确定才会执行下面的代码
        await deleteRole(id); //调用删除接口的方法
        this.getRoleList(); //重新渲染数据 更改视图层
        this.$message.success("删除角色成功");
      } catch (error) {
        console.log(error);
      }
    },
    // 获取编辑的角色的信息
    async editRole(id) {
      this.roleForm = await getRoleDetail(id);
      this.showDialog = true;
    },
    // 弹出层的确定按钮
    async btnOK() {
      try {
        // 先让内容通过校验
        await this.$refs.roleForm.validate();
        // 查看是否有id存在,没有id就是新增,有id就是修改
        if (this.roleForm.id) {
          await updateRole(this.roleForm);
        } else {
          //新增业务
          await addRole(this.roleForm);
        }
        // 重新渲染视图
        this.getRoleList();
        this.$message.success("操作成功");
        this.showDialog = false;
      } catch (error) {
        console.log(error);
      }
    },
    //弹出层的取消按钮
    btnCancel() {
      this.roleForm = {
        name: "",
        description: "",
      };
      this.$refs.roleForm.resetFields();
      this.showDialog = false;
    },
  },
  // 以下是生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created() {
    this.getRoleList();
    this.getCompanyInfo();
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