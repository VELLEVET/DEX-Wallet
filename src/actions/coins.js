import {fetcher, mapCreate} from '../files/functions'
import {objMap} from "../files/objMap";
import {Quote} from "../reducers/coins";

export const CHANGE_TAB ='CHANGE_TAB'
export type ChangeTab = {type : typeof CHANGE_TAB, payload:number}
export const changeTab = (index) :ChangeTab=> ({type:CHANGE_TAB, payload:index});


export const GET_COINS_REQUEST = 'GET_COINS_REQUEST'
export const GET_COINS_RESPONSE = 'GET_COINS_RESPONSE'
export const GET_COINS_ERROR = 'GET_COINS_ERROR'

export const coinsRequest =()=> ({type:GET_COINS_REQUEST})
export type CoinsResponse = {type: typeof GET_COINS_RESPONSE, payload:Array<{
        +key: string,
        +title: string,
        +quotes: Array<Quote>,
    }>}
export const coinsResponse =(response):CoinsResponse=> ({type:GET_COINS_RESPONSE, payload:response})
export const coinsError = (error) =>({type:GET_COINS_ERROR, payload: error})

export const REFRESH_COINS_REQUEST = 'REFRESH_COINS_REQUEST'
export const REFRESH_COINS_RESPONSE = 'REFRESH_COINS_RESPONSE'
export const REFRESH_COINS_ERROR = 'REFRESH_COINS_ERROR'

export const refreshCoinsRequest = ()=>({type:REFRESH_COINS_REQUEST})
export const refreshCoinsResponse = (response):CoinsResponse=>({type:REFRESH_COINS_RESPONSE, payload:response} )

export const loadCoins = ()=>(dispatch, getState) =>{
    dispatch(coinsRequest())
    mapCreate().then(result=>dispatch(coinsResponse(result.routes)))

}
//TODO: fix load all coins
 export const refresh=()=> (dispatch, getState)=>{
     dispatch(refreshCoinsRequest())
     mapCreate().then(result=>dispatch(refreshCoinsResponse(result.routes)))

 }
export const getTicker =(key1, key2)=>(dispatch, getState)=>{
    fetcher(1, "get_ticker", [key1, key2]).then(item => {
        this.setState({
            percent: item.result.percent_change,
            price: Number(item.result.latest).toFixed(
                objMap[key1.substr(4)].precision
            ),
            rotate: false
        });
    });
}

export type Actions = ChangeTab|CoinsResponse