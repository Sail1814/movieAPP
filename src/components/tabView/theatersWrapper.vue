<template>
  <div class="theatersWrapper">
    <div class="movieShow">
      <div class="goSearch">
        <router-link :to="{name: 'SearchCityView'}">
          <div class="loading" @click="cityView">
            <span class="city">{{cityName}}</span>
            <span class="select">
              <img src="../../common/img/icon_down.png" alt="" width="12px" height="9px">
            </span>
          </div>
        </router-link>
        <router-link :to="{name: 'searchWrapper'}">
          <div class="searchContent">
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
            <span class="text">电影/电视剧/影人</span>
          </div>
      </router-link>
      </div>
      <ul class="switches">
        <router-link :to="{name: 'isHit'}">
          <li
            class="switchesItem"
            @click.stop="nowShow"
            :class="{active: showNow}"
          >
            <span class="item">正在热映</span>
          </li>
        </router-link>
        <router-link :to="{name: 'isHit'}">
          <li
            class="switchesItem"
            @click.stop="upComingShow"
            :class="{active: showUpComing}"
          >
            <span class="item">即将上映</span>
          </li>
        </router-link>
      </ul>
    </div>
    <router-view
      :showNow="showNow"
      :showUpComing="showUpComing"
      :movieList="movieList"
      :movieId="movieId"
    >
    </router-view>
  </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
      name: 'theatersWrapper',
      data () {
        return {
          movieList: null,
          showNow: true,
          showUpComing: false,
          movieId: [],
          searchView: false,
          closeTab: true
        }
      },
      computed: {
        ...mapGetters({
          cityName: 'getCityValue'
        })
      },
      created () {
        this.movieListData()
      },
      methods: {
        movieListData () {
          if (this.showNow) { // 请求正在热映的电影列表
            var url1 = `/v2/movie/in_theaters`
            this.axios.get(url1, {apikey: '0b2bdeda43b5688921839c8ecb20399b', city: this.cityName}).then(res => {
              this.movieList = res.data.subjects
              this.movieIdList() // 每次请求都push了一次id,所以在拿数据时要再处理过this.movieId,拿到数据再清空
            }).catch(error => {
              console.log(error)
            })
          }
          if (this.showUpComing) { // 请求即将上映的电影列表
            var url2 = `/v2/movie/coming_soon`
            this.axios.get(url2, {apikey: '0b2bdeda43b5688921839c8ecb20399b'}).then(res => {
              this.movieList = res.data.subjects
              this.movieIdList()
            }).catch(error => {
              console.log(error)
            })
          }
        },
        nowShow () {
          this.showNow = true
          this.showUpComing = false
          this.movieId = [] // 清空数据，避免再次请求push数据
          this.movieListData() // 再次请求数据
        },
        upComingShow () {
          this.showNow = false
          this.showUpComing = true
          this.movieId = [] // 清空数据，避免再次请求push数据
          this.movieListData() // 再次请求数据
        },
        movieIdList () { // 电影条目id列表数据
          var idArr = this.movieId
          this.movieList.forEach(item => {
            idArr.push(item.id)
          })
          return this.movieId
        },
        seaechShow () {
          this.searchView = true
        },
        closeSearch (data) {
          this.searchView = data
        },
        cityView () {
          this.closeTab = false
          this.$emit('closeTab', this.closeTab)
        }
      }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.theatersWrapper {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  .movieShow {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 97px;
    .goSearch {
      box-sizing: border-box;
      padding: 10px 10px 5px 60px;
      width: 100%;
      height: 50px;
      text-align: center;
      .loading {
        display: flex;
        position: absolute;
        left: 10px;
        width: 70px;
        height: 35px;
        .city {
          display: inline-block;
          font-size: 16px;
          line-height: 35px;
          color: rgba(7,17,27,0.8);
        }
        .select {
          padding-left: 5px;
          display: inline-block;
          font-size: 16px;
          line-height: 35px;
          color: rgba(7,17,27,0.5);
        }
      }
    }
    .searchContent {
      margin-left: 2px;
      height: 35px;
      font-size: 0;
      line-height: 35px;
      border-radius: 5px;
      background: rgba(238,238,238,0.6);
      .icon-search {
        display: inline-block;
        font-size: 16px;
      }
      .text {
        display: inline-block;
        font-size: 16px;
        color: rgba(7,17,27,0.5);
      }
    }
  }
  .switches {
    position: relative;
    z-index: 200;
    display: flex;
    width: 100%;
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
</style>
