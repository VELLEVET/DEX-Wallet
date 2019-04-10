import React, {Component} from "react";
import {FlatList, RefreshControl, StyleSheet, Text, View, SafeAreaView, Dimensions, ScrollView} from "react-native";
import {appStyle} from "../../files/styles";
import "moment/locale/ru"
const { width, heigth } = Dimensions.get('window')
import {connect} from "react-redux";
var msg;
var data;
var e = [];
class Tabs extends Component<Props, State> {
    state = {
        btsQty: null,
        lastBlock: null,
        commitetMemebers: null,
        activeWitnesses: null,
        transactions: null,
        stelsQty: null
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
        console.log('1239081297398127391', msg.result)
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
            activeWitnesses: msg.result.active_witnesses.length
        })
         
      }
}
    }
    

    render() {
        console.log('1111111')
        const {lastBlock, btsQty, commitetMemebers, activeWitnesses, transactions, stelsQty}  = this.state
        const { container, main, leftSide, rightSide, block, secondContainer, underAreaContainer,
             title, boldGreyText, boldWhiteText, qtyTitle, qtyText} = styles
        return (
            
            <SafeAreaView style={container}>
            <View style={underAreaContainer}>
            <ScrollView
                width={width}
                horizontal={false}
                directionalLockEnabled={false}>
               <View style={main}>
                   <View style={leftSide}>
                    <View style={block}>
                       <Text style={title}>ТЕКУЩИЙ БЛОК</Text>
                       <Text style={boldWhiteText}>{lastBlock}</Text>
                    </View>
                    
                    <View style={block}>
                       <Text style={title}>АКТИВНЫЕ ЗАВЕРИТЕЛИ</Text>
                       <Text style={boldGreyText}>{activeWitnesses}</Text>
                    </View>
                    <View style={block}>
                       <Text style={title}>ТРАНЗАКИИ/БЛОК</Text>
                       <Text style={boldWhiteText}>{transactions}</Text>
                    </View>

                   </View>
                   <View style={rightSide}>
                   <View style={block}>
                       <Text style={title}>ТРАНЗАКИИ/СЕК</Text>
                       <Text style={boldWhiteText}>{(transactions/3).toFixed(2)}</Text>
                    </View>
                    <View style={block}>
                       <Text style={title}>АКТИВНЫЕ ЧЛЕНЫ КОМИТЕТА</Text>
                       <Text style={boldGreyText}>{commitetMemebers}</Text>
                    </View>
                   </View>
               </View>
                <View style={secondContainer}>
                    <View>
                       <Text style={qtyTitle}>ТЕКУЩЕЕ КОЛИЧЕСТВО</Text>
                       <Text style={qtyText}>{btsQty} BTS</Text>
                    </View>
                    <View style={{marginTop: 20 }}>
                       <Text style={qtyTitle}>СТЕЛС КОЛИЧЕСТВО</Text>
                       <Text style={qtyText}>{stelsQty} BTS</Text>
                    </View>   
                </View>
                   </ScrollView>
                </View>
                

                   
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    main: {
        flex: 1,
        flexDirection: 'row'
       
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
        justifyContent: 'center',
        alignItems: 'center',
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
        fontSize: 20,
        color: 'white',
    },
    qtyText:{
        textAlign: 'center',
        fontSize: 25,
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
export default connect(null, null)(Tabs)
