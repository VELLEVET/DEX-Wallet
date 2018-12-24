import React, {Component} from "react";
import {Button, processColor, RefreshControl, ScrollView, StyleSheet, Text, View} from "react-native";
import {TabBar, TabViewAnimated} from "react-native-tab-view";
import {defaultRoute} from "../../files/default_struct";
import {appStyle} from "../../files/styles";
import {CustomMenu, CustomModal} from "../../components";
import {fetcher, formula, getColorPercent} from "../../files/functions";
import {loc} from "../../files/locales";
import {objMap} from "../../files/objMap";
import {CandleStickChart} from "react-native-charts-wrapper";
import moment from "moment";
import "moment/locale/ru";

import {loadCoins} from '../../actions/coins'
import {connect} from "react-redux";

const styles = StyleSheet.create(appStyle);

let canJump = true;

type Props = {};
type State = {
    index: number,
    modal: boolean
};

class CoinDetail extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    static navigationOptions = {
        header: null
    }
    state = {
        canShow:false,
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
        rotate: false,
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
                        {
                            shadowH: 0.089,
                            shadowL: 0.092,
                            open: 0.089,
                            close: 0.092
                        },
                        {
                            shadowH: 0.091,
                            shadowL: 0.094,
                            open: 0.091,
                            close: 0.094
                        }
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

    static defaultProps = {
        coins: [],
        loading: true,
        refreshing: false,

    };

    changeFav(key) {
        let routes = [...this.state.routes];
        let quote = routes[this.state.index].quotes;
        let i = quote.find(item => item.key === key);
        if (i != undefined) {
            i.favorite = !i.favorite;
        }
        this.setState({routes: routes, modal: false});
    }

    openModal(item) {
        if (item === "lang") {
            this.modalParam.objects = [
                {
                    text: "Русский",
                    func: () => {
                        moment.locale("ru");
                        this.setState({
                            lang: "ru",
                            modal: false,
                            routes: [{key: "first", title: "График"}]
                        });
                    }
                },
                {
                    text: "English",
                    func: () => {
                        moment.locale("en");
                        this.setState({
                            lang: "en",
                            modal: false,
                            routes: [{key: "first", title: "Chart"}]
                        });
                    }
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
        this.setState({modal: true});
    }

    modalParam = {
        key: -1,
        objects: []
    };

    async componentDidMount() {
        console.log('detail',this.param)
        const key1 = this.props.navigation.getParam('key1', 'NO-ID');
        const key2 = this.props.navigation.getParam('key2', 'NO-ID');

        console.log('detail',key1,key2)
        await  this.buttonPress(3600, key1, key2, true);
        fetcher(1, "get_ticker", [key1, key2]).then(item => {
            console.log(item)
            this.setState({
                percent: item.result.percent_change,
                price: Number(item.result.latest).toFixed(
                    // objMap[key1].precision
                    objMap[key1.substr(4)].precision
                ),
                rotate: false,
                canShow:true
            });
            console.log('fff')
        });
    }

    _handleChangeTab = index => {
        this.setState({index});
    };

    _renderHeader = props => {
        let req = require("../../files/img/starempty.png");
        if (this.state.favorites) {
            req = require("../../files/img/star.png");
        }
        let reqswap = require("../../files/img/swap.png");
        return (
            <View style={{flex: 0}}>
                <View style={styles.toolbar}>
                    <View
                        style={{
                            padding: 10,
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    >
                        <Button
                            title={loc[this.state.lang].back}
                            onPress={() =>this.props.navigation.goBack()

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
                            {/*{objMap[this.state.key2.substr(4)].symbol +*/}
                            {/*" - " +*/}
                            {/*objMap[this.state.key1.substr(4)].symbol}*/}
                        </Text>
                    </View>
                    <CustomMenu
                        donateUs={loc[this.state.lang].donateUs}
                        langtext={loc[this.state.lang].lang}
                        langmenu={() => {
                            this.openModal("lang");
                        }}
                        func={() => this.updateChart(true)}
                        star={reqswap}
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

    };

    updateChart = (flip = false) => {
        let keyy1 = this.state.key1;
        let keyy2 = this.state.key2;
        if (flip) {
            keyy1 = this.state.key2;
            keyy2 = this.state.key1;
        }
        this.buttonPress(this.state.stick, keyy1, keyy2);
        fetcher(1, "get_ticker", [keyy1, keyy2]).then(item => {
            this.setState({
                percent: item.result.percent_change,
                price: Number(item.result.latest).toFixed(
                    objMap[keyy1.substr(4)].precision
                ),
                refreshing: false
            });
        });
    };



    _onRefresh() {
        this.setState({refreshing: true});
        this.updateChart();
    }

    handleSelect(event) {
        let entry = event.nativeEvent;
        if (entry == null || entry.data === undefined) {
            this.setState({selectedEntry: null});
        } else {
            let mmt = moment(entry.data.marker);
            this.setState({selectedEntry: mmt.format("MMM D, HH:mm")});
        }
    }

    buttonPress = async (id,
                         key1 = this.state.key1,
                         key2 = this.state.key2,
                         first = false) => {
        let date = moment(new Date());
        let currentDate = date.format("YYYY-MM-DDTHH:mm:ss");
        let difDate;
        let str;
        let stick;
        console.log("button press input: key1-" + key1 + ", key2-" + key2);
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
                                        values: obj.result.map(item => {
                                            let rotate = false;
                                            let key11 = key1;
                                            let key22 = key2;
                                            if (obj.result[0].key.base !== key1) {
                                                key11 = key2;
                                                key22 = key1;
                                                rotate = true;
                                            }

                                            let shadowH = formula(
                                                key11,
                                                key22,
                                                item.high_base,
                                                item.high_quote
                                            );
                                            let shadowL = formula(
                                                key11,
                                                key22,
                                                item.low_base,
                                                item.low_quote
                                            );
                                            let open = formula(
                                                key11,
                                                key22,
                                                item.open_base,
                                                item.open_quote
                                            );

                                            let close = formula(
                                                key11,
                                                key22,
                                                item.close_base,
                                                item.close_quote
                                            );

                                            return {
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
                                            axisDependency: "RIGHT",
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
                    yAxis: {
                        left: {
                            enabled: false
                        }
                    }
                };

                if (this.state.key1 === -1) {
                    o.routestwo = [...this.state.routes];
                    o.routes = [{key: "first", title: loc[this.state.lang].chart}];
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

    _renderScene = ({route}) => (
        <View style={{flex: 1}}>
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
                <View style={{flex: 1}}>
                    <Text>{this.state.selectedEntry}</Text>
                </View>
                <View style={{flex: 1}}>
                    <Text
                        style={{alignSelf: "center", fontWeight: "400", fontSize: 16}}
                    >
                        {this.state.price}
                    </Text>
                </View>
                <View style={{flex: 1}}>
                    {getColorPercent(this.state.percent, {alignSelf: "center"})}
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
            <View style={{flex: 1}}>
                <CandleStickChart
                    style={{
                        flex: 1
                    }}
                    data={this.state.data}
                    marker={{
                        enabled: false
                    }}
                    chartDescription={{text: ""}}
                    legend={this.state.legend}
                    xAxis={this.state.xAxis}
                    yAxis={this.state.yAxis}
                    maxVisibleValueCount={0}
                    autoScaleMinMaxEnabled={true}
                    onSelect={this.handleSelect.bind(this)}
                    ref="chart"
                    onChange={event => {
                        //console.log(event.nativeEvent.data.marker);
                    }}
                />
                <View style={{flex: 0, flexDirection: "row", padding: 5}}>
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

                <View style={{flex: 0, flexDirection: "row", padding: 5}}>
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
                </View>
            </View>
        </View>
    );





    renderScreen() {
        return (
            <TabViewAnimated
                swipeEnabled={false}
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

    canJumpToTab(route) {
        return canJump;
    }

    render() {
        console.log("loading", this.state.loading);
        console.log("state", this.state);
        console.log("props", this.props);
        return (
            <View style={styles.maincontainer}>
                <CustomModal
                    on={this.state.modal}
                    dim={() => this.setState({modal: false})}
                    objects={this.modalParam.objects}
                />
                {this.state.canShow&&this.renderScreen()}
            </View>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        coins: state.coins.coins,
        loading: state.coins.loading,
    }
};

export default connect(mapStateToProps, {loadCoins})(CoinDetail)