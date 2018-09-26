<template>
  <div class="detailWrapper">
    <div class="fixedTitle">
      <span class="back" @click="back">
        <i class="icon-arrow_left"></i>
      </span>
      <span class="type">电影</span>
    </div>
    <div class="movieDetail" ref="movieDetail">
      <div class="scrollWrapper">
        <div class="scrollContent">
          <div class="bgImage">
            <img :src="movieInfoImgs" width="207px" height="290px"/>
          </div>
          <div class="movieInfo">
            <div class="overall">
              <div class="desc">
                <h2 class="title">{{movieInfoTitle}}</h2>
                <span class="tag">{{movieInfoYear}}/{{movieInfoGenres[0]}}/{{movieInfoGenres[1]}}</span>
                <span class="pubdate">上映时间：{{movieInfoYear}}({{movieInfoCountries[0]}})</span>
              </div>
              <div class="rank">
                <span class="origin">豆瓣评分</span>
                <span class="rating">{{movieInfoRatingAverage}}</span>
                <div class="start">
                  <star :score="movieInfoRatingAverage"></star>
                </div>
                <span class="num">{{movieInfoRatings_count}}</span>
              </div>
            </div>
            <div class="operate">
              <div class="wantWatch">想看</div>
              <div class="hasWatched">
                <span>看过</span>
                <div class="starWant">
                  <star></star>
                </div>
              </div>
            </div>
            <div class="summary">
              <h2 class="title">简介</h2>
              <p class="content">&nbsp;&nbsp;&nbsp;&nbsp;{{movieInfoSummary}}</p>
            </div>
            <div class="casts">
              <div class="castsContent">
                <h2 class="title">影人</h2>
                <div class="castsItem" v-for="(item,index) in movieInfoCasts" :key="index">
                  <img :src="item.avatars.medium" width="90px" height="120px"/>
                  <h3 class="itemTitle">{{item.name}}</h3>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
          <div class="switch">
            <ul class="swiches">
              <li class="switchItem">
                <span>短评</span>
              </li>
              <li class="switchItem">
                <span>讨论区</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import star from '../widget/Star'
  import BScroll from 'better-scroll'
    export default {
      name: 'movieInfo',
      components: {star},
      data () {
        return {
          movieInfoImgs: null,
          movieInfoTitle: null,
          movieInfoYear: null,
          movieInfoGenres: [],
          movieInfoCountries: [],
          movieInfoRatingAverage: null,
          movieInfoRatings_count: null,
          movieInfoReviews_count: null,
          movieInfoCollect_count: null,
          movieInfoComments_count: null,
          movieInfoSummary: null,
          movieInfoCasts: [],
          detailWrapperScroll: null
        }
      },
      created () {
        this.getIdNum()
        this.$nextTick(() => {
          this._initScroll()
        })
      },
      computed: {
        ...mapGetters({
          id: 'getId'
        })
      },
      methods: {
        getIdNum () { // 请求电影条目信息
          var id = this.id
          if (id.length > 4) {
            var url = `/v2/movie/subject/${id}`
            this.axios.get(url).then(res => {
              this.movieInfoImgs = this.getImages(res.data.images.medium) // 缓存图片
              this.movieInfoTitle = res.data.title
              this.movieInfoYear = res.data.year
              this.movieInfoGenres = res.data.genres
              this.movieInfoCountries = res.data.countries
              this.movieInfoRatingAverage = res.data.rating.average
              this.movieInfoRatings_count = res.data.ratings_count
              this.movieInfoReviews_count = res.data.reviews_count
              this.movieInfoCollect_count = res.data.collect_count
              this.movieInfoComments_count = res.data.comments_count
              this.movieInfoSummary = res.data.summary
              this.movieInfoCasts = res.data.casts
              // console.log(res.data)
            }).catch(error => {
              console.log(error)
            })
          }
        },
        _initScroll () {
          if (!this.detailWrapperScroll) {
            this.detailWrapperScroll = new BScroll(this.$refs.movieDetail, {
              click: true
            })
          } else {
            this.detailWrapperScroll.refresh()
          }
        },
        back () {
          this.$router.go(-1)
        },
        // 网络接口都是有请求限制的，特别是图片字段值是绝对路径的情况，请求的时候就会报错403 forbidden，这个时候应该使用缓存的方式拿到请求图片的地址进行缓存，只要在请求到的图片链接前面加上‘https://images.weserv.nl/?url=’即可（这是一个专门缓存图片的网址）
        getImages (_url) {
          if (_url !== undefined) {
            let _u = _url.substring(7)
            return 'https://images.weserv.nl/?url=' + _u
          }
        }
      }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.detailWrapper {
  position: relative;
  z-index: 10;
  .fixedTitle {
    position: fixed;
    top: 0;
    width: 100%;
    height: 40px;
    text-align: center;
    z-index: 100;
    background: #59a76e;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;
      .icon-arrow_left {
        display: block;
        padding: 10px;
        font-size: 18px;
        color: #fff;
      }
    }
    .type {
      position: absolute;
      top: 0;
      left: 42%;
      display: block;
      padding: 10px;
      font-size: 18px;
      color: #fff;
    }
  }
  .movieDetail {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #59a76e;
    z-index: 60;
    .scrollWrapper {
      .scrollContent {
        .bgImage {
          text-align: center;
          padding: 50px 0 20px;
          background: #59a76e;
        }
        .movieInfo {
          background: #fff;
          padding: 0 20px;
          .overall {
            display: flex;
            height: 140px;
            .desc {
              flex: 0 0 70%;
              overflow: hidden;
              display: flex;
              flex-flow: column;
              .title {
                padding: 10px 0;
                font-size: 18px;
                font-weight: 700;
              }
              .tag {
                padding: 5px 0 0;
                font-size: 12px;
              }
              .pubdate {
                padding: 5px 0 0;
                font-size: 12px;
              }
            }
            .rank {
              margin-top: 15px;
              padding: 10px 15px;
              display: flex;
              flex-flow: column;
              height: 70px;
              box-shadow: 0 0 5px #ccc;
              background: #f8f8f8;
              text-align: center;
              .origin {
                margin: 0 0 2px;
                font-size: 12px;
                color: rgba(7,17,27,0.5);
              }
              .rating {
                margin: 2px 0;
                font-size: 18px;
              }
              .start {
                margin: 2px 0;
                font-size: 0;
              }
              .num {
                margin: 2px 0;
                font-size: 12px;
                color: rgba(7,17,27,0.7);
              }
            }
            }
          .operate {
            margin-top: 20px;
            display: flex;
            height: 35px;
            line-height: 35px;
            text-align: center;
            font-size: 14px;
            color: #42bd56;
            .wantWatch {
              flex: 1;
              margin-right: 5px;
              border: 1px solid #42bd56;
              border-radius: 5px;
            }
            .hasWatched {
              flex: 2;
              border: 1px solid #42bd56;
              border-radius: 5px;
              span {
                display: inline-block;
              }
              .starWant {
                display: inline-block;
              }
            }
          }
          .summary {
            position: relative;
            margin-top: 20px;
            padding-top: 20px;
            .title {
              font-size: 12px;
              color: rgba(7,17,27,0.5);
            }
            .content {
              padding-top: 10px;
              font-size: 14px;
              line-height: 25px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              overflow: hidden;
            }
          }
          .casts {
            padding: 30px 0;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            font-size: 0;
            position: relative;
            .castsContent {
              width: 482px;
              .title {
                padding-bottom: 20px;
                font-size: 12px;
              }
              .castsItem {
                width: 90px;
                vertical-align: top;
                display: inline-block;
                text-align: center;
                margin-right: 8px;
                font-size: 12px;
                .itemTitle {
                  padding: 8px 0 5px;
                  white-space: nowrap;
                }
                span {
                  color: rgba(7,17,27,0.5);
                }
              }
            }
          }
        }
        .switch {
          background: #fff;
          .swiches {
            position: relative;
            box-sizing: border-box;
            padding: 20px 20px 0;
            display: flex;
            width: 100%;
            z-index: 100;
            .switchItem {
              flex: 1;
              padding: 15px;
              text-align: center;
              font-size: 16px;
            }
          }
        }
      }
    }
  }
}
</style>
