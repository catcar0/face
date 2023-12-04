<template>
    <div class="flexc" style="width: 100%;aspect-ratio: 1/1;border-radius: 50%;padding: 10px;box-sizing: border-box;">
        <audio id="audio" src="audio/button.mp3"></audio>
        <div class="loading"></div>
        <video  :style="{transform: constraints.video.facingMode === 'user' ? 'rotateY(180deg)' : ''}"
            style="max-width: calc(100% - 75px);width: calc(100% - 75px);;min-width: calc(100% - 75px);aspect-ratio: 1/1;background-color: #fff;border-radius: 50%;object-fit:none;position: absolute;"
            id="myVideo" muted loop playsinline @loadedmetadata="fnRunFaceExpression"></video>
        <canvas v-show="false" width="600" height="600" style="width: 130%;height: 130%;;background-color: #fff;"
            id="myCanvas" />
        <!-- <div :style="{ opacity: image === '' ? '0' : '1' }"
         style="width: calc(100% - 90px);aspect-ratio: 1/1;background-color: #fff;border-radius: 50%;position: absolute;overflow: hidden;">
            <img 
            style="width: 100%;object-fit:none;"
            :src="image" alt="">
        </div> -->
    </div>
</template>

<script>
import * as faceapi from "face-api.js";
export default {
    name: 'FaceaiCamera',
    props: ['shoot', 'img', 'change', 'clear'],
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
            image: '',
            fileimg: '',
            timeout: 1000,
            ex: '',
            context: null,
            // 视频媒体参数配置
            constraints: {
                audio: false,
                video: {
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
        };
    },

    mounted() {
        this.videoEl = document.getElementById("myVideo");
        this.imgEl = document.getElementById("myImg");
        this.canvasEl = document.getElementById("myCanvas");
        this.context = this.canvasEl.getContext('2d')
        this.$nextTick(() => {
            this.fnInit().then(() => this.fnOpen())
        });
        console.log(this.img)
        if (this.img) {
            this.image = this.img.image
        }
    },
    watch: {
        //拍照
        shoot() {
            this.setImage()
        },
        //转换前后置摄像头
        change() {
            console.log('转换前后置')
            // this.constraints.video.facingMode = 'environment'
            if (this.constraints.video.facingMode === 'environment') {
                this.constraints.video.facingMode = 'user'
            } else {
                this.constraints.video.facingMode = 'environment'
            }
            this.fnClose()
            this.fnOpen()
        },
        //清除照片
        clear() {
            this.image = ''
            this.videoEl.play();
            this.fnClose()
            this.fnOpen()
        }
        // img() {
        //     this.image = this.img.image
        // }
    },
    methods: {
        async fnInit() {
            console.log(faceapi.nets[this.nets])
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
        // 拍照
        setImage() {
            document.getElementById('audio').play()
            this.videoEl.pause();
              var _this = this
            // 点击，canvas画图
              _this.context.drawImage(_this.videoEl, 0, 0)
            // 获取图片base64链接
            this.image = this.canvasEl.toDataURL('image/jpeg')
            this.fileimg = this.dataURLtoBlob(this.image, 'mypic.jpg')
            console.log(this.image, this.fileimg)
            let data = {
                image: this.image,
                file: this.fileimg
            }
            this.$emit('returnimg', data);
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
        async fnRunFaceExpression() {
            //   console.log("RunFaceExpression");
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
                    this.$emit('returnemo', this.ex)
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
        }
    },
    beforeDestroy() {
        this.fnClose();
    }
};
</script>

<style  scoped>
.loading {
    position: relative;
    min-width: 100%;
    aspect-ratio: 1/1;
    border: 10px solid #FD7B4B;
    border-top-color: rgba(253, 123, 75, 0.5);
    border-right-color: rgba(253, 123, 75, 0.5);
    border-bottom-color: rgba(253, 123, 75, 0.5);
    border-radius: 100%;

    animation: circle infinite 2s linear;
}

@keyframes circle {
    0% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
