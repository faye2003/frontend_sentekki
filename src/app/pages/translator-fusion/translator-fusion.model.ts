export interface Sentence {
  id: number | null;
  sentence_number: number;
  sentence_src: string;
  sentence_translated: string;
  corrections: any[];
  // champs côté UI
  isEditing?: boolean;
  editText?: string;
}

export interface TranslatorFusionData {
  id: number | null;
  user: number | null;
  lang_src: number | string;
  lang_dest: number | string;
  input_text: string;
  output_text: string;
  created_at?: string;
  sentences: Sentence[];
}


// export interface Sentence {
//   id: number;
//   sentence_number: number;
//   sentence_src: string;
//   sentence_translated: string;
//   corrections: any[];
//   isEditing?: boolean;
//   editText?: string;
// }

// export interface TranslatorData {
//   id: number;
//   user: number;
//   lang_src: number;
//   lang_dest: number;
//   input_text: string;
//   output_text: string;
//   created_at: string;
//   sentences: Sentence[];
// }

// export interface TranslationResponse {
//   sentences: string[];
// }