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
  TouchableOpacity,
  Dimensions,
  processColor,
  Button,
  ScrollView
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
  sortRouter,
  formula,
  getColorPercent
} from "./files/functions.js";
import { loc } from "./files/locales.js";
import { objMap } from "./files/objMap.js";
import { CandleStickChart } from "react-native-charts-wrapper";
import moment from "moment";
import "moment/locale/ru";
const styles = StyleSheet.create(appStyle);

let canJump = true;

export default class DynamicExample extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    index: 0,
    routes: defaultRoute,
    routestwo: undefined,
    loading: true,
    refreshing: false,
    sort: 3,
    modalKey: -1,
    favorites: false,
    lang: "ru",
    modal: false,
    key1: -1,
    key2: 0,
    rotate: true,
    legend: {
      enabled: false
    },
    percent: "-20.0%",
    price: "124244.023",
    date: "24h",
    stick: 3600,
    selectedEntry: null,
    data: {
      dataSets: [
        {
          values: [
            { shadowH: 101.76, shadowL: 100.4, open: 100.78, close: 101.03 },
            { shadowH: 101.58, shadowL: 100.27, open: 101.31, close: 101.12 },
            { shadowH: 102.24, shadowL: 100.15, open: 101.41, close: 101.17 }
          ],
          label: "aaa",
          config: {
            highlightColor: processColor("darkgray"),

            shadowColor: processColor("black"),
            shadowWidth: 1,
            shadowColorSameAsCandle: true,
            increasingColor: processColor("#71BD6A"),
            increasingPaintStyle: "fill",
            decreasingColor: processColor("#D14B5A")
          }
        }
      ]
    },
    xAxis: {},
    yAxis: {}
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
    moment.locale("ru");
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
    if (this.state.key1 != -1) {
      return (
        <View style={{ flex: 0 }}>
          <View style={styles.toolbar}>
            <View
              style={{
                padding: 10,
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <Button
                title="back"
                onPress={() =>
                  this.setState({ key1: -1, routes: this.state.routestwo })
                }
              />
              <Text
                style={{
                  fontWeight: "bold",
                  color: "white",
                  fontSize: 20,
                  paddingLeft: 10
                }}
              >
                {objMap[this.state.key1.substr(4)].symbol +
                  " - " +
                  objMap[this.state.key2.substr(4)].symbol}
              </Text>
            </View>
            <CustomMenu
              donateUs={loc[this.state.lang].donateUs}
              langtext={loc[this.state.lang].lang}
              langmenu={() => {
                this.openModal("lang");
              }}
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
        </View>
      );
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
          fontsize={12}
        />
      </View>
    );
  };

  updateChart = () => {
    this.buttonPress(this.state.stick);
    fetcher(1, "get_ticker", [this.state.key1, this.state.key2]).then(item => {
      this.setState({
        percent: item.result.percent_change,
        price: Number(item.result.latest).toFixed(
          objMap[this.state.key1.substr(4)].precision
        ),
        refreshing: false
      });
    });
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
    if (this.state.key1 != -1) {
      this.setState({ refreshing: true });
      this.updateChart();
    } else {
      canJump = false;
      this.setState({ refreshing: true });
      updateTab(this.state.index, this.state.routes).then(result => {
        this.setState(result);
        canJump = true;
      });
    }
  }

  showTheChart = (key1, key2) => {
    //this.buttonPress(3600, key1, key2);

    this.buttonPress(3600, key1, key2);
    fetcher(1, "get_ticker", [key1, key2]).then(item => {
      this.setState({
        percent: item.result.percent_change,
        price: Number(item.result.latest).toFixed(
          objMap[key1.substr(4)].precision
        )
      });
    });
  };

  handleSelect(event) {
    let entry = event.nativeEvent;
    if (entry == null || entry.data === undefined) {
      this.setState({ selectedEntry: null });
    } else {
      let mmt = moment(entry.data.marker);
      //mmt.format("MM D") + "/" + mmt.format("HH:mm");
      this.setState({ selectedEntry: mmt.format("MMM D, HH:mm") });
    }
  }

  buttonPress = (
    id,
    key1 = this.state.key1,
    key2 = this.state.key2,
    flip = false
  ) => {
    let date = moment(new Date());
    let currentDate = date.format("YYYY-MM-DDTHH:mm:ss");
    let difDate;
    let str;
    let stick;

    if (typeof id === "string") {
      stick = this.state.stick;
      if (id === "1w" && stick == 900) {
        stick = 3600;
      } else if (id === "1M") {
        if (stick < 14400) {
          stick = 14400;
        }
      } else if (id === "3M") {
        stick = 86400;
      }
      difDate = this.giveMeDateOneMoreTime(id);
      str = id;
    } else {
      difDate = this.giveMeDateOneMoreTime(this.state.date);
      str = this.state.date;
      stick = id;
    }

    fetcher(10, "call", [
      "history",
      "get_market_history",
      [key1, key2, stick, difDate, currentDate]
    ])
      .then(obj => {
        console.log(obj.result.length);
        let o = {
          key1: key1,
          key2: key2,
          date: str,
          stick: stick,
          data:
            obj.result.length === 0
              ? {}
              : {
                  dataSets: [
                    {
                      values: obj.result.map((item, index) => {
                        let rotate = this.state.rotate;
                        if (flip) {
                          rotate = !this.state.rotate;
                        }
                        let shadowH = formula(
                          key1,
                          key2,
                          item.high_base,
                          item.high_quote
                        );
                        let shadowL = formula(
                          key1,
                          key2,
                          item.low_base,
                          item.low_quote
                        );
                        let open = formula(
                          key1,
                          key2,
                          item.open_base,
                          item.open_quote
                        );

                        let close = formula(
                          key1,
                          key2,
                          item.close_base,
                          item.close_quote
                        );

                        return {
                          x: index,
                          shadowH: rotate ? 1 / shadowH : shadowH,
                          shadowL: rotate ? 1 / shadowL : shadowL,
                          open: rotate ? 1 / open : open,
                          close: rotate ? 1 / close : close,
                          marker: item.key.open
                        };
                      }),
                      label: "aaa",
                      config: {
                        highlightColor: processColor("darkgray"),

                        shadowColor: processColor("black"),
                        shadowWidth: 1,
                        shadowColorSameAsCandle: true,
                        increasingColor: processColor("#71BD6A"),
                        increasingPaintStyle: "fill",
                        decreasingColor: processColor("#D14B5A")
                      }
                    }
                  ]
                },
          xAxis: {
            drawLabels: true,

            position: "BOTTOM",

            labelCount: 7,
            valueFormatter: obj.result.map(item => {
              let mmt = moment(item.key.open);
              return mmt.format("HH:mm");
              //mmt.format("MM D") + "/" + mmt.format("HH:mm");
            })
          },
          yAxis: {}
        };
        if (flip == true) {
          o.rotate = !this.state.rotate;
        }
        if (this.state.key1 === -1) {
          o.routestwo = [...this.state.routes];
          o.routes = [{ key: "first", title: "График" }];
        }
        this.setState(o);
      })
      .catch(error => {
        console.error(error);
      });
  };

  giveMeDateOneMoreTime = str => {
    let d;
    let date = moment(new Date());
    if (str === "6h") {
      d = date.subtract(6, "hours").format("YYYY-MM-DDTHH:mm:ss");
    } else if (str === "24h") {
      d = date.subtract(24, "hours").format("YYYY-MM-DDTHH:mm:ss");
    } else if (str === "1w") {
      d = date.subtract(7, "days").format("YYYY-MM-DDTHH:mm:ss");
    } else if (str === "1M") {
      d = date.subtract(1, "months").format("YYYY-MM-DDTHH:mm:ss");
    } else if (str === "3M") {
      d = date.subtract(3, "months").format("YYYY-MM-DDTHH:mm:ss");
    } else {
      console.log("Не то время!");
    }
    return d;
  };

  _renderScene = ({ route }) => {
    if (this.state.key1 != -1) {
      return (
        <View style={{ flex: 1 }}>
          <View
            style={{
              paddingLeft: 10,
              paddingRight: 10,
              flex: 0.1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 4,
              borderWidth: 3,
              borderColor: "#d6d7da"
            }}
          >
            <View style={{ flex: 1 }}>
              <Text>{this.state.selectedEntry}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{ alignSelf: "center", fontWeight: "400", fontSize: 16 }}
              >
                {this.state.price}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              {getColorPercent(this.state.percent, { alignSelf: "center" })}
            </View>
          </View>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
          />
          <View style={{ flex: 1, paddingRight: 5 }}>
            <CandleStickChart
              style={{
                flex: 1
              }}
              zoom={{
                pinchZoom: false,
                scaleX: 0,
                scaleY: 0,
                xValue: 0,
                yValue: 0,
                axisDependency: "RIGHT"
              }}
              data={this.state.data}
              marker={{
                enabled: false
              }}
              chartDescription={{ text: "" }}
              legend={this.state.legend}
              xAxis={this.state.xAxis}
              yAxis={{
                left: {
                  enabled: false
                },
                right: {
                  enabled: true
                }
              }}
              maxVisibleValueCount={16}
              autoScaleMinMaxEnabled={true}
              onSelect={this.handleSelect.bind(this)}
              ref="chart"
              onChange={event => {
                //console.log(event.nativeEvent.data.marker);
              }}
            />
            <View style={{ flex: 0, flexDirection: "row", padding: 5 }}>
              <Button
                onPress={() => this.buttonPress("6h")}
                title="6h"
                color={this.state.date === "6h" ? "red" : "black"}
              />
              <Button
                onPress={() => this.buttonPress("24h")}
                title="24h"
                color={this.state.date === "24h" ? "red" : "black"}
              />
              <Button
                onPress={() => this.buttonPress("1w")}
                title="1w"
                color={this.state.date === "1w" ? "red" : "black"}
              />
              <Button
                onPress={() => this.buttonPress("1M")}
                title="1M"
                color={this.state.date === "1M" ? "red" : "black"}
              />
              <Button
                onPress={() => this.buttonPress("3M")}
                title="3M"
                color={this.state.date === "3M" ? "red" : "black"}
              />
            </View>

            <View style={{ flex: 0, flexDirection: "row", padding: 5 }}>
              <Button
                disabled={
                  this.state.date === "1w" ||
                  this.state.date === "1M" ||
                  this.state.date === "3M"
                    ? true
                    : false
                }
                onPress={() => this.buttonPress(900)}
                title="15m"
                color={this.state.stick == 900 ? "red" : "black"}
              />
              <Button
                disabled={
                  this.state.date === "1M" || this.state.date === "3M"
                    ? true
                    : false
                }
                onPress={() => this.buttonPress(3600)}
                title="1h"
                color={this.state.stick == 3600 ? "red" : "black"}
              />
              <Button
                disabled={this.state.date === "3M" ? true : false}
                onPress={() => this.buttonPress(14400)}
                title="4h"
                color={this.state.stick == 14400 ? "red" : "black"}
              />
              <Button
                onPress={() => this.buttonPress(86400)}
                title="24h"
                color={this.state.stick == 86400 ? "red" : "black"}
              />
              <View style={{ flex: 0.5, paddingLeft: 20 }}>
                <Button
                  onPress={() =>
                    this.setState(() =>
                      this.buttonPress(
                        this.state.date,
                        this.state.key1,
                        this.state.key2,
                        true
                      )
                    )
                  }
                  title="flip"
                  color={"black"}
                />
              </View>
            </View>
          </View>
        </View>
      );
    }
    let qts = [...route.quotes];
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
                press={() =>
                  this.showTheChart("1.3." + route.key, "1.3." + item.key)
                }
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
          swipeEnabled={this.state.key1 != -1 ? false : true}
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
