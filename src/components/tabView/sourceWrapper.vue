<template>
  <div class="sourceWrapper">
    <div class="sourceHeader">
      <div class="searchContent">
        <span class="title">
          <span class="icon-search">
              <mt-cell
                icon="search"
                style="display: inline;
                top: -2px;
                font-size: 16px;
                background: rgba(238,238,238,0.5);
                min-height: 35px;
                color: rgba(7,17,27,0.5);"
              >
              </mt-cell>
          </span>
          <router-link :to="{name: 'searchWrapper'}">
            <span class="text">电影/电视剧/影人</span>
          </router-link>
        </span>
      </div>
      <ul class="switches">
        <router-link :to="{name: 'SourceTabView'}">
          <li class="switchesItem" @click="keyDown" :class="{active: movies}">
            <span class="item">电影</span>
          </li>
        </router-link>
        <router-link :to="{name: 'SourceTabView'}">
          <li class="switchesItem" @click="keyUp" :class="{active: television}">
            <span class="item">电视</span>
          </li>
        </router-link>
      </ul>
    </div>
    <router-view :movies="movies" :television="television"></router-view>
  </div>
</template>

<script>
    export default {
      name: 'sourceWrapper',
      data () {
        return {
          movies: true,
          television: false
        }
      },
      methods: {
        keyDown () {
          this.movies = true
          this.television = false
        },
        keyUp () {
          this.movies = false
          this.television = true
        }
      }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .sourceWrapper {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 47px;
    width: 100%;
    overflow: hidden;
    .sourceHeader {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 97px;
      .searchContent {
        box-sizing: border-box;
        padding: 10px 10px;
        width: 100%;
        height: 50px;
        .title {
          display: inline-block;
          width: 100%;
          font-size: 16px;
          text-align: center;
          line-height: 36px;
          border-radius: 5px;
          background: rgba(238,238,238,0.6);
          color: rgba(7,17,27,0.5);
          .icon-search {
            display: inline-block;
          }
          .text {
            display: inline-block;
            color: rgba(7,17,27,0.5);
          }
        }
      }
      .switches {
        position: relative;
        display: flex;
        width: 100%;
        z-index: 100;
        a {
          flex: 1;
          display: inline-block;
          .switchesItem {
            padding: 15px;
            text-align: center;
            font-size: 16px;
            color: rgba(7,17,27,0.5);
            &.active {
              color: rgb(7,17,27);
              border-bottom: 2px solid rgb(7,17,27);
            }
          }
        }
      }
    }
  }
</style>
