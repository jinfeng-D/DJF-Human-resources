<template>
  <div>
    <!-- //action: 是指定图片上传的路径 , 那这里为啥要给一个#  , 这是因为我们使用的是腾讯云的上传方式 , 腾讯云是通过一个方法来上传图片, 不是直接指定网络路径  , 但是action又是一个必填选项 , 所以这里只能给一个# 
  //limit：限定上传数量
  //on-preview：支持预览 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :file-list="fileList"
      :class="{ disabled: fileComputed }"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>

    <el-dialog title="图片" :visible.sync="showDialog">
      <img :src="imgUrl" style="width: 100%" alt="" />
    </el-dialog>
    <el-progress
      v-if="showPercent"
      style="width: 180px"
      :percentage="percent"
    />
  </div>
</template>

<script>
import COS from "cos-js-sdk-v5";
import axios from "axios";
let cos = new COS({
  SecretId: "AKIDT8vjOsLj5TtLdrvnSbyKerv271mYFm8T",
  SecretKey: "NVN0PbZUCnBYnv2CAvUs3zf1HH0VzRjv",
});
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
      fileList: [
        {
          //我们先写死一个，测试一下（这个图片是百度图片上随便复制的一个地址，失效的话自己随便再找一个）
          url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Flmg.jj20.com%2Fup%2Fallimg%2F1114%2F121420113514%2F201214113514-6-1200.jpg&refer=http%3A%2F%2Flmg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1667449295&t=dbcd92dd88c2c1c7a4e77f6e62f81778",
        },
      ], // 上传的文件列表
      showDialog: false, // 控制显示弹层
      imgUrl: "", //图片路径
      currentFileUid: "",
      percent: 0, //上传进度，默认为0
      showPercent: false, // 默认不显示进度条
    };
  },
  // 计算属性
  computed: {
    fileComputed() {
      return this.fileList.length === 1;
    },
  },
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    preview(file) {
      //file是el-upload组件传递过来的参数，就是当前预览的文件对象
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url;
      this.showDialog = true;
    },
    handleRemove(file) {
      this.fileList = this.fileList.filter((item) => item.uid !== item.uid);
    },

    // 上传成功之后 还会进来 需要实现上传代码的逻辑 这里才会成功
    changeFile(file, fileList) {
      //第一次fileList里有数据，遍历之后啥也不做直接返回，赋值给this.fileList
      //第二次fileList没有数据，就不遍历了
      if (file.status === "ready") {
        this.fileList.push(file);
      }
    },
    beforeUpload(file) {
      // 进度条

      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ["image/jpeg", "image/gif", "image/bmp", "image/png"];
      if (!types.includes(file.type)) {
        this.$message.error("上传图片只能是 JPG、GIF、BMP、PNG 格式!");
        return false; //停止上传
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024;
      if (maxSize < file.size) {
        this.$message.error("图片大小最大不能超过5M");
        return false; //停止上传
      }
      this.currentFileUid = file.uid;
      this.showPercent = true; //开始上传前，就显示进度条

      return true; // 继续上传
    },
    // 上传图片之后的操作
    upload(params) {
      if (params.file) {
        cos.putObject(
          {
            Bucket: "renzi-tupian-1301012730",
            Region: "ap-nanjing",
            Key: params.file.name,
            Body: params.file,
            StorageClass: "STANDARD",
            onProgress: (params) => {
              this.percent = params.percent * 100;
            },
          },
          (err, data) => {
            if (!err && data.statusCode === 200) {
              this.fileList = this.fileList.map((item) => {
                // 去找谁的uid等于刚刚记录下来的id
                if (item.uid === this.currentFileUid) {
                  // 将成功的地址赋值给原来的url属性
                  setTimeout(() => {
                    //由于上传速度过快，导致看不到进度条，所以延时隐藏进度条
                    this.showPercent = false; // 隐藏进度条
                    this.percent = 0; // 进度归0
                  }, 2000);
                  return { url: "http://" + data.Location, upload: true };
                  // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                  // 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
                }
                return item;
              });
            }
          }
        );
      }
    },
    // async upload(params) {
    //   if (params.file) {
    //     const formData = new FormData();
    //     formData.append("image", params.file);
    //     const { data } = await axios({
    //       url: "http://toutiao.itheima.net/v1_0/upload",
    //       method: "POST",
    //       data: formData,
    //     });
    //     this.fileList = this.fileList.map((item) => {
    //       if (item.uid === params.file.uid) {
    //         return { url: data.data.url, upload: true };
    //       }
    //       return item;
    //     });
    //     this.showPercent = false;
    //     this.percent = 0;
    //   }
    // },
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

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>