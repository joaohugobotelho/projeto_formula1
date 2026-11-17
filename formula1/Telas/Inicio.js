
import React, { useState, useEffect } from 'react';
// a
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function Inicio() {

  const [corridas, setCorridas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function buscarCorridas() {
      try {
        setCarregando(true);
        setErro('');

        const resposta = await fetch(
          'https://api.openf1.org/v1/meetings?year=2026'
        );

        if (!resposta.ok) {
          throw new Error('Erro ao buscar os Grandes Prêmios.');
        }

        const dados = await resposta.json();

        setCorridas(dados);

      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    buscarCorridas();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.conteudo}>

        <Text style={styles.titulo}>
          PROJETO F1
        </Text>

        <Text style={styles.subtitulo}>
          Seu mundo da Fórmula 1.
        </Text>

        {carregando ? (
          <ActivityIndicator size="large" color="#E10600" />
        ) : erro ? (
          <Text style={styles.erro}>{erro}</Text>
        ) : (
          <Text style={styles.texto}>
            Grandes Prêmios encontrados: {corridas.length}
          </Text>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
  },

  conteudo: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titulo: {
    color: '#E10600',
    fontSize: 32,
    fontWeight: 'bold',
  },

  subtitulo: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 30,
  },

  texto: {
    color: '#FFFFFF',
    fontSize: 16,
  },

  erro: {
    color: '#FF5555',
    fontSize: 15,
  },
});
