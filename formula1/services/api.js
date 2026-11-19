
const GEMINI_API_KEY = 'BLABLA';

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

// CONFIGURAÇÃO GERAL DO GEMINI
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

    // Verifica se ocorreu algum erro na requisição.
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

    // Extrai o texto gerado pelo Gemini.
    const texto = candidato.content?.parts
      ?.map(parte => parte.text || '')
      .join('\n')
      .trim();

    if (!texto) {
      throw new Error(
        'O Gemini retornou uma resposta vazia.'
      );
    }

    // Fontes só serão preenchidas quando houver
    // pesquisa com Google Search habilitada.
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


// TESTAR CONEXÃO COM O GEMINI
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


// BUSCAR ESPECIFICAÇÕES DOS CARROS
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


// BUSCAR HISTÓRIA DOS PILOTOS
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
