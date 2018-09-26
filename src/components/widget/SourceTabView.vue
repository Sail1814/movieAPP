<template>
    <div class="header" ref="header">
      <div class="boxScroll">
        <div class="switch">
          <div class="movie">
            <div class="img">
              <img src="../../common/img/icon_homepage_movieCategory.png" width="38px" height="38px"/>
            </div>
            <div class="content">
              <h2>找电影</h2>
              <span>美国/爱情/日本</span>
            </div>
            <div class="go">
              <div class="icon-arrow_right"></div>
            </div>
          </div>
          <div class="movie">
            <div class="img">
              <img src="../../common/img/icon_mine_collection@2x.png" width="38px" height="38px"/>
            </div>
            <div class="content">
              <h2>我的影视</h2>
              <span>0部</span>
            </div>
            <div class="go">
              <span class="icon-arrow_right"></span>
            </div>
          </div>
        </div>
        <div class="hitMovie">
          <div class="left">豆瓣热门</div>
          <div class="right">
            全部99+
            <span> > </span>
          </div>
        </div>
        <div class="boxHit" ref="boxHit" @click="_initMovieSliderBar">
          <ul class="hitMovieList" ref="hitMovieList">
            <li class="ListItem" v-for="(item, index) in movieList" :key="index">
              <router-link to="/movieInfo">
                <div class="item" @click="upIdData(index)">
                  <div class="img">
                    <img :src="item.images.small" width="95px" height="120"/>
                  </div>
                  <h2 class="title">{{item.title}}</h2>
                  <div class="start">
                    <Star :score="item.rating.average"></Star>
                    <span>{{item.rating.average}}</span>
                  </div>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
        <div class="sortWrapper" >
          <div class="sortScroll" >
            <div class="title">
              <h2 class="name">豆瓣电影</h2>
            </div>
            <div class="scroll" ref="scroll">
              <ul>
                <li class="moviesTitle" v-for="(title, index) in moviesTitle" :key="index">
                  <ul class="item">
                    <li class="moviesItem" v-for="(item, count) in title" :key="item.id">
                      <div class="content">
                        <div class="sort">{{count+1}}</div>
                        <div class="images">
                          <img :src="item.images.small" width="30px" height="40px"/>
                        </div>
                      </div>
                      <div class="boxInfo">
                        <div class="info">
                          <span class="title">{{item.title}}</span>
                          <div class="result">
                            <star :score="item.rating.average"></star>
                            <div class="average">{{item.rating.average}}</div>
                            <div class="collect_count">{{item.collect_count}}看过</div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import Star from './Star'
    import BScroll from 'better-scroll'
    import {mapMutations} from 'vuex'
    export default {
      name: 'SourceTabView',
      components: {Star},
      props: {
        movies: Boolean,
        television: Boolean
      },
      data () {
        return {
          // topData: null,
          // box_usData: null,
          movieList: [],
          BoxOfficeList: [],
          // weeklyList: [],
          // new_moviesList: [],
          listScroll: null,
          sortScroll: null,
          boxScroll: null,
          movieId: [],
          lists: ['/v2/movie/top250', '/v2/movie/us_box', '/v2/movie/weekly', '/v2/movie/new_movies'],
          moviesTitle: [],
          moviesItem: [],
          titleName: []
        }
      },
      watch: {
        // movies () {
        //   this.movieHitInfo()
        // },
        television () {
          this.movieId = [] // 清空数据，避免再次请求push数据
        }
      },
      created () {
        this.$nextTick(() => {
          this.movieHitInfo()
          this._initMovieSliderBar()
        })
      },
      methods: {
        ...mapMutations({
          idName: 'DETID'
        }),
        movieHitInfo () {
          var url1 = `/v2/movie/top250` // Top250
          this.axios.get(url1, {apikey: '0b2bdeda43b5688921839c8ecb20399b', start: 0, count: 20}).then(res => {
            this.movieList = this.movieList.concat(res.data.subjects)
            this.moviesTitle.push(this.movieList)
            this.movieIdList()
            this.titleName.push(res.data.titel)
            console.log(res.data.title)
          }).catch(error => {
            console.log(error)
          })
          var url2 = `/v2/movie/us_box` // 北美票房榜
          this.axios.get(url2, {apikey: '0b2bdeda43b5688921839c8ecb20399b'}).then(res => {
            let data = []
            res.data.subjects.forEach(item => {
              data.push(item.subject)
            })
            this.BoxOfficeList = data
            this.moviesTitle.push(this.BoxOfficeList)
            this.titleName.push(res.data.titel)
            console.log(res.data.title)
          }).catch(error => {
            console.log(error)
          })
        },
        _initMovieSliderBar () {
          console.log(this.moviesTitle)
          if (!this.listScroll) {
            this.listScroll = new BScroll(this.$refs.boxHit, {
              scrollX: true,
              click: true
            })
          } else {
            this.listScroll.refresh()
          }
          if (!this.sortScroll) {
            this.sortScroll = new BScroll(this.$refs.scroll, {
              scrollX: true,
              click: true,
              snap: {
                loop: false,
                threshold: 0.3,
                speed: 400
              }
            })
            this.sortScroll.on('scrollEnd', () => {
              let pageIndex = this.sortScroll.getCurrentPage().pageX
              console.log(pageIndex)
            })
          } else {
            this.sortScroll.refresh()
          }
          if (!this.boxScroll) {
            this.boxScroll = new BScroll(this.$refs.header, {
              click: true
            })
          } else {
            this.boxScroll.refresh()
          }
        },
        resetTitel (index) {
          return this.titleName[index]
        },
        movieIdList () { // 电影条目id列表数据
          var idArr = this.movieId
          this.movieList.forEach(item => {
            idArr.push(item.id)
          })
          console.log(this.movieId)
          return this.movieId
        },
        upIdData (index) { // 请求电影条目信息
          var id = this.movieId[index]
          if (id) {
            this.idName(id)
          }
        }
      }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .header {
    position: absolute;
    left: 0;
    top: 97px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .boxScroll {
      display: inline-block;
      .switch {
        display: flex;
        box-sizing: border-box;
        padding: 10px;
        width: 100%;
        height: 60px;
        border-top: 1px solid rgba(7,17,27,0.1);
        border-bottom: 1px solid rgba(7,17,27,0.1);
        .movie {
          flex: 1;
          padding: 0px 5px;
          display: flex;
          .img {
            flex: 0 0 38px;
            vertical-align: middle;
            text-align: center;
            line-height: 38px;
            border-radius: 50%;
          }
          .content {
            flex: 1;
            padding-top: 2px;
            margin-left: 5px;
            h2 {
              font-size: 14px;
              vertical-align: top;
              font-weight: 500;
              margin-bottom: 5px;
            }
            span {
              font-size: 12px;
              color: rgba(7,17,27,0.5);
            }
          }
        }
      }
      .hitMovie {
        box-sizing: border-box;
        display: flex;
        padding: 0 10px 10px;
        width: 100%;
        height: 40px;
        .left {
          flex: 1;
          padding-left: 10px;
          text-align: left;
          line-height: 40px;
          font-size: 18px;
          font-weight: 700;
        }
        .right {
          flex: 1;
          padding-right: 10px;
          text-align: right;
          line-height: 40px;
          font-size: 12px;
        }
      }
      .boxHit {
        display: inline-block;
        box-sizing: border-box;
        width: 100%;
        height: 330px;
        overflow: hidden;
        .hitMovieList {
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          padding-left: 10px;
          width: 260%;
          height: 330px;
          .ListItem {
            flex: 0 0 95px;
            padding: 10px 0 0 10px;
            max-width: 95px;
            height: 155px;
            overflow: hidden;
            a {
              display: inline-block;
              text-decoration: none;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              .item {
                display: inline-block;
                .img {
                  display: inline-block;
                  border-radius: 5px;
                  overflow: hidden;
                }
                .title {
                  padding-top: 5px;
                  font-size: 14px;
                  color: rgb(7,17,27);
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                }
                .start {
                  display: flex;
                  padding-top: 2px;
                  font-size: 12px;
                  span {
                    padding-left: 5px;
                    color: rgba(7,17,27,0.5);
                  }
                }
              }
            }
          }
        }
      }
      .sortWrapper {
        padding-top: 10px;
        width: 100%;
        .sortScroll {
          display: inline-block;
          box-sizing: border-box;
          padding: 10px 0 0 20px;
          width: 100%;
          .title {
            display: inline-block;
            width: 100%;
            height: 40px;
            .name {
              font-size: 18px;
              font-weight: 700;
              line-height: 40px;
              vertical-align: center;
            }
          }
          .scroll {
            width: 100%;
            ul {
              display: inline-block;
              width: 200%;
              .moviesTitle {
                display: inline-block;
                width: 45%;
                height: 240px;
                overflow: hidden;
                .item {
                  display: inline-block;
                  width: 100%;
                  .moviesItem {
                    display: flex;
                    padding-top: 10px;
                    height: 50px;
                    .content {
                      flex: 0 0 50px;
                      display: flex;
                      padding-bottom: 10px;
                      .sort {
                        flex: 0 0 15px;
                        padding-right: 5px;
                        font-size: 14px;
                        vertical-align: top;
                      }
                      .images {
                        flex: 1;
                        img {
                          vertical-align: top;
                        }
                      }
                    }
                    .boxInfo {
                      flex: 1;
                      margin: 0 10px;
                      padding-bottom: 10px;
                      border-bottom: 1px solid rgba(7,17,27,0.1);
                      .info {
                        display: flex;
                        flex-direction: column;
                        .title {
                          display: inline-block;
                          padding-bottom: 10px;
                          height: 15px;
                          font-size: 14px;
                          vertical-align: top;
                        }
                        .result {
                          flex: 1;
                          font-size: 0;
                          display: flex;
                          .average {
                            flex: 0 0 20px;
                            display: inline-block;
                            padding-left: 5px;
                            font-size: 12px;
                            color: rgba(7,17,27,0.5);
                          }
                          .collect_count {
                            flex: 1;
                            display: inline-block;
                            padding-left: 2px;
                            font-size: 12px;
                            color: rgba(7,17,27,0.5);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
