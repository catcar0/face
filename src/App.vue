<template>
  <div id="app">
    <!-- <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav> -->
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  padding: 0px;
  margin: -8px;
  box-sizing: border-box;
  user-select: none;
  overflow: hidden;
}
body{
	position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
nav {
  padding: 0px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
.flexc{
  display: flex;
  align-items: center;
  justify-content: center;
}
.flexcol{
  display: flex;
  flex-direction: column;
}
.flexcolc{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.btnscale{
  transition: 0.6s;
  transform: scale(1);
}
.btnscale:active{
  transition: 0.6s;
  transform: scale(0.8);
}
</style>
