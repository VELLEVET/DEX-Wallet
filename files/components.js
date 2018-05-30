import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { appStyle } from "./styles.js";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";

const styles = StyleSheet.create(appStyle);

export class MyListItem extends Component {
  render() {
    let colorized = () => {
      let change = this.props.percent_change;
      if (change === "0%") {
        return (
          <Text style={{ color: "gray", fontSize: 14, alignSelf: "flex-end" }}>
            0.0%
          </Text>
        );
      } else if (change.includes("-")) {
        return (
          <Text style={{ color: "red", fontSize: 14, alignSelf: "flex-end" }}>
            {change}
          </Text>
        );
      } else {
        return (
          <Text style={{ color: "green", fontSize: 14, alignSelf: "flex-end" }}>
            +{change}
          </Text>
        );
      }
    };

    let title = this.props.title;

    titleSplitter = () => {
      if (title.includes(".")) {
        let tit = title.split(".");
        return (
          <View
            style={{
              flex: 2,
              flexDirection: "row",
              alignItems: "baseline",
              alignSelf: "stretch"
            }}
          >
            <Text
              style={{
                fontSize: 9
              }}
            >
              {tit[0]}
            </Text>
            <Text
              style={{
                fontWeight: "600",
                height: 18
              }}
            >
              .{tit[1]}
            </Text>
          </View>
        );
      } else {
        return (
          <View
            style={{
              flex: 2
            }}
          >
            <Text style={{ fontWeight: "600" }}>{title}</Text>
          </View>
        );
      }
    };

    return (
      <View style={styles.item}>
        <View
          style={{
            flex: 2
          }}
        >
          {titleSplitter(title)}
          <View style={{ alignSelf: "flex-start" }}>
            <Text style={{ fontSize: 10 }}>
              {new Date(this.props.time).toLocaleTimeString()}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 4,
            flexDirection: "row",
            justifyContent: "center"
          }}
        >
          <View
            style={{
              marginEnd: 10,
              flex: 1.5
            }}
          >
            <Text style={{ fontSize: 14, alignSelf: "flex-end" }}>
              {this.props.latest}
            </Text>
            {colorized()}
          </View>
          <View
            style={{
              flex: 1.2,

              marginEnd: 10
            }}
          >
            <Text style={{ fontSize: 14, alignSelf: "flex-end" }}>
              {this.props.quote_volume}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export class CustomMenu extends Component {
  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  render() {
    return (
      <View style={{ padding: 10 }}>
        <Menu
          ref={this.setMenuRef}
          button={
            <TouchableOpacity onPress={this.showMenu}>
              <Image
                style={{ width: 30, height: 30 }}
                source={require("../img/menu-icon.png")}
              />
            </TouchableOpacity>
          }
        >
          <MenuItem onPress={this.hideMenu}>Menu item 1</MenuItem>
          <MenuItem onPress={this.hideMenu}>Menu item 2</MenuItem>
          <MenuItem onPress={this.hideMenu} disabled>
            Bonus
          </MenuItem>
          <MenuDivider />
          <MenuItem onPress={this.hideMenu}>Menu item 4</MenuItem>
        </Menu>
      </View>
    );
  }
}

export class Footer extends Component {
  render() {
    return (
      <View style={styles.bottom_toolbar}>
        <Image
          style={{ width: 30, height: 30 }}
          source={require("../img/list.png")}
        />
        <Image
          style={{ width: 30, height: 30 }}
          source={require("../img/info.png")}
        />
      </View>
    );
  }
}

export class Loading extends Component {
  render() {
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
            color: "burlywood",
            fontSize: 45,
            fontWeight: "bold"
          }}
        >
          DEX Wallet
        </Text>
        <Text
          style={{
            color: "chocolate",
            fontSize: 45,
            fontWeight: "bold",
            position: "absolute",
            top: 295,
            right: 92
          }}
        >
          DEX Wallet
        </Text>
        <Text style={{ fontSize: 18 }}>loading...</Text>
      </View>
    );
  }
}
