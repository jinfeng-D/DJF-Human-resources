<template>
  <!-- //弹窗，需要使用到element的dialog对话框组件 -->
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showTitel" :visible="showDialog" @close="btnCancel">
    <!-- //visible：控制是否显示 -->
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form
      label-width="120px"
      :model="formData"
      :rules="rules"
      ref="deptFrom"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="formData.name"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="formData.code"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          style="width: 80%"
          placeholder="请选择"
          v-model="formData.manager"
          @focus="getEmployeeSimple"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
          v-model="formData.introduce"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartments,
  getDepartDetail,
  updateDepartments,
} from "@/api/departments";
import { getEmployeeSimple } from "@/api/employees";
export default {
  // 组件名称
  name: "",
  // 组件参数 接收来自父组件的数据
  props: {
    showDialog: {
      type: Boolean,
      required: true,
    },
    treeNode: {
      type: Object,
      default: null,
    },
  },
  // 局部注册的组件
  components: {},
  // 组件状态值
  data() {
    // 检查部门名称是否重复的方法
    const checkNameRepeat = async (rule, value, callback) => {
      // value是部门名称 要和统计的部门名称比较 有没有相同的 相同的 不能过 不相同的可以过
      const { depts } = await getDepartments();
      let isRepeat = false;
      if (this.formData.id) {
        // 有内容就是修改模式校验  校验除了我以后 名字以及编码不能重复
        isRepeat = depts
          .filter((item) => {
            item.pid === this.treeNode.pid;
          })
          .filter((it) => {
            it.id !== this.treeNode.id;
          })
          .some((item) => {
            item.name === value;
          });
      } else {
        // 这个是添加部门校验
        isRepeat = depts
          .filter((item) => {
            item.pid === this.treeNode.id;
          })
          .some((item) => item.name === value);
      }
      isRepeat
        ? callback(new Error(`同级部门下已经存在这个${value}部门了`))
        : callback();
    };
    // 部门编码校验
    const checkCodeRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments();
      let isRepeat = false;
      if (this.formData.id) {
        isRepeat = depts.some(
          (item) => item.id !== this.formData.id && item.code === value && value
        );
      } else {
        isRepeat = depts.some((item) => item.code === value && value);
      }

      isRepeat
        ? callback(new Error(`组织架构中已经有部门在使用${value}编码了`))
        : callback();
    };
    return {
      formData: { name: "", code: "", manager: "", introduce: "" },
      rules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门名称要求1-50个字符",
            trigger: "blur",
          },
          { trigger: "blur", validator: checkNameRepeat },
        ],
        code: [
          {
            required: true,
            message: "部门编码不能为空",
            trigger: "blur",
          },
          {
            min: 1,
            max: 50,
            message: "部门编码要求1-50个字符",
            trigger: "blur",
          },
          { trigger: "blur", validator: checkCodeRepeat },
        ],
        manager: [
          {
            required: true,
            message: "部门负责人不能为空",
            trigger: "blur",
          },
        ],
        introduce: [
          {
            required: true,
            message: "部门介绍不能为空",
            trigger: "blur",
          },
          {
            trigger: "blur",
            min: 1,
            max: 300,
            message: "部门介绍要求1-300个字符",
          },
        ],
      },
      peoples: [],
    };
  },
  // 计算属性
  computed: {
    showTitel() {
      return this.formData.id ? "编辑部门" : "新增部门";
    },
  },
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    // 部门负责人的下拉表单获取
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple();
    },
    // 点击确定后的操作
    btnOk() {
      this.$refs.deptFrom.validate(async (isOK) => {
        if (isOK) {
          if (this.formData.id) {
            await updateDepartments(this.treeNode.id);
            this.$message.success("修改部门成功");
          } else {
            await addDepartments({ ...this.formData, pid: this.treeNode.id });
          }
          this.formData = {
            name: "",
            code: "",
            manager: "",
            introduce: "",
          };
          this.$emit("addDepts");
          this.$emit("update:showDialog", false);
          this.$message.success("添加部门成功");

          this.$refs.deptFrom.resetFields();
        }
      });
    },
    //点击取消 关闭弹出层
    btnCancel() {
      this.formData = {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      };
      this.$emit("update:showDialog", false);
      this.$refs.deptFrom.resetFields();
    },
    // 根据id获取部门的详细信息
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id);
    },
  },
  // 以下是生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created() {},
  /**
   * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
   */
  mounted() {},
};
</script> 

<style scoped lang="less">
</style>