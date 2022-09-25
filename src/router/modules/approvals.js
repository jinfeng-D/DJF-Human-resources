// 导出员工的路由规则
import Layout from "@/layout/";
export default {
  // 路由规则
  path: "/approvals",
  name: "approvals", //给模块增加一个name属性,用于后期做权限的时候使用
  component: Layout,
  children: [
    {
      // 2级路由的path什么都不用写的时候,代表了它是二级的默认路由
      path: "", //这里什么都不用写表示/approvals 不但有布局 layout => 员工主页
      component: () => import("@/views/approvals"),
      // 路由元信息,其实就是一个存储数据的地方 可以放任何内容
      meta: {
        title: "审批", // 这里为什么用title,因为左侧的导航栏用了这里的title属性
        icon: "tree-table",
      },
    },
  ],
};
