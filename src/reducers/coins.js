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
    coinsByKey:{}

}

// FIXME: this is temporary solution
type Action = {type:string, payload?:Actions}

export default (state:State = init, action:Action):State => {
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
        default:
            return state;
    }

}