<template>
  <div style="width: 100%;height: 98vh;overflow: hidden;" :style="{background:colors[ex] }">
    <div style="margin-bottom: -50px;margin-top: 50px;">表情:{{ ex }}</div>
    <div
      style="display: flex;flex-direction: column;justify-content: space-between;align-items: center;height: 80%;margin-top: 30%;">
      <div>
        <div v-show="false" style="background-color: #fff;position: absolute;left: 5%;border-radius: 9999px;width: 120px;height: 120px;max-width: 120px;max-height: 120px;min-width: 120px;min-height: 120px;overflow: hidden;display: flex;">
          <canvas v-show="false" width="600" height="600"  style="width: 130%;height: 130%;;background-color: #fff;"  id="myCanvas" />
        </div>
    </div>
      <div style="width: 100%;aspect-ratio: 1/1;background-color: red;border-radius: 99999px;z-index: 9999;position: relative;">
        <video style="width: 100%;height: 100%;background-color: #fff;;border-radius: 50%;object-fit:none" id="myVideo" muted loop
          playsinline         @loadedmetadata="fnRunFaceExpression"></video>
      </div>
      <div style="display: flex;align-items: center;justify-content: center;width: 80%;">
        <!-- <img @click="clearCanvas" src="images/return.svg" alt=""> -->
        <!-- <img @click="setImage" src="images/point.svg" alt=""> -->
    <div @click="setImage" :style="{backgroundColor: uploading? 'rgba(190, 190, 190, 0.5)' : 'rgba(255, 255, 255, 0.5)'}" class="btn"
     style="width: 95px; height: 95px;border-radius: 65px;display: flex;align-items: center;justify-content: center;">
      <div :style="{backgroundColor: uploading? 'rgba(190, 190, 190, 1)' : 'rgba(255, 255, 255, 1)'}"
       style="width: 76px; height: 76px;  border-radius: 65px"></div>
    </div>
    <audio id="audio" src="audio/button.mp3"></audio>
        <!-- <img @click="upload" src="images/yes.svg" alt=""> -->
      </div>
    </div>
  </div>
</template>
 
<script>
// @ is an alias to /src
import axios from 'axios'
import main from '@/assets/js/test'
import * as faceapi from "face-api.js";
import { Message } from 'element-ui'
// import qs from 'qs'
export default {
  name: 'HomeView',
  components: {
    // HelloWorld
  },
  data() {
    return {
      nets: "ssdMobilenetv1", // 模型
      options: null, // 模型参数
      withBoxes: true, // 边框or轮廓
      detectFace: "detectSingleFace", // 单or多人脸
      detection: "expression",
      imgEl: null,
      videoEl: null,
      canvasEl: null,
      context: null,
      imageUrl: '',
      base64img: null,
      fileimg: null,
      haveImage: false,
      uploading: false,
      timeout: 1000,
      // 视频媒体参数配置
      constraints: {
        audio: false,
        video: {
          // ideal（应用最理想的）
          // width: {
          //   min: 480,
          //   ideal: 1280,
          //   max: 1920,
          // },
          // height: {
          //   min: 640,
          //   ideal: 720,
          //   max: 1080,
          // },
          // frameRate受限带宽传输时，低帧率可能更适宜
          frameRate: {
            min: 15,
            ideal: 30,
            max: 60,
          },
          // 显示模式前置后置
          facingMode: "user",
        },
      },
      dictionaryb: [
        {
          name: '角色1',
          imgurl: ["a.jpg", "b.jpg"]
        },
        {
          name: '角色2',
          imgurl: ["c.jpg", "d.jpg"]
        },
        {
          name: '角色3',
          imgurl: ["a.jpg", "b.jpg"]
        },
        {
          name: '角色4',
          imgurl: ["c.jpg", "d.jpg"]
        },        {
          name: '角色5',
          imgurl: ["c.jpg", "d.jpg"]
        }
      ],
      dictionary: [],
      colors: {neutral: 'burlywood', happy: 'yellow', sad: 'gray', angry: 'red', fearful: 'black', disgusted:'brown', surprised: 'orange', unkown: 'linear-gradient(341deg, #437FA7 0%, #CA719D 100%)'},
      base_url: 'http://47.94.44.34/statics/avatar/',
      ori_url: 'base.jpg',
      ex: 'unkown',
      imgex: 'unkown'
    }
  },
  beforeMount () {
  },
  mounted() {
    // this.start()
    // this.bqstart()
    // console.log(require('@/assets/logo.png'))
    // 节点属性化
    this.videoEl = document.getElementById("myVideo");
    this.imgEl = document.getElementById("myImg");
    this.canvasEl = document.getElementById("myCanvas");
    this.context = this.canvasEl.getContext('2d')
    this.$nextTick(() => {
      this.fnInit().then(() => this.fnOpen())
    });
  },
  methods: {
    getDictionary() {
      this.dictionary = {
        "角色1": ["person1_a.jpg", "person1_b.jpg"],
        "角色2": ["person2_a.jpg", "person2_b.jpg"],
        "角色3": ["person3_a.jpg", "person3_b.jpg"],
        "角色4": ["person4_a.jpg", "person4_b.jpg"],
        "角色5": ["person5_a.jpg", "person5_b.jpg"]
      }
    },
    getOriUrl(url) {
      this.ori_url = url
    },
    start() {
      this.getDictionary()
      main(this.dictionary, this.base_url, this.ori_url).then(res => {
        this.uploading = false
        console.log(res)
        if (res !== '') {
          alert('你是' + res + ',表情：' + this.imgex)
        } else {
          alert('你不是人员组内成员' + ',表情：' + this.imgex)
        }
      }).catch(error => {
        Message.error('识别失败，请重新再试一次')
        this.uploading = false
        console.log(error)
      })
    },
    // 初始化模型加载
    async fnInit() {
      await faceapi.nets[this.nets].loadFromUri("models");
      await faceapi.loadFaceLandmarkModel("models");
      await faceapi.loadFaceExpressionModel("models");
      // 根据模型参数识别调整结果
      switch (this.nets) {
        case "ssdMobilenetv1":
          this.options = new faceapi.SsdMobilenetv1Options({
            minConfidence: 0.5, // 0.1 ~ 0.9
          });
          break;
        case "tinyFaceDetector":
          this.options = new faceapi.TinyFaceDetectorOptions({
            inputSize: 224, // 160 224 320 416 512 608
            scoreThreshold: 0.5, // 0.1 ~ 0.9
          });
          break;
        case "mtcnn":
          this.options = new faceapi.MtcnnOptions({
            minFaceSize: 20, // 1 ~ 50
            scaleFactor: 0.709, // 0.1 ~ 0.9
          });
          break;
      }
    },
    // 执行识别绘制
    async fnRun() {
      console.log(this.imgEl)
      const results = await faceapi
        .detectAllFaces(this.imgEl, this.options)
        .withFaceLandmarks()
        .withFaceExpressions();
      faceapi.matchDimensions(this.canvasEl, this.imgEl);
      const resizedResults = faceapi.resizeResults(results, this.imgEl);
      console.log(results)
      if (results[0]) {
        let list = results[0].expressions
        let newlist = Object.keys(list).sort((a, b) => list[a] - list[b])
        console.log(newlist[6])
        this.imgex = newlist[6]
      }
      this.withBoxes
        ? faceapi.draw.drawDetections(this.canvasEl, resizedResults)
        : faceapi.draw.drawFaceLandmarks(this.canvasEl, resizedResults);
      faceapi.draw.drawFaceExpressions(this.canvasEl, resizedResults, 0.05);
    },
    async fnRunFaceExpression() {
      // console.log("RunFaceExpression");
      if (this.videoEl.paused) return clearTimeout(this.timeout);
      // 识别绘制人脸信息
      const result = await faceapi[this.detectFace](this.videoEl, this.options)
        .withFaceLandmarks()
        .withFaceExpressions();
      if (result && !this.videoEl.paused) {
        // const dims = faceapi.matchDimensions(this.canvasEl, this.videoEl, true);
        // const resizeResult = faceapi.resizeResults(result, dims);
        // console.log(result)
      if (result) {
        let list = result.expressions
        let newlist = Object.keys(list).sort((a, b) => list[a] - list[b])
        // console.log(newlist[6])
        this.ex = newlist[6]
      }
        // this.withBoxes
        //   ? faceapi.draw.drawDetections(this.canvasEl, resizeResult)
        //   : faceapi.draw.drawFaceLandmarks(this.canvasEl, resizeResult);
        // faceapi.draw.drawFaceExpressions(this.canvasEl, resizeResult, 0.05);
      } else {
        this.ex = 'unkown'
      }
      // this.timeout = setTimeout(() => this.fnRunFaceExpression());
      this.timeout = setTimeout(() => {
        this.fnRunFaceExpression()
      }, 500);
    },
    clearCanvas() {
              this.canvasEl
          .getContext("2d")
          .clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
          this.haveImage = false
    },
    fnChange(e) {
      if (!e.target.files.length) return;
      // 将文件显示为图像并识别
      console.log(e.target.files)
      faceapi.bufferToImage(e.target.files[0]).then((img) => {
        console.log(img.src)
        this.imgEl.src = img.src;
        this.canvasEl
          .getContext("2d")
          .clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
        this.fnRun();
      });
    },
    bqstart() {
      this.$nextTick(() => {
        this.fnInit().then(() => this.fnRun());
      });
    },
    test(event, b, c) {
      console.log(event, b, c)
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(this.imageUrl, file)
      let base64 = ''
      // this.blobToBase64(file, (dataurl) => {
      //   base64 = dataurl;
      //   console.log("base64", base64);
      // });
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function (e) {
        base64 = e.target.result
        console.log(e.target.result); //获取到base64格式图片
        console.log(base64)
        this.imgEl = document.getElementById("myImg");
        this.imgEl.src = base64;
        console.log(this.imgEl)
      }
      this.fnRun();
      //   this.imgEl.src = reader.result;
      //   console.log(this.imgEl.src)
      // this.canvasEl
      //   .getContext("2d")
      //   .clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      // this.fnRun();
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    blobToBase64(blob, callback) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        callback(e.target.result);
      };
      fileReader.readAsDataURL(blob);
    },
    // 启动摄像头视频媒体
    fnOpen() {
      if (typeof window.stream === "object") return;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        clearTimeout(this.timeout);
        navigator.mediaDevices
          .getUserMedia(this.constraints)
          .then(this.fnSuccess)
          .catch(this.fnError);
      }, 300);
    },
    // 成功启动视频媒体流
    fnSuccess(stream) {
      window.stream = stream; // 使流对浏览器控制台可用
      this.videoEl.srcObject = stream;
      this.videoEl.play();
    },
    // 失败启动视频媒体流
    fnError(error) {
      console.log(error);
      alert("视频媒体流获取错误" + error);
    },
    // 结束摄像头视频媒体
    fnClose() {
      this.canvasEl
        .getContext("2d")
        .clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      this.videoEl.pause();
      clearTimeout(this.timeout);
      if (typeof window.stream === "object") {
        window.stream.getTracks().forEach((track) => track.stop());
        window.stream = "";
        this.videoEl.srcObject = null;
      }
    },
    upload() {
      if (this.uploading) {
        Message.warning('正在识别中')
        return
      }
      this.uploading = true
      // if (!this.haveImage) {
      //   Message.warning('请先拍照')
      //   return
      // }
      Message.success('拍照成功,正在上传')
      console.log(this.fileimg)
      const formData = new FormData();
      formData.append("smfile",this.fileimg)
console.log(formData)
      axios({
        method: 'POST',
        url: `aab/upload`,
        data: formData,
        headers: {
          'Authorization': 'FXulofGUi61Qss86aTh0NkkRHk4WnzhU'
        }
      }).then((response) => {
          console.log(response.data)
          this.base_url = response.data.data.url
          Message.success('上传成功,开始识别,预计十五秒')
          this.start()
      }).catch( error=> {
        this.uploading = false
        Message.error('image上传失败')
        console.log(error)
      })
    },
    setImage() {
      document.getElementById('audio').play()
      var _this = this
      // 点击，canvas画图
      _this.context.drawImage(_this.videoEl, 0, 0)
      // 获取图片base64链接
      this.image = this.canvasEl.toDataURL('image/jpeg')
      this.fileimg = this.dataURLtoBlob(this.image, 'mypic.jpg')
      console.log(this.image, this.fileimg)
      this.haveImage = true
      this.imgex = this.ex
      this.upload()
    },
    dataURLtoBlob(dataurl, name) {
     var arr = dataurl.split(","),
     mime = arr[0].match(/:(.*?);/)[1],
     bstr = atob(arr[1]),
     n = bstr.length,
     u8arr = new Uint8Array(n);
     while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
     }
     return new File([u8arr], name, {
           type: mime
      });
},

  }
}

</script>
<style scoped>
.btn{
  transition: 0.6s;
  transform: scale(1);
}
.btn:active{
  transition: 0.6s;
  transform: scale(0.8);
}
</style>