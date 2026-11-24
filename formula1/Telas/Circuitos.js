
import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import{useFavoritos} from '../context/FavoritosContext';

export default function Circuitos({ navigation }) {
  const {alternarFavorito, ehFavorito} = useFavoritos();
  const [listaGPs, setListaGPs] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [ano, setAno] = useState(2025);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarGPs();
  }, [ano]);

  async function carregarGPs() {
    setCarregando(true);
    setErro('');

    try {
      const resposta = await fetch(
        `https://api.openf1.org/v1/meetings?year=${ano}`
      );

      if (!resposta.ok) {
        throw new Error('Falha na consulta');
      }

      const dados = await resposta.json();
      setListaGPs(dados);
    } catch (error) {
      setErro('Não foi possível carregar os Grandes Prêmios.');
      setListaGPs([]);
    } finally {
      setCarregando(false);
    }
  }

  const GPsFiltrados = listaGPs.filter((gp) => {
    const pesquisa = termoBusca.toLowerCase();

    return (
      gp.meeting_name?.toLowerCase().includes(pesquisa) ||
      gp.country_name?.toLowerCase().includes(pesquisa) ||
      gp.circuit_short_name?.toLowerCase().includes(pesquisa) ||
      gp.location?.toLowerCase().includes(pesquisa)
    );
  });

  function mostrarData(data) {
    if (!data) return 'Data não disponível';

    return new Date(data).toLocaleDateString('pt-BR');
  }

  
function mostrarGP({ item }) {
  return (
    <View style={estilos.cartao}>
      {item.circuit_image ? (
        <Image
          source={{ uri: item.circuit_image }}
          style={estilos.imagem}
        />
      ) : null}

      <View style={estilos.informacoes}>
        <View style={estilos.cabecalho}>
          <Text style={estilos.nomeGP}>
            {item.meeting_name}
          </Text>

          <TouchableOpacity
            onPress={() => alternarFavorito('circuitos', item)}
            style={estilos.botaoFavorito}
          >
            <Ionicons
              name={
                ehFavorito('circuitos', item)
                  ? 'heart'
                  : 'heart-outline'
              }
              size={25}
              color="#E10600"
            />
          </TouchableOpacity>

          {item.country_flag ? (
            <Image
              source={{ uri: item.country_flag }}
              style={estilos.bandeira}
            />
          ) : null}
        </View>

        <Text style={estilos.circuito}>
          {item.circuit_short_name}
        </Text>

        <Text style={estilos.local}>
          {item.location} - {item.country_name}
        </Text>

        <Text style={estilos.data}>
          Data: {mostrarData(item.date_start)}
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('DetalhesGP', { gp: item })
          }
        >
          <Text style={estilos.detalhes}>
            Ver detalhes →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


  return (
    <SafeAreaView style={estilos.container}>
      <Text style={estilos.titulo}>Grandes Prêmios</Text>

      <Text style={estilos.subtitulo}>
        Confira os circuitos da Fórmula 1
      </Text>

      <View style={estilos.anos}>
        {[2023, 2024, 2025, 2026].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              estilos.botaoAno,
              ano === item && estilos.anoAtivo,
            ]}
            onPress={() => setAno(item)}
          >
            <Text
              style={[
                estilos.textoAno,
                ano === item && estilos.textoAtivo,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={estilos.pesquisa}
        placeholder="Pesquisar GP, país ou circuito"
        placeholderTextColor="#999"
        value={termoBusca}
        onChangeText={setTermoBusca}
      />

      {carregando ? (
        <ActivityIndicator
          size="large"
          color="#E10600"
          style={estilos.loading}
        />
      ) : erro ? (
        <Text style={estilos.erro}>{erro}</Text>
      ) : (
        <FlatList
          data={GPsFiltrados}
          renderItem={mostrarGP}
          keyExtractor={(item) => String(item.meeting_key)}
          ListEmptyComponent={
            <Text style={estilos.vazio}>
              Nenhum GP encontrado.
            </Text>
          }
          contentContainerStyle={estilos.lista}
        />
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    padding: 16,
  },

  titulo: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
  },

  subtitulo: {
    color: '#aaa',
    marginTop: 5,
    marginBottom: 20,
  },

  anos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  botaoAno: {
    backgroundColor: '#292929',
    padding: 10,
    borderRadius: 8,
  },

  anoAtivo: {
    backgroundColor: '#E10600',
  },

  textoAno: {
    color: '#fff',
    fontWeight: 'bold',
  },

  textoAtivo: {
    color: '#fff',
  },

  pesquisa: {
    backgroundColor: '#242424',
    color: '#fff',
    padding: 13,
    borderRadius: 8,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#444',
  },

  lista: {
    paddingBottom: 20,
  },

  cartao: {
    backgroundColor: '#202020',
    borderRadius: 12,
    marginBottom: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },

  imagem: {
    width: '100%',
    height: 160,
    backgroundColor: '#303030',
  },

  informacoes: {
    padding: 14,
  },

  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  nomeGP: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },

  bandeira: {
    width: 32,
    height: 22,
  },

  circuito: {
    color: '#E10600',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 8,
  },

  local: {
    color: '#ccc',
    fontSize: 13,
    marginTop: 5,
  },

  data: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 8,
  },

  detalhes: {
    color: '#E10600',
    fontWeight: 'bold',
    marginTop: 12,
  },

  loading: {
    marginTop: 40,
  },

  erro: {
    color: '#ff5555',
    textAlign: 'center',
    marginTop: 30,
  },

  vazio: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 30,
  },
  botaoFavorito: {
  padding: 5,
},
});
