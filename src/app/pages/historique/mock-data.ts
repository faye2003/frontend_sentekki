import { Translation } from "./types";

export const MOCK_TRANSLATIONS: Translation[] = [
  {
    id: '1',
    lang_src: { code: 'FR', name: 'Français', flag: '🇫🇷' },
    lang_dest: { code: 'EN', name: 'Anglais', flag: '🇬🇧' },
    input_text: 'Bonjour, comment allez-vous aujourd\'hui ?',
    output_text: 'Hello, how are you doing today?',
    created_at: new Date().toISOString(),
    is_favorite: true,
    rate: 5,
    category: 'SALUTATIONS'
  },
  {
    id: '2',
    lang_src: { code: 'GB', name: 'Anglais', flag: '🇬🇧' },
    lang_dest: { code: 'ES', name: 'Espagnol', flag: '🇪🇸' },
    input_text: 'I would like to order a coffee, please.',
    output_text: 'Me gustaría pedir un café, por favor.',
    created_at: new Date().toISOString(),
    is_favorite: false,
    rate: 4,
    category: 'RESTAURATION'
  }
];