# F1 HUB 🏎️

Aplicativo mobile desenvolvido com **React Native e Expo** para reunir informações sobre o universo da Fórmula 1. O projeto apresenta dados de pilotos, equipes, Grandes Prêmios, campeonatos e paradas nos boxes em uma interface com tema escuro inspirado no automobilismo.

## 📱 Funcionalidades

- **Início:** tela inicial do aplicativo.
- **Equipes:** consulta de pilotos por equipe e visualização de informações técnicas dos carros da temporada 2026.
- **Grandes Prêmios (GPs):** listagem de corridas por temporada, pesquisa por GP, país ou circuito e acesso à tela de detalhes.
- **Detalhes do GP:** exibição do traçado do circuito, curvas e análise técnica dos setores disponíveis.
- **Campeonatos:** consulta dos líderes ou campeões dos campeonatos de pilotos e construtores por temporada.
- **Pits:** seleção de temporada, GP e piloto para consultar o histórico de pit stops, tempos registrados e compostos de pneus.
- **Favoritos:** possibilidade de salvar pilotos e circuitos para acesso posterior.
- **Sobre:** apresentação do aplicativo.

> A disponibilidade dos dados depende das APIs externas, da temporada selecionada e da existência de informações para cada sessão.

## 🧰 Tecnologias utilizadas

- [React Native](https://reactnative.dev/)
- [Expo SDK 54](https://docs.expo.dev/)
- JavaScript
- [React Navigation](https://reactnavigation.org/) — navegação por abas, menu lateral e telas de detalhes.
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) — armazenamento local dos favoritos.
- [Expo Vector Icons](https://icons.expo.fyi/) — ícones da interface.
- `fetch` — comunicação com serviços externos.

## 🌐 APIs e fontes de dados

O aplicativo consulta diferentes serviços para obter informações:

- **[OpenF1](https://openf1.org/):** dados de sessões, pilotos, equipes, Grandes Prêmios, pit stops e stints (sequências de uso de pneus).
- **[MultiViewer API](https://multiviewer.app/):** dados do traçado dos circuitos e das curvas.
- **[Jolpica F1](https://github.com/jolpica/jolpica-f1):** resultados históricos e informações de corridas e classificações de pilotos.
- **[Google Gemini API](https://ai.google.dev/gemini-api/docs):** geração de textos de apoio, como biografias, especificações técnicas e análises de setores.

As APIs são serviços externos e podem alterar seus dados, disponibilidade, limites de requisições ou condições de acesso.

## 🗂️ Estrutura do projeto

```text
formula1/
├── App.js
├── index.js
├── app.json
├── package.json
├── dadosCarros.js
├── assets/
│   ├── imagens e ícones do aplicativo
├── components/
│   ├── AssetExample.js
│   ├── ChampionshipCard.js
│   ├── DriverCard.js
│   ├── ErrorMessage.js
│   └── Loading.js
├── context/
│   └── FavoritosContext.js
├── services/
│   ├── api.js
│   └── setoresCircuitos.js
└── Telas/
    ├── Campeonatos.js
    ├── Circuitos.js
    ├── DetalhesGP.js
    ├── DetalhesPiloto.js
    ├── Equipes.js
    ├── Favoritos.js
    ├── Inicio.js
    ├── Pits.js
    ├── Sobre.js
```

### Organização das pastas

- `Telas/`: componentes que representam as telas do aplicativo.
- `components/`: componentes reutilizáveis da interface.
- `context/`: contexto global usado para compartilhar e gerenciar os favoritos.
- `services/`: funções responsáveis pela comunicação com APIs e dados de configuração dos setores.
- `assets/`: imagens, ícones e recursos visuais.
- `dadosCarros.js`: dados técnicos dos carros organizados por temporada/equipe.
- `App.js`: configuração da navegação e do contexto global.

## ▶️ Como executar o projeto

### Pré-requisitos

- Node.js instalado.
- npm (instalado junto com o Node.js).
- Expo Go no celular, ou um emulador Android/iOS.
- Git (opcional, para versionamento).

### Instalação

1. Clone o repositório:

   ```bash
   git clone URL_DO_REPOSITORIO
   ```

2. Entre na pasta que contém o `package.json`:

   ```bash
   cd formula1
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Inicie o Expo:

   ```bash
   npx expo start
   ```

5. Para abrir no celular, leia o QR Code com o Expo Go. Também é possível executar em um emulador compatível.

### Comandos disponíveis

```bash
npm start       # inicia o Expo
npm run android # inicia no Android
npm run ios     # inicia no iOS
npm run web     # inicia a versão web
```

## 🔐 Configuração da chave da API Gemini

O arquivo `services/api.js` lê a variável `process.env.GEMINI_API_KEY` para realizar chamadas à API Gemini.

Para executar os recursos que dependem do Gemini, configure a credencial no ambiente de desenvolvimento e verifique se ela está sendo disponibilizada corretamente ao aplicativo Expo.

**Importante:** não coloque chaves privadas diretamente no código e não envie arquivos com credenciais para o GitHub. Aplicativos mobile executam no dispositivo do usuário; portanto, uma chave incluída no bundle do aplicativo pode ser extraída. Para um projeto publicado, o mais seguro é intermediar as chamadas ao Gemini por um backend que mantenha a chave protegida.

Os recursos que dependem do Gemini podem não funcionar enquanto a chave e sua configuração não estiverem disponíveis.

## 💾 Favoritos

Os favoritos são organizados em duas categorias:

- Pilotos
- Circuitos

O aplicativo utiliza AsyncStorage para guardar essas informações localmente no dispositivo. Os favoritos não são sincronizados automaticamente entre dispositivos ou contas.

## ⚠️ Observações

- O conteúdo exibido depende das respostas das APIs utilizadas.
- Algumas temporadas, sessões ou corridas podem não possuir todos os dados.
- Tempos de pit stop e informações de pneus podem estar ausentes em determinados eventos.
- A análise de setores depende de haver um mapeamento cadastrado em `services/setoresCircuitos.js`.
- A tela de equipes utiliza dados técnicos locais em `dadosCarros.js` e informações de pilotos obtidas pela OpenF1.
- Este projeto é independente e não é um aplicativo oficial da Fórmula 1, da FIA ou das equipes.

## 👨‍💻 Projeto acadêmico

O **F1 HUB** foi desenvolvido como projeto acadêmico, com o objetivo de praticar desenvolvimento mobile, organização de componentes, navegação entre telas, consumo de APIs, gerenciamento de estado e persistência local de dados.

---

Desenvolvido com React Native e Expo. 🏁
