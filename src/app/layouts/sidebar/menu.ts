import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    { label: 'Dashboard', route: '/admin', icon: 'home', roles: ['super_admin', 'Admin'] },
    { label: 'Traductions', route: '/traduction', roles: ['super_admin', 'Admin', 'Traducteur'] },
    { label: 'Corrections', route: '/correction', roles: ['super_admin', 'Correcteur'] },
    { label: 'Historique', route: '/historique', roles: ['super_admin', 'Admin', 'Traducteur', 'Correcteur'] },
];

