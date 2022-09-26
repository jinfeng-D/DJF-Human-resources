<template>
  <div class="tree-tools" style="width: 100%">
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      style="height: 40px; width: 100%"
    >
      <!-- 左侧内容 -->
      <el-col>
        <span>{{ treeNode.name }}</span>
      </el-col>
      <!-- // span：跨度，span设置为4，说明这里一列占4份，一行默认是24份 -->
      <el-col :span="4">
        <el-row type="flex" justify="end">
          <!-- 右 两个内容 -->
          <el-col style="margin-left: -20px">{{ treeNode.manager }}</el-col>
          <el-col>
            <!-- 下拉菜单 element -->
            <el-dropdown @command="operateDepts">
              <!-- //这个span是下拉菜单默认显示的内容 -->
              <span>
                <!-- //i的class使用的是element的icon图标  -->
                操作
                <i class="el-icon-arrow-down" />
              </span>
              <!-- dropdownmenu是具体的下拉菜单选项，通过具名插槽dropdown来指定 -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                <el-dropdown-item v-if="!isRoot" command="edit"
                  >编辑部门</el-dropdown-item
                >
                <el-dropdown-item v-if="!isRoot" command="del"
                  >删除部门</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { delDepartments } from "@/api/departments";
export default {
  // 组件名称
  name: "TreeTools",
  // 组件参数 接收来自父组件的数据
  props: {
    treeNode: {
      type: Object,
      required: true,
    },
    //增加isRoot，为真时不出现删除、编辑部门，假时出现，控制是否为头部，是否显示编辑部门和删除部门
    isRoot: {
      type: Boolean,
      default: false,
    },
  },
  // 局部注册的组件
  components: {},
  // 组件状态值
  data() {
    return {};
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    operateDepts(command) {
      if (command === "add") {
        // 添加部门
        this.$emit("addDepts", this.treeNode);
      } else if (command === "edit") {
        // 编辑部门
        this.$emit("editDepts", this.treeNode);
      } else if (command === "del") {
        this.$confirm("确定要删除该部门吗?")
          .then(() => {
            return delDepartments(this.treeNode.id);
          })
          .then(() => {
            this.$emit("delDepts");
            this.$message.success("删除部门成功");
          });
      }
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