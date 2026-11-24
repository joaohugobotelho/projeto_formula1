import { setoresCircuitos } from "./setoresCircuitos";


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const MODELO = 'gemini-3.1-flash-lite';


const CONTEXTO_ATUAL = `
  Data de referência: novembro de 2026.

  FATO CONFIRMADO:
  - Lando Norris foi campeão mundial de Fórmula 1 em 2025.
  - Conquistou o título no GP de Abu Dhabi de 2025.
  - Terminou a temporada com 423 pontos.
  - Max Verstappen terminou em segundo lugar, com 421 pontos.
  - Norris conquistou seu primeiro título mundial.

  Nunca apresente informações anteriores a esse resultado
  como se ainda fossem a situação atual.
`;


async function consultarGemini(pergunta) {
  try {
    const resposta = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },

        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: pergunta,
                },
              ],
            },
          ],

          generationConfig: {
            temperature: 0.3,
          },
        }),
      }
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
      console.log('STATUS:', resposta.status);

      console.log(
        'ERRO COMPLETO:',
        JSON.stringify(dados, null, 2)
      );

      throw new Error(
        dados.error?.message || 'Erro na API Gemini'
      );
    }

    const candidato = dados.candidates?.[0];

    if (!candidato) {
      throw new Error('O Gemini não retornou uma resposta.');
    }


    const texto = candidato.content?.parts
      ?.map(parte => parte.text || '')
      .join('\n')
      .trim();

    if (!texto) {
      throw new Error(
        'O Gemini retornou uma resposta vazia.'
      );
    }


    const chunks =
      candidato.groundingMetadata?.groundingChunks || [];

    const fontes = chunks
      .filter(item => item.web?.uri)
      .map(item => ({
        titulo: item.web.title || 'Fonte consultada',
        url: item.web.uri,
      }));

    // Remove fontes duplicadas.
    const fontesUnicas = [
      ...new Map(
        fontes.map(fonte => [fonte.url, fonte])
      ).values(),
    ];

    return {
      texto,
      fontes: fontesUnicas,
    };

  } catch (erro) {
    console.log('Erro Gemini:', erro.message);
    throw erro;
  }
}



export async function testarGemini() {
  const pergunta = `
    ${CONTEXTO_ATUAL}

    Explique brevemente a história da Fórmula 1.

    Apresente informações interessantes e confirmadas.

    Responda em português brasileiro.
  `;

  const resultado = await consultarGemini(pergunta);

  return resultado.texto;
}



export async function buscarEspecificacoesCarro(
  equipe,
  temporada = 2026
) {
  const pergunta = `
    Você é um assistente especializado em Fórmula 1
    e deve apresentar informações técnicas com precisão.

    ${CONTEXTO_ATUAL}

    EQUIPE: ${equipe}
    TEMPORADA: ${temporada}

    Organize as informações nos seguintes tópicos:

    1. Nome e modelo do carro.
    2. Unidade de potência.
    3. Motor.
    4. Chassi.
    5. Câmbio.
    6. Suspensão dianteira e traseira.
    7. Peso.
    8. Outros detalhes técnicos relevantes.

    REGRAS IMPORTANTES:

    - Utilize exclusivamente informações referentes à temporada solicitada.
    - Não confunda especificações de temporadas diferentes.
    - Não invente informações técnicas.
    - Não apresente estimativas como dados oficiais.
    - Diferencie regras gerais da FIA de características específicas da equipe.
    - Quando não souber uma informação, escreva:
      "Informação não confirmada".
    - Não afirme que consultou fontes externas se não realizou uma pesquisa.
    - Responda em português brasileiro.
    - Utilize títulos e tópicos para facilitar a leitura.
  `;

  return await consultarGemini(pergunta);
}



export async function buscarHistoriaPiloto(piloto) {
  const nome = piloto.full_name || 'Piloto desconhecido';

  const pergunta = `
    Você é um especialista em Fórmula 1 e está
    produzindo uma biografia para o aplicativo F1 HUB.

    ${CONTEXTO_ATUAL}

    IDENTIFICAÇÃO DO PILOTO:

    - Nome: ${nome}
    - Número: ${piloto.driver_number || 'Não informado'}
    - Equipe: ${piloto.team_name || 'Não informada'}
    - Nacionalidade: ${piloto.country_code || 'Não informada'}

    ORGANIZE A BIOGRAFIA:

    1. INÍCIO DA CARREIRA
       Conte como o piloto começou no automobilismo.

    2. KART E CATEGORIAS DE BASE
       Apresente sua trajetória nas categorias anteriores à F1.

    3. CAMINHO ATÉ A FÓRMULA 1
       Explique como conseguiu chegar à categoria.

    4. ESTREIA NA FÓRMULA 1
       Informe o ano, a equipe e o contexto da estreia.

    5. EQUIPES
       Apresente todas as equipes pelas quais passou,
       respeitando a ordem cronológica.

    6. VITÓRIAS E PÓDIOS
       Destaque suas principais conquistas na categoria.

    7. TÍTULOS E CONQUISTAS
       Informe campeonatos mundiais e outros títulos
       importantes conquistados na carreira.

    8. MOMENTO ATUAL
       Apresente a situação mais recente da carreira,
       considerando a data de referência.

    REGRAS OBRIGATÓRIAS:

    - Respeite a cronologia da carreira.
    - Não invente vitórias, pódios ou títulos.
    - Não confunda títulos de categorias de base
      com títulos mundiais de Fórmula 1.
    - Considere o contexto atualizado fornecido acima.
    - Se não tiver certeza de um dado, informe que
      ele não está confirmado.
    - Não apresente informações antigas como atuais.
    - Não afirme que pesquisou na internet se isso
      não aconteceu.
    - Escreva em português brasileiro.
    - Utilize uma linguagem clara e interessante.
    - Evite introduções muito longas.
    - Organize o texto com subtítulos e parágrafos.
  `;

  return await consultarGemini(pergunta);
}





export async function buscarDadosCircuito(gp) {
  try {
    console.log('GP SELECIONADO:', gp);

    const circuitoKey = gp.circuit_key ?? gp.circuitKey;
    const temporada = Number(gp.year ?? gp.season);

    if (!circuitoKey) {
      throw new Error('Identificador do circuito não encontrado.');
    }

    if (!temporada) {
      throw new Error('Temporada do GP não encontrada.');
    }

    const url = `https://api.multiviewer.app/api/v1/circuits/${circuitoKey}/${temporada}`;

    console.log('URL DO CIRCUITO:', url);

    // Primeiro fazemos a requisição
    const resposta = await fetch(url);

    // Depois verificamos se ela funcionou
    if (!resposta.ok) {
      throw new Error(
        `Não foi possível buscar os dados do circuito. Status: ${resposta.status}`
      );
    }

    // Agora recebemos os dados em JSON
    const dados = await resposta.json();

    // LOGS DA AUDITORIA
    console.log('========== AUDITORIA DO CIRCUITO ==========');
    console.log('GP SELECIONADO:', gp);
    console.log('CIRCUIT KEY:', circuitoKey);
    console.log('TEMPORADA:', temporada);
    console.log('NOME DO CIRCUITO:', dados.circuitName);
    console.log('TOTAL DE CURVAS:', dados.corners?.length);
    console.log('CURVAS DO CIRCUITO:', dados.corners);

    console.log(
      'IDENTIFICADORES DAS CURVAS:',
      dados.corners?.map(curva =>
        `${curva.number}${curva.letter || ''}`
      )
    );

    console.log('===========================================');

    // Mantemos a temporada nos dados retornados
    const dadosComTemporada = {
      ...dados,
      season: temporada
    };

    return dadosComTemporada;

  } catch (erro) {
    console.log('Erro ao buscar circuito:', erro.message);
    throw erro;
  }
}



export function auditarMapeamentoSetores(dadosCircuito) {
  try {
    if (!dadosCircuito) {
      throw new Error('Dados do circuito não encontrados.');
    }

    const temporada = Number(
      dadosCircuito.season || dadosCircuito.year
    );

    const chaveCircuito =
      `${dadosCircuito.circuitKey}-${temporada}`;

    const configuracao = setoresCircuitos[chaveCircuito];

    if (!configuracao) {
      return {
        sucesso: false,
        mensagem: 'Circuito sem mapeamento cadastrado.',
        chaveCircuito,
      };
    }

    const curvasReais = (dadosCircuito.corners || []).map(curva =>
      `${curva.number}${curva.letter || ''}`
    );

    const curvasCadastradas = [
      ...configuracao.setores.S1.curvas.map(String),
      ...configuracao.setores.S2.curvas.map(String),
      ...configuracao.setores.S3.curvas.map(String),
    ];

    const curvasInexistentes = curvasCadastradas.filter(
      curva => !curvasReais.includes(curva)
    );

    const curvasNaoMapeadas = curvasReais.filter(
      curva => !curvasCadastradas.includes(curva)
    );

    const curvasDuplicadas = curvasCadastradas.filter(
      (curva, index) =>
        curvasCadastradas.indexOf(curva) !== index
    );

    const setoresComProblemas = [];

    ['S1', 'S2', 'S3'].forEach(setor => {
      const dadosSetor = configuracao.setores[setor];

      if (!dadosSetor || !Array.isArray(dadosSetor.curvas)) {
        setoresComProblemas.push(setor);
      }
    });

    const aprovado =
      curvasInexistentes.length === 0 &&
      curvasNaoMapeadas.length === 0 &&
      curvasDuplicadas.length === 0 &&
      setoresComProblemas.length === 0;

    const resultado = {
      sucesso: aprovado,
      circuito: dadosCircuito.circuitName,
      temporada,
      chaveCircuito,
      totalCurvasReais: curvasReais.length,
      totalCurvasCadastradas: curvasCadastradas.length,
      curvasInexistentes,
      curvasNaoMapeadas,
      curvasDuplicadas,
      setoresComProblemas,
    };

    console.log('========== AUDITORIA DOS SETORES ==========');
    console.log(JSON.stringify(resultado, null, 2));
    console.log(
      aprovado
        ? 'MAPEAMENTO ESTRUTURAL APROVADO'
        : 'MAPEAMENTO PRECISA DE REVISÃO'
    );
    console.log('===========================================');

    return resultado;

  } catch (erro) {
    console.log('Erro na auditoria:', erro.message);
    throw erro;
  }
}






export async function buscarAnaliseSetor(
  setor,
  dadosCircuito,
  dadosSetor = null
) {
  try {

    if (!['S1', 'S2', 'S3'].includes(setor)) {
      throw new Error('Setor inválido. Selecione S1, S2 ou S3.');
    }


    if (!dadosCircuito) {
      throw new Error('Dados do circuito não encontrados.');
    }

    const temporada = Number(
      dadosCircuito.season || dadosCircuito.year
    );

    if (!temporada) {
      throw new Error('Temporada do circuito não identificada.');
    }


    const chaveCircuito =
      `${dadosCircuito.circuitKey}-${temporada}`;

    const configuracao = setoresCircuitos[chaveCircuito];

    if (!configuracao) {
      throw new Error(
        'A divisão oficial dos setores deste circuito ainda não foi cadastrada.'
      );
    }


    const configuracaoSetor = configuracao.setores?.[setor];

    if (!configuracaoSetor) {
      throw new Error(
        `Configuração do setor ${setor} não encontrada.`
      );
    }


    const curvasConfiguradas =
      configuracaoSetor.curvas.map(String);

    const curvasDoSetor = (dadosCircuito.corners || [])
      .filter(curva => {
        const identificacao =
          `${curva.number}${curva.letter || ''}`;

        return curvasConfiguradas.includes(identificacao);
      });

    if (curvasDoSetor.length === 0) {
      throw new Error(
        `Nenhuma curva encontrada para o setor ${setor}.`
      );
    }


    const informacoesCircuito = {
      nome: dadosCircuito.circuitName,
      temporada,
      setorSelecionado: setor,
      limiteDoSetor: configuracaoSetor.limite,

      curvasDoSetor: curvasDoSetor.map(curva => ({
        numero: curva.number,
        letra: curva.letter || '',
        angulo: curva.angle,
        comprimento: curva.length,
        posicao: curva.trackPosition
      }))
    };


    const pergunta = `
      Você é um engenheiro especializado em Fórmula 1,
      aerodinâmica e análise técnica de circuitos.

      ${CONTEXTO_ATUAL}

      Analise tecnicamente o setor selecionado no F1 HUB.

      CIRCUITO: ${informacoesCircuito.nome}
      TEMPORADA: ${temporada}
      SETOR: ${setor}

      LIMITE OFICIAL:
      ${informacoesCircuito.limiteDoSetor}

      CURVAS DO SETOR:
      ${JSON.stringify(
      informacoesCircuito.curvasDoSetor,
      null,
      2
    )}

      DADOS ADICIONAIS:
      ${dadosSetor
        ? JSON.stringify(dadosSetor, null, 2)
        : 'Nenhum dado adicional de telemetria foi fornecido.'}

      Analise exclusivamente as curvas informadas.

      ORGANIZE A RESPOSTA:

      1. CARACTERÍSTICAS DO SETOR
      Descreva o perfil técnico do trecho.

      2. CURVAS E TRAÇADO
      Explique as características das curvas fornecidas.

      3. DESAFIOS DE PILOTAGEM
      Explique os desafios de frenagem, aceleração,
      tração e aerodinâmica quando aplicáveis.

      4. DESEMPENHO E TELEMETRIA
      Analise dados de desempenho somente quando
      houver informações disponíveis.

      5. RESUMO TÉCNICO
      Apresente os principais pontos do setor.

      REGRAS:

      - Não invente velocidades ou pontos de frenagem.
      - Não invente dados de telemetria.
      - Não inclua curvas de outros setores.
      - Diferencie fatos confirmados de hipóteses.
      - Não confunda setores de cronometragem com
        setores de fiscais (marshal sectors).
      - Informe quando não houver dados suficientes.
      - Responda em português brasileiro.
      - Utilize subtítulos e linguagem clara.
    `;


    console.log('CIRCUITO:', informacoesCircuito.nome);
    console.log('TEMPORADA:', temporada);
    console.log('CHAVE:', chaveCircuito);
    console.log('SETOR:', setor);
    console.log(
      'CURVAS ENVIADAS:',
      informacoesCircuito.curvasDoSetor
    );


    const resultado = await consultarGemini(pergunta);

    return resultado;

  } catch (erro) {
    console.log('Erro ao analisar setor:', erro.message);
    throw erro;
  }
}




