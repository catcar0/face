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
            nets: "ssdMobilenetv1", // model
            options: null, // Model parameters
            withBoxes: true, // Borders or outlines
            detectFace: "detectSingleFace", // Single or multi-faced
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
                    // When frameRate is limited bandwidth, a low frame rate may be more suitable
                    frameRate: {
                        min: 15,
                        ideal: 30,
                        max: 60,
                    },
                    // The display mode is front-facing and rear-facing
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
        shoot() {
            this.setImage()
        },
        //Convert the front and rear cameras
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
        //Clear
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
            // Identify adjustment results based on model parameters
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
        // Start the camera video media
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
        // The video media stream was successfully launched
        fnSuccess(stream) {
            window.stream = stream; // Make the flow available to the browser console
            this.videoEl.srcObject = stream;
            this.videoEl.play();
        },
        // Failed to start video media stream
        fnError(error) {
            console.log(error);
            alert("Failed to start video media stream" + error);
        },
        // End the camera video media
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
        setImage() {
            document.getElementById('audio').play()
            this.videoEl.pause();
              var _this = this
              _this.context.drawImage(_this.videoEl, 0, 0)
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
            // Recognize and draw face information
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
