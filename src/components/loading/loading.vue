<template>
  <div class="loading">
    <img width="24" height="24" src="./loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
export default {
	props: {title: {type: String, default: '正在加载中...'}
  }
}
</script>

<style scoped>
  .loading{ width: 100%; height:120px; text-align:center; position:absolute; top:50%; transform: translateY(-50%);}
  .loading p {line-height:48px;  font-size:28px; color:#999;}
</style>
