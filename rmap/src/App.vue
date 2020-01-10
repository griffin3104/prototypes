<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component({
  components: {
  },
})
export default class App extends Vue { }
</script>

<style lang="scss">
html {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  overflow: hidden;
}
body {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
}
</style>
