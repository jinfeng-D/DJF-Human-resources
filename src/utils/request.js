// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from "axios";
// 引入token的所在
import store from "@/store";
// 引入element里面的Message提示方法,用来提示错误信息
import { Message } from "element-ui";
// 获取缓存中时间戳的方法
import { getTimeStamp } from "@/utils/auth";
// 拿到router来做没有token时候的跳转
import router from "@/router";
const TimeOut = 3600; // 定义token是否超时的时间戳
const service = axios.create({
  // 当执行npm run dev => .evn.development => /api => 跨域代理
  baseURL: process.env.VUE_APP_BASE_API, //axios请求的基础的基础地址
  //  当执行npm run dev => /api   这个是给开发环境配置的代理
  //  当执行npm run build => /prod-api   //这个是生产环境 后续运维会处理上线后的配置代理
  timeout: 5000, //设置超时时间,超过5秒 没有响应报错
}); // 创建一个axios的实例
// 请求拦截器
service.interceptors.request.use(
  // comfig是请求的配置信息 必须要返回的
  (config) => {
    // 判断是否有token
    if (store.getters.token) {
      // 只有在有token的情况下  检查token时间戳是否超时
      if (IsCheckTimeOut()) {
        // 如果为true,表示token过期了
        store.dispatch("user/logout"); //退出登录
        router.push("/login"); //跳到登录页
        return Promise.reject(new Error("token超时了"));
      }
      // 有token就像后台接口要求的注入token,
      config.headers["Authorization"] = `Bearer ${store.getters.token}`;
    }
    // 如果没有token就返回原来的
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 响应拦截器
service.interceptors.response.use(
  // 响应成功
  (response) => {
    const { success, message, data } = response.data; //要根据success成功与否决定下面的操作
    if (success) {
      return data;
    } else {
      Message.error(message); //提示错误信息
      return Promise.reject(new Error(message));
    }
  },
  // 响应失败
  (error) => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.code === 10002
    ) {
      // 如果满足条件,表示后端提醒token已经超时了
      store.dispatch("user/logout"); //退出登录
      router.push("/login"); //跳到登录页
    } else {
      Message.error(error.message); //提示错误信息
    }
    return Promise.reject(error); //返回执行错误,让当前的执行链跳出成功,直接进入catch
  }
);
// 定义token是否超时的方法
function IsCheckTimeOut() {
  let currentTime = Date.now(); //当前的时间戳
  let timeStamp = getTimeStamp(); //缓存中的时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut;
}
export default service; // 导出axios实例
