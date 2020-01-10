<template>
  <div id="rc-panel" @click="clickPanel($event)">
    <v-card>
      <v-toolbar color="indigo" dark>指定基準位置</v-toolbar>
      <v-container style="font-size:9pt;">
        <v-row style="box-sizing: border-box;">
          <v-col cols="12" sm="4" class="pa-2">緯度</v-col>
          <v-col cols="12" sm="8" class="pa-2">38.180031</v-col>
        </v-row>
        <v-row style="box-sizing: border-box;">
          <v-col cols="12" sm="4" class="pa-2">経度</v-col>
          <v-col cols="12" sm="8" class="pa-2">132.180031</v-col>
        </v-row>
      </v-container>
    </v-card>
    <br />
    <v-card>
      <v-toolbar color="indigo" dark>選択河川</v-toolbar>
      <v-container style="font-size:9pt;">
        <v-row style="box-sizing: border-box;">
          <v-col cols="12" sm="4" class="pa-2">カテゴリ</v-col>
          <v-col cols="12" sm="8" class="pa-2">統一河川</v-col>
        </v-row>
        <v-row style="box-sizing: border-box;">
          <v-col cols="12" sm="4" class="pa-2">河川コード</v-col>
          <v-col cols="12" sm="8" class="pa-2">13211233</v-col>
        </v-row>
        <v-row style="box-sizing: border-box;">
          <v-col cols="12" sm="4" class="pa-2">河川名</v-col>
          <v-col cols="12" sm="8" class="pa-2">利根川</v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
  name: "rc-panel"
})
export default class RcPanel extends Vue {
  clickPanel(event: MouseEvent) {
    console.log(event);
  }
}
</script>

<style lang="scss" scoped>
#rc-panel {
  background-color: #aaa;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 12px;
}
.base-point-frame {
  padding: 8px;
}
</style>
