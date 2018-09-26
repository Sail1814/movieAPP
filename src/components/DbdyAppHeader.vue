<template>
  <div class="dbdyAppHeader">
    <router-view @closeTab="closeTab" :closeView="closeView"></router-view>
    <div class="tab" v-if="TabView">
      <div class="tab-item">
        <router-link to="/">热映</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/source">找片</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/mine">我的</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: 'DbdyAppHeader',
    data () {
      return {
        TabView: true
      }
    },
    watch: {
      closeView (newValue) {
        this.TabView = newValue
      }
    },
    computed: {
      ...mapGetters({closeView: 'getTab'})
    },
    methods: {
      closeTab (data) {
        var View = this.closeView
        View = data
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.tab {
  position: fixed;
  display: flex;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 46px;
  border-top: 1px solid rgba(7,17,27,0.1);
  font-size: 0;
  .tab-item {
    flex: 1;
    line-height: 46px;
    text-align: center;
    a {
      display: block;
      font-size: 14px;
      color: rgba(7,17,27,0.4);
    }
  }
}
</style>
