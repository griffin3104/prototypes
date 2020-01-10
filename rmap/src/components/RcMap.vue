<template>
  <div id="rc-map">
    <l-map
      :zoom="zoom"
      :center="center"
      :max-zoom="maxZoom"
      :min-zoom="minZoom"
      @update:zoom="updateZoom"
      @update:bounds="updateBounds"
    >
      <l-tile-layer :url="tileUrl"></l-tile-layer>
    </l-map>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { LMap, LTileLayer, LGeoJson } from 'vue2-leaflet';
import { MapOptions, LatLngExpression, GeoJSONOptions, Layer, LatLng, LatLngBounds } from 'leaflet';
import * as L from 'leaflet';
import * as geojson from 'geojson';

@Component({
  name: "rc-map",
  components: {
    LMap, LTileLayer, LGeoJson,
  }
})
export default class RcMap extends Vue {
  get zoom(): number {
    return this.$store.state.zoom;
  }
  set zoom(z: number) {
    this.$store.commit("setZoom", z);
  }
  get tileUrl(): string {
    return this.$store.state.tileUrl;
  }
  get center(): LatLng {
    return this.$store.state.center;
  }
  get maxZoom(): LatLng {
    return this.$store.state.maxZoom;
  }
  get minZoom(): number[] {
    return this.$store.state.minZoom;
  }
  updateZoom(z: number) {
    this.zoom = z;
  }
  updateBounds(b: any) {
    console.log(b);
    this.$store.commit("setBounds", b);
  }
}
</script>

<style scoped>
@import "~leaflet/dist/leaflet.css";

#rc-map {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
