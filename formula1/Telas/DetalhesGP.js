
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { setoresCircuitos } from '../services/setoresCircuitos';

import {
  buscarDadosCircuito,
  buscarAnaliseSetor,
  auditarMapeamentoSetores,
} from '../services/api';

export default function DetalhesGP({ route }) {
  const gp = route.params.gp;

  const [larguraPista, setLarguraPista] = useState(0);
  const [dadosCircuito, setDadosCircuito] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const [setorSelecionado, setSetorSelecionado] = useState(null);
  const [analiseSetor, setAnaliseSetor] = useState(null);
  const [carregandoAnalise, setCarregandoAnalise] = useState(false);
  const [erroAnalise, setErroAnalise] = useState(null);

  // Carrega os dados do circuito
  useEffect(() => {
    async function carregarCircuito() {
      try {
        setCarregando(true);
        setErro(null);

        const dados = await buscarDadosCircuito(gp);

        setDadosCircuito(dados);

        auditarMapeamentoSetores(dados);
      } catch (error) {
        console.log('Erro ao carregar circuito:', error);
        setErro('Não foi possível carregar o traçado.');
      } finally {
        setCarregando(false);
      }
    }

    carregarCircuito();
  }, [gp]);

 
  async function analisarSetor(setor) {
    if (carregandoAnalise || !dadosCircuito || !setor) return;

    try {
      setSetorSelecionado(setor);
      setAnaliseSetor(null);
      setErroAnalise(null);
      setCarregandoAnalise(true);

      const resultado = await buscarAnaliseSetor(
        setor,
        dadosCircuito
      );

      setAnaliseSetor(resultado.texto);
    } catch (error) {
      console.log('Erro ao analisar setor:', error);

      setErroAnalise(
        error.message || 'Não foi possível gerar a análise.'
      );
    } finally {
      setCarregandoAnalise(false);
    }
  }

  
  function formatarData(data) {
    if (!data) return 'Não disponível';

    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  // Calcula as dimensoes pra desenhar a pista
  function obterDimensoesPista() {
    if (
      !dadosCircuito?.x?.length ||
      !dadosCircuito?.y?.length ||
      larguraPista <= 0
    ) {
      return null;
    }

    const curvas = dadosCircuito.corners || [];

    const todosX = [
      ...dadosCircuito.x,
      ...curvas.map(curva => curva.trackPosition?.x),
    ].filter(Number.isFinite);

    const todosY = [
      ...dadosCircuito.y,
      ...curvas.map(curva => curva.trackPosition?.y),
    ].filter(Number.isFinite);

    const minX = Math.min(...todosX);
    const maxX = Math.max(...todosX);
    const minY = Math.min(...todosY);
    const maxY = Math.max(...todosY);

    const intervaloX = Math.max(maxX - minX, 1);
    const intervaloY = Math.max(maxY - minY, 1);

    const margem = 40;
    const proporcao = intervaloY / intervaloX;

    const altura = Math.max(
      260,
      (larguraPista - margem * 2) * proporcao + margem * 2
    );

    const escalaX = (larguraPista - margem * 2) / intervaloX;
    const escalaY = (altura - margem * 2) / intervaloY;

    const escala = Math.min(escalaX, escalaY);

    return {
      altura,
      minX,
      minY,
      escala,
      margem,
      larguraDesenho: intervaloX * escala,
      alturaDesenho: intervaloY * escala,
    };
  }

 
  function converterCoordenada(x, y, dimensoes) {
    if (!dimensoes) return null;

    return {
      x:
        dimensoes.margem +
        (x - dimensoes.minX) * dimensoes.escala +
        (larguraPista - dimensoes.larguraDesenho) / 2,

      y:
        dimensoes.margem +
        (y - dimensoes.minY) * dimensoes.escala +
        (dimensoes.altura - dimensoes.alturaDesenho) / 2,
    };
  }

  
  function obterPontosPista(dimensoes) {
    if (
      !dadosCircuito?.x ||
      !dadosCircuito?.y ||
      !dimensoes
    ) {
      return [];
    }

    return dadosCircuito.x
      .map((valorX, index) => {
        return converterCoordenada(
          valorX,
          dadosCircuito.y[index],
          dimensoes
        );
      })
      .filter(
        ponto =>
          ponto &&
          Number.isFinite(ponto.x) &&
          Number.isFinite(ponto.y)
      );
  }

  const dimensoesPista = obterDimensoesPista();
  const pontos = obterPontosPista(dimensoesPista);

  
  const chaveCircuito = dadosCircuito
    ? `${dadosCircuito.circuitKey}-${dadosCircuito.season}`
    : null;

  const mapeamentoSetores = chaveCircuito
    ? setoresCircuitos[chaveCircuito]
    : null;

  // Cores setores
  const coresSetores = {
    S1: '#3B82F6',
    S2: '#F59E0B',
    S3: '#22C55E',
  };

  // Identifica a cor de cada trecho da pista conforme o setor
  function obterSegmentosColoridos() {
    if (
      pontos.length < 2 ||
      !dadosCircuito?.corners ||
      !dimensoesPista ||
      !mapeamentoSetores
    ) {
      return [];
    }

    const setorPorCurva = {};

    Object.entries(mapeamentoSetores.setores || {}).forEach(
      ([setor, dados]) => {
        (dados.curvas || []).forEach(numero => {
          setorPorCurva[String(numero)] = setor;
        });
      }
    );

    // Converte as posicoes das curvas para posicoes no desenho
    const curvasOrdenadas = dadosCircuito.corners
      .map(curva => {
        const numero =
          curva.number ??
          curva.cornerNumber ??
          curva.corner_number ??
          curva.corner;

        const posicao = curva.trackPosition;

        if (
          numero === undefined ||
          !posicao ||
          !Number.isFinite(posicao.x) ||
          !Number.isFinite(posicao.y)
        ) {
          return null;
        }

        const posicaoVisual = converterCoordenada(
          posicao.x,
          posicao.y,
          dimensoesPista
        );

        if (!posicaoVisual) return null;

        let menorDistancia = Infinity;
        let indiceMaisProximo = -1;

        pontos.forEach((ponto, index) => {
          const dx = ponto.x - posicaoVisual.x;
          const dy = ponto.y - posicaoVisual.y;

          const distancia = dx * dx + dy * dy;

          if (distancia < menorDistancia) {
            menorDistancia = distancia;
            indiceMaisProximo = index;
          }
        });

        return {
          indice: indiceMaisProximo,
          numero: String(numero),
        };
      })
      .filter(curva => curva && curva.indice >= 0)
      .sort((a, b) => a.indice - b.indice);

    if (curvasOrdenadas.length === 0) {
      return [];
    }

    // Define a cor de cada segmento usando a curva anterior
    return pontos.slice(1).map((ponto, index) => {
      let curvaAtual =
        curvasOrdenadas[curvasOrdenadas.length - 1];

      for (const curva of curvasOrdenadas) {
        if (curva.indice <= index) {
          curvaAtual = curva;
        } else {
          break;
        }
      }

      const setor = setorPorCurva[curvaAtual.numero];

      return {
        ponto,
        anterior: pontos[index],
        cor: coresSetores[setor] || '#777',
      };
    });
  }

  const segmentosColoridos = obterSegmentosColoridos();

  // Organiza o texto retornado pelo Gemini
  function renderizarAnalise() {
    if (!analiseSetor) return null;

    const linhas = analiseSetor
      .split('\n')
      .map(linha => linha.trim())
      .filter(Boolean);

    return linhas.map((linha, index) => {
      const texto = linha
        .replace(/^#{1,3}\s*/, '')
        .replace(/\*\*/g, '');

      const ehTitulo =
        linha.startsWith('#') ||
        /^[A-ZÀ-Ú][^.!?]{2,55}:$/.test(texto);

      const ehTopico = /^[-•*]\s/.test(linha);

      if (ehTitulo) {
        return (
          <Text
            key={index}
            style={estilos.tituloTopicoAnalise}
          >
            {texto.replace(/:$/, '')}
          </Text>
        );
      }

      if (ehTopico) {
        return (
          <View
            key={index}
            style={estilos.linhaTopicoAnalise}
          >
            <Text style={estilos.marcadorTopico}>›</Text>

            <Text style={estilos.textoTopicoAnalise}>
              {texto.replace(/^[-•*]\s*/, '')}
            </Text>
          </View>
        );
      }

      return (
        <Text
          key={index}
          style={estilos.paragrafoAnalise}
        >
          {texto}
        </Text>
      );
    });
  }

  return (
    <SafeAreaView style={estilos.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

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

          <View style={estilos.divisor} />

          <Text style={estilos.tituloSecao}>
            Guia do circuito
          </Text>

          <Text style={estilos.descricao}>
            Visualize o traçado do circuito e explore as informações
            técnicas de cada setor.
          </Text>

          {carregando ? (
            <View style={estilos.carregando}>
              <ActivityIndicator
                size="large"
                color="#E10600"
              />

              <Text style={estilos.textoCarregando}>
                Carregando traçado...
              </Text>
            </View>
          ) : erro ? (
            <Text style={estilos.erro}>
              {erro}
            </Text>
          ) : dadosCircuito ? (
            <>

              {/* MAPA DO CIRCUITO */}
              <View style={estilos.cardCircuito}>

                <Text style={estilos.nomeMapa}>
                  {dadosCircuito.circuitName}
                </Text>

                <Text style={estilos.subtituloMapa}>
                  {dadosCircuito.location} • {dadosCircuito.countryName}
                </Text>

                <View
                  style={[
                    estilos.mapa,
                    {
                      height: dimensoesPista?.altura || 300,
                    },
                  ]}
                >
                  <View
                    style={[
                      estilos.areaPista,
                      {
                        height: dimensoesPista?.altura || 300,
                      },
                    ]}
                    onLayout={event => {
                      const largura = event.nativeEvent.layout.width;
                      setLarguraPista(largura);
                    }}
                  >

                    
                    {segmentosColoridos.length > 0 ? (
                      segmentosColoridos.map((segmento, index) => {
                        const { ponto, anterior, cor } = segmento;

                        const dx = ponto.x - anterior.x;
                        const dy = ponto.y - anterior.y;

                        const comprimento = Math.sqrt(
                          dx * dx + dy * dy
                        );

                        const angulo =
                          Math.atan2(dy, dx) * (180 / Math.PI);

                        const meioX = (ponto.x + anterior.x) / 2;
                        const meioY = (ponto.y + anterior.y) / 2;

                        return (
                          <View
                            key={`segmento-${index}`}
                            style={[
                              estilos.segmentoPista,
                              {
                                left: meioX - comprimento / 2,
                                top: meioY - 3,
                                width: comprimento,
                                backgroundColor: cor,
                                transform: [
                                  { rotate: `${angulo}deg` },
                                ],
                              },
                            ]}
                          />
                        );
                      })
                    ) : (
                      // tracado neutro caso não seja possível
                      // identificar as posições das curvas
                      pontos.slice(1).map((ponto, index) => {
                        const anterior = pontos[index];

                        const dx = ponto.x - anterior.x;
                        const dy = ponto.y - anterior.y;

                        const comprimento = Math.sqrt(
                          dx * dx + dy * dy
                        );

                        const angulo =
                          Math.atan2(dy, dx) * (180 / Math.PI);

                        const meioX = (ponto.x + anterior.x) / 2;
                        const meioY = (ponto.y + anterior.y) / 2;

                        return (
                          <View
                            key={`segmento-neutro-${index}`}
                            style={[
                              estilos.segmentoPista,
                              {
                                left: meioX - comprimento / 2,
                                top: meioY - 3,
                                width: comprimento,
                                backgroundColor: '#777',
                                transform: [
                                  { rotate: `${angulo}deg` },
                                ],
                              },
                            ]}
                          />
                        );
                      })
                    )}

                  </View>
                </View>

                {/* LEGENDA DOS SETORES */}
                <View style={estilos.legendaSetores}>

                  {['S1', 'S2', 'S3'].map(setor => (
                    <View
                      key={setor}
                      style={estilos.itemLegenda}
                    >
                      <View
                        style={[
                          estilos.pontoLegenda,
                          {
                            backgroundColor: coresSetores[setor],
                          },
                        ]}
                      />

                      <Text style={estilos.textoLegenda}>
                        {setor}
                      </Text>
                    </View>
                  ))}

                </View>

              </View>

              {/* ANÁLISE DOS SETORES */}
              <View style={estilos.secaoSetores}>

                <Text style={estilos.tituloSecao}>
                  Análise dos setores
                </Text>

                <Text style={estilos.descricao}>
                  Explore os três setores do circuito e solicite
                  uma análise técnica de cada trecho.
                </Text>

                {!mapeamentoSetores ? (
                  <View style={estilos.cardSemSetores}>
                    <Text style={estilos.textoSemSetores}>
                      Mapeamento de setores não disponível
                      para esta temporada.
                    </Text>
                  </View>
                ) : (
                  ['S1', 'S2', 'S3'].map(setor => {
                    const dadosSetor =
                      mapeamentoSetores.setores[setor];

                    const cor = coresSetores[setor];

                    const selecionado =
                      setorSelecionado === setor;

                    if (!dadosSetor) return null;

                    return (
                      <View
                        key={setor}
                        style={[
                          estilos.cardSetor,
                          selecionado && {
                            borderColor: cor,
                          },
                        ]}
                      >

                        <View style={estilos.topoCardSetor}>

                          <View
                            style={[
                              estilos.identificadorSetor,
                              { backgroundColor: cor },
                            ]}
                          >
                            <Text style={estilos.textoIdentificadorSetor}>
                              {setor}
                            </Text>
                          </View>

                          <View style={estilos.infoTopoSetor}>
                            <Text style={estilos.nomeSetor}>
                              Setor {setor.replace('S', '')}
                            </Text>

                            <Text style={estilos.quantidadeCurvas}>
                              {dadosSetor.curvas.length} curvas
                            </Text>
                          </View>

                        </View>

                        <Text style={estilos.rotuloCurvas}>
                          CURVAS DO SETOR
                        </Text>

                        <Text style={estilos.curvasSetor}>
                          {dadosSetor.curvas.join('  •  ')}
                        </Text>

                        <View style={estilos.linhaLimite}>
                          <Text style={estilos.rotuloLimite}>
                            LIMITE DO SETOR
                          </Text>

                          <Text style={estilos.textoLimite}>
                            {dadosSetor.limite || 'Não informado'}
                          </Text>
                        </View>

                        <Pressable
                          disabled={carregandoAnalise}
                          onPress={() => analisarSetor(setor)}
                          style={[
                            estilos.botaoAnalisar,
                            { backgroundColor: cor },
                            carregandoAnalise &&
                              estilos.botaoDesabilitado,
                          ]}
                        >
                          <Text style={estilos.textoBotaoAnalisar}>
                            {carregandoAnalise && selecionado
                              ? 'ANALISANDO...'
                              : 'ANALISAR SETOR'}
                          </Text>
                        </Pressable>

                      </View>
                    );
                  })
                )}

                {/* CARREGAMENTO DA ANÁLISE */}
                {carregandoAnalise && (
                  <View style={estilos.cardCarregandoAnalise}>
                    <ActivityIndicator
                      size="large"
                      color="#E10600"
                    />

                    <Text style={estilos.textoCarregando}>
                      Analisando o setor {setorSelecionado}...
                    </Text>

                    <Text style={estilos.avisoCarregamento}>
                      Isso pode levar alguns segundos.
                    </Text>
                  </View>
                )}

                {/* ERRO DA ANÁLISE */}
                {erroAnalise && (
                  <View style={estilos.cardErroAnalise}>
                    <Text style={estilos.tituloErroAnalise}>
                      Não foi possível gerar a análise
                    </Text>

                    <Text style={estilos.textoErroAnalise}>
                      {erroAnalise}
                    </Text>

                    <Pressable
                      style={estilos.botaoTentarNovamente}
                      onPress={() => analisarSetor(setorSelecionado)}
                    >
                      <Text style={estilos.textoTentarNovamente}>
                        Tentar novamente
                      </Text>
                    </Pressable>
                  </View>
                )}

                
                {analiseSetor && !carregandoAnalise && (
                  <View style={estilos.cardAnalise}>

                    <View style={estilos.topoAnalise}>

                      <View style={estilos.identificadorAnalise}>
                        <Text style={estilos.textoIdentificadorAnalise}>
                          AI
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={estilos.rotuloAnalise}>
                          ANÁLISE TÉCNICA
                        </Text>

                        <Text style={estilos.subtituloAnalise}>
                          Inteligência artificial • Gemini
                        </Text>
                      </View>

                      <View
                        style={[
                          estilos.badgeSetorAnalise,
                          {
                            backgroundColor:
                              coresSetores[setorSelecionado] + '25',
                            borderColor: coresSetores[setorSelecionado],
                          },
                        ]}
                      >
                        <Text
                          style={[
                            estilos.textoBadgeSetor,
                            {
                              color: coresSetores[setorSelecionado],
                            },
                          ]}
                        >
                          {setorSelecionado}
                        </Text>
                      </View>

                    </View>

                    <View style={estilos.divisorAnalise} />

                    <View style={estilos.conteudoAnalise}>
                      {renderizarAnalise()}
                    </View>

                    <View style={estilos.avisoAnalise}>
                      <Text style={estilos.textoAvisoAnalise}>
                        Análise baseada nos dados disponibilizados
                        do circuito. A ausência de telemetria pode
                        limitar a precisão de algumas avaliações.
                      </Text>
                    </View>

                  </View>
                )}

              </View>

            </>
          ) : null}

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
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 10,
  },

  descricao: {
    color: '#aaa',
    fontSize: 14,
    lineHeight: 22,
  },

  ano: {
    color: '#E10600',
    fontSize: 14,
    marginTop: 25,
    fontWeight: 'bold',
  },

  divisor: {
    height: 1,
    backgroundColor: '#333',
    marginTop: 25,
  },

  carregando: {
    padding: 40,
    alignItems: 'center',
  },

  textoCarregando: {
    color: '#aaa',
    marginTop: 12,
    textAlign: 'center',
  },

  erro: {
    color: '#ff5555',
    marginTop: 20,
  },

  // MAPA

  cardCircuito: {
    backgroundColor: '#181818',
    borderRadius: 12,
    padding: 12,
    marginTop: 15,
  },

  nomeMapa: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  subtituloMapa: {
    color: '#888',
    marginTop: 5,
    fontSize: 12,
  },

  mapa: {
    width: '100%',
    backgroundColor: '#111',
    marginTop: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },

  areaPista: {
    width: '100%',
    position: 'relative',
  },

  segmentoPista: {
    position: 'absolute',
    height: 6,
    borderRadius: 5,
  },

  legendaSetores: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
    paddingVertical: 17,
    borderTopWidth: 1,
    borderTopColor: '#292929',
    marginTop: 8,
  },

  itemLegenda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  pontoLegenda: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  textoLegenda: {
    color: '#ddd',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // SETORES

  secaoSetores: {
    marginTop: 10,
  },

  cardSemSetores: {
    backgroundColor: '#191919',
    borderRadius: 12,
    padding: 18,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#333',
  },

  textoSemSetores: {
    color: '#aaa',
    fontSize: 14,
    lineHeight: 21,
  },

  cardSetor: {
    backgroundColor: '#191919',
    borderRadius: 14,
    padding: 18,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#303030',
  },

  topoCardSetor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  identificadorSetor: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textoIdentificadorSetor: {
    color: '#101010',
    fontSize: 17,
    fontWeight: '900',
  },

  infoTopoSetor: {
    marginLeft: 13,
  },

  nomeSetor: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  quantidadeCurvas: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },

  rotuloCurvas: {
    color: '#777',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 9,
  },

  curvasSetor: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 25,
  },

  linhaLimite: {
    backgroundColor: '#222',
    borderRadius: 9,
    padding: 12,
    marginTop: 18,
  },

  rotuloLimite: {
    color: '#888',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 6,
  },

  textoLimite: {
    color: '#ddd',
    fontSize: 13,
    lineHeight: 20,
  },

  botaoAnalisar: {
    borderRadius: 9,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 16,
  },

  textoBotaoAnalisar: {
    color: '#101010',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  botaoDesabilitado: {
    opacity: 0.5,
  },

  // CARREGAMENTO DA ANÁLISE

  cardCarregandoAnalise: {
    backgroundColor: '#191919',
    borderRadius: 14,
    padding: 25,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#303030',
  },

  avisoCarregamento: {
    color: '#777',
    fontSize: 12,
    marginTop: 8,
  },

  // PAINEL DE ANÁLISE

  cardAnalise: {
    backgroundColor: '#191919',
    borderRadius: 16,
    padding: 18,
    marginTop: 22,
    borderWidth: 1,
    borderColor: '#303030',
  },

  topoAnalise: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  identificadorAnalise: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#E1060025',
    borderWidth: 1,
    borderColor: '#E10600',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textoIdentificadorAnalise: {
    color: '#E10600',
    fontSize: 15,
    fontWeight: '900',
  },

  rotuloAnalise: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },

  subtituloAnalise: {
    color: '#888',
    fontSize: 11,
    marginTop: 4,
  },

  badgeSetorAnalise: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  textoBadgeSetor: {
    fontWeight: '900',
    fontSize: 12,
  },

  divisorAnalise: {
    height: 1,
    backgroundColor: '#303030',
    marginVertical: 18,
  },

  conteudoAnalise: {
    gap: 9,
  },

  tituloTopicoAnalise: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 13,
    marginBottom: 3,
  },

  paragrafoAnalise: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 23,
  },

  linhaTopicoAnalise: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 5,
  },

  marcadorTopico: {
    color: '#E10600',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 9,
    lineHeight: 23,
  },

  textoTopicoAnalise: {
    flex: 1,
    color: '#ccc',
    fontSize: 14,
    lineHeight: 23,
  },

  avisoAnalise: {
    backgroundColor: '#252116',
    borderRadius: 9,
    padding: 12,
    marginTop: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#E6B85C',
  },

  textoAvisoAnalise: {
    color: '#D8BD80',
    fontSize: 11,
    lineHeight: 18,
  },

  // ERRO DA ANÁLISE

  cardErroAnalise: {
    backgroundColor: '#251515',
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#702020',
  },

  tituloErroAnalise: {
    color: '#ff6666',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  textoErroAnalise: {
    color: '#ddd',
    fontSize: 13,
    lineHeight: 20,
  },

  botaoTentarNovamente: {
    backgroundColor: '#E10600',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },

  textoTentarNovamente: {
    color: '#fff',
    fontWeight: 'bold',
  },

});
