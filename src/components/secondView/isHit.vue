<template>
  <div class="listWrapper">
    <div class="listScroll" ref="listScroll">
      <div class="listInner">
        <div class="movieList">
          <ul>
            <router-link to="/movieInfo">
              <li v-for="(item, index) in movieList" :key="index" @click="upData(index)">
                <div class="item">
                    <div class="infoImg">
                      <img v-lazy="item.images.small" width="80" height="120" :key="item.images.small"/>
                    </div>
                  <div class="infoDesc">
                    <p class="title">{{item.title}}</p>
                    <div class="start">
                      <star :score="scoreRating(index)"></star>
                      <span>{{scoreRating(index)}}</span>
                    </div>
                    <div class="director">导演：{{nameDir(index)}}</div>
                    <div class="casts">主演：{{nameCas(index)}}</div>
                  </div>
                </div>
              </li>
            </router-link>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Star from '../widget/Star'
  import BScroll from 'better-scroll'
  import {mapMutations} from 'vuex'
    export default {
      name: 'isHit',
      components: {Star},
      props: {
        movieList: Array,
        showNow: Boolean,
        showUpComing: Boolean,
        movieId: Array
      },
      data () {
        return {
          dirName: [],
          casName: [],
          scores: [],
          movieListScroll: null
        }
      },
      watch: {
        movieList () {
          this.$nextTick(() => {
            this._initScroll()
          })
        }
      },
      created () {
        this.upData()
      },
      computed: {
        directorsName () {
          var Name = this.dirName
          this.movieList.forEach(item => {
            Name.push(item.directors[0].name)
          })
          return Name
        },
        castsNames () {
          var Names = this.casName
          this.movieList.forEach((item, count) => {
            Names.push(item.casts)
          })
          return Names
        },
        ratingScore () {
          var scores = this.scores
          this.movieList.forEach(item => {
            scores.push(item.rating.average)
          })
          return scores
        }
      },
      methods: {
        ...mapMutations({
          idName: 'DETID'
        }),
        nameDir (index) {
          var Name = this.directorsName
          return Name[index]
        },
        nameCas (index) {
          var Names = this.castsNames
          var strName = []
          Names[index].forEach(nameValue => {
            strName.push(nameValue.name)
          })
          return strName.join('/')
        },
        scoreRating (index) {
          return this.ratingScore[index]
        },
        _initScroll () {
          if (!this.movieListScroll) {
            this.movieListScroll = new BScroll(this.$refs.listScroll, {
              click: true
            })
          } else {
            this.movieListScroll.refresh()
          }
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
  .listWrapper {
    position: fixed;
    top: 97px;
    bottom: 47px;
    width: 100%;
    .listScroll {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      .listInner {
        width: 100%;
        .movieList {
          width: 100%;
          ul {
            li{
              box-sizing: border-box;
              padding: 0 15px;
              width: 100%;
              border-top: 1px solid rgba(7,17,27,0.1);
              .item {
                display: flex;
                box-sizing: border-box;
                padding: 15px 0;
                .infoImg {
                  flex: 0 0 80px;
                  margin-right: 10px;
                }
                .infoDesc {
                  flex: 1;
                  display: flex;
                  flex-flow: column;
                  height: 120px;
                  font-size: 0;
                  text-align: left;
                  overflow: hidden;
                  .title {
                    display: inline-block;
                    margin: 2px 0;
                    font-size: 16px;
                    font-weight: 700;
                    color: #333;
                  }
                  .start {
                    display: flex;
                    margin: 2px 0;
                    font-size: 12px;
                    span {
                      flex: 1;
                      margin-left: 5px;
                      color: rgba(7,17,27,0.5);
                    }
                  }
                  .director {
                    margin: 2px 0;
                    font-size: 12px;
                    word-wrap: break-word;
                    color: rgba(7,17,27,0.5);
                  }
                  .casts {
                    margin: 2px 0;
                    font-size: 12px;
                    word-wrap: break-word;
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
</style>
