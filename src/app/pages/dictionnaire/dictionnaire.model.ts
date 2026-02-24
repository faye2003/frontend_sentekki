export interface Nettalin {
  "#text": string;
  "@làkk": string;
}

export interface DictionaryData {
  maas?: string;

  xeet?: {
    "#text"?: string;
    "@gàttal"?: string;
  };

  cosaan?: string;
  mbirmi?: string;
  tëggin?: string;

  sayu_tekki?: {
    tekki?: {
      nettalin?: Nettalin;
    };
    misaal?: {
      nettalin?: Nettalin[];
    };
  };
}

export interface DictionaryEntry {
  id: number;
  mbirmi: string;
  teggin: string;
  data: DictionaryData;
}

export interface DictionaryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DictionaryEntry[];
}
