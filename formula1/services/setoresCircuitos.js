




// SETORES 2026
const setoresAustralia = {
    nome: 'Albert Park Grand Prix Circuit',
    setores: {
        S1: {
            curvas: [1, 2, 3, 4, 5],
            limite: '120 metros antes da curva 6'
        },
        S2: {
            curvas: [6, 7, 8],
            limite: '140 metros antes da curva 9'
        },
        S3: {
            curvas: [9, 10, 11, 12, 13, 14],
            limite: 'Do segundo limite de setor até a linha de chegada'
        }
    }
};
const setoresXangai = {
    nome: 'Shanghai International Circuit',
    setores: {
        S1: {
            curvas: [1, 2, 3, 4, 5],
            limite: '150 metros antes da curva 6'
        },
        S2: {
            curvas: [6, 7, 8, 9, 10],
            limite: '145 metros antes da curva 11'
        },
        S3: {
            curvas: [11, 12, 13, 14, 15, 16],
            limite: 'Do segundo limite de setor até a linha de chegada'
        }
    }
};

const setoresMiami = {
  nome: 'Miami International Autodrome',
  setores: {
    S1: {
      curvas: [1, 2, 3, 4, 5, 6, 7, 8],
      limite: '110 metros depois da curva 8'
    },
    S2: {
      curvas: [9, 10, 11, 12, 13, 14, 15, 16],
      limite: '70 metros depois da curva 16'
    },
    S3: {
      curvas: [17, 18, 19],
      limite: 'Do segundo limite de setor até a linha de chegada'
    }
  }
};

const setoresSuzuka = {
  nome: 'Suzuka International Racing Course',
  setores: {
    S1: {
      curvas: [1, 2, 3, 4, 5, 6, 7],
      limite: '110 metros antes da curva 8'
    },
    S2: {
      curvas: [8, 9, 10, 11, 12, 13, 14],
      limite: '270 metros antes da curva 15'
    },
    S3: {
      curvas: [15, 16, 17, 18],
      limite: 'Do segundo limite de setor até a linha de chegada'
    }
  }
};
const setoresBahrain = {
    nome: 'Bahrain International Circuit',

    setores: {
        S1: {
            curvas: [1, 2, 3, 4, 5],
            limite: 'Limite oficial na curva 5'
        },

        S2: {
            curvas: [6, 7, 8, 9, 10, 11, 12],
            limite: 'Limite oficial 48 metros antes da curva 13'
        },

        S3: {
            curvas: [13, 14, 15],
            limite: 'Do segundo limite de setor até a linha de chegada'
        }
    }
};
const setoresJeddah = {
  nome: 'Jeddah Corniche Circuit',
  setores: {
    S1: {
      curvas: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      limite: '265 metros antes da curva 13'
    },
    S2: {
      curvas: [13, 14, 15, 16, 17, 18, 19, 20, 21],
      limite: '120 metros antes da curva 22'
    },
    S3: {
      curvas: [22, 23, 24, 25, 26, 27],
      limite: 'Do segundo limite de setor até a linha de chegada'
    }
  }
};
const setoresMontreal = {
  nome: 'Circuit Gilles-Villeneuve',
  setores: {
    S1: {
      curvas: [1, 2, 3, 4, 5],
      limite: '150 metros antes da curva 6'
    },
    S2: {
      curvas: [6, 7, 8, 9],
      limite: '190 metros antes da curva 10'
    },
    S3: {
      curvas: [10, 11, 12, 13, 14],
      limite: 'Do segundo limite de setor até a linha de chegada'
    }
  }
};
const setoresMonaco = {
  nome: 'Circuit de Monaco',
  setores: {
    S1: {
      curvas: [1, 2, 3, 4],
      limite: '60 metros antes da curva 5'
    },
    S2: {
      curvas: [5, 6, 7, 8, 9, 10, 11, 12],
      limite: '67 metros antes da curva 13'
    },
    S3: {
      curvas: [13, 14, 15, 16, 17, 18, 19],
      limite: 'Do segundo limite de setor até a linha de chegada'
    }
  }
};
const setoresBarcelona = {
  nome: 'Circuit de Barcelona-Catalunya',
  setores: {
    S1: {
      curvas: [1, 2, 3],
      limite: '50 metros antes da curva 4'
    },
    S2: {
      curvas: [4, 5, 6, 7, 8, 9],
      limite: '90 metros antes da curva 10'
    },
    S3: {
      curvas: [10, 11, 12, 13, 14],
      limite: 'Do segundo limite de setor até a linha de chegada'
    }
  }
};
const setoresAustria = {
  nome: 'Red Bull Ring',
  setores: {
    S1: {
      curvas: [1, 2],
      limite: '170 metros antes da curva 3'
    },
    S2: {
      curvas: [3, 4, 5, 6],
      limite: '60 metros antes da curva 7'
    },
    S3: {
      curvas: [7, 8, 9, 10],
      limite: 'Do segundo limite de setor até a linha de chegada'
    }
  }
};
const setoresSilverstone = {
  nome: 'Silverstone Circuit',
  setores: {
    S1: {
      curvas: [1, 2, 3, 4, 5],
      limite: '110 metros antes da curva 6'
    },
    S2: {
      curvas: [6, 7, 8, 9, 10, 11, 12, 13, 14],
      limite: '50 metros depois da curva 14'
    },
    S3: {
      curvas: [15, 16, 17, 18],
      limite: 'Do segundo limite de setor até a linha de chegada'
    }
  }
};
const setoresHungria = {
  nome: 'Hungaroring',
  setores: {
    S1: {
      curvas: ['1', '1A', '2', '3'],
      limite: '85 metros antes da curva 4'
    },
    S2: {
      curvas: ['4', '5', '6', '7', '8', '9', '10', '11'],
      limite: '100 metros depois da curva 11'
    },
    S3: {
      curvas: ['12', '12A', '13', '14'],
      limite: 'Do segundo limite de setor até a linha de chegada'
    }
  }
};
const setoresZandvoort = {
  nome: 'Circuit Zandvoort',
  setores: {
    S1: {
      curvas: [1, 2, 3, 4, 5, 6],
      limite: '110 metros antes da curva 7'
    },
    S2: {
      curvas: [7, 8, 9, 10],
      limite: '150 metros antes da curva 11'
    },
    S3: {
      curvas: [11, 12, 13, 14],
      limite: 'Do segundo limite de setor até a linha de chegada'
    }
  }
};
const setoresMonza = {
  nome: 'Autodromo Nazionale Monza',
  setores: {
    S1: {
      curvas: [1, 2, 3],
      limite: '230 metros antes da curva 4'
    },
    S2: {
      curvas: [4, 5, 6, 7],
      limite: '210 metros antes da curva 8'
    },
    S3: {
      curvas: [8, 9, 10, 11],
      limite: 'Do segundo limite de setor até a linha de chegada'
    }
  }
};
const setoresBaku = {
  nome: 'Baku City Circuit',
  setores: {
    S1: {
      curvas: [1, 2, 3, 4],
      limite: '45 metros antes da curva 5'
    },
    S2: {
      curvas: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      limite: '55 metros antes da curva 16'
    },
    S3: {
      curvas: [16, 17, 18, 19, 20],
      limite: 'Do segundo limite de setor até a linha de chegada'
    }
  }
};
const setoresSingapura = {
  nome: 'Marina Bay Street Circuit',
  setores: {
    S1: {
      curvas: [1, 2, 3, 4, 5, 6],
      limite: '150 metros antes da curva 7'
    },
    S2: {
      curvas: [7, 8, 9, 10, 11, 12, 13],
      limite: '140 metros antes da curva 14'
    },
    S3: {
      curvas: [14, 15, 16, 17, 18, 19],
      limite: 'Do segundo limite de setor até a linha de chegada'
    }
  }
};
const setoresAustin = {
  nome: 'Circuit of The Americas',
  setores: {
    S1: {
      curvas: [1, 2, 3, 4, 5, 6],
      limite: '65 metros antes da curva 7'
    },
    S2: {
      curvas: [7, 8, 9, 10, 11, 12],
      limite: '65 metros antes da curva 13'
    },
    S3: {
      curvas: [13, 14, 15, 16, 17, 18, 19, 20],
      limite: 'Do segundo limite de setor até a linha de chegada'
    }
  }
};
const setoresMexico = {
  nome: 'Autódromo Hermanos Rodríguez',
  setores: {
    S1: {
      curvas: [1, 2, 3],
      limite: '135 metros antes da curva 4'
    },
    S2: {
      curvas: [4, 5, 6, 7, 8, 9, 10, 11],
      limite: '240 metros antes da curva 12'
    },
    S3: {
      curvas: [12, 13, 14, 15, 16, 17],
      limite: 'Do segundo limite de setor até a linha de chegada'
    }
  }
};
const setoresInterlagos = {
  nome: 'Autódromo José Carlos Pace',
  setores: {
    S1: {
      curvas: [1, 2, 3],
      limite: '170 metros antes da curva 4'
    },
    S2: {
      curvas: [4, 5, 6, 7, 8, 9, 10, 11],
      limite: '85 metros antes da curva 12'
    },
    S3: {
      curvas: [12, 13, 14, 15],
      limite: 'Do segundo limite de setor até a linha de chegada'
    }
  }
};
const setoresLasVegas = {
  nome: 'Las Vegas Strip Circuit',
  setores: {
    S1: {
      curvas: [1, 2, 3, 4, 5],
      limite: '90 metros depois da curva 5'
    },
    S2: {
      curvas: [6, 7, 8, 9, 10, 11, 12],
      limite: '170 metros depois da curva 12'
    },
    S3: {
      curvas: [13, 14, 15, 16, 17],
      limite: 'Do segundo limite de setor até a linha de chegada'
    }
  }
};
const setoresQatar = {
  nome: 'Lusail International Circuit',
  setores: {
    S1: {
      curvas: [1, 2, 3, 4, 5],
      limite: '80 metros antes da curva 6'
    },
    S2: {
      curvas: [6, 7, 8, 9, 10, 11],
      limite: '75 metros antes da curva 12'
    },
    S3: {
      curvas: [12, 13, 14, 15, 16],
      limite: 'Do segundo limite de setor até a linha de chegada'
    }
  }
};
const setoresAbuDhabi = {
  nome: 'Yas Marina Circuit',
  setores: {
    S1: {
      curvas: [1, 2, 3, 4],
      limite: '205 metros antes da curva 5'
    },
    S2: {
      curvas: [5, 6, 7, 8],
      limite: '100 metros antes da curva 9'
    },
    S3: {
      curvas: [9, 10, 11, 12, 13, 14, 15, 16],
      limite: 'Do segundo limite de setor até a linha de chegada'
    }
  }
};

const setoresImola = {
  nome: 'Autodromo Internazionale Enzo e Dino Ferrari',
  setores: {
    S1: {
      curvas: [1, 2, 3, 4, 5, 6],
      limite: '115 metros antes da curva 7'
    },
    S2: {
      curvas: [7, 8, 9, 10, 11, 12, 13],
      limite: '190 metros antes da curva 14'
    },
    S3: {
      curvas: [14, 15, 16, 17, 18, 19],
      limite: 'Do segundo limite de setor até a linha de chegada'
    }
  }
};

const setoresSpa = {
  nome: 'Circuit de Spa-Francorchamps',
  setores: {
    S1: {
      curvas: [1, 2, 3, 4],
      limite: '145 metros antes da curva 5'
    },
    S2: {
      curvas: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      limite: '48 metros antes da curva 15'
    },
    S3: {
      curvas: [15, 16, 17, 18, 19],
      limite: 'Do segundo limite de setor até a linha de chegada'
    }
  }
};


export const setoresCircuitos = {
    '7-2026': setoresSpa,
    '7-2025': setoresSpa,
    '7-2024': setoresSpa,
    '7-2023': setoresSpa,
    '6-2025': setoresImola,
    '6-2024': setoresImola,
    '6-2023': setoresImola,
    '63-2023': setoresBahrain,
    '63-2024': setoresBahrain,
    '63-2025': setoresBahrain,
    '63-2026': setoresBahrain,
    '10-2023': setoresAustralia,
    '10-2024': setoresAustralia,
    '10-2025': setoresAustralia,
    '10-2026': setoresAustralia,
    '49-2026': setoresXangai,
    '49-2025': setoresXangai,
    '49-2024': setoresXangai,
    '46-2026': setoresSuzuka,
    '46-2025': setoresSuzuka,
    '46-2024': setoresSuzuka,
    '46-2023': setoresSuzuka,
    '149-2023': setoresJeddah,
    '149-2024': setoresJeddah,
    '149-2025': setoresJeddah,
    '149-2026': setoresJeddah,
    '23-2026': setoresMontreal,
    '23-2025': setoresMontreal,
    '23-2024': setoresMontreal,
    '23-2023': setoresMontreal,
    '22-2026': setoresMonaco,
    '22-2025': setoresMonaco,
    '22-2024': setoresMonaco,
    '22-2023': setoresMonaco,
    '15-2026': setoresBarcelona,
    '15-2025': setoresBarcelona,
    '15-2024': setoresBarcelona,
    '15-2023': setoresBarcelona,
    '19-2026': setoresAustria,
    '19-2025': setoresAustria,
    '19-2024': setoresAustria,
    '19-2023': setoresAustria,
    '2-2026': setoresSilverstone,
    '2-2025': setoresSilverstone,
    '2-2024': setoresSilverstone,
    '2-2023': setoresSilverstone,
    '4-2026': setoresHungria,
    '4-2025': setoresHungria,
    '4-2024': setoresHungria,
    '4-2023': setoresHungria,
    '55-2026': setoresZandvoort,
    '55-2025': setoresZandvoort,
    '55-2024': setoresZandvoort,
    '55-2023': setoresZandvoort,
    '39-2026': setoresMonza,
    '39-2025': setoresMonza,
    '39-2024': setoresMonza,
    '39-2023': setoresMonza,
    '144-2026': setoresBaku,
    '144-2025': setoresBaku,
    '144-2024': setoresBaku,
    '144-2023': setoresBaku,
    '61-2026': setoresSingapura,
    '61-2025': setoresSingapura,
    '61-2024': setoresSingapura,
    '61-2023': setoresSingapura,
    '9-2026': setoresAustin,
    '9-2025': setoresAustin,
    '9-2024': setoresAustin,
    '9-2023': setoresAustin,
    '65-2026': setoresMexico,
    '65-2025': setoresMexico,
    '65-2024': setoresMexico,
    '65-2023': setoresMexico,
    '14-2026': setoresInterlagos,
    '14-2025': setoresInterlagos,
    '14-2024': setoresInterlagos,
    '14-2023': setoresInterlagos,
    '152-2026': setoresLasVegas,
    '152-2025': setoresLasVegas,
    '152-2024': setoresLasVegas,
    '152-2023': setoresLasVegas,
    '150-2026': setoresQatar,
    '150-2025': setoresQatar,
    '150-2024': setoresQatar,
    '150-2023': setoresQatar,
    '70-2026': setoresAbuDhabi,
    '70-2025': setoresAbuDhabi,
    '70-2024': setoresAbuDhabi,
    '70-2023': setoresAbuDhabi,
    '151-2025': setoresMiami,
    '151-2024': setoresMiami,
    '151-2023': setoresMiami,
    '151-2026': setoresMiami,
    
};
