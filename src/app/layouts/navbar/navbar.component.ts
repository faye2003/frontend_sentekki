import { Component, OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  TemplateRef, } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { UserMe } from 'src/app/core/services/user-me.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent implements OnInit {
  userRole: string | null = null;
  username: string | null = null;
  isLoading = false;
  user!: UserMe;
  hasPendingRequest = false;
  error = '';
  message = '';
  isModalOpen: boolean = false;

  constructor (
    private authService: AuthService, 
    private router: Router,
    private modalService: NgbModal,
    private offcanvasService: NgbOffcanvas
  ){}

  ngOnInit(): void {
    // Récupération initiale du rôle
    this.userRole = this.authService.getCurrentUserRole();
    this.username = this.authService.getUsername();

    // Écoute des changements de rôle
    this.authService.getUserRole().subscribe(role => {
      this.userRole = role;
    });

    this.loadUserProfile();
  }

  loadUserProfile() {
    this.authService.getMe().subscribe(user => {
      this.user = user;

      this.hasPendingRequest =
        user.role_request !== null &&
        user.request_status === 'pending';
    });
  }

  requestCorrector() {
    this.isLoading = true;
    this.authService.requestCorrector().subscribe({
      next: (res) => {
        this.message = res.message;
        this.isLoading = false;
        this.hasPendingRequest = true;
        this.closeModal('Ok');
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: res.message,
          showConfirmButton: false,
          timer: 2000
        });
      },
      error: (err) => {
        this.error = err.error?.error || 'Une erreur est survenue';
        this.isLoading = false;
        const errorMsg =
          err?.error?.error ||
          err?.error?.detail ||
          'Une erreur est survenue';

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: errorMsg, // 🔥 message backend
          showConfirmButton: false,
          timer: 3000
        });
      }
    });
  }

  // Offcanvas Open Right
  openProfile(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  hasRole(...roles: string[]): boolean {
    return roles.includes(this.userRole || '');
  }

  logout() {
      this.authService.logout();
    this.router.navigate(['/account/login']);
  }

  // action fermeture modal
  closeModal(_modalname: any) {
    this.modalService.dismissAll();
    this.isModalOpen = false;
    this.message = ""
  }

  // action ouverture modal
  openModal(modalname: any) {
    this.isModalOpen = true;
    this.modalService.open(modalname, { centered: true });
  }
}

