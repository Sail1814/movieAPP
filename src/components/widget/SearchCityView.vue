<template>
  <div class="SearchCityView">
    <div class="oneSearch" v-show="!cityListView">
      <mt-header
        style="background-color: #fff;
        border-bottom: 1px solid rgba(7,17,27,0.1)"
        v-if="!searchView"
      >
        <router-link to="/" slot="left">
          <mt-button
            icon="back"
            style="color: #00c900"
            @click.native="openTab"
          >
          </mt-button>
          <span
            style="display: inline-block;
            padding-left: 20px;
            font-size: 16px;color: rgb(7,17,27)"
          >选择城市
          </span>
        </router-link>
      </mt-header>
      <div
        class="Search"
        style="display: flex;
        height: 48px;
        padding-left: 10px"
      >
        <mt-cell
          icon="search"
          style="font-size: 16px;
          background: #fff;
          flex: 0 0 30px;
          color: rgba(7,17,27,0.5);"
        ></mt-cell>
        <input
          type="text"
          style="flex: 1;
          font-size: 14px;
          border: 0px;
          outline:none;
          cursor: pointer;
          color: rgba(7,17,27,0.5)"
          placeholder="输入城市名称查询"
          @click="SearchShow"
        >
      </div>

      <mt-index-list>
        <div class="HitCity">
          <span>热门城市</span>
          <div class="HitCitySearch">
            <button
              class="city"
              v-for="(city, count) in hitCity"
              :key="count"
              @click="getCity(city)"
            >
              {{city}}
            </button>
          </div>
        </div>
        <div v-for="(letter, index) in citySortArr" :key="index" >
          <mt-cell
            :title="letter"
            style="background-color: rgba(244, 244, 244, 0.9);
            min-height: 30px;color: rgba(7,17,27,0.5);"
          >
          </mt-cell>
          <div
            v-for="(cityName, num) in cityArr"
            :key="num"
            @click="goToCities(cityName.value)"
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

      <Search
        v-show="searchView"
        :searchView="searchView"
        :citySearch="citySearch"
        :citySearchArr="citySearchArr"
        :citySearchSort="citySearchSort"
        :citySearchSortArr="citySearchSortArr"
        @CloseShow="CloseShow"
      >
      </Search>
    </div>

    <div class="CityList" v-show="cityListView">
      <div class="title">
        <mt-button
          icon="back"
          style="flex: 0 0 16px;
          height: 36px;
          color: #00c900;
          background: #fff;
          border: none;"
          @click="back"
        >
        </mt-button>
        <span
          style="flex: 1;
          padding-left: 24px;
          display: inline-block;
          font-size: 16px;
          line-height: 36px;
          color: rgb(7,17,27)"
        >选择城市
        </span>
      </div>
      <mt-index-list>
        <div v-for="(letter, index) in cityListSortArr" :key="index" >
          <mt-cell
            :title="letter"
            style="background-color: rgba(244, 244, 244, 0.9);
            min-height: 30px;color: rgba(7,17,27,0.5);"
          >
          </mt-cell>
          <mt-cell
            v-for="(cityName, num) in cityListArr"
            :key="num"
            v-if="cityName.key == letter"
            :title="cityName.value"
            style="border-top: 1px solid rgba(7,17,27,0.1)"
            @click.native="getCity(cityName.value)"
          >
          </mt-cell>
        </div>
        <div
          style="width: 100%;
          text-align: center;
          font-size: 16px;
          line-height: 32px;
          color: rgba(7,17,27,0.5);
          background: #fff"
        >没有啦...
        </div>
      </mt-index-list>
    </div>
  </div>
</template>

<script>
  import city from "../../common/json/cities" // 导入所有城市的JSON
  import { makePy } from "../../common/js/pinying" // 导入插件获取所有城市中文的大写首字母
  import dataCity from '../../common/city/citys'
  import Search from "./Search";
  import {mapMutations} from 'vuex'
  export default {
    name: 'SearchCityView',
    components: {Search},
    data () {
      return {
        openShow: false,
        arr: [], // 存放初始筛选的城市名称
        cityArr: [], // 存放第二次筛选后所有城市名称
        citySort: [], // 存放初始获取城市首字母大写的数组
        citySortArr: [], // 存放第二次筛选重复，不存在的城市首字母数组
        hitCity: [],
        searchView: false,
        cityNa: null,
        cityListView: false,
        arrList: [],
        cityListArr: [],
        cityListSort: [],
        cityListSortArr: [],
        citySearch: [],
        citySearchArr: [],
        citySearchSort: [],
        citySearchSortArr: []
      };
    },
    created () {
      this.$nextTick(() => {
        this.openView(this.openShow)
        this.getHitCity()
      })

      /**
       * 将json数据中的无用数据剔除
       */
      for (let i in city) {
        if (city[i].name != "请选择") { // 将第一层数据中为 “请选择” 的剔除掉
          this.arr.push(city[i].name);
          for (let j in city[i].sub) { // 将第二层数据中为 “请选择 和 其他” 的剔除掉
            if (
              city[i].sub[j].name != "请选择" &&
              city[i].sub[j].name != "其他"
            ) {
              this.citySearch.push(city[i].sub[j].name); // 将处理后的数据存放在数组中，等待第二次筛选处理
            }
          }
        }
      }

      this.citySearch.concat(this.arr)

      /**
       * 配置相关数据
       */
      for (let k in this.arr) {
        let cityKey = makePy(this.arr[k])[0].substring(0, 1); // 获取每一个市区的首字母
        let cityValue = this.arr[k]; // 获取所有市区
        this.citySort[cityKey] = cityKey; // 利用对象特性，剔除重复的字母，并将剔除后的字母存进对象中

        // 将所有市区信息 以（ 字母 - 市区名 ）的格式存在至数组中
        this.cityArr[k] = {
          key: cityKey,
          value: cityValue
        };
      }
      /**
       * 将处理后的首字母数据对象，存放至数组中
       */
      for (let p in this.citySort) {
        this.citySortArr.push(this.citySort[p]);
      }

      /**
       * 将真实存在的市区首字母按A-Z进行排序
       */
      this.citySortArr = this.citySortArr.sort();



      /**
       * 搜索城市数据
       * 配置相关数据
       */
      for (let k in this.citySearch) {
        let cityKey = makePy(this.citySearch[k])[0].substring(0, 1); // 获取每一个市区的首字母
        let cityValue = this.citySearch[k]; // 获取所有市区
        this.citySearchSort[cityKey] = cityKey; // 利用对象特性，剔除重复的字母，并将剔除后的字母存进对象中

        // 将所有市区信息 以（ 字母 - 市区名 ）的格式存在至数组中
        this.citySearchArr[k] = {
          key: cityKey,
          value: cityValue
        };
      }
      /**
       * 将处理后的首字母数据对象，存放至数组中
       */
      for (let p in this.citySearchSort) {
        this.citySearchSortArr.push(this.citySearchSort[p]);
      }

      /**
       * 将真实存在的市区首字母按A-Z进行排序
       */
      this.citySearchSortArr = this.citySearchSortArr.sort();
    },
    methods: {
      ...mapMutations({
        cityName: 'GETCITY',
        openView: 'GETTAB'
    }),
      getHitCity () {
        dataCity.hotCity.forEach(value => {
          this.hitCity.push(value)
        })
      },
      SearchShow () {
        this.searchView = true
      },
      CloseShow () {
        this.searchView = false
      },
      goToCities (data) {
        this.cityNa = null
        this.cityNa = data
        let newValue =  this.cityNa
        this.$nextTick(() => {
          this.openView(this.openShow)
          for (let i in city) {
            if (city[i].name == newValue) { // 将第一层数据中为 “请选择” 的剔除掉
              for (let j in city[i].sub) { // 将第二层数据中为 “请选择 和 其他” 的剔除掉
                if (
                  city[i].sub[j].name != "请选择" &&
                  city[i].sub[j].name != "其他"
                ) {
                  this.arrList.push(city[i].sub[j].name); // 将处理后的数据存放在数组中，等待第二次筛选处理
                }
              }
            }
          }
          if (this.arrList && this.arrList.length > 0) {
            for (let k in this.arrList) {
              let cityKey = makePy(this.arrList[k])[0].substring(0, 1); // 获取每一个市区的首字母
              let cityValue = this.arrList[k]; // 获取所有市区
              this.cityListSort[cityKey] = cityKey; // 利用对象特性，剔除重复的字母，并将剔除后的字母存进对象中

              // 将所有市区信息 以（ 字母 - 市区名 ）的格式存在至数组中
              this.cityListArr[k] = {
                key: cityKey,
                value: cityValue
              };
            }

            /**
             * 将处理后的首字母数据对象，存放至数组中
             */
            for (let p in this.cityListSort) {
              this.cityListSortArr.push(this.cityListSort[p]);
            }

            /**
             * 将真实存在的市区首字母按A-Z进行排序
             */
            this.cityListSortArr = this.cityListSortArr.sort();
          }
          this.cityListView = true
        })
      },
      back () {
        this.arrList = []
        this.cityListArr = []
        this.cityListSort = []
        this.cityListSortArr = []
        this.cityListView = false
      },
      getCity (data) {
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
  .SearchCityView {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100%;
    .oneSearch {
      .HitCity {
        width: 100%;
        background: rgba(244, 244, 244, 0.9);
        span {
          display: inline-block;
          padding-left: 10px;
          font-size: 14px;
          line-height: 32px;
          vertical-align: middle;
          color: rgba(7,17,27,0.5)
        }
        .HitCitySearch {
          display: flex;
          box-sizing: border-box;
          padding: 0 5px;
          width: 100%;
          flex-wrap: wrap;
          justify-content: space-around;
          .city {
            flex: 0 0 30%;
            display: inline-block;
            margin-top: 10px;
            height: 48px;
            line-height: 48px;
            border: none;
            outline:none;
            font-size: 16px;
            background: #fff;
            color: #333;
          }
        }
      }
    }
    .CityList {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      .title {
        position: relative;
        top: 0;
        left: 0;
        box-sizing: border-box;
        display: flex;
        padding: 0 10px;
        font-size: 14px;
        height: 39px;
        border-bottom: 1px solid rgba(7,17,27,0.1);
        .mint-button--default {
          -webkit-box-shadow: none;
          box-shadow: none;
        }
        .mint-button--normal {
          padding: 0;
        }
      }
    }
  }
</style>
