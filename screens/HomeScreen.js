import React, { Component } from 'react';
import { Header, Input, Button, Icon, Text, Overlay } from "react-native-elements";
import { View, StyleSheet, SafeAreaView, Image, Picker,
  Alert, DatePickerAndroid, ActivityIndicator, TouchableWithoutFeedback
} from "react-native";
import { BarCodeScanner, Permissions } from "expo";
import firebase, { fireStoreDataBase } from "./Firebase";

export default class HomeScreen extends React.Component {
  constructor() {
    super();
    console.ignoredYellowBox = ['Setting a timer'];
  }
  static navigationOptions = {
    header: null
  };

  state = {
    isVisible: false,
    hasCameraPermission: null,
    TextCodBarras: "Escanear Código",
    TextName: "Detalle Producto",
    InputCantidad: 0,
    InputEan: 0,
    InputUbicacion: "",
    spinnerText: null,
    spinnerDate: null,
    isCorrect: false,
    isCargando: false,
    PlazoRetiro: 0
  };

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === "granted"
    });
  };

_handleBarCodeRead = data => {
  this.setState({
    isVisible: false,
    TextCodBarras: data.data,
    isCargando: true
  });
  console.log(data.data);
  fireStoreDataBase
  .collection("Productos")
  .doc(data.data)
  .get()
  .then(doc => {
    if (doc.exists) {
      console.log("Document data:", doc.data());
      this.setState({
        TextName: doc.data().PRODUCTO,
        PlazoRetiro: doc.data().PLAZORETIRO,
        isCorrect: true,
        isCargando: false
      });
    } else {
      console.log("No such document!");
      this.setState({
        TextName: "PRODUCTO NO REGISTRADO",
        isCorrect: false,
        isCargando: false
      });
    }
  })
  .catch(error => {
    console.log("Error getting document:", error);
    this.setState({
      TextName: "ERROR AL BUSCAR",
      isCorrect: false,
      isCargando: false
    });
  });
};

  Barcode() {
    this.setState({ isVisible: true });
    this._requestCameraPermission();
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Overlay
          isVisible = {this.state.isVisible}
          overlayBackgroundColor = "rgba(0, 0, 0, .4)"
          width = "100%"
          height = "100%"
          onBackdropPress = {() =>
            this.setState(
              { isVisible: false}
            )
          }
          overlayStyle = {
            { flex: 1, alignItems: "center", justifyContent: "center"}
          }
        >
        {this.state.hasCameraPermission === null ?(
          <Text>Requesting for camera permission</Text>
        ) : this.state.hasCameraPermission === false ? (
          <Text>Camera permission is not granted</Text>
        ) : (
          <BarCodeScanner
            onBarCodeRead = {this._handleBarCodeRead.bind(this)}
            style = {{ height: "100%", width:"100%"}}
          >
          </BarCodeScanner>
        )}          
        </Overlay>
        
        <Header
          statusBarProps={{
            backgroundColor: "#ffffff",
            barStyle: "dark-content"
          }}
          barStyle="dark-content"
          centerComponent={
            <Image
              resizeMode="contain"
              style={{ width: 150 }}
              source={require("../assets/images/0.png")}
            />
          }
          containerStyle={{
            backgroundColor: "#ffffff",
            justifyContent: "space-around"
          }}>
        </Header>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
            borderTopColor: "#E2E03E",
            borderTopWidth: 3,
            elevation: 0.5
          }}
        >
          {/* icono y texto de  ESCANEAR CODIGO */}
          <TouchableWithoutFeedback onPress={() => this.Barcode()}>
            <View style={styles.container}>
              <Icon
                reverse
                name="ios-qr-scanner"
                type="ionicon"
                color="#5fa62c"
              />
              <Text h4 style={{ fontWeight: "normal" }}>
                {this.state.TextCodBarras}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          {/* FIN icono y texto de  ESCANEAR CODIGO */}

          {(this.state.isCargando && <View style={styles.container} />) ||
            (<View style={[styles.container, { paddingHorizontal: 10 }]}>
              <Text h4 style={{ textAlign: "center" }}>
                {this.state.TextName}
              </Text>
            </View>
            )}
        
        { this.state.isCargando ? (
          <View style  = {styles.container} />
        ) : (
          <View style={styles.container}>
            <View style={{ flex: 2, alignItems: "center" }}>
            {this.state.isCorrect ? (
              <Icon
                reverse
                name="md-pricetags"
                type="ionicon"
                color="#5FA62C"
              >
              </Icon>
            ) : (
                <Icon
                  reverse
                  name="md-pricetags"
                  type="ionicon"
                  color="#c6c6c6"
                >
                </Icon>
              )}
          </View>
            <View style={{ flex: 5, paddingRight: 5 }}>
            {this.state.isCorrect ? (
              <Input
                onChangeText={cantidad =>
                  this.setState(
                    { InputEan: parseInt(ean) }
                  )
                }
                placeholder="Cantidad"
                keyboardType="numeric"
                inputContainerStyle={{
                  height: 800,
                  borderBottomColor: "rgba(220,220,220,.6)"
                }}
                errorStyle={{ color: "red" }}
              >
              </Input>
            ) : (
                <Input
                  editable={false}
                  placeholder="Cantidad"
                  inputContainerStyle={{ height: 800 }}
                >
                </Input>
              )}
          </View>
          </View>
        )}
        
        <View style={styles.container}>
          <View style={{ flex: 2, alignItems: "center" }}>
            {this.state.isCorrect ? (
              <Icon
                reverse
                name="md-pricetags"
                type="ionicon"
                color="#5FA62C"
              >
              </Icon>
            ) : (
                <Icon
                  reverse
                  name="md-pricetags"
                  type="ionicon"
                  color="#c6c6c6"
                >
                </Icon>
              )}
          </View>
          <View style={{ flex: 5, paddingRight: 5 }}>
            {this.state.isCorrect ? (
              <Input
                onChangeText={cantidad =>
                  this.setState(
                    { InputEan: parseInt(ean) }
                  )
                }
                placeholder="Cantidad"
                keyboardType="numeric"
                inputContainerStyle={{
                  height: 800,
                  borderBottomColor: "rgba(220,220,220,.6)"
                }}
                errorStyle={{ color: "red" }}
              >
              </Input>
            ) : (
                <Input
                  editable={false}
                  placeholder="Cantidad"
                  inputContainerStyle={{ height: 800 }}
                >
                </Input>
              )}
          </View>
        </View>
        <View style={styles.container}>
          <View style={{ flex: 2, alignItems: "center" }}>
            {this.state.isCorrect ? (
              <Icon
                reverse
                name="md-pricetags"
                type="ionicon"
                color="#5FA62C"
              >
              </Icon>
            ) : (
                <Icon
                  reverse
                  name="md-pricetags"
                  type="ionicon"
                  color="#c6c6c6"
                >
                </Icon>
              )}
          </View>
          <View style={{ flex: 5, paddingRight: 5 }}>
            {this.state.isCorrect ? (
              <Input
                onChangeText={cantidad =>
                  this.setState(
                    { InputEan: parseInt(ean) }
                  )
                }
                placeholder="Cantidad"
                keyboardType="numeric"
                inputContainerStyle={{
                  height: 800,
                  borderBottomColor: "rgba(220,220,220,.6)"
                }}
                errorStyle={{ color: "red" }}
              >
              </Input>
            ) : (
                <Input
                  editable={false}
                  placeholder="Cantidad"
                  inputContainerStyle={{ height: 800 }}
                >
                </Input>
              )}
          </View>
        </View>
        <View style={styles.container}>
          {this.state.isCorrect ? (
            <Button
              title="Guardar"
              onPress={() => this.GuardarData()}
              icon={
                <Icon
                  name="md-cloud-upload"
                  type="ionicon"
                  size={
                    30 //titleStyle={{ fontWeight: "bold" }}
                  }
                  color="white"
                />
              }
              buttonStyle={
                {
                  backgroundColor: "rgba(95, 162,44, 1)",
                  width: 300,
                  height: 45,
                  borderRadius: 50
                } //borderWidth: 0, //borderColor: "transparent",
              }
            />
          ) : (
              <Button
                title="Guardar"
                disabled={true}
                icon={
                  <Icon
                    name="md-cloud-upload"
                    type="ionicon"
                    size={
                      30 //titleStyle={{ fontWeight: "bold" }}
                    }
                    color="white"
                  />
                }
                buttonStyle={
                  {
                    backgroundColor: "rgba(198, 198,198, 1)",
                    width: 300,
                    height: 45,
                    borderRadius: 50
                  } //borderWidth: 0, //borderColor: "transparent",
                }
              />
            )}
        </View>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "white"
  }
});