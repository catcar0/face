<template>
    <div class="container">
        <div v-show="step !== 0"
            style="position: fixed;z-index: 99;width: 100%;height: 100%;left: 0;top: 0;background:rgba(0, 0, 0, 0.5);padding: 10px;box-sizing: border-box;">
            <img @click="step = 2" v-show="step === 1" style="width: 100%;margin-top: 45%;" src="img/step1.png" alt="">
            <img @click="step = 3" v-show="step === 2" style="width: 100%;margin-top: 45%;" src="img/step2.png" alt="">
            <img @click="skip" v-show="step === 3" style="width: calc(100% - 20px);;position: absolute;bottom: 0;"
                src="img/step3.png" alt="">
            <div :style="{ top: step === 3 ? '35%' : '75%' }" @click="skip"
                style="position: absolute;background:rgba(255, 255, 255, 0.5);margin-left: calc(50% - 62px);color: white;"
                class="flexc btn">
                Skip
            </div>
        </div>
        <!-- bottom menu -->
        <div v-show="mode === ''">
            <div style="position: fixed;bottom: 0;width: 100%;z-index: 13;height: 15px;background-color: white;">
            </div>
            <div style="position: fixed;bottom: 0px;width: 100%;z-index: 1;">
                <img style="width: 100%;position: relative;z-index: 8;" src="img/Subtract.png" alt="">
                <img @click="mode = 'learner'" class="btnscale"
                    style="width: 84px;position: absolute;bottom: 33%;z-index: 15px;left: calc(50% - 42px);z-index: 99;"
                    src="img/New-Button.png" alt="">
                <div
                    style="position: absolute;z-index: 15;bottom: 30px;display: flex;justify-content: space-around;width: 100%;">
                    <img @click="menuindex = 'home'" :src="menuindex === 'home' ? 'img/home_fill.svg' : 'img/home.svg'"
                        alt="">
                    <img @click="menuindex = 'openBook'"
                        :src="menuindex === 'openBook' ? 'img/openBook_fill.svg' : 'img/openBook.svg'" alt="">
                    <div></div>
                    <img @click="menuindex = 'closeBook'"
                        :src="menuindex === 'closeBook' ? 'img/closeBook_fill.svg' : 'img/closeBook.svg'" alt="">
                    <img @click="menuindex = 'user'" :src="menuindex === 'user' ? 'img/user_fill.svg' : 'img/user.svg'"
                        alt="">
                </div>
            </div>
        </div>
        <!-- home view -->
        <div style="width: 100%;height: 100%;">
            <!-- default view -->
            <div v-show="mode === ''" class="home">
                <img style="width: 100%;position: fixed; top: 0;" src="img/home_top_bg.png" alt="">
                <div class="flexc"
                    style="position: relative;z-index: 88;padding-top: 20%;color: white;justify-content: space-around;">
                    <div>
                        <div style="font-size: 24px;font-weight: 700;line-height: 30px;">Hi, Kristin</div>
                        <div style="font-size: 14px;line-height: 18px;">Let’s start learning <br> Good morning!</div>
                    </div>
                    <div>
                        <img @touchstart.prevent="goTouchstart()" @touchend.prevent="goTouchend()" style="width: 88px;" src="img/home_ava.png" alt="">
                    </div>
                </div>
                <div class="progressbox flexcol">
                    <div>Learning progress</div>
                    <div class="flexc" style="color: #828282;font-size: 12px;justify-content: space-between;">
                        <div>
                            <div style="color: #F2994A;font-size: 24px;">{{ $cookies.get('progress').pra }}</div>
                            <div>Emotion practiced</div>
                        </div>
                        <div>
                            <div style="color: #9D66FA;font-size: 24px;">{{ $cookies.get('progress').tasks }}</div>
                            <div>Tasks done</div>
                        </div>
                        <div>
                            <div style="color: #529AFE;font-size: 24px;">{{ $cookies.get('progress').days.length }}</div>
                            <div>Days</div>
                        </div>
                    </div>
                    <div class="flexc"
                        style="justify-content: space-between;color: #404040;font-size: 10px;font-family: Nunito; ">
                        <div style="">
                            <img style="width: 80%;position: absolute;" src="img/Line.png" alt="">
                            <div style="position: absolute;margin-top: -4px;display: flex;align-items: center;" >
                                <img :style="{width: 'calc(' + ($cookies.get('progress').days.length / 30) * 100 + '% - 0px)' }" style="max-width: calc(100% - 20px);;height: 8px;" src="img/Line2.png" alt="">
                                <img style="width: 15px;margin-left:-5px;" src="img/point.svg" alt="">
                            </div>
                        </div>
                        days:{{ $cookies.get('progress').days.length }}
                    </div>
                </div>
                <div class="modebox flexcol">
                    <img @click="mode = 'regular';status = ''" src="img/regularmode.png" alt="">
                    <img @click="mode = 'learner';status = ''" src="img/learnermode.png" alt="">
                    <div style="color: #333333;font-size: 18px; ">
                        Learning Footprints
                    </div>
                    <img src="img/empty.png" alt="">
                </div>
            </div>
            <!-- regular mode view (include  loading && azure && result) -->
            <div v-if="mode === 'regular'" class="modeviewbox" v-loading="resultloading"
                element-loading-background="rgba(0, 0, 0, 0.5)">
                <img @click="mode = ''" style="position: absolute;left: 26px;top: 0;" src="img/return.svg" alt="">
                <div
                    style="padding-top: 5%;margin-bottom: 5%;font-size: 14px; font-family: Inter; font-weight: 400; line-height: 22px; word-wrap: break-word">
                    Take a photo of your own face, please ensure that your phone has sufficient lighting
                </div>
                <Camera :shoot="shoot" :change="change" @returnimg="returnimg" :img="img" @returnemo="returnemo"
                    :clear="clear" />
                <div class="flexc" style="gap: 20px;margin-top: 20px;">
                    <img class="btnscale" @click="change++" src="img/refresh.svg" alt="">
                    <img class="btnscale" @click="shoot++; emo_res = emo;" src="img/shoot_big.svg" alt="">
                    <img class="btnscale" @click="back" src="img/next_fill.svg" alt="">
                </div>
                <!-- result card -->
                <div v-show="status === 'result'" class="cardbox">
                    <el-result icon="success" title="Success" subTitle="Please see the results">
                        <template slot="extra">
                            <!-- <el-button type="primary" size="medium">返回</el-button> -->
                            <div style="font-size: 24px;gap: 10px;" class="flexcol">
                                <div>You are：{{ person }}</div>
                                <div>The expression is：{{ emo_res }}</div>
                            </div>
                        </template>
                    </el-result>
                    <div class="flexc" style="gap: 20px;margin-top: 20px;padding-bottom: 50px;">
                        <div v-show="mask" class="btn flexc" @click="clear++; status = ''"
                            style="background: linear-gradient(91deg, #27AE60 0%, #50D48B 100%);color: white;">Continue
                        </div>
                        <div v-show="!mask" class="btn flexc" @click="mode = ''"
                            style="background: linear-gradient(270deg, #FD814A 0%, #FC5C4C 100%);color: white;">Retry</div>
                        <div @click="mode = ''" class="btn flexc">Return</div>
                    </div>
                </div>
            </div>
            <!-- learner mode view (include  questions && mark) -->
            <div v-if="mode === 'learner'" class="modeviewbox">
                <img @click="mode = ''" style="position: absolute;left: 26px;top: 0;" src="img/return.svg" alt="">
                <div
                    style="padding-top: 5%;margin-bottom: 10%;font-size: 14px; font-family: Inter; font-weight: 400; line-height: 22px; word-wrap: break-word">
                    Take a photo of your own face, please ensure that your phone has sufficient lighting
                </div>
                <Camera :shoot="shoot" :change="change" @returnimg="returnimg" :img="img" @returnemo="returnemo"
                    :clear="clear" />
                <div class="flexc" style="gap: 20px;margin-top: 20px;">
                    <img class="btnscale" @click="change++" src="img/refresh.svg" alt="">
                    <img class="btnscale" @click="shoot++; status = 'question'" src="img/shoot_big.svg" alt="">
                    <img class="btnscale" @click="back" src="img/next_fill.svg" alt="">
                </div>
                <!-- question card -->
                <div v-show="status === 'question'" class="cardbox">
                    <div style="font-size: 18px;">Please select the emotion <br> <span style="font-size: 12px;">that you
                            believe is correct</span></div>
                    <div style="display: flex;flex-wrap: wrap;padding: 30px;justify-content: center;gap: 30px;">
                        <div @click="emosel = 'happy'" class="emobox flexcolc"
                            :class="emosel === 'happy' ? 'emosel' : 'emounsel'">
                            <img src="img/happy.svg" alt="">
                            Happy
                        </div>
                        <div @click="emosel = 'angry'" class="emobox flexcolc"
                            :class="emosel === 'angry' ? 'emosel' : 'emounsel'">
                            <img src="img/angry.svg" alt="">
                            Angry
                        </div>
                        <div @click="emosel = 'sad'" class="emobox flexcolc"
                            :class="emosel === 'sad' ? 'emosel' : 'emounsel'">
                            <img src="img/sad.svg" alt="">
                            Sad
                        </div>
                        <div @click="emosel = 'disgusted'" class="emobox flexcolc"
                            :class="emosel === 'disgusted' ? 'emosel' : 'emounsel'">
                            <img src="img/disgusting.svg" alt="">
                            Disgusted
                        </div>
                    </div>
                    <div @click="havemask" class="logregbtn flexc">
                        Submit
                    </div>
                </div>
                <!-- mask card -->
                <div v-show="status === 'mask'" class="cardbox">
                    <img v-show="!mask" style="width: 100%;" src="img/mask_false.png" alt="">
                    <img v-show="mask" style="width: 100%;" src="img/mask_success.png" alt="">
                    <div class="flexc" style="gap: 20px;margin-top: 20px;padding-bottom: 50px;">
                        <div v-show="mask" class="btn flexc" @click="clear++; status = ''"
                            style="background: linear-gradient(91deg, #27AE60 0%, #50D48B 100%);color: white;">Continue
                        </div>
                        <div v-show="!mask" class="btn flexc" @click="clear++; status = ''"
                            style="background: linear-gradient(270deg, #FD814A 0%, #FC5C4C 100%);color: white;">Retry</div>
                        <div @click="mode = ''" class="btn flexc">Return</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Camera from '../../components/Camera.vue'
import axios from 'axios'
import main from '@/assets/js/test'
// import normal from '@/assets/js/normal'
import { Message } from 'element-ui'
import cookies from 'vue-cookies'
export default {
    name: 'FaceaiHome',
    components: { Camera },
    data() {
        return {
            menuindex: 'home',
            mode: '',
            emosel: '',
            mask: true,
            step: 0,
            change: 0,
            shoot: 0,
            clear: 0,
            resultloading: false,
            img: '',
            status: '',
            emo: '',
            emo_res: '',
            person: '',
            base_url: 'http://47.94.44.34/statics/avatar/',
            ori_url: 'base.jpg',
            progress: ''
        };
    },
    beforeMount() {
        this.initprogress()
    },
    mounted() {
        this.step = 1
        if (cookies.get('step')) this.step = 0
        this.getDictionary()
        this.initprogress()
        // this.getCurrentDate()
    },

    methods: {
        //Initialize progress cookies
        initprogress() {
            let data = {
                pra: 0,
                tasks: 0,
                days: []
            }
            if (cookies.get('progress')) this.progress = cookies.get('progress')
            else cookies.set('progress', data, -1)
        },
        //Sign out
        logout() {
            console.log('logout')
            cookies.remove('login')
            // cookies.remove('step')
            // cookies.remove('progress')
            location.reload();
        },
        //Get the current time
        getCurrentDate() {
            let now = new Date();
            let year = now.getFullYear();
            let month = now.getMonth() + 1;
            let day = now.getDate();
            console.log(year + '' + month + '' + day)
            let newday = year + '' + month + '' + day
            let count = 0
            this.progress.days.forEach(item => {
                if (item === newday) count++
            });
            if (count === 0) {
                this.progress.days.push(newday)
                cookies.set('progress', this.progress, -1)
            }
            // return year + '' + month + '' + day
        },
        skip() {
            this.step = 0
            cookies.set('step', true, -1)
        },
        back() {

        },
        returnimg(v) {
            console.log(v)
            if (this.mode === 'learner') {
                return
            }
            this.img = v.image
            this.upload(v.file)
        },
        //mask
        havemask() {
            console.log(this.emo)
            if (this.emo == this.emosel) this.mask = true
            else this.mask = false
            this.status = 'mask'
            this.progress.pra++
            this.progress.tasks++
            cookies.set('progress', this.progress, -1)
            this.getCurrentDate()
        },
        returnemo(v) {
            this.emo = v
            console.log(this.emo)
        },
        //Obtain cookies to the person composition object
        getDictionary() {
            let list = cookies.get('personGroup')
            if (!list) {
                return
            }
            let obj = {}
            list.forEach(item => {
                let key = item.name
                let value = item.url
                if (obj[key]) obj[key].push(value)
                else {
                    obj[key] = []
                    obj[key].push(value)
                }
            });
            this.dictionary = obj
            console.log(this.dictionary, list)
        },
        getOriUrl(url) {
            this.ori_url = url
        },
        //Microsoft Face Recognition begins
        start() {
            this.getDictionary()
            // if (this.dictionary !== 0) {
            //     return
            // }
            main(this.dictionary, this.base_url, this.ori_url).then(res => {
                this.uploading = false
                console.log(res)
                this.status = 'result'
                this.progress.tasks++
                cookies.set('progress', this.progress, -1)
                this.getCurrentDate()
                if (res !== '') {
                    this.person = res
                } else {
                    this.person = 'unkown'
                }
                this.resultloading = false
            }).catch(error => {
                Message.error('Recognition failed, please try again')
                this.person = 'unkown'
                this.status = 'result'
                this.resultloading = false
                console.log(error)
            })
        },
        //Upload an image to sm.ms
        upload(fileimg) {
            this.resultloading = true
            const formData = new FormData();
            formData.append("smfile", fileimg)
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
                this.start()
            }).catch(error => {
                this.resultloading = false
                console.log(error)
            })
        },
        goTouchstart() {
            let _this = this;
            clearTimeout(_this.timeOutEvent);
            _this.timeOutEvent = setTimeout(function () {
                _this.timeOutEvent = 0;
                //  Handling long press events...
                cookies.remove('reglist')
                cookies.remove('personGroup')
                Message.success('The user group account has been reset, please register again')
            }, 1000);
        },
        //If the hand is released within 1000 milliseconds, the long press event is canceled
        goTouchend() {
            let _this = this;
            clearTimeout(_this.timeOutEvent);
            if (_this.timeOutEvent !== 0) {
                //  Handle click events
                _this.logout()
                Message.success('Logout successful')
            }
        }
    },
};
</script>

<style  scoped>
.container {
    width: 100%;
    height: 100%;
    color: #333333;
    box-sizing: border-box;
    /* background-color: aliceblue; */
}

.home {
    width: 100%;
    height: 100%;
    max-height: 100%;
    box-sizing: border-box;
}

.progressbox {
    border-radius: 10px;
    aspect-ratio: 1/0.414;
    padding: 15px;
    background-color: white;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    position: relative;
    z-index: 11;
    justify-content: space-between;
    margin: 10px 30px 0 30px;
}

.modebox {
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
    gap: 20px;
    height:50%;
    padding-bottom: 100px;
    overflow: auto;
}

.modeviewbox {
    width: 100%;
    height: 100%;
    padding: 37px;
    box-sizing: border-box;
    background: url('../../../public/img/bg.png');
    background-size: cover;
}

.emobox {
    box-sizing: border-box;
    width: 98px;
    height: 145px;
    font-size: 12px;
    gap: 5px;
    border-radius: 10px;
    border-radius: 10px;
}

.emosel {
    border: 1px #FD7B4B solid;
    background: #FFF4F0;
}

.emounsel {
    border: 1px white solid;
    background: rgba(221.03, 221.03, 221.03, 0.50);
}

.logregbtn {
    margin-top: 10px;
    margin-bottom: 40%;
    width: 124px;
    margin: 0 auto;
    height: 56px;
    border-radius: 999px;
    font-size: 16px;
    font-weight: 700;
    background: linear-gradient(270deg, #FD814A 0%, #FC5C4C 100%);
    color: #FFFFFF;
}

.cardbox {
    position: fixed;
    background: #FDFDFD;
    box-shadow: 0px 0px 24px rgba(127.93, 127.93, 127.93, 0.25);
    border-radius: 20px;
    width: 100%;
    bottom: 0;
    left: 0;
    text-align: center;
    padding: 20px;
    box-sizing: border-box;
}

.btn {
    border-radius: 99px;
    height: 48px;
    width: 124px;
    background: #E0E0E0;
}
</style>