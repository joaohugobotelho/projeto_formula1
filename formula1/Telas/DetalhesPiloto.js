
import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const DetalhesPiloto = ({ route }) => {

  const { piloto } = route.params;

  const [dadosJolpica, setDadosJolpica] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [estatisticas, setEstatisticas] = useState(null);

  useEffect(() => {

    const buscarHistorico = async () => {
      try {
        setCarregando(true);
        setErro(null);

        const resposta = await fetch(
          'https://api.jolpi.ca/ergast/f1/2026/drivers.json?limit=100'
        );

        if (!resposta.ok) {
          throw new Error('Erro ao consultar a Jolpica');
        }

        const dados = await resposta.json();

        const listaPilotos =
          dados.MRData.DriverTable.Drivers;

        const pilotoEncontrado = listaPilotos.find(
          (item) =>
            item.permanentNumber ===
            String(piloto.driver_number)
        );

        if (!pilotoEncontrado) {
          throw new Error(
            'Piloto não encontrado no cadastro da Jolpica.'
          );
        }

        setDadosJolpica(pilotoEncontrado);
        // Buscar resultados de todas as corridas
        const respostaResultados = await fetch(
          `https://api.jolpi.ca/ergast/f1/drivers/${pilotoEncontrado.driverId}/results.json?limit=1000`
        );

        if (!respostaResultados.ok) {
          throw new Error('Erro ao buscar resultados da carreira');
        }

        const dadosResultados = await respostaResultados.json();

        const corridas = dadosResultados.MRData.RaceTable.Races;

        const resultados = corridas.flatMap(
          (corrida) => corrida.Results || []
        );

        // Buscar resultados de classificações
        const respostaQualificacoes = await fetch(
          `https://api.jolpi.ca/ergast/f1/drivers/${pilotoEncontrado.driverId}/qualifying.json?limit=1000`
        );

        if (!respostaQualificacoes.ok) {
          throw new Error('Erro ao buscar classificações');
        }

        const dadosQualificacoes = await respostaQualificacoes.json();

        const qualificacoes =
          dadosQualificacoes.MRData.RaceTable.Races;

        const resultadosQualificacao = qualificacoes.flatMap(
          (corrida) => corrida.QualifyingResults || []
        );

        // Calcular estatísticas
        const vitorias = resultados.filter(
          (resultado) => resultado.position === '1'
        ).length;

        const podios = resultados.filter(
          (resultado) => {
            const posicao = Number(resultado.position);
            return posicao >= 1 && posicao <= 3;
          }
        ).length;

        const poles = resultadosQualificacao.filter(
          (resultado) => resultado.position === '1'
        ).length;

        const equipesHistoricas = [
          ...new Set(
            resultados
              .map((resultado) => resultado.Constructor?.name)
              .filter(Boolean)
          )
        ];

        setEstatisticas({
          corridas: resultados.length,
          vitorias,
          podios,
          poles,
          equipes: equipesHistoricas,
        });

      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    };

    buscarHistorico();

  }, [piloto]);

  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E10600" />
        <Text style={styles.texto}>
          Buscando carreira do piloto...
        </Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.container}>
        <Text style={styles.erro}>{erro}</Text>
      </View>
    );
  }

  return (
  <View style={styles.container}>

    {/* INFORMAÇÕES DO PILOTO */}

    <Text style={styles.nome}>
      {piloto.full_name}
    </Text>

    <Text style={styles.texto}>
      Número: {piloto.driver_number}
    </Text>

    <Text style={styles.texto}>
      Equipe: {piloto.team_name}
    </Text>

    <Text style={styles.texto}>
      Nacionalidade: {dadosJolpica.nationality}
    </Text>

    <Text style={styles.texto}>
      Data de nascimento: {dadosJolpica.dateOfBirth}
    </Text>

    <Text style={styles.texto}>
      Identificador Jolpica: {dadosJolpica.driverId}
    </Text>


    {/* ESTATÍSTICAS DA CARREIRA */}

    {estatisticas && (
      <View style={styles.areaEstatisticas}>

        <Text style={styles.tituloSecao}>
          Estatísticas da carreira
        </Text>

        <Text style={styles.texto}>
          Corridas: {estatisticas.corridas}
        </Text>

        <Text style={styles.texto}>
          Vitórias: {estatisticas.vitorias}
        </Text>

        <Text style={styles.texto}>
          Pódios: {estatisticas.podios}
        </Text>

        <Text style={styles.texto}>
          Pole positions: {estatisticas.poles}
        </Text>

        <Text style={styles.tituloSecao}>
          Equipes da carreira
        </Text>

        {estatisticas.equipes.map((equipe, index) => (
          <Text key={index} style={styles.texto}>
            • {equipe}
          </Text>
        ))}

      </View>
    )}

  </View>
)};


export default DetalhesPiloto;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#101010',
    padding: 20,
  },

  nome: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  texto: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 12,
  },

  erro: {
    color: '#FF4444',
    fontSize: 16,
  },
  areaEstatisticas: {
  marginTop: 25,
},

tituloSecao: {
  color: '#E10600',
  fontSize: 21,
  fontWeight: 'bold',
  marginBottom: 15,
  marginTop: 15,
},

});
