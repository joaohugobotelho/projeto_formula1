
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFavoritos } from '../context/FavoritosContext';

export default function Favoritos({ navigation }) {
  const { favoritos, alternarFavorito } = useFavoritos();

  const [categoria, setCategoria] = useState('pilotos');
  const [pesquisa, setPesquisa] = useState('');

  const lista = favoritos[categoria] || [];

  const listaFiltrada = lista.filter((item) => {
    const termo = pesquisa.toLowerCase();

    if (categoria === 'pilotos') {
      return (
        item.full_name?.toLowerCase().includes(termo) ||
        item.team_name?.toLowerCase().includes(termo) ||
        item.country_code?.toLowerCase().includes(termo)
      );
    }

    return (
      item.meeting_name?.toLowerCase().includes(termo) ||
      item.circuit_short_name?.toLowerCase().includes(termo) ||
      item.location?.toLowerCase().includes(termo) ||
      item.country_name?.toLowerCase().includes(termo)
    );
  });

  function mostrarFavorito({ item }) {
    const ehPiloto = categoria === 'pilotos';

    return (
      <View style={styles.card}>
        {ehPiloto ? (
          item.headshot_url ? (
            <Image
              source={{ uri: item.headshot_url }}
              style={styles.imagemPiloto}
            />
          ) : (
            <View style={styles.imagemVazia}>
              <Ionicons name="person" size={35} color="#777" />
            </View>
          )
        ) : item.circuit_image ? (
          <Image
            source={{ uri: item.circuit_image }}
            style={styles.imagemCircuito}
          />
        ) : null}

        <View style={styles.informacoes}>
          <Text style={styles.nome}>
            {ehPiloto ? item.full_name : item.meeting_name}
          </Text>

          <Text style={styles.detalhe}>
            {ehPiloto
              ? item.team_name
              : item.circuit_short_name || item.location}
          </Text>

          <Text style={styles.detalhe}>
            {ehPiloto
              ? `Número: ${item.driver_number}`
              : `${item.location || ''} - ${item.country_name || ''}`}
          </Text>

          <TouchableOpacity
            onPress={() => {
              if (ehPiloto) {
                navigation.navigate('DetalhesPiloto', {
                  piloto: item,
                });
              } else {
                navigation.navigate('DetalhesGP', {
                  gp: item,
                });
              }
            }}
          >
            <Text style={styles.verDetalhes}>
              VER DETALHES →
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.botaoCoracao}
          onPress={() => alternarFavorito(categoria, item)}
        >
          <Ionicons name="heart" size={25} color="#E10600" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>MEUS FAVORITOS</Text>

      <Text style={styles.subtitulo}>
        Seus pilotos e circuitos preferidos
      </Text>

      <View style={styles.categorias}>
        <TouchableOpacity
          style={[
            styles.botaoCategoria,
            categoria === 'pilotos' && styles.categoriaAtiva,
          ]}
          onPress={() => {
            setCategoria('pilotos');
            setPesquisa('');
          }}
        >
          <Ionicons
            name="person"
            size={17}
            color="#FFFFFF"
          />
          <Text style={styles.textoCategoria}>Pilotos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.botaoCategoria,
            categoria === 'circuitos' && styles.categoriaAtiva,
          ]}
          onPress={() => {
            setCategoria('circuitos');
            setPesquisa('');
          }}
        >
          <Ionicons
            name="flag"
            size={17}
            color="#FFFFFF"
          />
          <Text style={styles.textoCategoria}>Circuitos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.areaPesquisa}>
        <Ionicons name="search" size={20} color="#888" />

        <TextInput
          style={styles.inputPesquisa}
          placeholder={
            categoria === 'pilotos'
              ? 'Pesquisar piloto...'
              : 'Pesquisar circuito...'
          }
          placeholderTextColor="#888"
          value={pesquisa}
          onChangeText={setPesquisa}
        />

        {pesquisa.length > 0 && (
          <TouchableOpacity onPress={() => setPesquisa('')}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.contador}>
        {listaFiltrada.length} favorito(s)
      </Text>

      <FlatList
        data={listaFiltrada}
        renderItem={mostrarFavorito}
        keyExtractor={(item) =>
          categoria === 'pilotos'
            ? String(item.driver_number)
            : String(item.meeting_key)
        }
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Ionicons name="heart-outline" size={45} color="#555" />

            <Text style={styles.textoVazio}>
              {lista.length === 0
                ? 'Você ainda não adicionou favoritos.'
                : 'Nenhum favorito encontrado.'}
            </Text>
          </View>
        }
        contentContainerStyle={styles.lista}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    padding: 16,
  },

  titulo: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
  },

  subtitulo: {
    color: '#AAAAAA',
    marginTop: 5,
    marginBottom: 22,
  },

  categorias: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },

  botaoCategoria: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 13,
    backgroundColor: '#252525',
    borderRadius: 8,
  },

  categoriaAtiva: {
    backgroundColor: '#E10600',
  },

  textoCategoria: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  areaPesquisa: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242424',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 8,
    paddingHorizontal: 12,
  },

  inputPesquisa: {
    flex: 1,
    color: '#FFFFFF',
    padding: 13,
    marginLeft: 8,
  },

  contador: {
    color: '#888888',
    fontSize: 12,
    marginTop: 15,
    marginBottom: 10,
  },

  lista: {
    paddingBottom: 20,
    flexGrow: 1,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202020',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#E10600',
  },

  imagemPiloto: {
    width: 75,
    height: 90,
    borderRadius: 7,
    backgroundColor: '#303030',
  },

  imagemCircuito: {
    width: 85,
    height: 75,
    borderRadius: 7,
    backgroundColor: '#303030',
  },

  imagemVazia: {
    width: 75,
    height: 90,
    borderRadius: 7,
    backgroundColor: '#303030',
    justifyContent: 'center',
    alignItems: 'center',
  },

  informacoes: {
    flex: 1,
    marginLeft: 12,
  },

  nome: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  detalhe: {
    color: '#AAAAAA',
    fontSize: 12,
    marginBottom: 4,
  },

  verDetalhes: {
    color: '#E10600',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
  },

  botaoCoracao: {
    padding: 8,
  },

  vazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  textoVazio: {
    color: '#888888',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
  },
});
