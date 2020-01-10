<template>
  <div id="mapview">
    <div class="map-area">
      <rc-map></rc-map>
    </div>
    <div class="panel-area">
      <rc-panel></rc-panel>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import RcMap from '@/components/RcMap.vue'
import RcPanel from '@/components/RcPanel.vue'

@Component({
  components: {
    RcMap,
    RcPanel,
  },
})
export default class App extends Vue {
}
</script>

<style lang="scss" scoped>
#mapview {
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
  display: flex;
}
div.map-area {
  flex: 1;
}
div.panel-area {
  width: 300px;
}
</style>
