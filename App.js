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
  RefreshControl,
  StatusBar
} from "react-native";
import { TabViewAnimated, TabBar } from "react-native-tab-view";
import { savedState, defaultRoute } from "./files/default_struct.js";
import { appStyle } from "./files/styles.js";
import { MyListItem, CustomMenu, Footer, Loading } from "./files/components.js";
import {
  nFormatter,
  fetcher,
  mapCreate,
  updateTab
} from "./files/functions.js";

import objMap from "./files/objMap.js";
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
    refreshing: false
  };

  stateChanger = params => {
    this.setState(params);
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
    return (
      <View style={{ flex: 0 }}>
        <View style={styles.toolbar}>
          <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 22, color: "white" }}>DEX Wallet</Text>
          </View>
          <CustomMenu />
        </View>

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
    return <Footer />;
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
              time={item.time}
            />
          )}
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
