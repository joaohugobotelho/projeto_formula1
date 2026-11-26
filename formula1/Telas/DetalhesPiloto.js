
import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';

import { buscarHistoriaPiloto } from '../services/api';




async function buscarTodasAsCorridas(urlBase) {
  let todasCorridas = [];
  let offset = 0;
  const limite = 100;

  while (true) {
    const resposta = await fetch(
      `${urlBase}?limit=${limite}&offset=${offset}`
    );

    if (!resposta.ok) {
      throw new Error('Erro ao buscar histórico do piloto.');
    }

    const dados = await resposta.json();

    const corridas =
      dados.MRData.RaceTable.Races || [];

    todasCorridas = [
      ...todasCorridas,
      ...corridas,
    ];

    if (corridas.length < limite) {
      break;
    }

    offset += limite;
  }

  return todasCorridas;
}




function organizarHistoria(texto) {
  if (!texto) return [];

  const secoes = [];
  const linhas = texto.split('\n');

  let tituloAtual = 'TRAJETÓRIA DO PILOTO';
  let conteudoAtual = [];

  linhas.forEach((linha) => {
    const textoLinha = linha.trim();

    if (!textoLinha) return;

    // Identifica títulos numerados ou em destaque.
    const ehTitulo =
      /^(\d+[\.\-\)]\s*|#+\s*|[A-ZÁÉÍÓÚÂÊÔÃÕÇ\s]{5,}$)/.test(textoLinha);

    if (ehTitulo) {
      if (conteudoAtual.length > 0) {
        secoes.push({
          titulo: tituloAtual,
          texto: conteudoAtual.join(' '),
        });
      }

      tituloAtual = textoLinha
        .replace(/^#+\s*/, '')
        .replace(/^\d+[\.\-\)]\s*/, '')
        .replace(/\*\*/g, '')
        .replace(/:$/, '')
        .trim();

      conteudoAtual = [];

    } else {
      conteudoAtual.push(
        textoLinha.replace(/\*\*/g, '')
      );
    }
  });

  if (conteudoAtual.length > 0) {
    secoes.push({
      titulo: tituloAtual,
      texto: conteudoAtual.join(' '),
    });
  }

  return secoes;
}


const DetalhesPiloto = ({ route }) => {

  const { piloto } = route.params;

  const [dadosJolpica, setDadosJolpica] = useState(null);

  const [carregando, setCarregando] = useState(true);

  const [erro, setErro] = useState(null);

  const [estatisticas, setEstatisticas] = useState(null);

  const [historia, setHistoria] = useState(null);

  const [fontes, setFontes] = useState([]);

  const [carregandoHistoria, setCarregandoHistoria] =
    useState(true);

  const [erroHistoria, setErroHistoria] = useState(null);


 

  useEffect(() => {

    let ativo = true;

    const buscarHistorico = async () => {

      try {

        setCarregando(true);
        setErro(null);

        const resposta = await fetch(
          'https://api.jolpi.ca/ergast/f1/2026/drivers.json?limit=100'
        );

        if (!resposta.ok) {
          throw new Error('Erro ao consultar a Jolpica.');
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

        if (!ativo) return;

        setDadosJolpica(pilotoEncontrado);

        const corridas = await buscarTodasAsCorridas(
          `https://api.jolpi.ca/ergast/f1/drivers/${pilotoEncontrado.driverId}/results`
        );

        const resultados = corridas.flatMap(
          (corrida) => corrida.Results || []
        );

        const qualificacoes = await buscarTodasAsCorridas(
          `https://api.jolpi.ca/ergast/f1/drivers/${pilotoEncontrado.driverId}/qualifying`
        );

        const resultadosQualificacao = qualificacoes.flatMap(
          (corrida) => corrida.QualifyingResults || []
        );

        const vitorias = resultados.filter(
          (resultado) =>
            Number(resultado.position) === 1
        ).length;

        const podios = resultados.filter(
          (resultado) => {
            const posicao = Number(resultado.position);

            return posicao >= 1 && posicao <= 3;
          }
        ).length;

        const poles = resultadosQualificacao.filter(
          (resultado) =>
            Number(resultado.position) === 1
        ).length;

        const equipesHistoricas = [
          ...new Set(
            resultados
              .map(
                (resultado) =>
                  resultado.Constructor?.name
              )
              .filter(Boolean)
          ),
        ];

        if (!ativo) return;

        setEstatisticas({
          corridas: corridas.length,
          vitorias,
          podios,
          poles,
          equipes: equipesHistoricas,
        });

      } catch (error) {

        if (ativo) {
          console.log('Erro Jolpica:', error.message);
          setErro(error.message);
        }

      } finally {

        if (ativo) {
          setCarregando(false);
        }

      }
    };

    buscarHistorico();

    return () => {
      ativo = false;
    };

  }, [piloto.driver_number]);


 

  useEffect(() => {

    let ativo = true;

    const carregarHistoria = async () => {

      try {

        setCarregandoHistoria(true);
        setErroHistoria(null);

        const resultado = await buscarHistoriaPiloto(piloto);

        if (!ativo) return;

        setHistoria(resultado.texto);
        setFontes(resultado.fontes || []);

      } catch (error) {

        console.log('Erro Gemini:', error.message);

        if (ativo) {
          setErroHistoria(error.message);
        }

      } finally {

        if (ativo) {
          setCarregandoHistoria(false);
        }

      }
    };

    carregarHistoria();

    return () => {
      ativo = false;
    };

  }, [
    piloto.full_name,
    piloto.driver_number,
    piloto.team_name,
  ]);



  if (carregando) {

    return (
      <View style={styles.telaCarregamento}>

        <ActivityIndicator
          size="large"
          color="#E10600"
        />

        <Text style={styles.textoCarregamento}>
          CARREGANDO DADOS DO PILOTO...
        </Text>

      </View>
    );

  }




  if (erro) {

    return (
      <View style={styles.telaCarregamento}>

        <Text style={styles.erro}>
          {erro}
        </Text>

      </View>
    );

  }


 

  const secoesHistoria = organizarHistoria(historia);


  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      showsVerticalScrollIndicator={false}
    >

      

      <View style={styles.cabecalho}>

        <Text style={styles.identificacao}>
          F1 HUB / PILOTOS
        </Text>

        <Text style={styles.nome}>
          {piloto.full_name}
        </Text>

        <View style={styles.linhaVermelha} />

        <Text style={styles.equipe}>
          {piloto.team_name}
        </Text>

        <View style={styles.informacoesBasicas}>

          <View style={styles.numeroBox}>
            <Text style={styles.numero}>
              {piloto.driver_number}
            </Text>

            <Text style={styles.numeroLegenda}>
              NÚMERO
            </Text>
          </View>

          <View style={styles.dadosBasicos}>

            <Text style={styles.textoBasico}>
              {dadosJolpica?.nationality || 'Nacionalidade não informada'}
            </Text>

            <Text style={styles.textoBasico}>
              Nascimento: {dadosJolpica?.dateOfBirth || 'Não informado'}
            </Text>

          </View>

        </View>

      </View>


      

      {estatisticas && (

        <View style={styles.areaEstatisticas}>

          <Text style={styles.tituloSecao}>
            DESEMPENHO NA F1
          </Text>

          <View style={styles.gradeEstatisticas}>

            <View style={styles.cardEstatistica}>
              <Text style={styles.numeroEstatistica}>
                {estatisticas.corridas}
              </Text>

              <Text style={styles.nomeEstatistica}>
                CORRIDAS
              </Text>
            </View>

            <View style={styles.cardEstatistica}>
              <Text style={styles.numeroEstatistica}>
                {estatisticas.vitorias}
              </Text>

              <Text style={styles.nomeEstatistica}>
                VITÓRIAS
              </Text>
            </View>

            <View style={styles.cardEstatistica}>
              <Text style={styles.numeroEstatistica}>
                {estatisticas.podios}
              </Text>

              <Text style={styles.nomeEstatistica}>
                PÓDIOS
              </Text>
            </View>

            <View style={styles.cardEstatistica}>
              <Text style={styles.numeroEstatistica}>
                {estatisticas.poles}
              </Text>

              <Text style={styles.nomeEstatistica}>
                POLES
              </Text>
            </View>

          </View>

        </View>

      )}


      

      {estatisticas && (

        <View style={styles.areaEquipes}>

          <Text style={styles.tituloSecao}>
            EQUIPES DA CARREIRA
          </Text>

          <View style={styles.listaEquipes}>

            {estatisticas.equipes.map((equipe, index) => (

              <View
                key={index}
                style={styles.itemEquipe}
              >

                <View style={styles.marcadorEquipe} />

                <Text style={styles.nomeEquipe}>
                  {equipe}
                </Text>

              </View>

            ))}

          </View>

        </View>

      )}


      

      <View style={styles.areaHistoria}>

        <Text style={styles.identificacao}>
          PERFIL DO PILOTO
        </Text>

        <Text style={styles.tituloSecao}>
          TRAJETÓRIA NA FÓRMULA 1
        </Text>

        {carregandoHistoria && (

          <View style={styles.carregandoHistoria}>

            <ActivityIndicator
              size="large"
              color="#E10600"
            />

            <Text style={styles.textoCarregamento}>
              PREPARANDO BIOGRAFIA...
            </Text>

          </View>

        )}

        {erroHistoria && (

          <View style={styles.cardErro}>

            <Text style={styles.erro}>
              Não foi possível carregar a biografia.
            </Text>

            <Text style={styles.textoErro}>
              {erroHistoria}
            </Text>

          </View>

        )}

        {historia && (

          <View style={styles.listaHistoria}>

            {secoesHistoria.length > 0 ? (

              secoesHistoria.map((secao, index) => (

                <View
                  key={index}
                  style={styles.cardHistoria}
                >

                  <View style={styles.cabecalhoHistoria}>

                    <Text style={styles.numeroSecao}>
                      {String(index + 1).padStart(2, '0')}
                    </Text>

                    <Text style={styles.tituloHistoria}>
                      {secao.titulo}
                    </Text>

                  </View>

                  <Text style={styles.textoHistoria}>
                    {secao.texto}
                  </Text>

                </View>

              ))

            ) : (

              <View style={styles.cardHistoria}>

                <Text style={styles.textoHistoria}>
                  {historia}
                </Text>

              </View>

            )}

          </View>

        )}

        <Text style={styles.aviso}>
          INFORMAÇÕES GERADAS POR INTELIGÊNCIA ARTIFICIAL.
          Consulte fontes oficiais para confirmar os dados.
        </Text>

      </View>


      

      {fontes.length > 0 && (

        <View style={styles.areaFontes}>

          <Text style={styles.tituloSecao}>
            FONTES CONSULTADAS
          </Text>

          {fontes.map((fonte, index) => (

            <TouchableOpacity
              key={index}
              style={styles.cardFonte}
              onPress={() => Linking.openURL(fonte.url)}
            >

              <Text style={styles.nomeFonte}>
                {fonte.titulo}
              </Text>

              <Text style={styles.urlFonte}>
                {fonte.url}
              </Text>

              <Text style={styles.abrirFonte}>
                ABRIR FONTE →
              </Text>

            </TouchableOpacity>

          ))}

        </View>

      )}

      <Text style={styles.rodape}>
        F1 HUB • SUA CENTRAL DE FÓRMULA 1
      </Text>

    </ScrollView>

  );

};


export default DetalhesPiloto;



const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#101010',
  },

  conteudo: {
    padding: 20,
    paddingBottom: 45,
  },

  telaCarregamento: {
    flex: 1,
    backgroundColor: '#101010',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },

  textoCarregamento: {
    color: '#AAAAAA',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 15,
    letterSpacing: 1,
    textAlign: 'center',
  },

  cabecalho: {
    backgroundColor: '#151515',
    padding: 20,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#E10600',
    marginBottom: 25,
  },

  identificacao: {
    color: '#E10600',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 10,
  },

  nome: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  linhaVermelha: {
    width: 45,
    height: 3,
    backgroundColor: '#E10600',
    marginBottom: 12,
  },

  equipe: {
    color: '#AAAAAA',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 20,
  },

  informacoesBasicas: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333333',
    paddingTop: 18,
  },

  numeroBox: {
    backgroundColor: '#E10600',
    width: 65,
    height: 65,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  numero: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: 'bold',
  },

  numeroLegenda: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },

  dadosBasicos: {
    flex: 1,
  },

  textoBasico: {
    color: '#CCCCCC',
    fontSize: 13,
    marginBottom: 8,
  },

  areaEstatisticas: {
    marginBottom: 25,
  },

  tituloSecao: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 15,
    letterSpacing: 0.5,
  },

  gradeEstatisticas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  cardEstatistica: {
    backgroundColor: '#151515',
    width: '48%',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderBottomWidth: 3,
    borderBottomColor: '#E10600',
    marginBottom: 12,
    alignItems: 'center',
  },

  numeroEstatistica: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  nomeEstatistica: {
    color: '#AAAAAA',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  areaEquipes: {
    marginBottom: 25,
  },

  listaEquipes: {
    backgroundColor: '#151515',
    borderRadius: 10,
    padding: 16,
  },

  itemEquipe: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },

  marcadorEquipe: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#E10600',
    marginRight: 12,
  },

  nomeEquipe: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },

  areaHistoria: {
    marginTop: 5,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },

  carregandoHistoria: {
    backgroundColor: '#151515',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
  },

  listaHistoria: {
    gap: 14,
  },

  cardHistoria: {
    backgroundColor: '#151515',
    borderRadius: 10,
    padding: 17,
    borderLeftWidth: 3,
    borderLeftColor: '#E10600',
  },

  cabecalhoHistoria: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  numeroSecao: {
    color: '#E10600',
    fontSize: 19,
    fontWeight: 'bold',
    marginRight: 12,
  },

  tituloHistoria: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
  },

  textoHistoria: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 23,
    textAlign: 'left',
  },

  aviso: {
    color: '#888888',
    fontSize: 10,
    lineHeight: 17,
    marginTop: 20,
    letterSpacing: 0.4,
  },

  cardErro: {
    backgroundColor: '#151515',
    padding: 16,
    borderRadius: 10,
  },

  erro: {
    color: '#FF5555',
    fontSize: 15,
    fontWeight: 'bold',
  },

  textoErro: {
    color: '#AAAAAA',
    fontSize: 13,
    marginTop: 8,
  },

  areaFontes: {
    marginTop: 25,
  },

  cardFonte: {
    backgroundColor: '#151515',
    padding: 15,
    borderRadius: 9,
    marginBottom: 12,
  },

  nomeFonte: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 7,
  },

  urlFonte: {
    color: '#AAAAAA',
    fontSize: 11,
    lineHeight: 17,
  },

  abrirFonte: {
    color: '#E10600',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 12,
  },

  rodape: {
    color: '#777777',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 35,
    letterSpacing: 1,
  },

});

