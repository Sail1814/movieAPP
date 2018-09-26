<template>
  <div class="Mine">
    <div class="Naver">
      <div class="Navbar">
        <div class="Null"></div>
        <div class="Right">
          <img src="../../common/img/icon_navigationItem_set_white@2x.png" alt="" width="30px" height="30px">
        </div>
      </div>
      <div class="userInfo">
        <div class="Img">
          <img src="../../common/img/icon_mine_aboutmeituan@2x.png" alt="" width="65px" height="65px">
        </div>
        <div class="message">
          <div class="desc">
            <span class="Name">风帆</span>
            <span class="person"></span>
          </div>
          <div class="solds">
            <button class="moviePrice">我的电影票</button>
          </div>
        </div>
      </div>
    </div>
    <div class="bodyBar">
      <div
        class="swiper-button"
        ref="swiper"
        v-for="(item, index) in arr" :key="index"
        @click="heightActive(index)"
      >
        {{item}}
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'mineWrapper',
      data () {
          return {
            arr: ['讨论', '想看', '在看', '看过', '影评', '影人']
          }
      },
      created() {
          this.$nextTick(() => {
            this.$refs.swiper[0].style.borderBottom = `2px solid rgb(7,17,27)`
            this.$refs.swiper[0].style.color = `rgb(7,17,27)`
          })
      },
      methods: {
          heightActive (data) {
            this.$refs.swiper.forEach((item, index) => {
              if (index == data) {
                this.$refs.swiper[index].style.borderBottom = `2px solid rgb(7,17,27)`
                this.$refs.swiper[index].style.color = `rgb(7,17,27)`
              } else {
                this.$refs.swiper[index].style.borderBottom = `none`
                this.$refs.swiper[index].style.color = `rgba(7,17,27,0.5)`
              }
            })
          }
      }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.Mine {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  .Naver {
    width: 100%;
    height: 25%;
    background: cornflowerblue;
    .Navbar {
      box-sizing: border-box;
      display: flex;
      padding: 10px 20px;
      width: 100%;
      height: 60px;
      line-height: 40px;
      .Null {
        flex: 1;
      }
      .Right {
        flex: 0 0 50px;
        img {
          float: right;
        }
      }
    }
    .userInfo {
      box-sizing: border-box;
      display: flex;
      padding: 0 0 30px 30px;
      .Img {
        flex: 0 0 65px;
        height: 65px;
        border: 3px solid #fff;
        border-radius: 50%;
        background: #fff;
        overflow: hidden;
      }
      .message {
        flex: 1;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding-left: 20px;
        .desc {
          flex: 1;
          padding-bottom: 15px;
          .Name {
            font-size: 24px;
            font-weight: 700;
            color: #fff;
          }
        }
        .solds {
          flex: 1;
          height: 40px;
          .moviePrice {
            display: inline-block;
            padding: 0 5px;
            width: 30vw;
            height: 100%;
            outline:none;
            border: 1px solid #fff;
            border-radius: 4px;
            background: rgba(0,0,0,0);
            color: #fff;
          }
        }
      }
    }
  }
  .bodyBar {
    display: flex;
    height: 200px;
    .swiper-button {
      flex: 1;
      text-align: center;
      height: 35px;
      line-height: 35px;
      font-size: 14px;
      color: rgba(7,17,27,0.5);
    }
  }
}
</style>
