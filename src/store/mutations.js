import * as types from './mutation-types'

const Mutations = {
  [types.GETID] (state, id) {
    state.id = id
  },
  [types.GETCITY] (state, cityValue) {
    state.cityValue = cityValue
  },
  [types.GETTAB] (state, data) {
    state.tabBarView = data
  }
}
export default Mutations
