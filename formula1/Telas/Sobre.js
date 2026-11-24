import React from "react";
import {View,Text, StyleSheet} from 'react-native';

export default function Sobre(){
    return(
    <View style={styles.container}>
        <Text style={styles.titulo}>Sobre o F1 HUB</Text>
        <Text style={styles.subtitulo}>O F1 HUB é um aplicativo desenvolvido para reunir
        informações sobre o universo da Fórmula 1.</Text>

        <Text style={styles.texto}>
            Acompanhe pilotos, equipes, Grandes Prêmios,
        campeonatos e muito mais.
        </Text>
        <Text style={styles.versao}>Versão 1.0</Text>
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  titulo: {
    color: '#E10600',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  texto: {
    color: '#CCCCCC',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 23,
  },
  versao: {
    color: '#777777',
    marginTop: 25,
  },
});