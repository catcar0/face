<template>
    <div style="width:100%;height:100vh;">
        <LoginAndReg v-if="!login" @islogin="islogin" />
        <Home v-if="login" />
    </div>
</template>

<script>
import LoginAndReg from './LoginAndReg'
import Home from './Home'
import cookies from 'vue-cookies'
export default {
    name: 'FaceaiIndex',
    components:{LoginAndReg, Home},
    data() {
        return {
            login: false
        };
    },

    mounted() {
        if (cookies.get('login')) this.login = true
    },

    methods: {
        islogin (v){
            this.login = v
        }
    },
};
</script>

<style  scoped>

</style>