
import React, { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Linking,
} from 'react-native';

import { buscarEspecificacoesCarro } from '../services/api';

export default function TesteGemini() {
  const [texto, setTexto] = useState('');
  const [fontes, setFontes] = useState([]);
  const [carregando, setCarregando] = useState(false);

  async function testar() {
    try {
      setCarregando(true);
      setTexto('');
      setFontes([]);

      const resultado = await buscarEspecificacoesCarro(
        'Ferrari',
        2026
      );

      setTexto(resultado.texto);
      setFontes(resultado.fontes);

    } catch (erro) {
      setTexto('Erro: ' + erro.message);

    } finally {
      setCarregando(false);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#101010' }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text
        style={{
          color: '#FFFFFF',
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20,
        }}
      >
        TESTE DE PESQUISA GEMINI
      </Text>

      <TouchableOpacity
        onPress={testar}
        style={{
          backgroundColor: '#E10600',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
          BUSCAR FERRARI 2026
        </Text>
      </TouchableOpacity>

      {carregando && (
        <ActivityIndicator
          size="large"
          color="#E10600"
          style={{ marginTop: 25 }}
        />
      )}

      {texto !== '' && (
        <View style={{ marginTop: 25 }}>
          <Text style={{ color: '#FFFFFF', lineHeight: 24 }}>
            {texto}
          </Text>

          <Text
            style={{
              color: '#E10600',
              fontSize: 20,
              fontWeight: 'bold',
              marginTop: 25,
              marginBottom: 10,
            }}
          >
            FONTES CONSULTADAS
          </Text>

          {fontes.map((fonte, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => Linking.openURL(fonte.url)}
              style={{ marginBottom: 12 }}
            >
              <Text style={{ color: '#64A9FF' }}>
                {fonte.titulo}
              </Text>

              <Text style={{ color: '#AAAAAA', fontSize: 12 }}>
                {fonte.url}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
