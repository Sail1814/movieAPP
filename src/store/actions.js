import * as types from './mutation-types'

export const addId = function ({commit}, {id}) {
    commit(types.GETID, id)
}

export const addCity = function ({commit}, {cityValue}) {
  commit(types.GETCITY, cityValue)
}

export const changeView = function ({commit}, {data}) {
  commit(types.GETTAB, data)
}
