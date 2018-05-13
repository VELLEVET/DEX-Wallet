/* @flow */

import React, { Component } from "react";
import { View, StyleSheet, Text, Button, ToolbarAndroid } from "react-native";
import { TabViewAnimated, TabBar } from "react-native-tab-view";

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
