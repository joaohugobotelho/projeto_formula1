import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

const Pilotos = () => {
  const [pilotos, setPilotos] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);


  useEffect(() => {
  const buscarPilotos = async () => {
    console.log('Iniciando busca de sessões...');

    try {
      setCarregando(true);
      setErro(null);

      const respostaSessoes = await fetch(
        'https://api.openf1.org/v1/sessions?meeting_key=1299'
      );

      console.log('Resposta recebida:', respostaSessoes.status);

      if (!respostaSessoes.ok) {
        throw new Error('Erro ao buscar sessões');
      }

      const sessoes = await respostaSessoes.json();

      const sessaoCorrida = sessoes.find(
        (sessao) => sessao.session_name === 'Race'
      );
       if (!sessaoCorrida) {
        throw new Error('Sessão de corrida não encontrada');
      }

      const respostaPilotos = await fetch (
        `https://api.openf1.org/v1/drivers?session_key=${sessaoCorrida.session_key}`
      )
      if (!respostaPilotos.ok) {
        throw new Error('erro ao buscar piloto')
      }

      const dadosPilotos = await respostaPilotos.json();

      setPilotos(dadosPilotos);
      console.log('pilotos recebidos', dadosPilotos);

      console.log('Sessão encontrada:', sessaoCorrida);
      console.log('Chave da sessão:', sessaoCorrida.session_key);

    } catch (error) {
      setErro(error.message);
      console.log('Erro:', error.message);
    } finally {
      setCarregando(false);
    }
  };

  buscarPilotos();
}, []);


  return (
    <SafeAreaView style={styles.container}>
    <Text style={styles.titulo}>Pilotos da Fórmula 1</Text>

    <FlatList data={pilotos} keyExtractor={(item)=> String(item.driver_number)} renderItem={({item})=>(
    <View>
      <Text>{item.full_name}</Text>
      <Text>{item.team_name}</Text>
      <Text>Número: {item.driver_number}</Text>
    </View>
  )}
  />
  </SafeAreaView>
  )
};

export default Pilotos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#101827',
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
});
