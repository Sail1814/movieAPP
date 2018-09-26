import Vue from 'vue'
import Router from 'vue-router'
// 一级路由
import theatersWrapper from '../components/tabView/theatersWrapper'
import sourceWrapper from '../components/tabView/sourceWrapper'
import mineWrapper from '../components/tabView/mineWrapper'
import movieInfo from '../components/secondView/movieInfo'
import SearchCityView from '../components/widget/SearchCityView'
// 二级路由
import isHit from '../components/secondView/isHit'
import SourceTabView from '../components/widget/SourceTabView'
import searchWrapper from '../components/widget/searchWrapper'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'theatersWrapper',
      component: theatersWrapper,
      props: true,
      redirect: '/isHit',
      children: [
        {path: 'isHit', name: 'isHit', component: isHit, props: true}
      ]
    },
    {
      path: '/source',
      name: 'sourceWrapper',
      component: sourceWrapper,
      props: true,
      redirect: '/source/SourceTabView',
      children: [
        {path: 'SourceTabView', name: 'SourceTabView', component: SourceTabView, props: true}
      ]
    },
    {path: '/mine', name: 'mineWrapper', component: mineWrapper, props: true},
    {path: '/movieInfo', name: 'movieInfo', component: movieInfo, props: true},
    {
      path: '/searchCity',
      name: 'SearchCityView',
      component: SearchCityView,
      props: true
    },
    {path: '/searchWrapper', name: 'searchWrapper', component: searchWrapper, props: true},
    {path: '*', redirect: '/'}
  ]
})
