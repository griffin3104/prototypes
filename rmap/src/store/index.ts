import Vue from 'vue'
import Vuex from 'vuex'
import { LatLng, LatLngBounds } from 'leaflet';

Vue.use(Vuex)

export interface RootStoreStruct {
  zoom: number,
  minZoom: number,
  maxZoom: number,
  tileUrl: string,
  bounds: LatLngBounds | null,
  center: LatLng | null,
  riverType: number
}


export default new Vuex.Store({
  state: {
    zoom: 6,
    minZoom: 4,
    maxZoom: 16,
    bounds: null,
    tileUrl: "https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png",
    center: { lat: 35.67773, lng: 139.754813},
    riverType: 0,

  } as RootStoreStruct,
  mutations: {
    setZoom(state: RootStoreStruct, zoom: number) {
      state.zoom = zoom;
    },
    setBounds(state: RootStoreStruct, bounds: LatLngBounds) {
      state.bounds = bounds;
    }
  },
  actions: {
  },
  modules: {
  }
})
