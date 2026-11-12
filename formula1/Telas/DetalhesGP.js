
import React from 'react';

import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetalhesGP({ route }) {
  const gp = route.params.gp;

  function formatarData(data) {
    if (!data) {
      return 'Não disponível';
    }

    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  return (
    <SafeAreaView style={estilos.container}>
      <ScrollView>
        <Text style={estilos.titulo}>
          {gp.meeting_name}
        </Text>

        {gp.circuit_image ? (
          <Image
            source={{ uri: gp.circuit_image }}
            style={estilos.imagem}
            resizeMode="cover"
          />
        ) : (
          <View style={estilos.semImagem}>
            <Text style={estilos.textoSemImagem}>
              Imagem não disponível
            </Text>
          </View>
        )}

        <View style={estilos.conteudo}>
          <Text style={estilos.nomeCircuito}>
            {gp.circuit_short_name}
          </Text>

          <View style={estilos.linha}>
            <Text style={estilos.rotulo}>País</Text>
            <Text style={estilos.informacao}>
              {gp.country_name || 'Não disponível'}
            </Text>
          </View>

          <View style={estilos.linha}>
            <Text style={estilos.rotulo}>Cidade</Text>
            <Text style={estilos.informacao}>
              {gp.location || 'Não disponível'}
            </Text>
          </View>

          <View style={estilos.linha}>
            <Text style={estilos.rotulo}>Início</Text>
            <Text style={estilos.informacao}>
              {formatarData(gp.date_start)}
            </Text>
          </View>

          <View style={estilos.linha}>
            <Text style={estilos.rotulo}>Término</Text>
            <Text style={estilos.informacao}>
              {formatarData(gp.date_end)}
            </Text>
          </View>

          <Text style={estilos.tituloSecao}>
            Sobre o Grande Prêmio
          </Text>

          <Text style={estilos.descricao}>
            {gp.meeting_official_name || gp.meeting_name}
          </Text>

          <Text style={estilos.ano}>
            Temporada: {gp.year}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
  },

  titulo: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
    padding: 18,
  },

  imagem: {
    width: '100%',
    height: 220,
    backgroundColor: '#303030',
  },

  semImagem: {
    height: 180,
    backgroundColor: '#242424',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textoSemImagem: {
    color: '#aaa',
  },

  conteudo: {
    padding: 20,
  },

  nomeCircuito: {
    color: '#E10600',
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  linha: {
    marginBottom: 16,
  },

  rotulo: {
    color: '#888',
    fontSize: 13,
    marginBottom: 4,
  },

  informacao: {
    color: '#fff',
    fontSize: 16,
  },

  tituloSecao: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },

  descricao: {
    color: '#aaa',
    fontSize: 15,
    lineHeight: 23,
  },

  ano: {
    color: '#E10600',
    fontSize: 14,
    marginTop: 25,
    fontWeight: 'bold',
  },
});
