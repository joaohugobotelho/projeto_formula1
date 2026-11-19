
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const API = 'https://api.openf1.org/v1';

const temporadas = ['2024', '2025', '2026'];

// Compostos e cores dos pneus
const compostos = {
  SOFT: { nome: 'Macio', cor: '#E53935' },
  MEDIUM: { nome: 'Médio', cor: '#FBC02D' },
  HARD: { nome: 'Duro', cor: '#FFFFFF' },
  INTERMEDIATE: { nome: 'Intermediário', cor: '#43A047' },
  WET: { nome: 'Chuva', cor: '#2196F3' },
};

function obterComposto(nome) {
  return (
    compostos[nome] || {
      nome: nome || 'Não informado',
      cor: '#AAAAAA',
    }
  );
}

// Prioriza o tempo parado e usa o tempo de pit lane como alternativa
function obterTempoParada(parada) {
  if (
    parada.stop_duration !== null &&
    parada.stop_duration !== undefined
  ) {
    return {
      rotulo: 'Tempo parado',
      valor: `${Number(parada.stop_duration)
        .toFixed(1)
        .replace('.', ',')} segundos`,
    };
  }

  const tempoPit =
    parada.lane_duration ?? parada.pit_duration;

  if (
    tempoPit !== null &&
    tempoPit !== undefined
  ) {
    return {
      rotulo: 'Tempo no pit lane',
      valor: `${Number(tempoPit)
        .toFixed(1)
        .replace('.', ',')} segundos`,
    };
  }

  return {
    rotulo: 'Tempo nos boxes',
    valor: 'Não registrado',
  };
}

// Desenho do pneu
function PneuDesenho({ cor }) {
  return (
    <View style={styles.pneuDesenho}>
      <View
        style={[
          styles.faixaPneu,
          { borderColor: cor },
        ]}
      />
    </View>
  );
}

export default function Pits() {
  const [temporada, setTemporada] = useState('2025');

  const [gps, setGps] = useState([]);
  const [pilotos, setPilotos] = useState([]);

  const [gpSelecionado, setGpSelecionado] = useState(null);
  const [pilotoSelecionado, setPilotoSelecionado] = useState(null);
  const [sessaoSelecionada, setSessaoSelecionada] = useState(null);

  const [paradas, setParadas] = useState([]);

  const [mostrarGPs, setMostrarGPs] = useState(false);
  const [mostrarPilotos, setMostrarPilotos] = useState(false);

  const [carregandoGPs, setCarregandoGPs] = useState(false);
  const [carregandoPilotos, setCarregandoPilotos] = useState(false);
  const [carregandoParadas, setCarregandoParadas] = useState(false);

  const [erro, setErro] = useState('');

  // Função para consultar a API
  async function buscarDados(url) {
    const resposta = await fetch(url);

    if (!resposta.ok) {
      throw new Error('Erro ao consultar a API OpenF1.');
    }

    return await resposta.json();
  }

  // ETAPA 1: CARREGAR OS GPs DA TEMPORADA
  useEffect(() => {
    async function carregarTemporada() {
      try {
        setCarregandoGPs(true);
        setErro('');

        setGps([]);
        setPilotos([]);
        setGpSelecionado(null);
        setPilotoSelecionado(null);
        setSessaoSelecionada(null);
        setParadas([]);

        const [dadosMeetings, dadosSessoes] =
          await Promise.all([
            buscarDados(`${API}/meetings?year=${temporada}`),
            buscarDados(
              `${API}/sessions?year=${temporada}&session_name=Race`
            ),
          ]);

        const sessoesCorrida = dadosSessoes.filter(
          (sessao) => !sessao.is_cancelled
        );

        const sessoesPorMeeting = new Map();

        sessoesCorrida.forEach((sessao) => {
          sessoesPorMeeting.set(
            sessao.meeting_key,
            sessao
          );
        });

        const listaGPs = dadosMeetings
          .filter(
            (meeting) =>
              sessoesPorMeeting.has(meeting.meeting_key)
          )
          .map((meeting) => ({
            ...meeting,
            sessao: sessoesPorMeeting.get(
              meeting.meeting_key
            ),
          }))
          .sort(
            (a, b) =>
              new Date(a.date_start) -
              new Date(b.date_start)
          );

        setGps(listaGPs);

        if (listaGPs.length === 0) {
          setErro(
            'Nenhuma corrida encontrada para essa temporada.'
          );
        }
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregandoGPs(false);
      }
    }

    carregarTemporada();
  }, [temporada]);

  // ETAPA 2: SELECIONAR GP E CARREGAR PILOTOS
  async function selecionarGP(gp) {
    try {
      setGpSelecionado(gp);
      setPilotoSelecionado(null);
      setParadas([]);
      setPilotos([]);
      setSessaoSelecionada(gp.sessao);

      setMostrarGPs(false);
      setMostrarPilotos(false);

      setCarregandoPilotos(true);
      setErro('');

      const dadosPilotos = await buscarDados(
        `${API}/drivers?session_key=${gp.sessao.session_key}`
      );

      const pilotosUnicos = Array.from(
        new Map(
          dadosPilotos.map((piloto) => [
            piloto.driver_number,
            piloto,
          ])
        ).values()
      );

      pilotosUnicos.sort((a, b) =>
        a.full_name.localeCompare(b.full_name)
      );

      setPilotos(pilotosUnicos);

      if (pilotosUnicos.length === 0) {
        setErro(
          'Ainda não há pilotos disponíveis para essa corrida.'
        );
      }
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregandoPilotos(false);
    }
  }

  // ETAPA 3: CARREGAR PIT STOPS E PNEUS
  async function selecionarPiloto(piloto) {
    setPilotoSelecionado(piloto);
    setMostrarPilotos(false);
    setParadas([]);
    setErro('');

    if (!sessaoSelecionada) return;

    try {
      setCarregandoParadas(true);

      const sessionKey = sessaoSelecionada.session_key;
      const driverNumber = piloto.driver_number;

      const [dadosPit, dadosStints] = await Promise.all([
        buscarDados(
          `${API}/pit?session_key=${sessionKey}&driver_number=${driverNumber}`
        ),
        buscarDados(
          `${API}/stints?session_key=${sessionKey}&driver_number=${driverNumber}`
        ),
      ]);

      const stintsOrdenados = [...dadosStints].sort(
        (a, b) => a.stint_number - b.stint_number
      );

      const pitStopsOrdenados = [...dadosPit].sort(
        (a, b) => a.lap_number - b.lap_number
      );

      const paradasComPneus = pitStopsOrdenados.map(
        (parada) => {
          const stintAnterior = stintsOrdenados
            .filter(
              (stint) =>
                stint.lap_end <= parada.lap_number
            )
            .sort(
              (a, b) => b.lap_end - a.lap_end
            )[0];

          const stintNovo = stintsOrdenados
            .filter(
              (stint) =>
                stint.lap_start > parada.lap_number
            )
            .sort(
              (a, b) => a.lap_start - b.lap_start
            )[0];

          return {
            ...parada,
            pneuAnterior:
              stintAnterior?.compound || null,
            pneuNovo:
              stintNovo?.compound || null,
          };
        }
      );

      setParadas(paradasComPneus);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregandoParadas(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <Text style={styles.titulo}>
          Pits — F1 HUB
        </Text>

        {/* ETAPA 1 - TEMPORADA */}
        <Text style={styles.etapa}>
          ETAPA 1 · ESCOLHA A TEMPORADA
        </Text>

        <Text style={styles.subtitulo}>
          Selecione o ano
        </Text>

        <View style={styles.temporadas}>
          {temporadas.map((ano) => (
            <TouchableOpacity
              key={ano}
              style={[
                styles.botaoTemporada,
                temporada === ano && styles.temporadaAtiva,
              ]}
              onPress={() => setTemporada(ano)}
            >
              <Text
                style={[
                  styles.textoTemporada,
                  temporada === ano &&
                    styles.textoTemporadaAtiva,
                ]}
              >
                {ano}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ETAPA 2 - GP */}
        <Text style={styles.etapa}>
          ETAPA 2 · ESCOLHA O GP
        </Text>

        <Text style={styles.subtitulo}>
          Selecione a pista
        </Text>

        <TouchableOpacity
          style={styles.seletor}
          onPress={() => {
            setMostrarGPs(!mostrarGPs);
            setMostrarPilotos(false);
          }}
          disabled={carregandoGPs || gps.length === 0}
        >
          <Text style={styles.textoSeletor}>
            {gpSelecionado
              ? gpSelecionado.meeting_name
              : carregandoGPs
                ? 'Carregando pistas...'
                : 'Selecione um GP'}
          </Text>

          <Ionicons
            name="chevron-down"
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {mostrarGPs && (
          <ScrollView
            style={styles.opcoes}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            {gps.map((gp) => (
              <TouchableOpacity
                key={gp.meeting_key}
                style={styles.opcao}
                onPress={() => selecionarGP(gp)}
              >
                <Text style={styles.textoOpcao}>
                  {gp.meeting_name}
                </Text>

                <Text style={styles.localGP}>
                  {gp.location}, {gp.country_name}
                </Text>

                <Text style={styles.dataGP}>
                  {gp.date_start
                    ? new Date(
                        gp.date_start
                      ).toLocaleDateString('pt-BR')
                    : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {carregandoGPs && (
          <ActivityIndicator
            color="#E53935"
            style={styles.carregando}
          />
        )}

        {/* ETAPA 3 - PILOTO */}
        <Text style={styles.etapa}>
          ETAPA 3 · ESCOLHA O PILOTO
        </Text>

        <Text style={styles.subtitulo}>
          Selecione o piloto
        </Text>

        <TouchableOpacity
          style={styles.seletor}
          onPress={() => {
            setMostrarPilotos(!mostrarPilotos);
            setMostrarGPs(false);
          }}
          disabled={!gpSelecionado || carregandoPilotos}
        >
          <Text style={styles.textoSeletor}>
            {pilotoSelecionado
              ? pilotoSelecionado.full_name
              : carregandoPilotos
                ? 'Carregando pilotos...'
                : 'Selecione um piloto'}
          </Text>

          <Ionicons
            name="chevron-down"
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {mostrarPilotos && (
          <ScrollView
            style={styles.opcoes}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            {pilotos.map((piloto) => (
              <TouchableOpacity
                key={piloto.driver_number}
                style={styles.opcao}
                onPress={() => selecionarPiloto(piloto)}
              >
                <View style={styles.linhaPiloto}>
                  <Text
                    style={[
                      styles.numeroPiloto,
                      {
                        color: `#${piloto.team_colour || 'FFFFFF'}`,
                      },
                    ]}
                  >
                    {piloto.driver_number}
                  </Text>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.textoOpcao}>
                      {piloto.full_name}
                    </Text>

                    <Text style={styles.localGP}>
                      {piloto.team_name}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {carregandoPilotos && (
          <ActivityIndicator
            color="#E53935"
            style={styles.carregando}
          />
        )}

        {/* ERROS */}
        {erro !== '' && (
          <View style={styles.avisoErro}>
            <Ionicons
              name="alert-circle-outline"
              size={22}
              color="#FF5555"
            />

            <Text style={styles.textoErro}>
              {erro}
            </Text>
          </View>
        )}

        {/* ETAPA 4 - BOXES */}
        <Text style={styles.etapa}>
          ETAPA 4 · PARADAS NOS BOXES
        </Text>

        <Text style={styles.subtitulo}>
          Histórico de pit stops
        </Text>

        {!pilotoSelecionado ? (
          <View style={styles.aviso}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#AAAAAA"
            />

            <Text style={styles.textoAviso}>
              Selecione a temporada, o GP e o piloto para visualizar as paradas.
            </Text>
          </View>
        ) : carregandoParadas ? (
          <ActivityIndicator
            color="#E53935"
            size="large"
            style={styles.carregando}
          />
        ) : paradas.length === 0 ? (
          <View style={styles.aviso}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#AAAAAA"
            />

            <Text style={styles.textoAviso}>
              Não encontramos pit stops disponíveis para esse piloto nessa corrida.
            </Text>
          </View>
        ) : (
          paradas.map((parada, indice) => {
            const anterior = obterComposto(
              parada.pneuAnterior
            );

            const novo = obterComposto(
              parada.pneuNovo
            );

            const tempo = obterTempoParada(parada);

            return (
              <View
                key={`${parada.lap_number}-${indice}`}
                style={styles.cardParada}
              >
                {/* CABEÇALHO DA PARADA */}
                <View style={styles.linhaTitulo}>
                  <Text style={styles.tituloParada}>
                    Parada {indice + 1}
                  </Text>

                  <Text style={styles.concluida}>
                    Concluída
                  </Text>
                </View>

                {/* INFORMAÇÕES */}
                <View style={styles.informacoes}>
                  <View>
                    <Text style={styles.rotulo}>
                      Volta
                    </Text>

                    <Text style={styles.valor}>
                      Volta {parada.lap_number}
                    </Text>
                  </View>

                  <View style={styles.blocoTempo}>
                    <Text style={styles.rotulo}>
                      {tempo.rotulo}
                    </Text>

                    <Text style={styles.valor}>
                      {tempo.valor}
                    </Text>
                  </View>
                </View>

                <View style={styles.divisor} />

                {/* TROCA DE PNEUS */}
                <View style={styles.trocaPneus}>
                  <View style={styles.pneu}>
                    <PneuDesenho cor={anterior.cor} />

                    <Text
                      style={[
                        styles.nomePneu,
                        { color: anterior.cor },
                      ]}
                    >
                      {anterior.nome}
                    </Text>
                  </View>

                  <Ionicons
                    name="arrow-forward"
                    size={23}
                    color="#FFFFFF"
                  />

                  <View style={styles.pneu}>
                    <PneuDesenho cor={novo.cor} />

                    <Text
                      style={[
                        styles.nomePneu,
                        { color: novo.cor },
                      ]}
                    >
                      {novo.nome}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111317',
  },

  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 35,
  },

  titulo: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: 'bold',
    marginBottom: 25,
  },

  etapa: {
    color: '#E53935',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 22,
    marginBottom: 10,
  },

  subtitulo: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  temporadas: {
    flexDirection: 'row',
    gap: 10,
  },

  botaoTemporada: {
    flex: 1,
    backgroundColor: '#25282E',
    paddingVertical: 13,
    borderRadius: 9,
    alignItems: 'center',
  },

  temporadaAtiva: {
    backgroundColor: '#E53935',
  },

  textoTemporada: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  textoTemporadaAtiva: {
    color: '#FFFFFF',
  },

  seletor: {
    backgroundColor: '#25282E',
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  textoSeletor: {
    color: '#FFFFFF',
    fontSize: 15,
    flex: 1,
  },

  opcoes: {
    backgroundColor: '#25282E',
    borderRadius: 10,
    marginTop: 5,
    maxHeight: 260,
  },

  opcao: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#393C42',
  },

  textoOpcao: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  localGP: {
    color: '#A0A4AB',
    fontSize: 12,
    marginTop: 4,
  },

  dataGP: {
    color: '#777D86',
    fontSize: 11,
    marginTop: 3,
  },

  linhaPiloto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  numeroPiloto: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 30,
  },

  carregando: {
    marginTop: 18,
    marginBottom: 8,
  },

  avisoErro: {
    backgroundColor: '#352020',
    padding: 14,
    borderRadius: 10,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  textoErro: {
    color: '#FF7777',
    fontSize: 13,
    flex: 1,
  },

  aviso: {
    backgroundColor: '#25282E',
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  textoAviso: {
    color: '#AAAAAA',
    fontSize: 13,
    flex: 1,
    lineHeight: 20,
  },

  // CARTÃO DOS BOXES
  cardParada: {
    backgroundColor: '#25282E',
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
    marginBottom: 15,
  },

  linhaTitulo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  tituloParada: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  concluida: {
    color: '#4CAF50',
    fontSize: 13,
    fontWeight: 'bold',
  },

  informacoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  blocoTempo: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 15,
  },

  rotulo: {
    color: '#A0A4AB',
    fontSize: 12,
    marginBottom: 6,
  },

  valor: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  divisor: {
    height: 1,
    backgroundColor: '#393C42',
    marginVertical: 18,
  },

  trocaPneus: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 25,
  },

  pneu: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  pneuDesenho: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#090909',
    borderWidth: 7,
    borderColor: '#555555',
    justifyContent: 'center',
    alignItems: 'center',
  },

  faixaPneu: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 4,
  },

  nomePneu: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 6,
  },
});
