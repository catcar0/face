<template>
    <div class="container">
        <!-- start view -->
        <div v-show="status === 'start'" class="start">
            <img @click="status = 'login'" style="position: absolute;left: 62px;bottom: 67px;" src="img/getStarted_btn.svg"
                alt="">
        </div>
        <div v-show="status !== 'start'" class="loginAndreg">
            <img @click="back" style="position: absolute;left: 26px;top: 0%;" src="img/return.svg" alt="">
            <!-- login view -->
            <div v-show="status === 'login'" class="login">
                <div class="flexcol">
                    <div class="title">
                        Login <br>
                        <span v-show="false" style="color: #FC8861;font-size: 16px;font-weight: 400;">
                            Create a new account experience now
                        </span>
                    </div>
                    <div class="input flexcol">
                        <div class="inputtitle">Email</div>
                        <el-input placeholder="Ex.abc@example.com" v-model="email" class="login_email_input">
                            <i slot="prefix" class="el-input__icon el-icon-message">
                                <!-- <img src="img/return.svg" alt=""> -->
                            </i>
                        </el-input>
                        <div class="inputtitle">Your Password</div>
                        <el-input placeholder="enter your password" type="password" v-model="password" class="login_password_input">
                            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
                        </el-input>
                    </div>
                    <div class="flexc" style="justify-content:space-between ;">
                        <div style="color: #D1ADA0;font-size: 12px;text-decoration: underline;line-height: 24px;">Forgot
                            Password?</div>
                        <div style="color: #C3A093;font-size: 12px;line-height: 24px;">
                            <el-checkbox v-model="remember"></el-checkbox>
                            Remember me
                        </div>
                    </div>
                    <div @click="login()" class="logregbtn flexc">
                        Login
                    </div>
                    <div style="color: #C3A093;font-size: 16px;text-align: center; ">
                        Don’t have an account?
                        <span @click="status = 'reg'"
                            style="color: #FC8861;font-size: 16px;font-weight: 700;text-decoration: underline;">Register</span>
                    </div>
                </div>
            </div>
            <!-- register view -->
            <div v-show="status === 'reg'" class="login">
                <div class="flexcol">
                    <div class="title">
                        Register<br>
                        <span style="color: #FC8861;font-size: 16px;font-weight: 400;">
                            Create a new account experience now
                        </span>
                    </div>
                    <div class="input flexcol">
                        <div class="inputtitle">Email</div>
                        <el-input placeholder="Ex.abc@example.com" v-model="email_reg" class="login_email_input">
                            <i slot="prefix" class="el-input__icon el-icon-message">
                                <!-- <img src="img/return.svg" alt=""> -->
                            </i>
                        </el-input>
                        <div class="inputtitle">Your Password</div>
                        <el-input placeholder="enter your password" type="password" v-model="password_reg" class="login_password_input">
                            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
                        </el-input>
                    </div>
                    <div @click="reg" class="logregbtn flexc">
                        Register
                    </div>
                    <div style="color: #C3A093;font-size: 16px;text-align: center; ">
                        Already have an account?
                        <span @click="status = 'login'"
                            style="color: #FC8861;font-size: 16px;font-weight: 700;text-decoration: underline;">Login</span>
                    </div>
                </div>
            </div>
            <!-- infomation view -->
            <div v-show="status === 'info'" class="login">
                <div class="flexcol">
                    <div class="title">
                        Information<br>
                        <!-- <span style="color: #FC8861;font-size: 16px;font-weight: 400;">
                            Create a new account experience now
                        </span> -->
                    </div>
                    <div class="input flexcol">
                        <div class="inputtitle">Your Name</div>
                        <el-input placeholder="Ex. lucy" v-model="name" class="login_email_input">
                            <i slot="prefix" class="el-input__icon el-icon-user">
                                <!-- <img src="img/return.svg" alt=""> -->
                            </i>
                        </el-input>
                        <div class="inputtitle">Autism Spectrum</div>
                        <el-input placeholder="Please enter the required content" v-model="spectrum" class="info">
                            <!-- <i slot="prefix" class="el-input__icon el-icon-lock"></i> -->
                        </el-input>
                    </div>
                    <div class="flexc" style="justify-content: space-between;">
                        <div style="width: calc(50% - 42.5px);;border: 1px #C3A093 solid"></div>
                        <div
                            style="width: 57px;color: #333333; font-size: 16px; font-family: Inter; font-weight: 400; line-height: 24px; word-wrap: break-word">
                            Gender</div>
                        <div style="width: calc(50% - 42.5px);;border: 1px #C3A093 solid"></div>
                    </div>
                    <div class="flexc" style="gap: 20px;margin-top: 15px;margin-bottom: 30px;">
                        <div @click="sex = 'man'" class="sexbtn flexcol" :class="sex === 'man' ? 'sexsel' : 'sexunsel'">
                            <img src="img/man.svg" alt="">
                            <div>Man</div>
                        </div>
                        <div @click="sex = 'woman'" class="sexbtn flexcol" :class="sex === 'woman' ? 'sexsel' : 'sexunsel'">
                            <img src="img/woman.svg" alt="">
                            <div>Woman</div>
                        </div>
                        <div @click="sex = 'other'" class="sexbtn flexcol" :class="sex === 'other' ? 'sexsel' : 'sexunsel'">
                            <img src="img/other.svg" alt="">
                            <div>Other</div>
                        </div>
                    </div>
                    <div @click="info" class="logregbtn flexc">
                        Next
                    </div>
                </div>
            </div>
            <!-- Emotion Records 1  -->
            <div v-show="status === 'emotion1'" class="login">
                <div class="title">
                    Emotion Records <br>
                    <div style="color: #FC8861;font-size: 16px;font-weight: 400;margin-top: 10px;">
                        Please follow the prompts to complete the emotion records
                    </div>
                </div>
                <div style="display: flex;flex-wrap: wrap;padding: 30px;justify-content: space-between;gap: 30px;">
                    <div class="emobox flexcolc">
                        <img src="img/happy.svg" alt="">
                        Happy
                    </div>
                    <div class="emobox flexcolc">
                        <img src="img/angry.svg" alt="">
                        Angry
                    </div>
                    <div class="emobox flexcolc">
                        <img src="img/sad.svg" alt="">
                        Sad
                    </div>
                    <div class="emobox flexcolc">
                        <img src="img/disgusting.svg" alt="">
                        Disgusting
                    </div>
                </div>
                <div class="flexc" @click="status = 'emotion2'"
                    style="width: 100%;height: 56px;margin-top: 30px;background: rgba(255, 255, 255, 0.50); border-radius: 56px">
                    <img src="img/shoot_fill.svg" alt="">
                </div>
            </div>
            <!-- Emotion Records 2  -->
            <div v-show="status === 'emotion2'" class="login">
                <div class="title">
                    Emotion Records <br>
                    <div style="color: #FC8861;font-size: 16px;font-weight: 400;margin-top: 10px;">
                        Please follow the prompts to complete the emotion records
                    </div>
                </div>
                <div class="flexcol" style="gap: 20px;margin-top: 30px;">
                    <div class="iconbox" v-for="(item, index) in emolist" :key="index" @click="record(index)">
                        <img :src="item.icon" alt="">
                        <div style="margin-left: -35%;">{{ item.content }}</div>
                        <img v-if="item.img === ''" src="img/arrow_g.svg" alt="">
                        <img v-else src="img/finish_tick.svg" alt="">
                    </div>
                </div>
            </div>
            <!-- Emotion Records 3  -->
            <div v-if="status === 'emotion3'" class="login">
                <div
                    style="padding-top: 5%;margin-bottom: 5%;font-size: 14px; font-family: Inter; font-weight: 400; line-height: 22px; word-wrap: break-word">
                    Take a photo of your own face, please ensure that your phone has sufficient lighting
                </div>
                    <Camera :shoot="shoot" :change="change" @returnimg="returnimg" :img="emolist[emoindex].img" />
                <div class="iconbox" style="height: 68px;margin-top: 20px;" v-for="(item, index) in emolist.slice(emoindex, emoindex + 1)"
                    :key="index">
                    <img :src="item.icon" alt="">
                    <div>{{ item.content }}</div>
                    <img v-if="item.img === ''" style="opacity: 0;" src="img/arrow_g.svg" alt="">
                    <img v-else src="img/finish_tick.svg" alt="">
                </div>
                <div class="flexc" style="gap: 20px;margin-top: 20px;">
                    <img class="btnscale" @click="change++" src="img/refresh.svg" alt="">
                    <img class="btnscale" @click="shoot++" src="img/shoot_big.svg" alt="">
                    <img class="btnscale" @click="next" src="img/next_fill.svg" alt="">
                </div>
            </div>
            <!-- Emotion Records 4  -->
            <div v-show="status === 'emotion4'" class="login">
                <div class="title">
                    Emotion Records <br>
                    <div style="color: #FC8861;font-size: 16px;font-weight: 400;margin-top: 10px;">
                        Please follow the prompts to complete the emotion records
                    </div>
                </div>
                <div class="flexcol" style="gap: 30px;margin-top: 30px;margin-bottom: 40px;">
                    <div class="iconbox" style="height: 68px;" v-for="(item, index) in emolist" :key="index">
                        <img :src="item.icon" alt="">
                        <div >{{ item.content }}</div>
                        <img v-if="item.img === ''" src="img/arrow_g.svg" alt="">
                        <img v-else src="img/finish_tick.svg" alt="">
                    </div>
                </div>
                <div @click="submit" class="logregbtn flexc">Submit</div>
            </div>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui';
import cookies from 'vue-cookies'
import axios from 'axios'
import Camera from '../../components/Camera.vue'
export default {
    name: 'FaceaiLoginAndReg',
    components:{Camera},
    data() {
        return {
            email: '',
            password: '',
            email_reg: '',
            password_reg: '',
            spectrum: '',
            name: '',
            dataname: '',
            status: 'start',
            sex: 'man',
            emoindex: 0,
            remember: false,
            change: 0,
            shoot: 0,
            emolist: [
                {
                    icon: require('../../../public/img/happy_icon.svg'),
                    content: 'Happy',
                    img: ''
                },
                {
                    icon: require('../../../public/img/sad_icon.svg'),
                    content: 'Sad',
                    img: ''
                },
                {
                    icon: require('../../../public/img/disgusting_icon.svg'),
                    content: 'Disgusting',
                    img: ''
                },
                {
                    icon: require('../../../public/img/angry_icon.svg'),
                    content: 'Angry',
                    img: ''
                }
            ]
        };
    },

    mounted() {

    },

    methods: {
        login () {
            if (this.email === '' || this.password === '') {
                Message.warning('Cannot be empty')
                return
            }
            let list = []
            let count = 0
            if (cookies.get('reglist')) {
                list = cookies.get('reglist')
            }
            list.forEach(item => {
                if (this.email === item.email) {
                    if (this.password === item.password) {
                        count++
                    }
                }
            });
            if (count === 0 ) {
                Message.warning('The account number or password is incorrect')
                return
            }
            cookies.set('login', true, -1)
            this.$emit('islogin', true)
            Message.success('Success')
            if (!this.remember) {
                this.email = ''
                this.password = ''
            }
        },
        reg () {
            if (this.email_reg === '' || this.password_reg === '') {
                Message.warning('Cannot be empty')
                return
            }
            this.status = 'info'
            Message.success('Success')
        },
        info () {
            if (this.name === '' || this.spectrum === '') {
                Message.warning('Cannot be empty')
                return
            }
            this.status = 'emotion1'
            Message.success('Success')
        },
        record(index) {
            this.status = 'emotion3'
            this.emoindex = index
        },
        returnimg (v) {
            console.log(v)
            this.emolist[this.emoindex].img = v
        },
        next () {
            let count = 0
            this.emolist.forEach(item => {
                if (item.img === '') {
                    count++
                }
            });
            if (count === 0) this.status = 'emotion4'
            else this.status = 'emotion2'
        },
        submit () {
            Message.success('Success')
            this.status = 'login'
            this.upload(this.emolist[0].img.file)
            this.upload(this.emolist[1].img.file)
            let list = []
            if (cookies.get('reglist')) {
                list = cookies.get('reglist')
            }
            list.push({
                email: this.email_reg,
                password: this.password_reg
            })
            cookies.set('reglist', list, -1)
            this.email_reg = ''
            this.password_reg = ''
            this.spectrum = ''
            this.dataname = this.name
            this.name = ''
        },
        back () {
            switch (this.status) {
                case 'login' : this.status = 'start'; break;
                case 'reg' : this.status = 'login'; break;
                case 'info' : this.status = 'reg'; break;
                case 'emotion1' : this.status = 'info'; break;
                case 'emotion2' : this.status = 'emotion1'; break;
                case 'emotion4' : this.status = 'emotion3'; break;
                default:
                    break;
            }
        },
        upload(fileimg) {
            // this.resultloading = true
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
                let personGroup = []
                if (cookies.get('personGroup')) personGroup = cookies.get('personGroup')
                let data = {
                    name: this.dataname,
                    url: response.data.data.url
                }
                if (personGroup.length <=10) {
                    personGroup.push(data)
                    cookies.set('personGroup', personGroup, -1)
                } else {
                    Message.warning('The number of people in the group is full')
                }
                // this.base_url = response.data.data.url
                // this.start()
            }).catch(error => {
                // this.resultloading = false
                console.log(error)
            })
        },
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

.start {
    width: 100%;
    height: 100%;
    background: url('../../../public/img/getStarted_bg.png');
    background-size: cover;
}

.loginAndreg {
    width: 100%;
    height: 100%;
    padding: 37px;
    box-sizing: border-box;
    background: url('../../../public/img/bg.png');
    background-size: cover;
}

.login {
    width: 100%;
    height: 100%;
    max-height: 100%;
    box-sizing: border-box;
}

.title {
    font-size: 32px;
    font-weight: 700;
    height: 80px;
    padding-top: 5%;
}

.input {
    margin-bottom: 10px;
    height: 200px;
    justify-content: space-around;
}

.logregbtn {
    margin-top: 10px;
    margin-bottom: 40%;
    width: 100%;
    height: 56px;
    border-radius: 999px;
    font-size: 16px;
    font-weight: 700;
    background: linear-gradient(270deg, #FD814A 0%, #FC5C4C 100%);
    color: #FFFFFF;
}

.sexbtn {
    width: 60px;
    height: 60px;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    font-size: 10px;
    gap: 10px;
}

.sexunsel {
    border: 2px white solid;
    box-sizing: border-box;
    transition: 0.5s;
}

.sexsel {
    background: #FFF7F5;
    box-shadow: 0px 4px 13px rgba(252, 136, 97, 0.59);
    border: 1px #FFF7F5 solid;
    box-sizing: border-box;
    transition: 0.5s;
}

.emobox {
    box-sizing: border-box;
    width: 98px;
    height: 145px;
    font-size: 12px;
    gap: 5px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.50);
    border: 1px white solid
}

.iconbox {
    width: 100%;
    height: 58px;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.50);
    border: 1px white solid;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
}

::v-deep .el-input__inner {
    border-radius: 100px;
    height: 56px;
    border: 1px solid #D1ADA1;
    padding-left: 55px;
    color: #D1ADA1 !important;
    font-size: 16px;
    font-style: italic;
    /* border-color: #D1ADA1; */
}

::v-deep .info .el-input__inner {
    padding-left: 35px;
}

::v-deep .el-input__inner::placeholder {
    color: #D1ADA1 !important;
    font-size: 16px;
}

::v-deep .el-input__inner:focus {
    border: 2px solid #FF9B63;
    color: #FF9B63 !important;
}

::v-deep .el-input:focus-within .el-input__icon {
    color: #FF9B63 !important;
}

::v-deep .el-input__icon {
    line-height: 56px;
    font-size: 22px;
    width: 45px;
}

::v-deep .is-checked .el-checkbox__inner {
    background-color: #FF9B63 !important;
    border-color: #FF9B63 !important;
}

::v-deep .el-checkbox__inner {
    margin-bottom: -2px;
    border-color: #FF9B63 !important;
}</style>