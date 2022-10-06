<template>
  <div class="dspartments-comtainer" v-loading="loading">
    <div class="app-container">
      <!-- 组织架构头部 -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <!-- 用了一个行列布局 -->
        <tree-tools :treeNode="company" :isRoot="true" @addDepts="addDepts" />
        <el-tree
          :data="departs"
          :props="defaultProps"
          @node-click="handleNodeClick"
          :default-expand-all="true"
        >
          <tree-tools
            slot-scope="{ data }"
            :treeNode="data"
            @delDepts="getDepartments"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>
    <!-- :tree-node="node" -->
    <add-dept
      :show-dialog.sync="showDialog"
      :tree-node="node"
      @addDepts="getDepartments"
      ref="addDept"
    />
  </div>
</template>

<script>
import TreeTools from "./components/tree-tools.vue";
import { getDepartments } from "@/api/departments";
import { tranListToTreeData } from "@/utils";
import AddDept from "./components/add-dept.vue";
export default {
  // 组件名称
  name: "Departments",
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: {
    TreeTools,
    AddDept,
  },
  // 组件状态值
  data() {
    return {
      // 新增部门的弹窗开关
      showDialog: false,
      defaultProps: {
        label: "name", // label默认的值是:'label'
        children: "children", //这个可以省略，children默认的就是'children'
      },
      //depart：部门的意思
      departs: [
        {
          name: "总裁办",
          manager: "曹操",
          children: [{ name: "董事会", manager: "曹丕" }],
        },
        { name: "行政部", manager: "刘备" },
        { name: "人事部", manager: "孙权" },
      ],
      company: { name: "江苏传智播客教育科技股份有限公司", manager: "负责人" },
      node: null,
      loading: false,
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    handleNodeClick(data) {
      // console.log(data);
    },
    // 树形架构的转换
    async getDepartments() {
      this.loading = true;
      const result = await getDepartments();
      this.company = { name: result.companyName, manager: "负责人", id: "" };
      this.departs = tranListToTreeData(result.depts, ""); // 需要将其转化成树形结构
      this.loading = false;
    },
    // 添加部门,子组件传过来的数据
    addDepts(treeNode) {
      this.showDialog = true;
      // 记录下当前需要添加的父节点 ,  父部门需要记录下来
      this.node = treeNode;
    },
    // 编辑部门,子组件传过来的 并记录需要编辑的节点
    editDepts(node) {
      this.showDialog = true;
      this.node = node;
      this.$refs.addDept.getDepartDetail(node.id);
    },
  },
  // 以下是生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created() {
    this.getDepartments();
  },
  /**
   * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
   */
  mounted() {},
};
</script> 

<style scoped >
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>