/* @flow */

import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  RefreshControl,
  TouchableHighlight,
  TouchableOpacity
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
  ImgButton,
  CustomModal
} from "./files/components.js";
import {
  nFormatter,
  fetcher,
  mapCreate,
  updateTab,
  sortRouter
} from "./files/functions.js";
import { loc } from "./files/locales.js";
import { objMap } from "./files/objMap.js";

const styles = StyleSheet.create(appStyle);

let canJump = true;
export default class DynamicExample extends Component {
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
    favorites: false,
    lang: "ru",
    modal: false
  };

  changeFav(key) {
    let routes = [...this.state.routes];
    let quote = routes[this.state.index].quotes;
    let i = quote.find(item => item.key === key);
    if (i != undefined) {
      i.favorite = !i.favorite;
    }
    this.setState({ routes: routes, modal: false });
  }

  openModal(item) {
    if (item === "lang") {
      this.modalParam.objects = [
        {
          text: "Русский",
          func: () => this.setState({ lang: "ru", modal: false })
        },
        {
          text: "English",
          func: () => this.setState({ lang: "en", modal: false })
        }
      ];
    } else {
      this.modalParam.key = item.key;
      this.modalParam.objects = [
        item.favorite
          ? {
              text: loc[this.state.lang].rmFav,
              func: () => this.changeFav(item.key)
            }
          : {
              text: loc[this.state.lang].addFav,
              func: () => this.changeFav(item.key)
            },
        {
          text: loc[this.state.lang].info,
          func: () => {
            alert(loc[this.state.lang].alertInfo);
          }
        }
      ];
    }
    this.setState({ modal: true });
  }

  modalParam = {
    key: -1,
    objects: []
  };

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
    let req = require("./files/img/starempty.png");
    if (this.state.favorites) {
      req = require("./files/img/star.png");
    }
    return (
      <View style={{ flex: 0 }}>
        <View style={styles.toolbar}>
          <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 22, color: "white" }}>DEX Wallet</Text>
          </View>
          <CustomMenu
            donateUs={loc[this.state.lang].donateUs}
            langtext={loc[this.state.lang].lang}
            langmenu={() => {
              this.openModal("lang");
            }}
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
        <SortBar
          lang={this.state.lang}
          func={this.sortTab}
          hoverbut={this.state.sort}
        />
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
      { req: require("./files/img/list.png"), func: () => {} },
      { req: require("./files/img/info.png"), func: () => {} }
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

  _renderScene = ({ route }) => {
    let qts = [...this.state.routes[this.state.index].quotes];
    if (this.state.favorites) {
      qts = qts.filter(item => item.favorite);
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
                {this.state.favorites
                  ? loc[this.state.lang].noFav
                  : loc[this.state.lang].noItems}
              </Text>
            </View>
          }
          keyExtractor={item => item.key}
          renderItem={({ item }) => {
            let styleItem = Object.assign({}, StyleSheet.flatten(styles.item));
            if (item.favorite == true) {
              styleItem.backgroundColor = "#effbc4";
            }
            return (
              <MyListItem
                longpress={() => {
                  this.openModal(item);
                }}
                press={() => {
                  alert(loc[this.state.lang].alertGr);
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
    return (
      <View style={styles.maincontainer}>
        <CustomModal
          on={this.state.modal}
          dim={() => this.setState({ modal: false })}
          objects={this.modalParam.objects}
        />
        {this.renderScreen()}
      </View>
    );
  }
}
