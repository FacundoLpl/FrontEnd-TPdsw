import { Injectable } from "@angular/core"
import  { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router"
import { AuthService } from "../services/auth.service"

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      // Check if user type is required for this route
      const requiredUserType = route.data["requiredUserType"]
      if (requiredUserType) {
        const userType = this.authService.getUserType()
        if (userType !== requiredUserType) {
          // Redirect to unauthorized page or home
          this.router.navigate(["/unauthorized"])
          return false
        }
      }
      return true
    }

    // Store the attempted URL for redirecting after login
    this.router.navigate(["/login"], {
      queryParams: { returnUrl: state.url },
    })
    return false
  }
}
