export interface UserMe {
  id: number;
  username: string;
  email: string;

  profil: {
    name: 'translator' | 'corrector' | 'admin' | 'super_admin';
    label?: string;
  };

  role_request: {
    name: 'corrector';
  } | null;

  request_status: 'pending' | 'approved' | 'rejected' | null;
}
