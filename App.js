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
      console.log(" ");
      console.log(" ------------------------------- ");
      console.log(" ");
    }
    if (msg.id == 11) {
      console.log("Текущее количество: " + msg.result[0].current_supply + " BTS (надо немного подшаманить количество)");
      console.log("Стелс-количество: " + msg.result[0].confidential_supply + " BTS (надо немного подшаманить количество)");
      console.log(" ");
      console.log(" ------------------------------- ");
      console.log(" ");
    }
    if (msg.id == 12) {
      // Всё это смотрю через парсер тут - jsonlint.com
      // В экосистеме BitShares каждой операции присваивается индивидуальная комиссия. Эти комиссии могут меняться. Тем не менее, они определяются только одобрением держателей долей, поэтому каждый держатель основного актива BitShares (BTS) имеет право влиять на то, какими эти комиссии должны быть. Если держатели согласятся снизить некую комиссию и консенсус будет достигнут, комиссия будет автоматически снижена блокчейном. Изменения параметров блокчейна предлагаются членами комитета. Этих члены избираются держателями долей и улучшают показатели гибкости и реакции.
      // Комиссии, требующие пожизненной подписки (tm_required) 5, 7, 20, 21, 34 - выплачиваются полностью, а потом 80% возвращается на вестинговые баланс
      console.log("Комиссии, стандартные / для пожизненной подписки:");
      console.log(" ");
      
      // id 0, 25, 26, 27, 28, 32, 33, 37, 39, 40
      console.log("General / Основные");
      console.log("[0] Перевод: " + (msg.result.parameters.current_fees.parameters[0][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[0][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[0] Перевод (за килобайт данных транзакции): " + (msg.result.parameters.current_fees.parameters[0][1].price_per_kbyte / 100000) + " / " + (msg.result.parameters.current_fees.parameters[0][1].price_per_kbyte * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[25] Создание разрешения на вывод: " + (msg.result.parameters.current_fees.parameters[25][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[25][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[26] Обновление разрешения на вывод: " + (msg.result.parameters.current_fees.parameters[26][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[26][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[27] Истребование разрешения на вывод: " + (msg.result.parameters.current_fees.parameters[27][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[27][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[27] Истребование разрешения на вывод (цена за килобайт данных транзакции): " + (msg.result.parameters.current_fees.parameters[27][1].price_per_kbyte / 100000) + " / " + (msg.result.parameters.current_fees.parameters[27][1].price_per_kbyte * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[28] Удаление разрешения на вывод (0 означает - без комиссии): " + (msg.result.parameters.current_fees.parameters[28][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[28][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[32] Создание вестингового баланса: " + (msg.result.parameters.current_fees.parameters[32][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[32][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[33] Вывод вестингового баланса: " + (msg.result.parameters.current_fees.parameters[33][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[33][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      // 37 айдишка пустая почему-то
      console.log("[39] Перевод на слепой аккаунт: " + (msg.result.parameters.current_fees.parameters[39][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[39][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[39] Перевод на слепой аккаунт (цена за килобайт данных транзакции): " + (msg.result.parameters.current_fees.parameters[39][1].price_per_output / 100000) + " / " + (msg.result.parameters.current_fees.parameters[39][1].price_per_output * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[40] Перевод со слепого аккаунта: " + (msg.result.parameters.current_fees.parameters[40][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[40][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log(" ");
      
      // id 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 38, 41
      console.log("Asset / Относящиеся к активам");
      console.log("[10] Создание актива с 3 знаками: " + (msg.result.parameters.current_fees.parameters[10][1].symbol3 / 100000) + " / " + (msg.result.parameters.current_fees.parameters[10][1].symbol3 * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[10] Создание актива с 4 знаками: " + (msg.result.parameters.current_fees.parameters[10][1].symbol4 / 100000) + " / " + (msg.result.parameters.current_fees.parameters[10][1].symbol4 * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[10] Создание актива с 5 и более знаками: " + (msg.result.parameters.current_fees.parameters[10][1].long_symbol / 100000) + " / " + (msg.result.parameters.current_fees.parameters[10][1].long_symbol * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[10] Цена за килобайт данных транзакции: " + (msg.result.parameters.current_fees.parameters[10][1].price_per_kbyte / 100000) + " / " + (msg.result.parameters.current_fees.parameters[10][1].price_per_kbyte * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[11] Обновление актива: " + (msg.result.parameters.current_fees.parameters[11][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[11][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[11] Обновление актива (цена за килобайт данных транзакции): " + (msg.result.parameters.current_fees.parameters[11][1].price_per_kbyte / 100000) + " / " + (msg.result.parameters.current_fees.parameters[11][1].price_per_kbyte * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[12] Обновление SmartCoin: " + (msg.result.parameters.current_fees.parameters[12][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[12][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[13] Обновление производителей котировок актива: " + (msg.result.parameters.current_fees.parameters[13][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[13][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[14] Выпуск актива: " + (msg.result.parameters.current_fees.parameters[14][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[14][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[14] Выпуск актива (цена за килобайт данных транзакции): " + (msg.result.parameters.current_fees.parameters[14][1].price_per_kbyte / 100000) + " / " + (msg.result.parameters.current_fees.parameters[14][1].price_per_kbyte * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[15] Сжечь актив: " + (msg.result.parameters.current_fees.parameters[15][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[15][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[16] Пополнение пула комиссий актива: " + (msg.result.parameters.current_fees.parameters[16][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[16][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[17] Погашение активаов: " + (msg.result.parameters.current_fees.parameters[17][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[17][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[18] Глобальное погашение активов: " + (msg.result.parameters.current_fees.parameters[18][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[18][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[19] Публикация котировок: " + (msg.result.parameters.current_fees.parameters[19][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[19][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[38] Отмена перевода: " + (msg.result.parameters.current_fees.parameters[38][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[38][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[38] Отмена перевода (цена за килобайт данных транзакции): " + (msg.result.parameters.current_fees.parameters[38][1].price_per_kbyte / 100000) + " / " + (msg.result.parameters.current_fees.parameters[38][1].price_per_kbyte * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[41] Взыскание комиссий с активов: " + (msg.result.parameters.current_fees.parameters[41][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[41][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log(" ");
      
      // id 1, 2, 3, 4, 17, 18
      console.log("Market / Относящиеся к бирже");
      console.log("[1] Размещение ордера: " + (msg.result.parameters.current_fees.parameters[1][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[1][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[2] Отмена ордера: " + (msg.result.parameters.current_fees.parameters[2][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[2][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[3] Обновление залога: " + (msg.result.parameters.current_fees.parameters[3][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[3][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      // 4ой id нет
      console.log("[17] Погашение активов: " + (msg.result.parameters.current_fees.parameters[17][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[17][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[18] Глобальное погашение активов: " + (msg.result.parameters.current_fees.parameters[18][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[18][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log(" ");
      
      // id 5, 6, 7, 8, 9
      console.log("Account / Относящиеся к аккаунтам");
      console.log("[5] Создание аккаунта (базовая комиссия, требуется LTM): " + (msg.result.parameters.current_fees.parameters[5][1].basic_fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[5] Создание аккаунта (премиум имя, требуется LTM): " + (msg.result.parameters.current_fees.parameters[5][1].premium_fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[5] Создание аккаунта (цена за килобайт данных транзакции, требуется LTM): " + (msg.result.parameters.current_fees.parameters[5][1].price_per_kbyte * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[6] Обновление аккаунта: " + (msg.result.parameters.current_fees.parameters[6][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[6][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[6] Обновление аккаунта (за килобайт данных транзакции): " + (msg.result.parameters.current_fees.parameters[6][1].price_per_kbyte / 100000) + " / " + (msg.result.parameters.current_fees.parameters[6][1].price_per_kbyte * 0.2 / 100000) + " BTS");
      console.log("[7] Добавление в белый список (требуется LTM): " + (msg.result.parameters.current_fees.parameters[7][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[8] Апгрейд аккаунта (годовая подписка, не рекомендуется): " + (msg.result.parameters.current_fees.parameters[8][1].membership_annual_fee / 100000) + " / " + " BTS");
      console.log("[8] Апрейд аккаунта (пожизненная подписка - LTM, настоятельно рекомендуется): " + (msg.result.parameters.current_fees.parameters[8][1].membership_lifetime_fee / 100000) + " / " + " BTS");
      console.log(" ");
      console.log("[9] Передача аккаунта: " + (msg.result.parameters.current_fees.parameters[9][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[9][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log(" ");
      
      // id 20, 21, 22, 23, 24, 29, 30, 31, 34, 35, 36
      console.log("Business / Обслуживающие бизнес-процессы");
      console.log("[20] Создание заверителя: " + (msg.result.parameters.current_fees.parameters[20][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[21] Обновление заверителя: " + (msg.result.parameters.current_fees.parameters[21][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[22] Создание предложения: " + (msg.result.parameters.current_fees.parameters[22][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[22][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[22] Создание предложения (цена за килобайт данных транзакции): " + (msg.result.parameters.current_fees.parameters[22][1].price_per_kbyte / 100000) + " / " + (msg.result.parameters.current_fees.parameters[22][1].price_per_kbyte * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[23] Обновление предложения: " + (msg.result.parameters.current_fees.parameters[23][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[23][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[23] Обновление предложения (цена за килобайт данных транзакции): " + (msg.result.parameters.current_fees.parameters[23][1].price_per_kbyte / 100000) + " / " + (msg.result.parameters.current_fees.parameters[23][1].price_per_kbyte * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[24] Удаление предложения (без комиссии): " + (msg.result.parameters.current_fees.parameters[24][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[24][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[29] Создание члена комитета: " + (msg.result.parameters.current_fees.parameters[29][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[29][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[30] Обновление члена комитета: " + (msg.result.parameters.current_fees.parameters[30][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[30][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[31] Обновление глобальных параметров (без комиссии): " + (msg.result.parameters.current_fees.parameters[31][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[31][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[34] Создание работника (требуется LTM): " + (msg.result.parameters.current_fees.parameters[34][1].fee * 0.2 / 100000) + " BTS");
      console.log("[35] Специальная: " + (msg.result.parameters.current_fees.parameters[35][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[35][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[35] Специальная (цена за килобайт данных транзакции): " + (msg.result.parameters.current_fees.parameters[35][1].price_per_kbyte / 100000) + " / " + (msg.result.parameters.current_fees.parameters[35][1].price_per_kbyte * 0.2 / 100000).toFixed(5) + " BTS");
      console.log("[36] Операция подтверждения: " + (msg.result.parameters.current_fees.parameters[36][1].fee / 100000) + " / " + (msg.result.parameters.current_fees.parameters[36][1].fee * 0.2 / 100000).toFixed(5) + " BTS");
      console.log(" ");
      console.log(" ------------------------------- ");
      console.log(" ");
      console.log("Комитет");
      console.log("Активные члены комитета: " + msg.result.active_committee_members.length);
      console.log("Список id членов комитета: " + msg.result.active_committee_members);
      
      // Таким запросом мы получаем данные по каждому участнику комитета
      // {"id":1, "method":"call", "params":[2,"get_objects",[["1.5.15"]]]}
      // Прилетает что-нибудь такое
      // {"id":1,"jsonrpc":"2.0","result":[{"id":"1.5.15","committee_member_account":"1.2.121","vote_id":"0:85","total_votes":"71082645234821","url":"transwiser.com"}]}
      // Из этих ответов надо дёргать и формировать список: имя аккаунта по id (committee_member_account), количество голосов (total_votes) и url
      // Пример тут: https://market.rudex.org/#/explorer/committee-members
      
      console.log(" ");
      console.log(" ------------------------------- ");
      console.log(" ");
      console.log("Заверители");
      console.log("Текущие заверители: " + msg.result.active_witnesses.length);
      console.log("Список id заверителей: " + msg.result.active_witnesses);
      // {"id":1, "method":"call", "params":[2,"get_objects",[["1.6.16"]]]}
      // Прилетает что-нибудь такое
      // {"id":1,"jsonrpc":"2.0","result":[{"id":"1.6.16","witness_account":"1.2.167","last_aslot":27704221,"signing_key":"BTS7aosZBJxYvWJhFyunKjv6GgfcSfW6BASZho8o187gm8M4a3fMH","pay_vb":"1.13.32","vote_id":"1:26","total_votes":"70173628937417","url":".","total_missed":4554,"last_confirmed_block_num":27553854}]}
      /*
      Из этих ответов надо дёргать и формировать список:
       * имя заверителя (witness_account)
       * количество голосов (total_votes)
       * пропущенные блоки (total_missed)
       * последний подтверждённый блок (last_confirmed_block_num)
       * время с последнего блока (хз, где достать - видимо, через какой-нибудь get_object и по номеру блока).
      
       А также нужна общая инфа:
       * уровень участия (в процентах)
       * оплата за блок (msg.result.parameters.current_fees.witness_pay_per_block)
       * оставшийся бюджет
       * следующее обновление
       * пример тут: https://market.rudex.org/#/explorer/witnesses
      */
       
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
