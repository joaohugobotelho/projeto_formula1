
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritosContext = createContext();

const CHAVE_STORAGE = '@f1hub_favoritos';

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState({
    pilotos: [],
    circuitos: [],
  });

  const [carregandoFavoritos, setCarregandoFavoritos] = useState(true);

 
  useEffect(() => {
    async function carregarFavoritos() {
      try {
        const dadosSalvos = await AsyncStorage.getItem(CHAVE_STORAGE);

        if (dadosSalvos) {
          setFavoritos(JSON.parse(dadosSalvos));
        }
      } catch (error) {
        console.log('Erro ao carregar favoritos:', error);
      } finally {
        setCarregandoFavoritos(false);
      }
    }

    carregarFavoritos();
  }, []);

  
  useEffect(() => {
    if (carregandoFavoritos) return;

    async function salvarFavoritos() {
      try {
        await AsyncStorage.setItem(
          CHAVE_STORAGE,
          JSON.stringify(favoritos)
        );
      } catch (error) {
        console.log('Erro ao salvar favoritos:', error);
      }
    }

    salvarFavoritos();
  }, [favoritos, carregandoFavoritos]);

  function alternarFavorito(tipo, item) {
    const identificador =
      tipo === 'pilotos'
        ? String(item.driver_number)
        : String(item.meeting_key);

    setFavoritos((atuais) => {
      const listaAtual = atuais[tipo] || [];

      const jaExiste = listaAtual.some((favorito) => {
        const id =
          tipo === 'pilotos'
            ? String(favorito.driver_number)
            : String(favorito.meeting_key);

        return id === identificador;
      });

      return {
        ...atuais,
        [tipo]: jaExiste
          ? listaAtual.filter((favorito) => {
              const id =
                tipo === 'pilotos'
                  ? String(favorito.driver_number)
                  : String(favorito.meeting_key);

              return id !== identificador;
            })
          : [...listaAtual, item],
      };
    });
  }

  function ehFavorito(tipo, item) {
    const identificador =
      tipo === 'pilotos'
        ? String(item.driver_number)
        : String(item.meeting_key);

    return (favoritos[tipo] || []).some((favorito) => {
      const id =
        tipo === 'pilotos'
          ? String(favorito.driver_number)
          : String(favorito.meeting_key);

      return id === identificador;
    });
  }

  return (
    <FavoritosContext.Provider
      value={{
        favoritos,
        alternarFavorito,
        ehFavorito,
        carregandoFavoritos,
      }}
    >
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  const contexto = useContext(FavoritosContext);

  if (!contexto) {
    throw new Error(
      'useFavoritos precisa ser usado dentro de FavoritosProvider.'
    );
  }

  return contexto;
}
