import React, { Component } from "react";
import { Image, ImageBackground, KeyboardAvoidingView,
   StyleSheet, ToastAndroid, View } from "react-native";
import { Button, CheckBox, Input } from "react-native-elements"

import firebase from './Firebase';

class LoginScreen extends Component {
    constructor() {
        super();
        console.ignoredYellowBox = ['Setting a timer'];
    }

    state = {
        email: '',
        password: '',
        security: true,
        _checkbox: false
    };

    async loginUser (email, password) {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => this.props.navigation.navigate('Main'))
        .catch((error) =>{
            var message = 'No es posible conectar con Firebase'
            if (error.code == 'auth/invalid-email') {
                message = 'Direccion de correo electrónico inválido';
            } else if (error.code == 'auth/user-disabled'){
                message = 'Direccion de correo electronico inhabilitada';
            } else if (error.code == 'auth/user-not-found'){
                message = 'Direccion de correo electronico inexistente';
            } else if (error.code == 'auth/wrong-password'){
                mesaage = 'Constraseña incorrecta';
            }
            ToastAndroid.show(message, ToastAndroid.SHORT);
        });
    }

    render(){
        return(
            <KeyboardAvoidingView style={styles.flex} behavior="padding" enabled>
              <ImageBackground
                source = { require('../assets/images/login-1.png')}
                style = { styles.flex}
              >
                <View style = {[styles.flex, styles.section]}>
                    <Input
                    inputContainerStyle={styles.input_container_style}
                    inputStyle={styles.input_style}
                    onChangeText={ email => this.setState({ email: email}) }
                    placeholder='Usuario'
                    shake
                    />
                    <Input
                    inputContainerStyle={styles.input_container_style}
                    inputStyle={styles.input_style}
                    onChangeText={ password => this.setState({ password: password}) }
                    placeholder='Contraseña'
                    secureTextEntry={this.state.security}
                    />          
                    <CheckBox
                    checked={this.state._checkbox}
                    containerStyle={styles.checkbox_container_style}
                    textStyle={styles.checkbox_text}
                    title='Mostrar contraseña'
                    onPress={() => this.setState ({
                        security: !this.state.security,
                        _checkbox: !this.state._checkbox
                    })}
                    />
                    <Button 
                    buttonStyle={styles.button_style}
                    onPress={ () => this.loginUser(this.state.email, this.state.password) }
                    title="CONTINUAR"
                    />     
                </View>
              </ImageBackground>
            </KeyboardAvoidingView>    
        );
    }
}
export default LoginScreen;

const styles = StyleSheet.create({
    flex: {
      flex: 1
    },
    logo: {
      height: 100,
      width: 100,
      alignSelf: 'center'
    },
    section: {
      alignItems: 'stretch',
      justifyContent: 'center',
      paddingHorizontal: 40
    }, 
    input_container_style: {
      marginTop: 25,
      borderBottomColor: 'rgba(220,220, 220, .6)'
    },
    input_style: {
      color: 'rgba(100, 100, 100, 1)',
      fontSize: 14
    },
    checkbox_container_style: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      marginBottom: 20,
      marginLeft: 0,
      marginRight: 0
    }, 
    checkbox_text: {
      color: 'rgba(150, 150, 150, .9)',
      fontStyle: 'italic',
      fontSize: 12
    },
    button_style: {
      alignContent: 'stretch',
      backgroundColor: 'green',
      paddingVertical: 4
    }
  });
  