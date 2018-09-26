<template>
    <div class="searchWrapper">
      <div class="searchBox">
        <div class="tab">
          <div class="tabInp">
            <i class="icon-search"></i>
            <input type="text" v-model="query" placeholder="搜索电影/电视剧/影人" class="box"/>
            <i class="icon-search"></i>
          </div>
          <span class="cancel" @click="back">取消</span>
        </div>
      </div>
      <div class="container">
        <div class="scrollInfo" ref="scrollInfo">
          <div class="bscroll-container">
            <!-- 刷新提示信息 -->
            <div class="top-tip">
              <span class="refresh-hook">{{pulldownMsg}}</span>
            </div>
            <!-- 内容列表 -->
            <ul class="list">
              <router-link to="/movieInfo">
                <li class="movieList" v-for="(item, index) in movieList" :key="index" @click="upData(index)">
                  <div class="content">
                    <div class="img">
                      <img v-lazy="item.images.small" width="45px" height="60px"/>
                    </div>
                    <div class="info">
                      <span class="title">{{item.title}}</span>
                      <span class="basicInfo">{{item.rating.average}}分/{{item.year}}</span>
                    </div>
                  </div>
                </li>
              </router-link>
              <!-- 底部提示信息 -->
              <div class="loadmore" v-show="start < total && movieList.length">正在加载中...</div>
              <div class="loadmore" v-show="start === total && movieList.length">没有了...</div>
            </ul>
            <loading v-show="loading"></loading>
          </div>
        </div>
        <!-- alert提示刷新成功 -->
        <div class="alert-hook" :style="{display: alertHook}">刷新成功</div>
      </div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'
    import loading from '../loading/loading'
    import {mapMutations} from 'vuex'
    export default {
      name: 'searchWrapper',
      components: {loading},
      data () {
        return {
          timer: null,
          query: '',
          start: 0,
          movieList: [],
          total: 0,
          scrollInfo: null,
          pulldownMsg: '下拉刷新',
          pullupMsg: '加载更多',
          alertHook: 'none',
          loading: false,
          movieId: []
        }
      },
      watch: {
        query (newValue) {
          if (newValue) {
            if (this.timer) clearTimeout(this.timer)
            this.start = 0
            this.movieList = []
            this.total = 0
            const that = this
            this.$nextTick(() => {
              this.searchInfo()
              this.scroll = new BScroll(this.$refs.scrollInfo, { // 初始化better-scroll
                probeType: 1, // 1 滚动的时候会派发scroll事件，会截流。2滚动的时候实时派发scroll事件，不会截流。 3除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
                click: true // 是否派发click事件
              })
              // 滑动过程中事件
              this.scroll.on('scroll', (pos) => {
                this.loading = false
                if (pos.y > 30) {
                  this.pulldownMsg = '释放立即刷新'
                }
              })
              // 滑动结束松开事件
              this.scroll.on('touchEnd', (pos) => { // 上拉刷新
                if (pos.y > 50) {
                  setTimeout(() => {
                    var url = `/v2/movie/search?q=${newValue}`
                    url += (url.indexOf('?')) < 0 ? '?' : '&' + that.param({start: that.start, count: 10})
                    that.axios.get(url, {apikey: '0b2bdeda43b5688921839c8ecb20399b'}).then((res) => {
                      // 恢复刷新提示文本值
                      that.pulldownMsg = '下拉刷新'
                      // 刷新成功后提示
                      that.refreshalert()
                      // 刷新列表后，重新计算滚动区域高度
                      that.scroll.refresh()
                    })
                  }, 2000)
                } else if (pos.y < (this.scroll.maxScrollY - 50)) { // 下拉加载
                  this.movieId = []
                  that.timer = setTimeout(() => {
                    this.loading = true
                    var url = `/v2/movie/search?q=${newValue}`
                    url += (url.indexOf('?')) < 0 ? '?' : '&' + that.param({start: that.start, count: 10})
                    that.start += 10
                    that.axios.get(url, {apikey: '0b2bdeda43b5688921839c8ecb20399b'}).then((res) => {
                      that.movieList = that.movieList.concat(res.data.subjects)
                      this.total = res.data.total
                      this.movieIdList()
                     that.scroll.refresh()
                      clearInterval(that.timer)
                    }).catch(error => {
                      console.log(error)
                    })
                  }, 500)
                }
              })
            })
          }
        }
      },
      methods: {
        ...mapMutations({
          idName: 'DETID'
        }),
        back () {
          this.query = ''
          this.movieList = []
          this.$router.go(-1)
        },
        searchInfo () {
          var url = `/v2/movie/search?q=${this.query}`
           url += (url.indexOf('?')) < 0 ? '?' : '&' + this.param({start: this.start, count: 10})
          this.axios.get(url, {apikey: '0b2bdeda43b5688921839c8ecb20399b'}).then((res) => {
            this.movieList = res.data.subjects
            this.total = res.data.total
            this.start = this.movieList.length
            this.movieIdList()
            console.log(res.data.subjects)
          }).catch(error => {
            console.log(error)
          })
        },
        param (data) {
          let url = ''
          for (var k in data) {
            let value = data[k] !== undefined ? data[k] : ''
            url += `&${k}=${encodeURIComponent(value)}`
          }
          return url ? url.substring(1) : ''
        },
        refreshalert () { // 刷新成功提示
          this.alertHook = 'block'
          setTimeout(() => {
            this.alertHook = 'none'
          }, 1000)
        },
        movieIdList () { // 电影条目id列表数据
          var idArr = this.movieId
          this.movieList.forEach(item => {
            idArr.push(item.id)
          })
          return this.movieId
        },
        upData (index) { // 请求电影条目信息
          var id = this.movieId[index]
          if (id) {
            this.idName(id)
          }
        }
      }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.searchWrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #00f300;
  z-index: 200;
  .searchBox {
    box-sizing: border-box;
    padding: 20px 5px 5px;
    width: 100%;
    height: 60px;
    .tab {
      display: flex;
      width: 100%;
      height: 100%;
      line-height: 35px;
      .tabInp {
        flex: 0 0 85%;
        display: flex;
        padding: 5px;
        background: #fff;
        border-radius: 10px;
        .icon-search {
          flex: 1;
          display: inline-block;
        }
        .box {
          flex: 0 0 80%;
          display: inline-block;
          font-size: 16px;
          border: 0px;
          outline:none;
          cursor: pointer;
        }
      }
      .cancel {
        flex: 1;
        display: inline-block;
        padding-left: 10px;
        font-size: 14px;
      }
    }
  }
  .container {
    position: relative;
    height: 100%;
    background: #fff;
    .scrollInfo {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      .bscroll-container {
        .top-tip {
          position: absolute;
          top: -40px;
          left: 0;
          z-index: 1;
          width: 100%;
          height:40px;
          line-height:40px;
          text-align:center;
          color: #555;
        }
        .list {
          width: 100%;
          a {
            display: inline-block;
            text-decoration: none;
            text-overflow:ellipsis;
            white-space: nowrap;
            color: rgb(7,17,27);
            .movieList {
              box-sizing: border-box;
              padding: 10px;
              .content {
                display: flex;
                width: 100%;
                .img {
                  flex: 0 0 60px;
                }
                .info {
                  flex: 1;
                  display: flex;
                  flex-direction: column;
                  margin-left: 10px;
                  .title {
                    flex: 1;
                    display: inline-block;
                    font-size: 16px;
                    font-weight: 700;
                  }
                  .basicInfo {
                    flex: 1;
                    display: inline-block;
                    font-size: 12px;
                    color: rgba(7,17,27,0.5);
                  }
                }
              }
            }
          }
          .loadmore {
            text-align: center;
            line-height: 64px;
            color: #999;
            text-align: center;
          }
        }
      }
    }
    .alert-hook {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      width: 100%;
      height: 35px;
      line-height: 35px;
      text-align: center;
      color: #eee;
      font-size: 12px;
      background: rgba(7, 17, 27, 0.5)
    }
  }
}
</style>
