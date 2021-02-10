<template>
  <div class="upload">
    <van-uploader
      v-model="fileList"
      :before-read="beforeRead"
      :deletable="deletable"
      :after-read="afterRead"
      :max-count="maxCount"
      @delete="handleDelete"
      multiple
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";
import { Uploader } from "vant";

@Component({
  name: "BaseUpload",
  components: {
    [Uploader.name]: Uploader
  }
})
export default class BaseUpload extends Vue {
  @Prop({ default: 1 }) private maxCount: number;
  @Prop({ default: [] }) private fileData: Array<object>;
  @Prop({ default: true }) private deletable: boolean;
  @Prop({ default: "/" }) private uploadUrl: string;
  @Prop({ default: "file" }) private fileName: string;
  private fileList: object[] = [];
  private files: object[] = [];

  @Emit("afterRead") send(files: object[]) {}
  @Emit("emitDelete") emitDelete(index: number) {}

  public mounted(): void {
    this.fileList = this.fileData;
  }

  @Watch("files")
  private filesChange(newValue: any, oldValue: any): void {
    console.log("files", newValue);
    this.send(newValue);
  }

  // 返回布尔值
  beforeRead(file: any): boolean {
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      this.$toast("请上传 jpg/png 格式图片");
      return false;
    }
    return true;
  }
  handleDelete(file: any, { index }: any): void {
    this.emitDelete(index);
  }

  afterRead(file: object[]): void {
    this.files.push(file);
    // 此时可以自行将文件上传至服务器
    // console.log(file)
    // const formData = new FormData() // 构造一个 FormData，把后台需要发送的参数添加
    // formData.append(this.fileName, file.file) // 接口需要传的参数
    // console.log(formData.getAll(this.fileName))
    // let config = {
    //   headers: { 'Content-Type': 'multipart/form-data' }
    // }
    // // 添加请求头
    // axios
    //   .post(this.uploadUrl, formData, config)
    //   .then(res => {
    //     console.log(res)
    //     if (res.data) {
    //       // s.replace(/\//g,"@") ;
    //       // console.log(s);
    //       // let url = res.data.url
    //       // console.log(this.fileList)
    //       // debugger
    //       // this.$emit('afterRead', this.fileList)
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
  }
}
</script>

<style lang="scss" scoped></style>
