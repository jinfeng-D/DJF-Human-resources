<template>
  <div class="dspartments-comtainer">
    <div class="app-container">
      <!-- 组织架构头部 -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <!-- 用了一个行列布局 -->
        <el-row
          type="flex"
          justify="space-between"
          align="middle"
          style="height: 40px; width: 100%"
        >
          <!-- 左侧内容 -->
          <el-col>
            <span>江苏传智播客教育科技股份有限公司</span>
          </el-col>
          <!-- // span：跨度，span设置为4，说明这里一列占4份，一行默认是24份 -->
          <el-col :span="4">
            <el-row type="flex" justify="end">
              <!-- 右 两个内容 -->
              <el-col style="margin-left: -20px">负责人</el-col>
              <el-col>
                <!-- 下拉菜单 element -->
                <el-dropdown>
                  <!-- //这个span是下拉菜单默认显示的内容 -->
                  <span>
                    <!-- //i的class使用的是element的icon图标  -->
                    操作
                    <i class="el-icon-arrow-down" />
                  </span>
                  <!-- dropdownmenu是具体的下拉菜单选项，通过具名插槽dropdown来指定 -->
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>添加子部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-tree
          :data="departs"
          :props="defaultProps"
          @node-click="handleNodeClick"
          :default-expand-all="true"
        >
          <!-- TODO:准备写插槽 -->
          <el-row
            slot-scope="{ data }"
            type="flex"
            justify="space-between"
            align="middle"
            style="height: 40px; width: 100%"
          >
            <!-- 左侧内容 -->
            <el-col>
              <span>{{ data.name }}</span>
            </el-col>
            <!-- // span：跨度，span设置为4，说明这里一列占4份，一行默认是24份 -->
            <el-col :span="4">
              <el-row type="flex" justify="end">
                <!-- 右 两个内容 -->
                <el-col style="margin-left: -20px">{{ data.manager }}</el-col>
                <el-col>
                  <!-- 下拉菜单 element -->
                  <el-dropdown>
                    <!-- //这个span是下拉菜单默认显示的内容 -->
                    <span>
                      <!-- //i的class使用的是element的icon图标  -->
                      操作
                      <i class="el-icon-arrow-down" />
                    </span>
                    <!-- dropdownmenu是具体的下拉菜单选项，通过具名插槽dropdown来指定 -->
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>添加子部门</el-dropdown-item>
                      <el-dropdown-item>编辑部门</el-dropdown-item>
                      <el-dropdown-item>删除部门</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
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
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    handleNodeClick(data) {
      console.log(data);
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

<style scoped >
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>