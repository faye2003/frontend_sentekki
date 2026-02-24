// Modèles TypeScript pour correspondre au backend
export interface Language {
  id: number;
  code: string;
  name: string;
}

export interface Translator {
  id?: number;
  lang_src: Language;
  lang_dest: Language;
  input_text: string;
  output_text?: string;
  input_sentence?: any;   // JSON object {index: "phrase", ...}
  output_sentence?: any;  // JSON object {index: "phrase", ...}
  request_status: 'pending' | 'corrected' | 'flagged';
  created_at?: string;
  tags: string[];
}

export interface Sentence {
  id: number | null;
  user_id?: number;
  phrase_source: string;
  phrase_corrigee: string;
  isEditing?: boolean;
  editText?: string;
}

export interface CorrectionTranslator {
  id?: number;
  translator_id: number;
  user_id?: number;
  phrase_source: string;
  phrase_corrigee: string;
  isEditing?: boolean;
  editText?: string;
  created_at?: string;
}