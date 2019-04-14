import React , { Component } from 'react';
import { View, StyleSheet, Linking} from "react-native";
import { Button, Icon } from "react-native-elements";
import firebase from "./Firebase";
import { Updates } from 'expo';
//import { ExpoConfigView } from '@expo/samples';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
  };
  async logout() {
    firebase
      .auth()
      .signOut()
      .then(
        //this.props.navigation.goBack()
       //Expo.Util.reload()
       Updates.reload()
      )
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
  //  return <ExpoConfigView />;
  return(
    <View style={styles.Hola}>
                <Button
                title="Cerrar Sesion, YEAH!gi"
                onPress={() => this.logout()}
                icon={
                    <Icon
                    name="md-arrow-round-back"
                    type="ionicon"
                    size={
                        30 //titleStyle={{ fontWeight: "bold" }}
                    }
                    color="white"
                    
                    />
                }
                buttonStyle={
                    {
                    backgroundColor: "#CB4335",
                    width: 250,
                    height: 45,
                    borderRadius: 50
                    } //borderWidth: 0, //borderColor: "transparent",
                }
                />
            </View>

  )

  }
}

const styles = StyleSheet.create({
  Hola: {
    flex: 1,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        backgroundColor: "white",
  },

});