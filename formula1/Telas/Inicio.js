
import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
} from 'react-native';

import f1 from '../assets/f1.jpg'
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Inicio() {
  return (
    <ImageBackground
  source={f1}
  style={{
    flex: 1,
    width: '100%',
    height: '100%',
  }}
  resizeMode="cover"
>
  <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.conteudo}>
      
    </View>
  </SafeAreaView>
</ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
  },

  conteudo: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 25,
  },

  infoCorridas: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 220,
    alignItems: 'center',
  },

  texto: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },

  erro: {
    color: '#FF5555',
    fontSize: 13,
    textAlign: 'center',
  },
});
