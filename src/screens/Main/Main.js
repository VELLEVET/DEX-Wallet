import React, {Component} from "react";
import {FlatList, RefreshControl, StyleSheet, Text, View} from "react-native";
import {TabBar, TabViewAnimated} from "react-native-tab-view";
import {savedState} from "../../files/default_struct";
import {appStyle} from "../../files/styles";
import {CustomMenu, CustomModal, Loading, MyListItem, SortBar} from "../../components";
import {nFormatter, sortRouter} from "../../files/functions";
import {loc} from "../../files/locales";
import {objMap} from "../../files/objMap";
import moment from "moment";
import "moment/locale/ru";

import {changeTab, loadCoins, refresh} from '../../actions/coins'
import {connect} from "react-redux";

const styles = StyleSheet.create(appStyle);

let canJump = true;

type Props = {

};
type State = {
    index: number,
    modal:boolean
};

class Main extends Component<Props, State> {
    constructor(props:Props) {
        super(props);
    }
    static navigationOptions={
        header:null
    }
    state = {
        sort: 3,
        modalKey: -1,
        favorites: false,
        lang: "ru",
        modal: false,
        legend: {
            enabled: false
        },

    };

    static defaultProps = {
        coins:[],
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
        this.setState({ routes: routes, modal: false });
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
                            routes: this.props.routes
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
                            routes: this.state.routes
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
        this.props.loadCoins()

    }

    _handleChangeTab = index => {
        this.props.changeTab(index)
    };

    _renderHeader = props => {
        let req = require("../../files/img/starempty.png");
        if (this.state.favorites) {
            req = require("../../files/img/star.png");
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


    sortTab = id => {
        return this.setState(
            this.state.sort == id ? { sort: id + 100 } : { sort: id }
        );
    };



    _onRefresh() {
        this.props.refresh()
    }

    showTheChart = (key1, key2) => {
        console.log('main', key1, key2)
        this.props.navigation.navigate('CoinDetail', { key1, key2 })
    };




    _renderScene = ({ route }) => {
        console.log('_renderScene', route)


        let qts = this.props.coinsByKey[route.key]?this.props.coinsByKey[route.key]:[];

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
                            refreshing={this.props.refreshing}
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
        if (this.props.loading) {
            return <Loading />;
        } else {
            return (
                <TabViewAnimated
                    swipeEnabled={ true}
                    canJumpToTab={this.canJumpToTab}
                    style={styles.container}
                    navigationState={this.props}
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


const mapStateToProps = (state) => {
    return {
        routes: state.coins.routes,
        coins: state.coins.coins,
        coinsByKey: state.coins.coinsByKey,
        index: state.coins.index,
        loading: state.coins.loading,
    }
};

export default connect(mapStateToProps, {loadCoins, changeTab, refresh})(Main)