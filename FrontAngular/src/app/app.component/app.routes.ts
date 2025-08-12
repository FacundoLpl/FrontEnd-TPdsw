import type { Routes } from "@angular/router"
import { HomeComponent } from "../components/home/home.component"
import { CartaComponent } from "../components/carta/carta.component"
import { ReservaComponent } from "../components/reserva/reserva.component"
import { FaqComponent } from "../components/faq/faq.component"
import { NosotrosComponent } from "../components/nosotros/nosotros.component"
import { CarritoComponent } from "../components/carrito/carrito.component"
import { LoginComponent } from "../components/authentication/login/login.component"
import { RegisterComponent } from "../components/authentication/register/register.component"
import { AdminDashboardComponent } from "../components/admin/admin-dashboard.component"
import { MisPedidosComponent } from "../components/mis-pedidos/mis-pedidos.component"
import { ReviewListComponent } from "../components/review/review-list/review-list.component"

// Guards
import { AuthGuard } from "../core/guards/auth.guard"
import { AuthenticatedGuard } from "../core/guards/authenticated.guard"
import { AdminGuard } from "../core/guards/admin.guard"

export const routes: Routes = [
  // Página principal
  {
    path: "",
    component: HomeComponent,
    // canActivate: [AuthGuard], // descomentado si quieres proteger la home
  },

  // Páginas públicas
  
  { path: "carta", component: CartaComponent },
  { path: 'reviews/:productId', component: ReviewListComponent },
  { path: "reserva", component: ReservaComponent },
  { path: "faq", component: FaqComponent },
  { path: "nosotros", component: NosotrosComponent },

  // Páginas que requieren autenticación
  {
    path: "carrito",
    component: CarritoComponent,
    canActivate: [AuthGuard], // Proteger carrito para usuarios autenticados
  },
  
  //  MIS PEDIDOS - MOVIDO AQUÍ
  {
    path: 'mis-pedidos',
    component: MisPedidosComponent,
    canActivate: [AuthGuard]
  },

  // Autenticación (solo para usuarios no autenticados)
  {
    path: "login",
    component: LoginComponent,
    canActivate: [AuthenticatedGuard], // Redirige si ya está logueado
  },
  {
    path: "register",
    component: RegisterComponent,
    canActivate: [AuthenticatedGuard], // Redirige si ya está logueado
  },

  // Rutas de administración
  {
    path: "admin/dashboard",
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
  },

   //Rutas para diferentes roles 
  {
    path: "mozo/panel",
   loadComponent: () => import("../components/mozo/mozo-panel.component").then((m) => m.MozoPanelComponent),
    canActivate: [AuthGuard], // Puedes crear un guard específico para mozos
  },

  { path: "**", redirectTo: "/carta" }
]