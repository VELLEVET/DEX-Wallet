/* @flow */

import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  RefreshControl,
  TouchableHighlight
} from "react-native";
import { TabViewAnimated, TabBar } from "react-native-tab-view";
import { savedState, defaultRoute } from "./files/default_struct.js";
import { appStyle } from "./files/styles.js";
import {
  MyListItem,
  CustomMenu,
  Footer,
  Loading,
  SortBar,
  TxtButton,
  ImgButton
} from "./files/components.js";
import {
  nFormatter,
  fetcher,
  mapCreate,
  updateTab,
  sortRouter
} from "./files/functions.js";

import { objMap } from "./files/objMap.js";
const styles = StyleSheet.create(appStyle);

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
    refreshing: false,
    sort: 3,
    modalKey: -1,
    favorites: false
  };

  setModalKey(key) {
    if (key === "press") {
      this.state.modalKey != -1
        ? this.setState({ modalKey: -1 })
        : alert("Open sesame!");
    } else {
      this.setState(
        this.state.modalKey != -1 ? { modalKey: -1 } : { modalKey: key }
      );
    }
  }

  componentDidMount() {
    savedState.forEach(item => {
      objMap[item.key] = {};
      item.quotes.forEach(quote => {
        objMap[quote] = {};
      });
    });
    mapCreate().then(result => {
      this.setState(result);
    });
  }

  _handleChangeTab = index => {
    this.setState({ index });
  };

  _renderHeader = props => {
    let req = require("./img/starempty.png");
    if (this.state.favorites) {
      req = require("./img/star.png");
    }
    return (
      <View style={{ flex: 0 }}>
        <View style={styles.toolbar}>
          <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 22, color: "white" }}>DEX Wallet</Text>
          </View>
          <CustomMenu
            func={() => {
              this.setState(prevState => ({
                favorites: !prevState.favorites
              }));
            }}
            star={req}
          />
        </View>

        <TabBar
          {...props}
          scrollEnabled
          indicatorStyle={styles.indicator}
          style={styles.tabbar}
          labelStyle={styles.label}
          tabStyle={styles.tabstyle}
        />
        <SortBar func={this.sortTab} hoverbut={this.state.sort} />
      </View>
    );
  };

  sortTab = id => {
    return this.setState(
      this.state.sort == id ? { sort: id + 100 } : { sort: id }
    );
  };

  _renderFooter = props => {
    let items = [
      { req: require("./img/list.png"), func: () => {} },
      { req: require("./img/info.png"), func: () => {} }
    ];
    return <Footer items={items} />;
  };

  _onRefresh() {
    canJump = false;
    this.setState({ refreshing: true });
    updateTab(this.state.index, this.state.routes).then(result => {
      this.setState(result);
      canJump = true;
    });
  }

  modalFunc = () => {
    let routes = [...this.state.routes];
    let quotes = routes[this.state.index].quotes;
    let modKey = this.state.modalKey;
    let k = quotes.findIndex(x => x.key === modKey);

    if (k != -1) {
      quotes[k].favorite = quotes[k].favorite ? false : true;
    }

    this.setState({
      routes: routes,
      modalKey: -1
    });
  };

  _renderScene = ({ route }) => {
    let qts = [...this.state.routes[this.state.index].quotes];
    let modKey = this.state.modalKey;
    let favText = "a";
    if (this.state.favorites) {
      qts = qts.filter(item => item.favorite);
    }
    let k = qts.find(x => x.key == modKey);
    if (k != undefined) {
      k.favorite
        ? (favText = "Remove from favorites")
        : (favText = "Add to favorites");
    }
    if (this.state.sort != -1 && qts.length > 1) {
      qts.sort(sortRouter(this.state.sort));
    }

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
          style={styles.flatlist}
          data={qts}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  marginTop: 100,
                  fontSize: 24,
                  color: "gray",
                  fontWeight: "bold"
                }}
              >
                {this.state.favorites ? "No favorites :-(" : "No items."}
              </Text>
            </View>
          }
          keyExtractor={item => item.key}
          renderItem={({ item }) => {
            let styleItem = Object.assign({}, StyleSheet.flatten(styles.item));
            if (item.favorite == true) {
              styleItem.backgroundColor = "#effbc4";
            }
            if (this.state.modalKey == item.key) {
              return (
                <View style={styles.asset_menu}>
                  <ImgButton
                    imgstyle={{ width: 30, height: 30 }}
                    source={require("./img/info2.png")}
                    func={this.modalFunc}
                  />
                  <ImgButton
                    imgstyle={{ width: 30, height: 30 }}
                    source={
                      item.favorite
                        ? require("./img/star.png")
                        : require("./img/starempty.png")
                    }
                    func={this.modalFunc}
                  />
                </View>
              );
            } else
              return (
                <MyListItem
                  longpress={() => {
                    this.setModalKey(item.key);
                  }}
                  press={() => {
                    this.setModalKey("press");
                  }}
                  style={styleItem}
                  title={item.title}
                  item_key={item.key}
                  route_key={route.key}
                  latest={item.latest}
                  percent_change={item.percent_change}
                  base_volume={nFormatter(item.base_volume, 2)}
                  time={item.time}
                />
              );
          }}
        />
      </View>
    );
  };

  renderScreen() {
    if (this.state.loading) {
      return <Loading />;
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
