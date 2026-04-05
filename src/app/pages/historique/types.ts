
export interface Language {
  code: string;
  name: string;
  flag?: string;
}

export interface Translation {
  id: string;
  lang_src: Language;
  lang_dest: Language;
  input_text: string;
  output_text: string;
  created_at: string;
  is_favorite: boolean;
  rate?: number;
  category?: string;
}