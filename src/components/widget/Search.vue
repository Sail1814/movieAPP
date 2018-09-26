<template>
  <div class="SearchCity">
    <div
      class="City"
      style="display: flex;
      height: 48px;
      padding-left: 10px;
      background: #fff"
    >
      <mt-cell
        icon="search"
        style="font-size: 16px;
        background: #fff;flex: 0 0 30px;
        color: rgba(7,17,27,0.5);"></mt-cell>
      <input
        type="text"
        v-model="Value"
        style="flex: 1;
        font-size: 14px;
        border: 0px;
        outline:none;
        cursor: pointer;
        color: rgb(7,17,27)"
        placeholder="输入城市名称查询"
      >
      <span
        @click="CloseView"
        style="flex: 0 0 50px;display: inline-block;line-height: 48px;font-size: 14px"
      >
        取消
      </span>
    </div>
    <div
      class="backGround"
      @click="CloseView"
      style="position: relative;
      width: 100%;
      height: 100%;
      background: rgba(7,17,27,0.4)"
      :class="{active: true}"
    >
      <div class="contton" v-show="showCities">
        <div class="nullCity" v-if="nullCity">这里是空哒~</div>
        <mt-index-list>
          <div v-for="(letter, index) in letterCity" :key="index" >
            <mt-cell
              :title="letter"
              style="background-color: rgba(244, 244, 244, 0.9);
            min-height: 30px;color: rgba(7,17,27,0.5);"
            >
            </mt-cell>
            <div
              v-for="(cityName, num) in arr"
              :key="num"
              @click="goCities(cityName.value)"
            >
              <mt-cell
                v-if="cityName.key == letter"
                :title="cityName.value "
                style="border-top: 1px solid rgba(7,17,27,0.1)"
                @click.native="openTab"
              >
              </mt-cell>
            </div>
          </div>
        </mt-index-list>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex'
  import { makePy } from '../../common/js/pinying' // 导入插件获取所有城市中文的大写首字母
    export default {
        name: 'Search',
      props: {
          searchView: Boolean,
        citySearch: Array,
        citySearchArr: Array,
        citySearchSort: Array,
        citySearchSortArr: Array
      },
      data () {
          return {
            Close: this.searchView,
            city: this.citySearch,
            cityArr: this.citySearchArr,
            citySort: this.citySearchSort,
            citySortArr: this.citySearchSortArr,
            Value: '',
            showCities: false,
            arr: [],
            letterCity: [],
            nullCity: false
          }
      },
      watch: {
        Value (newValue) {
          this.openView(false)
          var list = []
          this.arr = []
          this.letterCity = []
          if (newValue != '') {
            this.showCities = true
            this.nullCity = false
            for(var j in this.citySortArr) {
              for(var k in this.cityArr) {
                var PY = makePy(newValue)[0].substring(0, 1)
                var PYs = PY.toLowerCase()
                var Letter = makePy(this.cityArr[k].value)[0].substring(0, 1).toLowerCase()
                if (this.cityArr[k].value.indexOf(newValue[0]) == 0 && this.citySortArr[j] == PY) {
                  this.arr.push(this.cityArr[k])
                  list = this.citySortArr[j]
                }
                if (this.cityArr[k].value == newValue) {
                  this.arr = []
                  this.arr.push(this.cityArr[k])
                }
              }
            }
            if (list.length > 0) {
              for (var m = 0;m < list.length;m++) {
                if (list.indexOf(list[m]) >= 0) {
                  this.letterCity.push(list[m])
                }
              }
            }
          } else {
            this.showCities = false
            this.nullCity = true
          }
        }
      },
      methods: {
        ...mapMutations({
          cityName: 'GETCITY',
          openView: 'GETTAB'
        }),
          CloseView () {
            this.Close = false
            this.$emit('CloseShow', this.Close)
          },
        goCities(data) {
          this.openView(true)
          this.cityName(data)
          this.$router.push('/')
        },
        openTab () {
          this.openView(true)
        }
      }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.SearchCity {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  &.active {
    background: #fff;
  }
  .backGround {
    .contton {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      background: #fff;
      .nullCity {
        margin-top: 20px;
        width: 100%;
        height: 50px;
        font-size: 16px;
        text-align: center;
        color: rgba(7,17,27,0.5);
      }
    }
  }
}

</style>
