// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from "axios";
// 引入element里面的Message提示方法,用来提示错误信息
import { Message } from "element-ui";
const service = axios.create({
  // 当执行npm run dev => .evn.development => /api => 跨域代理
  baseURL: process.env.VUE_APP_BASE_API, //axios请求的基础的基础地址
  //  当执行npm run dev => /api   这个是给开发环境配置的代理
  //  当执行npm run build => /prod-api   //这个是生产环境 后续运维会处理上线后的配置代理
  timeout: 5000, //设置超时时间,超过5秒 没有响应报错
}); // 创建一个axios的实例
service.interceptors.request.use(); // 请求拦截器
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
    Message.error(error.message); //提示错误信息
    return Promise.reject(error); //返回执行错误,让当前的执行链跳出成功,直接进入catch
  }
); // 响应拦截器
export default service; // 导出axios实例
