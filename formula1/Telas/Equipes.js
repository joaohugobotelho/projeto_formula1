
import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import rafaelCamara from '../assets/rafael.jpeg';
import { SafeAreaView } from 'react-native-safe-area-context';

const Equipes = ({ navigation }) => {
  const [pilotos, setPilotos] = useState([]);
  const [equipes, setEquipes] = useState([]);
  const [equipeSelecionada, setEquipeSelecionada] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [dropdownAberto, setDropdownAberto] = useState(false);

  const pilotosDaEquipe = pilotos.filter(
    (piloto) => piloto.team_name === equipeSelecionada
  );

  const organizarEquipes = (dadosPilotos) => {
    const nomesEquipes = [
      ...new Set(dadosPilotos.map((piloto) => piloto.team_name))
    ];

    setEquipes(nomesEquipes);
  };

  // IMAGEM CARROS

  const imagensCarros = {
    'Alpine': 'https://media.formula1.com/image/upload/d_common%3Af1%3A2026%3Afallback%3Acar%3A2026fallbackcarleft.png/common/f1/2026/alpine/2026alpinecarleft.png',

    'Aston Martin': 'https://media.formula1.com/image/upload/d_common%3Af1%3A2026%3Afallback%3Acar%3A2026fallbackcarleft.png/common/f1/2026/astonmartin/2026astonmartincarleft.png',

    'Audi': 'https://media.formula1.com/image/upload/d_common%3Af1%3A2026%3Afallback%3Acar%3A2026fallbackcarleft.png/common/f1/2026/audi/2026audicarleft.png',

    'Cadillac': 'https://media.formula1.com/image/upload/d_common%3Af1%3A2026%3Afallback%3Acar%3A2026fallbackcarleft.png/common/f1/2026/cadillac/2026cadillaccarleft.png',

    'Ferrari': 'https://media.formula1.com/image/upload/d_common%3Af1%3A2026%3Afallback%3Acar%3A2026fallbackcarleft.png/common/f1/2026/ferrari/2026ferraricarleft.png',

    'Haas F1 Team': 'https://media.formula1.com/image/upload/d_common%3Af1%3A2026%3Afallback%3Acar%3A2026fallbackcarleft.png/common/f1/2026/haas/2026haascarleft.png',

    'McLaren': 'https://media.formula1.com/image/upload/d_common%3Af1%3A2026%3Afallback%3Acar%3A2026fallbackcarleft.png/common/f1/2026/mclaren/2026mclarencarleft.png',

    'Mercedes': 'https://media.formula1.com/image/upload/d_common%3Af1%3A2026%3Afallback%3Acar%3A2026fallbackcarleft.png/common/f1/2026/mercedes/2026mercedescarleft.png',

    'Racing Bulls': 'https://media.formula1.com/image/upload/d_common%3Af1%3A2026%3Afallback%3Acar%3A2026fallbackcarleft.png/common/f1/2026/racingbulls/2026racingbullscarleft.png',

    'Red Bull Racing': 'https://media.formula1.com/image/upload/d_common%3Af1%3A2026%3Afallback%3Acar%3A2026fallbackcarleft.png/common/f1/2026/redbullracing/2026redbullracingcarleft.png',

    'Williams': 'https://media.formula1.com/image/upload/d_common%3Af1%3A2026%3Afallback%3Acar%3A2026fallbackcarleft.png/common/f1/2026/williams/2026williamscarleft.png',
  };

  // IMAGEM DOS PILOTS NAO CARREGADAS
  const fotosAlternativas = {
    51: 'https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000001/common/f1/2026/haas/rafcam01/2026haasrafcam01right.webp',

    41: 'https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/racingbulls/arvlin01/2026racingbullsarvlin01right.webp',
  };

  const imagemCarroSelecionado = imagensCarros[equipeSelecionada];


  useEffect(() => {
    const buscarPilotos = async () => {
      try {
        setCarregando(true);
        setErro(null);

        const respostaSessoes = await fetch(
          'https://api.openf1.org/v1/sessions?meeting_key=1299'
        );

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

        const respostaPilotos = await fetch(
          `https://api.openf1.org/v1/drivers?session_key=${sessaoCorrida.session_key}`
        );

        if (!respostaPilotos.ok) {
          throw new Error('Erro ao buscar pilotos');
        }

        const dadosPilotos = await respostaPilotos.json();

        setPilotos(dadosPilotos);
        organizarEquipes(dadosPilotos);

      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    };

    buscarPilotos();
  }, []);

  if (carregando) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#E53935" />
        <Text style={styles.textoCarregamento}>
          Carregando equipes...
        </Text>
      </SafeAreaView>
    );
  }

  if (erro) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.mensagemErro}>{erro}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.titulo}>Equipes da Fórmula 1</Text>

      <View>
        <TouchableOpacity
          style={styles.botaoDropdown}
          onPress={() => setDropdownAberto(!dropdownAberto)}
        >
          <Text style={styles.textoDropdown}>
            {equipeSelecionada || 'Selecione uma equipe'}
          </Text>

          <Text style={styles.textoDropdown}>
            {dropdownAberto ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {dropdownAberto && (
          <View style={styles.listaDropdown}>
            {equipes.map((equipe, index) => (
              <TouchableOpacity
                key={index}
                style={styles.itemDropdown}
                onPress={() => {
                  setEquipeSelecionada(equipe);
                  setDropdownAberto(false);
                }}
              >
                <Text style={styles.textoDropdown}>
                  {equipe}
                </Text>
              </TouchableOpacity>
            ))}

          </View>
        )}
      </View>

      {equipeSelecionada && (

        <View style={styles.areaPilotos}>

          <Text style={styles.subtitulo}>
            Pilotos da {equipeSelecionada}
          </Text>



          {pilotosDaEquipe.map((piloto) => (

            <View
              key={piloto.driver_number}
              style={styles.cardPiloto}
            >

              {imagemCarroSelecionado && (
                <View style={styles.areaCarro}>

                </View>
              )}

              {String(piloto.driver_number) === '51' ? (
                <Image
                  source={rafaelCamara}
                  style={styles.fotoPiloto}
                  resizeMode="contain"
                />
              ) : piloto.headshot_url ? (
                <Image
                  source={{ uri: piloto.headshot_url }}
                  style={styles.fotoPiloto}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.fotoIndisponivel} />
              )}


              <View>
                <Text style={styles.nomePiloto}>
                  {piloto.full_name}
                </Text>

                <Text style={styles.numeroPiloto}>
                  Número: {piloto.driver_number}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.botaoCarreira}
                onPress={() => {
                  console.log('Botão clicado!');
                  console.log('Navigation:', navigation);

                  navigation.navigate('DetalhesPiloto', {
                    piloto: piloto,
                  });
                }}
              >
                <Text style={styles.textoBotaoCarreira}>
                  VER CARREIRA
                </Text>
              </TouchableOpacity>
            </View>


          ))}
          {imagemCarroSelecionado && (
            <View style={styles.areaCarro}>
              <Text style={styles.subtitulo}>
                Carro da Equipe
              </Text>

              <Image
                source={{ uri: imagemCarroSelecionado }}
                style={styles.fotoCarro}
                resizeMode="contain"
              />
            </View>
          )}
        </View>
      )}

    </SafeAreaView>
  );
};

export default Equipes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#101010',
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },

  botaoDropdown: {
    backgroundColor: '#101010',
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E53935',
  },
  listaDropdown: {
    backgroundColor: '#101010',
    marginTop: 5,
    borderRadius: 10,
  },

  itemDropdown: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#101010',
  },

  textoDropdown: {
    color: '#FFFFFF',
    fontSize: 16,
  },

  areaPilotos: {
    marginTop: 25,
  },

  subtitulo: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    alignSelf: 'flex-start',
    margintop: 50,

  },

  cardPiloto: {
    backgroundColor: '#101010',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  fotoPiloto: {
    width: 85,
    height: 85,
    borderRadius: 10,
    marginRight: 15,
  },

  fotoIndisponivel: {
    width: 85,
    height: 85,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: '#3A4A60',
  },

  nomePiloto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  numeroPiloto: {
    color: '#AAB8CC',
    marginTop: 5,
  },

  textoCarregamento: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
  },

  mensagemErro: {
    color: '#FF4444',
    fontSize: 16,
  },

  // CARROS 
  areaCarro: {
    backgroundColor: '#101010',
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
  },

  fotoCarro: {
    width: '100%',
    height: 180,
  },

  // CARREIRA PILOTOS
  botaoCarreira: {
    backgroundColor: '#E10600',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 'auto',
  },

  textoBotaoCarreira: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
