// 全局组件入口
import PageTools from "./PageTools";
import UploadExcel from "./UploadExcel";
import ImageUpload from "./ImageUpload";
import Print from "vue-print-nb";
export default {
  // install 会拿到Vue的全局对象
  install(Vue) {
    Vue.component("PageTools", PageTools);
    Vue.component("UploadExcel", UploadExcel);
    Vue.component("ImageUpload", ImageUpload);
    Vue.use(Print);
  },
};
