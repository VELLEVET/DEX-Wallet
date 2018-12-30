// @flow
import * as types from '../actions/coins'
import {Actions} from '../actions/coins'

export type Quote = {
    +base_volume: string,
    +favorite: boolean,
    +key: string,
    +latest: number,
    +percent_change: string,
    +time: string,
    +title: string
}



//TODO: normolize  coin by key, keys of Quotes by coin, Quote by key
export type   State = $Exact<{
    +loading: boolean,
    +refreshing : boolean,
    +index:number,
    //tabs
    +routes:Array<{
        +key: string,
        +title: string}>,
    +coins: Array<{
        +key: string,
        +title: string,
        +quotes: Array<Quote>,
    }>,
    +coinsByKey:{
        +[key:string]:Array<Quote>
    },
    +starQuoteKeys:{
        +[key:string]:{
            +[key:string]:boolean
        }
    }
}>
export const init:State ={
    loading: true,
    refreshing: false,
    index:0,
    routes: [
        { key: '0', title: 'BTS' },
        { key: '103', title: 'BTC' },
        { key: '113', title: 'CNY' },
        { key: '119', title: 'JPY' },
        { key: '120', title: 'EUR' },
        { key: '121', title: 'USD' },
        { key: '1325', title: 'RUBLE' },
    ],
    coins:[],
    coinsByKey:{},
    starQuoteKeys:{}

}

// FIXME: this is temporary solution
// type Action = {type:string, payload?:Actions}

export default (state:State = init, action:Actions):State => {
    switch (action.type){
        case types.GET_COINS_RESPONSE:
            return {...state,   coins: action.payload,
                // normalize response
                //TODO: rewrite functions.js
                coinsByKey: action.payload?action.payload.reduce((obj, item) => {
                    obj[item.key] = item.quotes
                    return obj
                }, {}):{}, loading: false, refreshing: false}
        case types.CHANGE_TAB:
            return {...state, index:action.payload}
        case types.GET_COINS_REQUEST:
            return {...state, refreshing:true}
        case types.REFRESH_COINS_RESPONSE:
            return {...state,   coins: action.payload,
                // normalize response
                //TODO: rewrite functions.js
                coinsByKey: action.payload?action.payload.reduce((obj, item) => {
                    obj[item.key] = item.quotes
                    return obj
                }, {}):{}, loading: false, refreshing: false}
        case types.STAR_COIN:
            return {...state,
                starQuoteKeys:{
                    ...state.starQuoteKeys,
                    [action.payload.coin]:{...state.starQuoteKeys[action.payload.coin], [action.payload.key]:true}
                }
            }
        case types.UNSTAR_COIN:
            return {...state,
                starQuoteKeys:{
                    ...state.starQuoteKeys,
                    [action.payload.coin]:{...state.starQuoteKeys[action.payload.coin], [action.payload.key]:false}
                }
            }
        case types.LOAD_STARS:
            return {...state, starQuoteKeys:action.payload}
        default:
            return state;
    }

}