import React, {Component} from "react";
import {FlatList, RefreshControl, StyleSheet, Text, View, SafeAreaView, Dimensions, ScrollView, StatusBar} from "react-native";
import {TabBar, SceneMap } from "react-native-tab-view";
import "moment/locale/ru"
const { width } = Dimensions.get('window')
import {connect} from "react-redux";
var msg;
var data;
var e = [];

class Comission extends Component<Props, State> {
    state = {
        btsQty: null,
        lastBlock: null,
        commitetMemebers: null,
        activeWitnesses: null,
        transactions: null,
        stelsQty: null,
        transfer: null,
        transferPerKb: null,
        allowTransfer: null,
        allowTransferUpdate: null,
        reclamationTransfer: null,
        reclamationTransferPerKb: null,
        withdrawDelete: null,
        vestingBalance: null,
        withdrawVestingbalance: null,
        toBlindAccount: null,
        fromBlindAccount: null,
        assetCreateThree: null,
        assetCreateFour: null,
        assetCreateLong: null,
        assetCreatePerKb: null,
        assetUpdate: null,
        assetUpdatePerKb: null,
        updateSmartCoin: null,
        updateAssetOwner: null,
        publishAsset: null,
        publishAssetPerKb: null,
        burnAsset: null,
        refillAssetComission: null,
        removeAsset: null,
        globalRemoveAsset: null,
        publishQuotes: null,
        cancelTransfer: null,
        cancelTransferPerKb: null,
        assetPenalty: null,
        orderCreate: null,
        cancelOrder: null,
        updatePledge: null,
        provideSoftware: null, //dfdfd
        createAccount:null,
        createAccountPro: null,
        createAccountPerKb: null,
        updateAccount: null,
        updateAccountPerKb: null,
        addToWhiteList: null,
        upgradeaccount: null,
        upgradeAccountYear: null,
        accountSend: null,
        createCaller: null,
        updateCaller: null,
        createOffer: null,
        createOfferPerKb: null,
        updateOffer: null,
        updateOfferPerKb: null,
        deleteOffer: null,
        createMember: null,
        updateMember: null,
        updateGlobalParametres: null,
        createWorker: null,
        special: null,
        specialPerKb: null,
        acceptOperation: null
    }
    static navigationOptions = {
        header: null,
    }
    componentDidMount(){
       
  
const login_query = {
    id: -1,
    method: "call",
    params: [1,"login",["",""]]    
}

const db_connect_query = {
    id: 0,
    method: "call",
    params: [1,"database",[]]    
}
const data = {
    id:1,
    method: "call",
    params: [2,"get_block", ["27039840"]]
}      

const dynamic_global_props_query = {
    id: 10,
    method: "call",
    params: [2,"get_dynamic_global_properties",[]]    
}

const bts_object_query = {
    id: 11,
    method: "call",
    params: [2,"get_objects",[["2.3.0"]]]    
}

const global_props_query = {
    id: 12,
    method: "call",
    params: [2,"get_global_properties",[]]    
}
        
var ws = new WebSocket('wss://bitshares.openledger.info/ws');

ws.onopen = () => {
    ws.send(JSON.stringify(login_query));
};
ws.onmessage = (e) => {
    msg = JSON.parse(e.data);
    if (msg.id == -1) {
      ws.send(JSON.stringify(db_connect_query)); 
      ws.send(JSON.stringify(dynamic_global_props_query)); 
      ws.send(JSON.stringify(bts_object_query)); 
      ws.send(JSON.stringify(global_props_query)); 
      ws.send(JSON.stringify(data)); 

    }
    console.log('_________', msg.result.transactions)
    if(msg.id == 1){
        this.setState({
            transactions: msg.result.transactions.length
        })
    }
    if (msg.id == 10) {
      this.setState({
        lastBlock: msg.result.head_block_number
    })
    }
    if (msg.id == 11) {
        this.setState({
            btsQty: msg.result[0].current_supply,
            stelsQty: msg.result[0].confidential_supply
        })
    }
    
    if (msg.id == 12) {
        this.setState({
            commitetMemebers: msg.result.active_committee_members.length,
            activeWitnesses: msg.result.active_witnesses.length,
            transfer: ((msg.result.parameters.current_fees.parameters[0][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[0][1].fee * 0.2 / 100000).toFixed(5)),
            transferPerKb: ((msg.result.parameters.current_fees.parameters[0][1].price_per_kbyte / 100000) + " / " + (msg.result.parameters.current_fees.parameters[0][1].price_per_kbyte * 0.2 / 100000).toFixed(5)),
            allowTransfer: ((msg.result.parameters.current_fees.parameters[25][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[25][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            allowTransferUpdate: ((msg.result.parameters.current_fees.parameters[26][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[26][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            reclamationTransfer: ((msg.result.parameters.current_fees.parameters[26][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[26][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            reclamationTransferPerKb: ((msg.result.parameters.current_fees.parameters[27][1].price_per_kbyte / 100000) + " / " + (msg.result.parameters.current_fees.parameters[27][1].price_per_kbyte * 0.2 / 100000).toFixed(5) + " BTS"),
            withdrawDelete: ((msg.result.parameters.current_fees.parameters[28][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[28][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            vestingBalance: ((msg.result.parameters.current_fees.parameters[32][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[32][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            withdrawVestingbalance: ((msg.result.parameters.current_fees.parameters[33][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[33][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            toBlindAccount: ((msg.result.parameters.current_fees.parameters[39][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[39][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            fromBlindAccount: ((msg.result.parameters.current_fees.parameters[39][1].price_per_output / 100000) + " / " + (msg.result.parameters.current_fees.parameters[39][1].price_per_output * 0.2 / 100000).toFixed(5) + " BTS"),
            assetCreateThree: ((msg.result.parameters.current_fees.parameters[10][1].symbol3 / 100000) + " / " + (msg.result.parameters.current_fees.parameters[10][1].symbol3 * 0.2 / 100000).toFixed(5) + " BTS"),
            assetCreateFour: ((msg.result.parameters.current_fees.parameters[10][1].symbol4 / 100000) + " / " + (msg.result.parameters.current_fees.parameters[10][1].symbol4 * 0.2 / 100000).toFixed(5) + " BTS"),
            assetCreateLong: ((msg.result.parameters.current_fees.parameters[10][1].long_symbol / 100000) + " / " + (msg.result.parameters.current_fees.parameters[10][1].long_symbol * 0.2 / 100000).toFixed(5) + " BTS"),
            assetCreatePerKb: ((msg.result.parameters.current_fees.parameters[10][1].price_per_kbyte / 100000) + " / " + (msg.result.parameters.current_fees.parameters[10][1].price_per_kbyte * 0.2 / 100000).toFixed(5) + " BTS"),
            assetUpdate: ((msg.result.parameters.current_fees.parameters[11][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[11][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            assetUpdatePerKb: ((msg.result.parameters.current_fees.parameters[11][1].price_per_kbyte / 100000) + " / " + (msg.result.parameters.current_fees.parameters[11][1].price_per_kbyte * 0.2 / 100000).toFixed(5) + " BTS"),
            updateSmartCoin: ((msg.result.parameters.current_fees.parameters[12][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[12][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            updateAssetOwner: ((msg.result.parameters.current_fees.parameters[13][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[13][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            publishAsset: ((msg.result.parameters.current_fees.parameters[14][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[14][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            publishAssetPerKb: ((msg.result.parameters.current_fees.parameters[14][1].price_per_kbyte / 100000) + " / " + (msg.result.parameters.current_fees.parameters[14][1].price_per_kbyte * 0.2 / 100000).toFixed(5) + " BTS"),
            burnAsset: ((msg.result.parameters.current_fees.parameters[15][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[15][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            refillAssetComission: ((msg.result.parameters.current_fees.parameters[16][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[16][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            removeAsset: ((msg.result.parameters.current_fees.parameters[17][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[17][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            globalRemoveAsset: ((msg.result.parameters.current_fees.parameters[18][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[18][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            publishQuotes: ((msg.result.parameters.current_fees.parameters[19][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[19][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            cancelTransfer: ((msg.result.parameters.current_fees.parameters[38][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[38][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            cancelTransferPerKb: ((msg.result.parameters.current_fees.parameters[38][1].price_per_kbyte / 100000) + " / " + (msg.result.parameters.current_fees.parameters[38][1].price_per_kbyte * 0.2 / 100000).toFixed(5) + " BTS"),
            assetPenalty: ((msg.result.parameters.current_fees.parameters[41][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[41][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            orderCreate: ((msg.result.parameters.current_fees.parameters[1][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[1][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            cancelOrder: ((msg.result.parameters.current_fees.parameters[2][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[2][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            updatePledge: ((msg.result.parameters.current_fees.parameters[3][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[3][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            createAccount: ((msg.result.parameters.current_fees.parameters[5][1].basic_fee * 0.2 / 100000).toFixed(5) + " BTS"),
            createAccountPro: ((msg.result.parameters.current_fees.parameters[5][1].premium_fee * 0.2 / 100000).toFixed(5) + " BTS"),
            createAccountPerKb: ((msg.result.parameters.current_fees.parameters[5][1].price_per_kbyte * 0.2 / 100000).toFixed(5) + " BTS"),
            updateAccount: ((msg.result.parameters.current_fees.parameters[6][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[6][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            updateAccountPerKb: ((msg.result.parameters.current_fees.parameters[6][1].price_per_kbyte / 100000) + " / " + (msg.result.parameters.current_fees.parameters[6][1].price_per_kbyte * 0.2 / 100000) + " BTS"),
            addToWhiteList: ((msg.result.parameters.current_fees.parameters[7][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            upgradeaccount: ((msg.result.parameters.current_fees.parameters[8][1].membership_annual_fee / 100000) + " / " + " BTS"),
            upgradeAccountYear: ((msg.result.parameters.current_fees.parameters[8][1].membership_lifetime_fee / 100000) + " / " + " BTS"),
            accountSend: ((msg.result.parameters.current_fees.parameters[9][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[9][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            createCaller: ((msg.result.parameters.current_fees.parameters[20][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            updateCaller: ((msg.result.parameters.current_fees.parameters[21][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            createOffer: ((msg.result.parameters.current_fees.parameters[22][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[22][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            createOfferPerKb: ((msg.result.parameters.current_fees.parameters[22][1].price_per_kbyte / 100000) + " / " + (msg.result.parameters.current_fees.parameters[22][1].price_per_kbyte * 0.2 / 100000).toFixed(5) + " BTS"),
            updateOffer: ((msg.result.parameters.current_fees.parameters[23][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[23][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            updateOfferPerKb: ((msg.result.parameters.current_fees.parameters[23][1].price_per_kbyte / 100000) + " / " + (msg.result.parameters.current_fees.parameters[23][1].price_per_kbyte * 0.2 / 100000).toFixed(5) + " BTS"),
            deleteOffer: ((msg.result.parameters.current_fees.parameters[24][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[24][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            createMember: ((msg.result.parameters.current_fees.parameters[29][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[29][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            updateMember: ((msg.result.parameters.current_fees.parameters[30][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[30][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            updateGlobalParametres: ((msg.result.parameters.current_fees.parameters[31][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[31][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            createWorker: ((msg.result.parameters.current_fees.parameters[34][1].fee * 0.2 / 100000) + " BTS"),
            special: ((msg.result.parameters.current_fees.parameters[35][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[35][1].fee * 0.2 / 100000).toFixed(5) + " BTS"),
            specialPerKb: ((msg.result.parameters.current_fees.parameters[35][1].price_per_kbyte / 100000) + " / " + (msg.result.parameters.current_fees.parameters[35][1].price_per_kbyte * 0.2 / 100000).toFixed(5) + " BTS"),
            acceptOperation: ((msg.result.parameters.current_fees.parameters[36][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[36][1].fee * 0.2 / 100000).toFixed(5) + " BTS")

        })
      }
    }
}

    render() {
        const { transfer, transferPerKb, allowTransfer, allowTransferUpdate,  reclamationTransfer, reclamationTransferPerKb, withdrawDelete, 
            vestingBalance, withdrawVestingbalance, toBlindAccount, fromBlindAccount,  assetCreateThree , assetCreateFour,assetCreateLong,assetCreatePerKb,assetUpdate,
            assetUpdatePerKb, updateSmartCoin, updateAssetOwner, publishAsset, publishAssetPerKb, burnAsset, refillAssetComission, removeAsset, globalRemoveAsset, publishQuotes,
            cancelTransfer, cancelTransferPerKb, assetPenalty,orderCreate, cancelOrder, updatePledge, createAccount, createAccountPro, createAccountPerKb, updateAccount, updateAccountPerKb, 
            addToWhiteList, upgradeaccount, upgradeAccountYear, accountSend, createCaller, updateCaller, createOffer, createOfferPerKb, updateOffer, updateOfferPerKb, deleteOffer,
            createMember, updateMember, updateGlobalParametres, createWorker, special, specialPerKb, acceptOperation}  = this.state
        const { container, main,underAreaContainer, mainSection, mainText, numbers} = styles
        return (
            
            <SafeAreaView style={container}>
            <View style={underAreaContainer}>
            
            <ScrollView
            
                width={width}
                horizontal={false}
                directionalLockEnabled={false}>
               <View style={main}>
               
                <View style={{padding: 10}}>
                    <Text style={{color: 'white', fontSize: 15, textAlign: 'center'}}> В экосистеме BitShares каждой операции присваивается индивидуальная комиссия. Эти комиссии могут меняться. 
                    Тем не менее, они определяются только одобрением держателей долей, поэтому каждый держатель основного актива BitShares 
                    (BTS) имеет право влиять на то, какими эти комиссии должны быть. Если держатели согласятся снизить некую комиссию и консенсус
                     будет достигнут, комиссия будет автоматически снижена блокчейном. Изменения параметров блокчейна предлагаются членами комитета. 
                     Этих члены избираются держателями долей и улучшают показатели гибкости и реакции.</Text>
                </View>
                <View style={mainSection}>
                    <Text style={{fontSize: 25, color: 'black'}}>Основные</Text>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ПЕРЕВОД</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакци</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{transfer}</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'flex-end'}}>
                    <Text>Цена за Кбайт данных транзакции</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{transferPerKb} BTS</Text>
                </View>


                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>СОЗДАНИЕ РАЗРЕШЕНИЯ НА ВЫВОД	</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакци</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{allowTransfer}</Text>
                </View>


                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ОБНОВЛЕНИЕ РАЗРЕШЕНИЯ НА ВЫВОД</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакци</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{allowTransferUpdate}</Text>
                </View>
                
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ИСТРЕБОВАНИЕ РАЗРЕШЕНИЯ НА ВЫВОД</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакци</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{reclamationTransfer}</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'flex-end'}}>
                    <Text>Цена за Кбайт данных транзакции</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{reclamationTransferPerKb}</Text>
                </View>


                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>УДАЛЕНИЕ РАЗРЕШЕНИЯ НА ВЫВОД</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакци</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 12}}>{withdrawDelete}</Text>
                </View>


                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>СОЗДАНИЕ ВЕСТИНГОВОГО БАЛАНСА</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакци</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{vestingBalance}</Text>
                </View>


                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ВЫВОД ВЕСТИНГОВОГО БАЛАНСА</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ТИП КОМИССИИ</Text>
                    <Text style={mainText}>Обычная комиссия за транзакци</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{withdrawVestingbalance}</Text>
                </View>

                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ПЕРЕВОД НА СЛЕПОЙ АККАУНТ</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакци</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{toBlindAccount}</Text>
                </View>


                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ПЕРЕВОД СО СЛЕПОГО АККАУНТА</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакци</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{fromBlindAccount}</Text>
                </View>
                </View>

                <View style={mainSection}>
                    <Text>ОТНОСЯЩИЕСЯ К АКТИВАМ</Text>
                    <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>СОЗДАНИЕ АКТИВА</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Тикеры с тремя знаками</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{assetCreateThree}</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'flex-end'}}>
                    <Text>Тикеры с четырьмя знаками</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{assetCreateFour}</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'flex-end'}}>
                    <Text>Длинные тикеры</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{assetCreateLong}</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'flex-end'}}>
                    <Text>Цена за Кбайт данных транзакции</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{assetCreatePerKb}</Text>
                </View>


                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ОБНОВЛЕНИЕ АКТИВА</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{assetUpdate}</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'flex-end'}}>
                    <Text>Цена за Кбайт данных транзакции</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{assetUpdatePerKb}</Text>
                </View>

                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ОБНОВЛЕНИЕ SMARTCOIN</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{updateSmartCoin}</Text>
                </View>

                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ОБНОВЛЕНИЕ ПРОИЗВОДИТЕЛЕЙ КОТИРОВОК</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{updateAssetOwner}</Text>
                </View>

                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ВЫПУСК АКТИВА</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{publishAsset}</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'flex-end'}}>
                    <Text>Цена за Кбайт данных транзакции</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{publishAssetPerKb}</Text>
                </View>

                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>СЖЕЧЬ АКТИВ</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>   
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{burnAsset}</Text>
                </View>

                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ПОПОЛНЕНИЕ ПУЛА КОМИССИЙ АКТИВА</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text>0.45468 BTS / 2.09083 bitRUBLE</Text>
                </View>


                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ПОПОЛНЕНИЕ ПУЛА КОМИССИЙ АКТИВА</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text>0.45468 BTS / 2.09083 bitRUBLE</Text>
                </View>

                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ПОГАШЕНИЕ АКТИВОВ</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{removeAsset}</Text>
                </View>


                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ГЛОБАЛЬНОЕ ПОГАШЕНИЕ АКТИВОВ</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{globalRemoveAsset}</Text>
                </View>


                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ПУБЛИКАЦИЯ КОТИРОВОК</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{publishQuotes}</Text>
                </View>


                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ОТМЕНА ПЕРЕВОДА</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{cancelTransfer}</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'flex-end'}}>
                    <Text>Цена за Кбайт данных транзакции</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{cancelTransferPerKb}</Text>
                </View>


                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ВЗЫСКАНИЕ КОМИССИЙ С АКТИВОВ</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{assetPenalty}</Text>
                </View>


                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ВОСТРЕБОВАТЬ ПУЛ КОМИССИЙ АКТИВА</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text>0.45468 BTS / 2.09083 bitRUBLE</Text>
                </View>

                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ОБНОВИТЬ ЭМИТЕНТА АКТИВА</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text>0.45468 BTS / 2.09083 bitRUBLE</Text>
                </View>
                </View>

                <View style={mainSection}>
                    <Text>ОТНОСЯЩИЕСЯ К БИРЖЕ</Text>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>РАЗМЕЩЕНИЕ ОРДЕРА</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{orderCreate}</Text>
                </View>


                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ОТМЕНА ОРДЕРА</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{cancelOrder}</Text>
                </View>


                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ОБНОВЛЕНИЕ ЗАЛОГА</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{updatePledge}</Text>
                </View>


                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ПРЕДЛАГАЕМОЕ ОБЕСПЕЧЕНИЕ</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text>0.45468 BTS / 2.09083 bitRUBLE</Text>
                </View>

                </View>

                <View style={mainSection}>
                    <Text>ОТНОСЯЩИЕСЯ К АККАУНТУ</Text>
                    <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>СОЗДАНИЕ АККАУНТА</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Бзаовая комиссия</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{createAccount}</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Комиссия для Премиум Имен</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{createAccountPro}</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Цена за Кбайт данных транзакции</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{createAccountPerKb}</Text>
                </View>


                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ОБНОВЛЕНИЕ АККАУНТА</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{updateAccount}</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Цена за Кбайт данных транзакции</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{updateAccountPerKb}</Text>
                </View>


                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ДОБАВЛЕНИЕ В БЕЛЫЙ СПИСОК</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{addToWhiteList}</Text>
                </View>
                

                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>АПГРЕЙД АККАУНТА</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Годовое Членство</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{upgradeAccountYear}</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Пожизненное Членство</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{upgradeaccount}</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ПЕРЕДАЧА АККАУНТА</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{accountSend}</Text>
                </View>
                </View>


                <View style={mainSection}>
                    <Text>ОБСЛУЖИВАЮЩИЕ БИЗНЕС-ПРОЦЕССЫ</Text>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>СОЗДАНИЕ ЗАВЕРИТЕЛЯ</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{createCaller}</Text>
                </View>
                

                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ОБНОВЛЕНИЕ ЗАВЕРИТЕЛЯ</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{updateCaller}</Text>
                </View>


                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>СОЗДАНИЕ ПРЕДЛОЖЕНИЯ</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{createOffer}</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Цена за Кбайт данных транзакции</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{createOfferPerKb}</Text>
                </View>


                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ОБНОВЛЕНИЕ ПРЕДЛОЖЕНИЯ</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{updateOffer}</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Цена за Кбайт данных транзакции</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{updateOfferPerKb}</Text>
                </View>


                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>УДАЛЕНИЕ ПРЕДЛОЖЕНИЯ</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{deleteOffer}</Text>
                </View>

                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>СОЗДАНИЕ ЧЛЕНА КОМИТЕТА</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{createMember}</Text>
                </View>

                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ОБНОВЛЕНИЕ ЧЛЕНА КОМИТЕТА</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{updateMember}</Text>
                </View>

                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ОБНОВЛЕНИЕ ГЛОБАЛЬНЫХ ПАРАМЕТРОВ</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{updateGlobalParametres}</Text>
                </View>


                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>СОЗДАТЬ РАБОТНИКА</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{createWorker}</Text>
                </View>



                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>СПЕЦИАЛЬНАЯ</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{special}</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Цена за Кбайт данных транзакции</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{specialPerKb}</Text>
                </View>


                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text style={mainText}>ОПЕРАЦИЯ</Text>
                    <Text style={mainText}>ОПЕРАЦИЯ ПОДТВЕРЖДЕНИЯ</Text>
                </View>
                <View style={{flexDirection: 'row', width: width, backgroundColor: 'white', justifyContent:'space-between'}}>
                    <Text>ТИП КОМИССИИ</Text>
                    <Text>Обычная комиссия за транзакцию</Text>
                </View>
                <View style={{flexDirection: 'column', width: width, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 10}}>СТАНДАРТНАЯ КОМИССИЯ / КОМИССИЯ ПОЖИЗНЕННОГО ЧЛЕНАЯ</Text>
                    <Text style={numbers}>{acceptOperation}</Text>
                </View>


                </View>
                
                </View>
                </ScrollView>
                </View>
                

                   
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    numbers:{
        fontWeight: 'bold',
        fontSize: 15
    },
    mainText: {
        fontSize: 13
    },
    mainSection:{
        width: width,
        backgroundColor: '#E5E6E4'
    },
    container1: {
        marginTop: StatusBar.currentHeight
      },
      scene: {
        flex: 1,
      },
    container:{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    main: {
        flex: 1,
        flexDirection: 'column',

       
    },
    underAreaContainer:{
        backgroundColor:'#2A2A2A',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    leftSide: {
        alignItems: 'center',
        width: width/2,
        marginTop: 20
    },
    rightSide: {
        alignItems: 'center',
        width: width/2,
        marginTop: 20
    },
    firstBlock:{
       alignItems: 'center',

    },
    block:{
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#00695c',
        height: 60,
        width: 150,
        marginTop: 10,
        padding: 5,
        borderRadius: 5
    },
    block1:{
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#00695c',
        height: 75,
        width: 150,
        marginTop: 10,
        padding: 5,
        borderRadius: 5
    },
    secondContainer: {
        width: width,
        flexDirection:'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: 25
    },
    thirdContainer:{
        marginLeft: 20,
        width: width,
        flexDirection:'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: 25
    },
    title:{
        textAlign: 'center',
        fontSize: 12,
        color: 'white'
    },
    boldWhiteText: {
        textAlign: 'center',
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold'
    },
    boldGreyText:{
        textAlign: 'center',
        fontSize: 15,
        color: '#60A12E',
        fontWeight: 'bold'
    },
    qtyTitle:{
        textAlign: 'center',
        fontSize: 15,
        color: 'white',
    },
    qtyText:{
        textAlign: 'center',
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
        marginTop: 10
    },
    lastText:{
        fontSize: 15,
        color: 'white'
    },
    divider:{
        borderBottomWidth: 1,
        borderBottomColor: '#3B3B3B',
        width: width,
        marginTop: 10,
        marginBottom:10
    }
})
export default connect(null, null)(Comission)
