/* @flow */

import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  ToolbarAndroid,
  FlatList,
  ListItem,
  Image,
  RefreshControl
} from "react-native";
import { TabViewAnimated, TabBar } from "react-native-tab-view";
import { savedState, defaultRoute } from "./default_struct.js";

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
    //alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f4eb"
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
  },
  bottom_toolbar: {
    position: "absolute",
    justifyContent: "space-evenly",
    bottom: 0,
    width: 220,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#110d0c",
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 40,
    opacity: 0.8
  },
  item: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderBottomWidth: 2,
    borderRadius: 2,
    borderColor: "#ddd"
  }
});

export class MyListItem extends Component {
  render() {
    changeFunc = () => {
      let change = this.props.percent_change;
      if (change === "0")
        return (
          <Text style={{ color: "blue", fontSize: 15, alignSelf: "flex-end" }}>
            0
          </Text>
        );
      if (change.includes("-")) {
        return (
          <Text style={{ color: "red", fontSize: 15, alignSelf: "flex-end" }}>
            {change}
          </Text>
        );
      } else {
        return (
          <Text style={{ color: "green", fontSize: 15, alignSelf: "flex-end" }}>
            +{change}
          </Text>
        );
      }
    };
    titleFunc = () => {
      let title = this.props.title;
      if (title.includes(".")) {
      }
    };
    return (
      <View style={styles.item}>
        <View style={{ flex: 2 }}>
          <Text
            style={{
              fontSize: 18,
              alignSelf: "flex-start",
              fontWeight: "bold"
            }}
          >
            {this.props.title}
          </Text>
        </View>

        <View
          style={{
            flex: 4,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <View
            style={{
              marginEnd: 10,
              flex: 1.5
            }}
          >
            <Text style={{ fontSize: 15, alignSelf: "flex-end" }}>
              {this.props.latest}
            </Text>
            {changeFunc()}
          </View>
          <View
            style={{
              flex: 2,

              marginEnd: 10
            }}
          >
            <Text style={{ fontSize: 15, alignSelf: "flex-end" }}>
              {this.props.quote_volume}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

let objMap = {};
let canJump = true;
export default class DynamicExample extends Component {
  static propTypes = {
    style: View.propTypes.style
  };

  constructor(props) {
    super(props);
  }

  state = {
    index: 0,
    routes: defaultRoute,
    loading: true,
    refreshing: false
  };

  componentDidMount() {
    this.mapCreate(savedState);
  }

  fetchData = function() {
    var t0 = Date.now();
    let count = -1;
    let value = "";
    Promise.all(
      savedState
        .reduce((acc, { key, quotes }) => {
          quotes.forEach(quote => acc.push({ key, quote }));
          return acc;
        }, [])
        .map(pair => {
          if (pair.key !== value) {
            count++;
            value = pair.key;
          }
          return fetch("https://api-ru.bts.blckchnd.com", {
            method: "post",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: count,
              method: "get_ticker",
              params: ["1.3." + pair.key, "1.3." + pair.quote]
            })
          }).then(result => result.json());
        })
    )
      .then(items => {
        count = -1;
        let arri = [];

        items.forEach(item => {
          let qNum = item.result.quote.slice(4);
          let bNum = item.result.base.slice(4);
          if (item.id > count) {
            arri.push({
              title: objMap[bNum].symbol,
              key: bNum,
              quotes: []
            });
            count++;
          }
          let tit = objMap[qNum].symbol;
          if (tit.length > 11) {
            let arrTit = tit.split(".");
            tit = arrTit[0] + ".\n" + arrTit[1];
          }
          arri[count].quotes.push({
            percent_change: item.result.percent_change,
            quote_volume: item.result.quote_volume,
            latest: Number(item.result.latest).toFixed(objMap[qNum].precision),
            title: tit,
            key: qNum
          });
        });
        this.setState({ routes: arri, loading: false, refreshing: false });
      })
      .then(item => {
        var t1 = Date.now();
        console.log("It took " + (t1 - t0) + " milliseconds.");
      })
      .catch(error => {
        alert("Network error!");
        console.error(error);
      });
  };

  updateTab = function(index) {
    canJump = false;
    this.setState({ refreshing: true, index: index });
    console.log("Updating tab...");
    var t0 = Date.now();
    let currentRoute = [...savedState][index];
    let routes = [...this.state.routes];
    Promise.all(
      currentRoute.quotes.map(quote => {
        return fetch("https://api-ru.bts.blckchnd.com", {
          method: "post",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "get_ticker",
            params: ["1.3." + currentRoute.key, "1.3." + quote]
          })
        }).then(result => result.json());
      })
    )
      .then(items => {
        for (i = 0; i < currentRoute.quotes.length; i++) {
          let routObj = routes[index].quotes[i];
          let qKey = items[i].result.quote.slice(4);
          routObj.key = qKey;
          routObj.percent_change = items[i].result.percent_change;
          // let num = Number(items[i].result.latest).toFixed(
          //   objMap[qKey].precision
          // );
          // if (num.length > 12) {
          //   let arrNum = num.split(".");
          //   num = arrNum[0] + ".\n" + arrNum[1];
          // }
          routObj.latest = Number(items[i].result.latest).toFixed(
            objMap[qKey].precision
          );
          routObj.quote_volume = items[i].result.quote_volume;
        }
      })
      .then(() => {
        this.setState({
          routes: routes,
          refreshing: false,
          canJumpToTab: true
        });
        canJump = true;
        var t1 = Date.now();
        console.log("It took " + (t1 - t0) + " milliseconds.");
      })
      .catch(error => {
        alert("Network error.");
        console.error(error);
      });
  };

  mapCreate = array => {
    array.forEach(item => {
      objMap[item.key] = {};
      item.quotes.forEach(quote => {
        objMap[quote] = {};
      });
    });

    fetch("https://api-ru.bts.blckchnd.com", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "get_assets",
        params: [Object.keys(objMap).map(item => "1.3." + item)]
      })
    })
      .then(result => result.json())
      .then(result2 => {
        result2.result.forEach(item => {
          objMap[item.id.slice(4)] = item;
        });
      })
      .then(this.fetchData())
      .catch(error => {
        alert("Network error.");
        console.error(error);
      });
  };

  _handleChangeTab = index => {
    //it should run the setState
    this.setState({ index });
  };

  menuActions = position => {};

  _renderHeader = props => {
    return (
      <View style={{ flex: 0 }}>
        <ToolbarAndroid
          style={styles.toolbar}
          title="DEX Wallet"
          titleColor="#FFF"
          actions={[
            { title: "Настройки", show: "never", color: "#FFF" },
            { title: "Сообщество", show: "never", color: "#FFF" },
            { title: "Язык", show: "never", color: "#FFF" }
          ]}
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

  _renderFooter = props => {
    return (
      <View style={styles.bottom_toolbar}>
        <Image
          style={{ width: 35, height: 35 }}
          source={{
            uri:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/VisualEditor_-_Icon_-_Indent-list-ltr_-_white.svg/2000px-VisualEditor_-_Icon_-_Indent-list-ltr_-_white.svg.png"
          }}
        />
        <Image
          style={{ width: 30, height: 30 }}
          source={{
            uri: "https://apteka245.ru/img/info.png"
          }}
        />
      </View>
    );
  };

  _onRefresh() {
    this.updateTab(this.state.index);
  }
  _renderScene = ({ route }) => {
    return (
      <View style={styles.page}>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          ListFooterComponent={<View style={{ height: 40 }} />}
          style={{ flex: 1 }}
          data={route.quotes}
          keyExtractor={item => item.key}
          renderItem={({ item }) => (
            <MyListItem
              style={styles.item}
              title={item.title}
              item_key={item.key}
              route_key={route.key}
              latest={item.latest}
              percent_change={item.percent_change}
              base_volume={item.base_volume}
              quote_volume={item.quote_volume}
            />
          )}
        />
      </View>
    );
  };

  renderScreen() {
    if (this.state.loading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              color: "blue",
              fontSize: 45,
              fontWeight: "bold"
            }}
          >
            DEX Wallet
          </Text>
          <Text style={{ fontSize: 18 }}>loading...</Text>
        </View>
      );
    } else {
      return (
        <TabViewAnimated
          canJumpToTab={this.canJumpToTab}
          style={styles.container}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderHeader={this._renderHeader}
          renderFooter={this._renderFooter}
          onRequestChangeTab={this._handleChangeTab}
          onIndexChange={this._handleChangeTab}
        />
      );
    }
  }
  canJumpToTab(route) {
    return canJump;
  }
  render() {
    console.log("render");
    return <View style={styles.container}>{this.renderScreen()}</View>;
  }
}
