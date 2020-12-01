import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  ToastAndroid
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import firebase from 'firebase';
import db from '../config';

export default class ReadStoryScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      hasCameraPermissions: null,
      scanned: false,
      scannedBookId: '',
      scannedStudentId: '',
      buttonState: 'normal',
      transactionMessage: '',
    };
  }

  getCameraPermissions = async (id) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({
      /*status === "granted" is true when user has granted permission
        status === "granted" is false when user has not granted the permission
      */
      hasCameraPermissions: status === 'granted',
      buttonState: id,
      scanned: false,
    });
  };

  handleBarCodeScanned = async ({ type, data }) => {
    const { buttonState } = this.state;

    if (buttonState === 'BookId') {
      this.setState({
        scanned: true,
        scannedBookId: data,
        buttonState: 'normal',
      });
    } else if (buttonState === 'StudentId') {
      this.setState({
        scanned: true,
        scannedStudentId: data,
        buttonState: 'normal',
      });
    }
  };


    

    

  initiateREadStory = async () => {
    //add a transaction
    db.collection('transactions').add({
      studentId: this.state.scannedReadStory,
      bookId: this.state.scannedWriteStory,
      date: firebase.firestore.Timestamp.now().toDate(),
      transactionType: 'Return',
    });

    


    this.setState({
      transactionMessage: transactionMessage,
    });
  };

  render() {
    const hasCameraPermissions = this.state.hasCameraPermissions;
    const scanned = this.state.scanned;
    const buttonState = this.state.buttonState;

    if (buttonState !== 'normal' && hasCameraPermissions) {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    } else if (buttonState === 'normal') {
      return (
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        
          <View>
            <Image
              source={require('../assets/booklogo.jpg')}
              style={{ width: 200, height: 200 }}
            />
            <Text style={{ textAlign: 'center', fontSize: 30 }}>Wily</Text>
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputBox}
              placeholder="ReadStory"
              onChangeText={text=>this.setState({scannedReadStory:text})}
              value={this.state.scannedReadtory}
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => {
                this.getCameraPermissions('ReadStory');
              }}>
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputBox}
              placeholder="Read Story"
              onChangeText={text=>this.setState({scannedReadStory:text})}
              value={this.state.scannedReadStory}
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => {
                this.getCameraPermissions('ReadStory');
              }}>
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.transactionAlert}>
            {this.state.transactionMessage}
          </Text>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={this.submitStory}
            onPress={async () => {
              var transactionMessage = await this.handleTransaction();
            }}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
      </KeyboardAvoidingView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayText: {
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  buttonText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
  },
  inputView: {
    flexDirection: 'row',
    margin: 20,
  },
  inputBox: {
    width: 200,
    height: 40,
    borderWidth: 1.5,
    borderRightWidth: 0,
    fontSize: 20,
  },
  scanButton: {
    backgroundColor: 'lightblue',
    width: 50,
    borderWidth: 1.5,
    borderLeftWidth: 0,
  },
  submitButton: { backgroundColor: '#FBC02D', width: 100, height: 50 },
  submitButtonText: {
    padding: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});
