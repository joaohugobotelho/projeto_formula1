
import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

// cache campeao mundial
// tratamento de tentativas pra nao falhar a api

const cacheCampeonatos = {};

async function buscarComTentativas(url, tentativas = 3) {
  let ultimoErro;

  for(let tentativa = 1; tentativa <= tentativas; tentativa++){
    const controlar = new AbortController();

    const timeout = setTimeout(()=> {
      controlar.abort();
    }, 12000);

    try {
      const resposta = await fetch(url, {
        signal:controlar.signal,
      });

      if(!resposta.ok) {
        const erro = new Error(`Erro HTTP: ${resposta.status}`);

        if(resposta.status !== 429 && resposta.status < 500) {
          throw erro;
        }
        throw erro;
      }

      return await resposta.json();
    } catch (erro) {
      ultimoErro = erro;

      if (
        tentativa === tentativas ||
        (erro.message.startsWith('Erro HTTP:') &&
          !['Erro HTTP: 429'].includes(erro.message) &&
          !erro.message.includes('5'))
      ) {
        throw erro;
      }

      await new Promise(resolve =>
        setTimeout(resolve, tentativa * 1000)
      );

    } finally {
      clearTimeout(timeout);
    }
  }

  throw ultimoErro;
}
  



export default function Campeonatos() {
  const [ano, setAno] = useState(2025);
  const [campeaoPiloto, setCampeaoPiloto] = useState(null);
  const [campeaoEquipe, setCampeaoEquipe] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  
useEffect(() => {
  let ativo = true;

  async function carregar() {
    setCarregando(true);
    setErro('');

    
    if (cacheCampeonatos[ano]) {
      setCampeaoPiloto(cacheCampeonatos[ano].piloto);
      setCampeaoEquipe(cacheCampeonatos[ano].equipe);
      setCarregando(false);
      return;
    }

    setCampeaoPiloto(null);
    setCampeaoEquipe(null);

    try {
      const urlCorridas =
        `https://api.openf1.org/v1/sessions?year=${ano}&session_name=Race`;

      const corridas = await buscarComTentativas(urlCorridas);

      if (!ativo) return;

    
      const corridasDisponiveis = corridas
        .filter(corrida =>
          !corrida.is_cancelled &&
          corrida.date_end &&
          new Date(corrida.date_end) <= new Date()
        )
        .sort((a, b) =>
          new Date(b.date_end) - new Date(a.date_end)
        );

      if (corridasDisponiveis.length === 0) {
        throw new Error('Nenhuma corrida encerrada encontrada.');
      }

      const sessao = corridasDisponiveis[0].session_key;

      const urlPilotos =
        `https://api.openf1.org/v1/championship_drivers?session_key=${sessao}`;

      const urlEquipes =
        `https://api.openf1.org/v1/championship_teams?session_key=${sessao}`;

      const urlNomes =
        `https://api.openf1.org/v1/drivers?session_key=${sessao}`;

     
      const [dadosPilotos, dadosEquipes, nomesPilotos] =
        await Promise.all([
          buscarComTentativas(urlPilotos),
          buscarComTentativas(urlEquipes),
          buscarComTentativas(urlNomes).catch(erro => {
            console.log('Erro ao buscar fotos e nomes:', erro.message);
            return [];
          }),
        ]);

      if (!ativo) return;

      dadosPilotos.sort(
        (a, b) => a.position_current - b.position_current
      );

      dadosEquipes.sort(
        (a, b) => a.position_current - b.position_current
      );

      const primeiroPiloto = dadosPilotos[0];
      const primeiraEquipe = dadosEquipes[0];

      if (!primeiroPiloto || !primeiraEquipe) {
        throw new Error('Classificação indisponível.');
      }

      const dadosDoPiloto = nomesPilotos.find(
        item =>
          item.driver_number === primeiroPiloto.driver_number
      );

      const piloto = {
        ...primeiroPiloto,
        nome: dadosDoPiloto?.full_name ||
          `Piloto #${primeiroPiloto.driver_number}`,
        equipe: dadosDoPiloto?.team_name ||
          'Equipe não disponível',
        foto: dadosDoPiloto?.headshot_url || null,
      };

      cacheCampeonatos[ano] = {
        piloto,
        equipe: primeiraEquipe,
      };

      setCampeaoPiloto(piloto);
      setCampeaoEquipe(primeiraEquipe);

    } catch (error) {
      console.log('ERRO CAMPEONATOS:', error.message);

      if (ativo) {
        setErro(
          'Não foi possível carregar os dados desta temporada. Tente novamente.'
        );
      }

    } finally {
      if (ativo) {
        setCarregando(false);
      }
    }
  }

  carregar();

  return () => {
    ativo = false;
  };
}, [ano]);


  return (
    <SafeAreaView style={estilos.container}>
      <Text style={estilos.titulo}>Campeonatos</Text>

      <Text style={estilos.subtitulo}>
        Conheça os líderes da Fórmula 1
      </Text>

      <Text style={estilos.rotulo}>
        Escolha a temporada
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
            <Text style={estilos.textoAno}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {carregando ? (
        <ActivityIndicator
          size="large"
          color="#E10600"
          style={estilos.loading}
        />
      ) : erro ? (
        <Text style={estilos.erro}>{erro}</Text>
      ) : (
        <>
          <Text style={estilos.temporada}>
            Temporada {ano}
          </Text>

          <Text style={estilos.secao}>
            {ano === new Date().getFullYear()
              ? 'Líder do campeonato de pilotos'
              : 'Campeão mundial de pilotos'}
          </Text>

          {campeaoPiloto && (
            <View style={estilos.cartao}>
              {campeaoPiloto.foto ? (
                <Image
                  source={{ uri: campeaoPiloto.foto }}
                  style={estilos.foto}
                />
              ) : null}

              <View style={estilos.informacoes}>
                <Text style={estilos.nome}>
                  {campeaoPiloto.nome}
                </Text>

                <Text style={estilos.equipe}>
                  {campeaoPiloto.equipe}
                </Text>

                <Text style={estilos.pontos}>
                  {campeaoPiloto.points_current} pontos
                </Text>
              </View>

              <Text style={estilos.posicao}>1º</Text>
            </View>
          )}

          <Text style={estilos.secao}>
            {ano === new Date().getFullYear()
              ? 'Líder do campeonato de construtores'
              : 'Campeã mundial de construtores'}
          </Text>

          {campeaoEquipe && (
            <View style={estilos.cartaoEquipe}>
              <View style={estilos.informacoes}>
                <Text style={estilos.nome}>
                  {campeaoEquipe.team_name}
                </Text>

                <Text style={estilos.equipe}>
                  Campeonato de Construtores
                </Text>

                <Text style={estilos.pontos}>
                  {campeaoEquipe.points_current} pontos
                </Text>
              </View>

              <Text style={estilos.posicao}>1º</Text>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    padding: 18,
  },

  titulo: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
  },

  subtitulo: {
    color: '#aaa',
    marginTop: 5,
    marginBottom: 25,
  },

  rotulo: {
    color: '#ccc',
    fontWeight: 'bold',
    marginBottom: 12,
  },

  anos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  botaoAno: {
    backgroundColor: '#292929',
    padding: 12,
    borderRadius: 8,
  },

  anoAtivo: {
    backgroundColor: '#E10600',
  },

  textoAno: {
    color: '#fff',
    fontWeight: 'bold',
  },

  temporada: {
    color: '#E10600',
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  secao: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 12,
  },

  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202020',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#383838',
  },

  cartaoEquipe: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202020',
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#383838',
  },

  foto: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: '#333',
  },

  informacoes: {
    flex: 1,
    marginLeft: 12,
  },

  nome: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  equipe: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 5,
  },

  pontos: {
    color: '#E10600',
    fontWeight: 'bold',
    marginTop: 8,
  },

  posicao: {
    color: '#E10600',
    fontSize: 25,
    fontWeight: 'bold',
  },

  loading: {
    marginTop: 50,
  },

  erro: {
    color: '#ff5555',
    textAlign: 'center',
    marginTop: 30,
  },
});
