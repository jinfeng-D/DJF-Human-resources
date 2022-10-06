<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form
              label-width="120px"
              style="margin-left: 120px; margin-top: 30px"
              :rules="rules"
              ref="userForm"
              :model="userInfo"
            >
              <el-form-item label="姓名:" prop="username">
                <el-input style="width: 300px" v-model="userInfo.username" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input
                  style="width: 300px"
                  type="password"
                  v-model="userInfo.password2"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <component :is="UserComponent" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位基本信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <component :is="JobComponent" />
            <div></div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { saveUserDetailById } from "@/api/employees";
import { getUserDetailById } from "@/api/user";
import UserInfo from "./components/user-info.vue";
import JobInfo from "./components/job-info.vue";
export default {
  // 组件名称
  name: "EmployeesDetail",
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: {
    UserInfo,
    JobInfo,
  },
  // 组件状态值
  data() {
    return {
      JobComponent: "job-info",
      UserComponent: "user-info",
      userId: this.$route.params.id,
      userInfo: {
        username: "",
        password2: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: "blur",
          },
        ],
        password2: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur",
          },
          {
            min: 6,
            max: 9,
            message: "密码长度为6-9位",
            trigger: "blur",
          },
        ],
      },
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    // 进入弹窗页面后,显示出来的获取到的用户的基本信息
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId);
    },
    // 点击保存完后 把新的数据发送给后台
    async saveUser() {
      try {
        // 先校验
        await this.$refs.userForm.validate();
        await saveUserDetailById({
          ...this.userInfo,
          password: this.userInfo.password2,
        });
        this.$message.success("保存数据成功");
      } catch (error) {
        console.log(error);
      }
    },
  },
  // 以下是生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created() {
    this.getUserDetailById();
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