// 全局组件入口
import PageTools from "./PageTools";
import UploadExcel from "./UploadExcel";
import ImageUpload from "./ImageUpload";
import Print from "vue-print-nb";
import ScreenFull from "./ScreenFull";
import ThemePicker from "./ThemePicker";
import LangSelect from "./lang";
import TagsView from "./TagsView";

export default {
  // install 会拿到Vue的全局对象
  install(Vue) {
    Vue.component("PageTools", PageTools);
    Vue.component("UploadExcel", UploadExcel);
    Vue.component("ImageUpload", ImageUpload);
    Vue.use(Print);
    Vue.component("ScreenFull", ScreenFull); // 注册全屏组件
    Vue.component("ThemePicker", ThemePicker); //注册主题颜色
    Vue.component("LangSelect", LangSelect);
    Vue.component("TagsView", TagsView); //页签
  },
};
