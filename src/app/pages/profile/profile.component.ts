import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserMe } from 'src/app/core/services/user-me.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user!: UserMe;
  isLoading = false;
  hasPendingRequest = false;
  message = '';
  loading = false;
  error = '';
  errorMessage = '';
  isModalOpen: boolean = false;

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Page' },
      { label: 'Profile', active: true }
    ];
    this.loadUser();
  }

  loadUser() {
    this.authService.getMe().subscribe(user => {
      this.user = user;

      this.hasPendingRequest =
        user.role_request !== null &&
        user.request_status === 'pending';
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    this.authService.uploadAvatar(file).subscribe({
      next: (res) => {
        this.user.profil.avatar = res.avatar;
        console.log(res);

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Avatar mis à jour',
          showConfirmButton: false,
          timer: 2000
        });
      }
    });
  }

  requestCorrector() {
    this.isLoading = true;

    this.authService.requestCorrector().subscribe({
      next: (res) => {
        this.message = res.message;
        this.hasPendingRequest = true;
        this.isLoading = false;

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: res.message,
          showConfirmButton: false,
          timer: 2000
        });
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/account/login']);
  }

  // action ouverture modal
  openModal(modalname: any) {
    this.isModalOpen = true;
    this.modalService.open(modalname, { centered: true });
  }

  // action fermeture modal
  closeModal(_modalname: any) {
    this.modalService.dismissAll();
    this.isModalOpen = false;
    this.errorMessage = "";
    this.error = ""
  }
}