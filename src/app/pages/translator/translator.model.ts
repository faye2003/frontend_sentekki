export interface Sentence {
  id: number;
  sentence_number: number;
  sentence_src: string;
  sentence_translated: string;
  corrections: any[];
  isEditing?: boolean;  // utilisé côté front
  editText?: string;    // texte temporaire pour l’édition
}

export interface TranslatorData {
  id: number;
  user: number;
  lang_src: number;
  lang_dest: number;
  input_text: string;
  output_text: string;
  created_at: string;
  sentences: Sentence[];
}

export interface TranslationResponse {
  sentences: string[];
}