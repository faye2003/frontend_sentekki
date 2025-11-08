import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username = '';
  password = '';

  year: number = new Date().getFullYear();
  loginForm!: UntypedFormGroup;
  submitted = false;
  error = '';
  returnUrl!: string;
  // Carousel navigation arrow show
  showNavigationArrows: any;
  fieldTextType!: boolean;

  constructor(
    private authService: AuthService,
    private router : Router,
    private formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    /**
     * Form Validatyion
     */
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
    document.body.setAttribute('data-layout', 'vertical');
  }

  get f() { return this.loginForm.controls; }

  onLogin() {
    console.log("Bonjour");
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/']);
          console.log('Connecté ✅', res)
        }
      },
      error: (err) => {
        console.log(err.error?.error)
        Swal.fire('Erreur!', err.error?.error || 'Une erreur est survenue.', 'error');
      }
    });
  }

  /**
   * Testimonial slider
   */
  carouselOption: OwlOptions = {
    items: 1,
    loop: false,
    margin: 0,
    nav: false,
    dots: true,
    responsive: {
      680: {
        items: 1
      },
    }
  }

  /**
   * Password Hide/Show
   */
   toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
