/* @flow */

import React, { Component } from "react";
import { View, StyleSheet, Text, Button, ToolbarAndroid } from "react-native";
import { TabViewAnimated, TabBar } from "react-native-tab-view";

// ------------------------------------
var msg;
var data;
var e = [];

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
    // connection opened
    ws.send(JSON.stringify(login_query));           // отправляем запрос на подключение к БД
};

ws.onmessage = (e) => {
    // a message was received
    msg = JSON.parse(e.data);
    //console.log("e.data = " + e.data);
    //console.log("msg = " + msg.id);
    
    if (msg.id == -1) {
        // Когда приходит ответ о подключении к БД, начинаем отсылать запросы
        ws.send(JSON.stringify(db_connect_query)); 
        ws.send(JSON.stringify(dynamic_global_props_query)); 
        ws.send(JSON.stringify(bts_object_query)); 
        ws.send(JSON.stringify(global_props_query)); 
    }
    
    if (msg.id == 10) {
        console.log("Последний блок: " + msg.result.head_block_number + " (" + msg.result.time + ", надо дату немного скорректировать)");
    }
    if (msg.id == 11) {
        console.log("Текущее количество: " + msg.result[0].current_supply + " BTS (надо немного подшаманить количество)");
        console.log("Стелс-количество: " + msg.result[0].confidential_supply + " BTS (надо немного подшаманить количество)");
    }
    if (msg.id == 12) {
        console.log("Активные члены комитета: " + msg.result.active_committee_members.length);
        console.log("Активные заверители: " + msg.result.active_witnesses.length)
        console.log(" ");
        console.log("Комиссии, стандартные / для пожизненной подписки (надо преобразовать все значения):");
        console.log("Перевод: " + msg.result.parameters.current_fees.parameters[0][1].fee + " / " + msg.result.parameters.current_fees.parameters[0][1].fee * 0.2 + " BTS");
        console.log("Цена за килобайт данных транзакции: " + msg.result.parameters.current_fees.parameters[0][1].price_per_kbyte + " / " + msg.result.parameters.current_fees.parameters[0][1].price_per_kbyte * 0.2 + " BTS");
        console.log("Пожизненное членство: " + msg.result.parameters.current_fees.parameters[8][1].membership_lifetime_fee + " / " + " BTS");
        
    }
    
};


// ------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  },
  tabbar: {
    backgroundColor: "#222"
  },
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  indicator: {
    backgroundColor: "#ffeb3b"
  },
  label: {
    color: "#fff",
    fontWeight: "400"
  },
  toolbar: {
    backgroundColor: "#543532",
    height: 56,
    alignSelf: "stretch"
  }
});

export default class DynamicExample extends Component {
  static title = "Dynamic tab load";
  static appbarElevation = 0;

  static propTypes = {
    style: View.propTypes.style
  };
  constructor(props) {
    super(props);
    this.addNewObject = this.addNewObject.bind(this);
  }
  state = {
    index: 0,
    routes: [],
    loading: true,
    data: {}
  };

  componentDidMount() {
    objects = [
      { info: "Bitshare", key: "1.3.27" },
      { info: "Nickcoin", key: "6.1.41" }
    ];
    this.addNewObject(objects);
  }

  addNewObject = objectsArray => {
    let routes = this.state.routes;
    objectsArray.forEach(active => {
      routes.push({
        title: active.info,
        key: active.key
      });
    });

    this.setState({
      data: objectsArray,
      routes,
      loading: false
    });
  };

  _handleChangeTab = index => {
    this.setState({ index });
  };

  _renderHeader = props => {
    return (
      <View>
        <ToolbarAndroid
          style={styles.toolbar}
          title="Trader"
          titleColor="#FFF"
          actions={[{ title: "Настройки", show: "never" }]}
          onActionSelected={this.menuActions}
        />
        <TabBar
          {...props}
          scrollEnabled
          indicatorStyle={styles.indicator}
          style={styles.tabbar}
          labelStyle={styles.label}
        />
      </View>
    );
  };

  myArray = [{ info: "Rockcoin", key: "2.1.11" }];

  _renderScene = ({ route }) => {
    return (
      <View style={[styles.page, { backgroundColor: "#f9f4eb" }]}>
        <Button
          onPress={() => this.addNewObject(this.myArray)}
          title="Push me"
          color="#841584"
        />
        <Text />
        <Text />
        <Text />
        <Text style={{ fontSize: 20 }}>
          {route.key} - {route.title}
        </Text>
      </View>
    );
  };

  renderScreen() {
    if (this.state.loading) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    } else {
      return (
        <TabViewAnimated
          style={styles.container}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderHeader={this._renderHeader}
          onRequestChangeTab={this._handleChangeTab}
          onIndexChange={this._handleChangeTab}
        />
      );
    }
  }

  render() {
    return <View style={styles.container}>{this.renderScreen()}</View>;
  }
}
