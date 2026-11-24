
import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavoritos } from '../context/FavoritosContext';
import dadosCarros from '../dadosCarros';
import rafaelCamara from '../assets/rafael.jpeg';
import limblad from '../assets/limblad.jpg';

export default function Equipes({ navigation }) {
  const { alternarFavorito, ehFavorito } = useFavoritos();
  const [pilotos, setPilotos] = useState([]);
  const [equipeSelecionada, setEquipeSelecionada] = useState('McLaren');
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [mostrarEspecificacoes, setMostrarEspecificacoes] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const imagensCarros = {
    'Alpine':
      'https://media.formula1.com/image/upload/d_common:f1:2026:fallback:car:2026fallbackcarleft.png/common/f1/2026/alpine/2026alpinecarleft.png',

    'Aston Martin':
      'https://media.formula1.com/image/upload/d_common:f1:2026:fallback:car:2026fallbackcarleft.png/common/f1/2026/astonmartin/2026astonmartincarleft.png',

    'Audi':
      'https://media.formula1.com/image/upload/d_common:f1:2026:fallback:car:2026fallbackcarleft.png/common/f1/2026/audi/2026audicarleft.png',

    'Cadillac':
      'https://media.formula1.com/image/upload/d_common:f1:2026:fallback:car:2026fallbackcarleft.png/common/f1/2026/cadillac/2026cadillaccarleft.png',

    'Ferrari':
      'https://media.formula1.com/image/upload/d_common:f1:2026:fallback:car:2026fallbackcarleft.png/common/f1/2026/ferrari/2026ferraricarleft.png',

    'Haas F1 Team':
      'https://media.formula1.com/image/upload/d_common:f1:2026:fallback:car:2026fallbackcarleft.png/common/f1/2026/haas/2026haascarleft.png',

    'McLaren':
      'https://media.formula1.com/image/upload/d_common:f1:2026:fallback:car:2026fallbackcarleft.png/common/f1/2026/mclaren/2026mclarencarleft.png',

    'Mercedes':
      'https://media.formula1.com/image/upload/d_common:f1:2026:fallback:car:2026fallbackcarleft.png/common/f1/2026/mercedes/2026mercedescarleft.png',

    'Racing Bulls':
      'https://media.formula1.com/image/upload/d_common:f1:2026:fallback:car:2026fallbackcarleft.png/common/f1/2026/racingbulls/2026racingbullscarleft.png',

    'Red Bull Racing':
      'https://media.formula1.com/image/upload/d_common:f1:2026:fallback:car:2026fallbackcarleft.png/common/f1/2026/redbullracing/2026redbullracingcarleft.png',

    'Williams':
      'https://media.formula1.com/image/upload/d_common:f1:2026:fallback:car:2026fallbackcarleft.png/common/f1/2026/williams/2026williamscarleft.png',
  };


  useEffect(() => {
    async function buscarPilotos() {
      try {
        setCarregando(true);
        setErro('');

        const respostaSessoes = await fetch(
          'https://api.openf1.org/v1/sessions?meeting_key=1299'
        );

        if (!respostaSessoes.ok) {
          throw new Error('Não foi possível buscar as sessões.');
        }

        const sessoes = await respostaSessoes.json();

        const sessaoCorrida = sessoes.find(
          (sessao) => sessao.session_name === 'Race'
        );

        if (!sessaoCorrida) {
          throw new Error('Sessão de corrida não encontrada.');
        }

        const respostaPilotos = await fetch(
          `https://api.openf1.org/v1/drivers?session_key=${sessaoCorrida.session_key}`
        );

        if (!respostaPilotos.ok) {
          throw new Error('Não foi possível buscar os pilotos.');
        }

        const dados = await respostaPilotos.json();
        setPilotos(dados);

      } catch (error) {
        console.log('Erro ao buscar pilotos:', error);
        setErro('Não foi possível carregar as equipes. Tente novamente.');
      } finally {
        setCarregando(false);
      }
    }

    buscarPilotos();
  }, []);

  const equipes = [
    ...new Set(pilotos.map((piloto) => piloto.team_name)),
  ].sort();

  const pilotosDaEquipe = pilotos.filter(
    (piloto) => piloto.team_name === equipeSelecionada
  );

  const nomesEquipes = {
  'McLaren': 'McLaren',
  'Mercedes': 'Mercedes',
  'Ferrari': 'Ferrari',
  'Red Bull Racing': 'RedBull',
  'Red Bull': 'RedBull',
  'Aston Martin': 'AstonMartin',
  'Alpine': 'Alpine',
  'Williams': 'Williams',
  'Racing Bulls': 'RacingBulls',
  'RB': 'RacingBulls',
  'Haas F1 Team': 'Haas',
  'Haas': 'Haas',
  'Audi': 'Audi',
  'Cadillac': 'Cadillac',
};

const chaveEquipe = nomesEquipes[equipeSelecionada] || equipeSelecionada;

const dadosCarroSelecionado =
  dadosCarros[2026]?.equipes?.[chaveEquipe];

  function selecionarEquipe(equipe) {
    setEquipeSelecionada(equipe);
    setMostrarEspecificacoes(false);
    setDropdownAberto(false);
  }

  function abrirFonte() {
    if (dadosCarroSelecionado?.fonte) {
      Linking.openURL(dadosCarroSelecionado.fonte);
    }
  }

  if (carregando) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator size="large" color="#E10600" />
        <Text style={styles.textoCarregando}>
          Carregando equipes...
        </Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.carregando}>
        <Text style={styles.erro}>{erro}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
    >
      <Text style={styles.titulo}>EQUIPES</Text>

      <Text style={styles.subtitulo}>
        Temporada 2026
      </Text>

      <TouchableOpacity
        style={styles.seletor}
        onPress={() => setDropdownAberto(!dropdownAberto)}
      >
        <Text style={styles.textoSeletor}>
          {equipeSelecionada || 'Selecione uma equipe'}
        </Text>

        <Text style={styles.seta}>
          {dropdownAberto ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {dropdownAberto && (
        <View style={styles.dropdown}>
          {equipes.map((equipe, index) => (
            <TouchableOpacity
              key={index}
              style={styles.opcao}
              onPress={() => selecionarEquipe(equipe)}
            >
              <Text style={styles.textoOpcao}>
                {equipe}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.nomeEquipe}>
        {equipeSelecionada}
      </Text>

      <Text style={styles.tituloSecao}>
        PILOTOS
      </Text>

      {pilotosDaEquipe.map((piloto) => (
        <View
          key={piloto.driver_number}
          style={styles.cardPiloto}
        >

          {String(piloto.driver_number) === '51' ? (
            <Image
              source={rafaelCamara}
              style={styles.fotoPiloto}
              resizeMode="cover"
            />
          ) : String(piloto.driver_number) === '41' ? (
            <Image
              source={limblad}
              style={styles.fotoPiloto}
              resizeMode="cover"
            />
          ) : piloto.headshot_url ? (
            <Image
              source={{ uri: piloto.headshot_url }}
              style={styles.fotoPiloto}
              resizeMode="cover"
            />
          ) : null}

          <View style={styles.infoPiloto}>
            <Text style={styles.nomePiloto}>
              <TouchableOpacity
                style={styles.botaoFavorito}
                onPress={() => alternarFavorito('pilotos', piloto)}
              >
                <Ionicons
                  name={ehFavorito('pilotos', piloto) ? 'heart' : 'heart-outline'}
                  size={25}
                  color="#E10600"
                />
              </TouchableOpacity>
              {piloto.full_name}
            </Text>

            <Text style={styles.texto}>
              Número: {piloto.driver_number}
            </Text>



            <TouchableOpacity
              style={styles.botaoCarreira}
              onPress={() =>
                navigation.navigate('DetalhesPiloto', {
                  piloto: piloto,
                })
              }
            >
              <Text style={styles.textoBotao}>
                VER CARREIRA
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <View style={styles.areaCarro}>
        <Text style={styles.tituloSecao}>
          CARRO DA EQUIPE
        </Text>

        <Image
          source={{ uri: imagensCarros[equipeSelecionada] }}
          style={styles.imagemCarro}
          resizeMode="contain"
        />


        {dadosCarroSelecionado ? (
          <>
            <Text style={styles.nomeCarro}>
              {dadosCarroSelecionado.modelo}
            </Text>

            <TouchableOpacity
              style={styles.botaoEspecificacoes}
              onPress={() =>
                setMostrarEspecificacoes(!mostrarEspecificacoes)
              }
            >
              <Text style={styles.textoBotaoEspecificacoes}>
                {mostrarEspecificacoes
                  ? 'OCULTAR ESPECIFICAÇÕES'
                  : 'VER ESPECIFICAÇÕES'}
              </Text>
            </TouchableOpacity>

            {mostrarEspecificacoes && (
              <View style={styles.cardEspecificacoes}>
                <Text style={styles.tituloEspecificacoes}>
                  FICHA TÉCNICA
                </Text>

                {Object.entries(
                  dadosCarroSelecionado.especificacoes || {}
                ).map(([chave, valor]) => (
                  <View
                    key={chave}
                    style={styles.linhaEspecificacao}
                  >
                    <Text style={styles.nomeEspecificacao}>
                      {chave}
                    </Text>

                    <Text style={styles.valorEspecificacao}>
                      {String(valor)}
                    </Text>
                  </View>
                ))}

                {dadosCarroSelecionado.fonte && (
                  <TouchableOpacity
                    style={styles.botaoFonte}
                    onPress={abrirFonte}
                  >
                    <Text style={styles.textoFonte}>
                      CONSULTAR FONTE OFICIAL ↗
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </>
        ) : (
          <View style={styles.cardAviso}>
            <Text style={styles.textoAviso}>
              As especificações oficiais desta equipe ainda não foram
              cadastradas para a temporada 2026.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
  },

  conteudo: {
    padding: 20,
    paddingBottom: 40,
  },

  carregando: {
    flex: 1,
    backgroundColor: '#101010',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textoCarregando: {
    color: '#FFFFFF',
    marginTop: 15,
    fontSize: 16,
  },

  erro: {
    color: '#E10600',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },

  titulo: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
  },

  subtitulo: {
    color: '#AAAAAA',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },

  seletor: {
    backgroundColor: '#222222',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E10600',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  textoSeletor: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  seta: {
    color: '#E10600',
    fontSize: 16,
  },

  dropdown: {
    backgroundColor: '#222222',
    marginTop: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },

  opcao: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },

  textoOpcao: {
    color: '#FFFFFF',
    fontSize: 15,
  },

  nomeEquipe: {
    color: '#E10600',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
  },

  tituloSecao: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  cardPiloto: {
    backgroundColor: '#1C1C1C',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: '#E10600',
  },

  fotoPiloto: {
    width: 115,
    height: 135,
    backgroundColor: '#252525',
    borderRadius: 8,
  },

  fotoIndisponivel: {
    width: 115,
    height: 135,
    backgroundColor: '#252525',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textoFoto: {
    color: '#777777',
  },

  infoPiloto: {
    flex: 1,
    marginLeft: 15,
  },

  nomePiloto: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  imagemCarro: {
    width: '100%',
    height: 220,
    resizeMode: 'contain',
    marginBottom: 15,
  },


  texto: {
    color: '#BBBBBB',
    fontSize: 14,
    marginBottom: 5,
  },

  botaoCarreira: {
    backgroundColor: '#E10600',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },

  textoBotao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },

  areaCarro: {
    marginTop: 35,
  },

  nomeCarro: {
    color: '#E10600',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },

  botaoEspecificacoes: {
    backgroundColor: '#E10600',
    padding: 15,
    borderRadius: 7,
    alignItems: 'center',
  },

  textoBotaoEspecificacoes: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },

  cardEspecificacoes: {
    backgroundColor: '#1C1C1C',
    padding: 18,
    borderRadius: 8,
    marginTop: 15,
  },

  tituloEspecificacoes: {
    color: '#E10600',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },

  linhaEspecificacao: {
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingVertical: 12,
  },

  nomeEspecificacao: {
    color: '#AAAAAA',
    fontSize: 13,
    marginBottom: 5,
    textTransform: 'capitalize',
  },

  valorEspecificacao: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  botaoFonte: {
    marginTop: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E10600',
    borderRadius: 6,
    alignItems: 'center',
  },

  textoFonte: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },

  cardAviso: {
    backgroundColor: '#1C1C1C',
    padding: 18,
    borderRadius: 8,
  },

  textoAviso: {
    color: '#AAAAAA',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  // botao favoritar
  botaoFavorito: {
    alignSelf: 'flex-start',
    padding: 5,
    marginBottom: 5,
  },
});
