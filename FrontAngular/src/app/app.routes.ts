import type { Routes } from "@angular/router"
import { HomeComponent } from "./home/home.component"
import { CartaComponent } from "./carta/carta.component"
import { ReservaComponent } from "./reserva/reserva.component"
import { FaqComponent } from "./faq/faq.component"
import { NosotrosComponent } from "./nosotros/nosotros.component"
import { CarritoComponent } from "./components/carrito/carrito.component"
import { LoginComponent } from "./authentication/login/login.component"
import { RegisterComponent } from "./authentication/register/register.component"
import { AdminDashboardComponent } from "./admin/admin-dashboard.component"
import { MisPedidosComponent } from "./components/mis-pedidos/mis-pedidos.component"

// Guards
import { AuthGuard } from "./core/guards/auth.guard"
import { AuthenticatedGuard } from "./core/guards/authenticated.guard"
import { AdminGuard } from "./core/guards/admin.guard"

export const routes: Routes = [
  // Página principal
  {
    path: "",
    component: HomeComponent,
    // canActivate: [AuthGuard], // descomentado si quieres proteger la home
  },

  // Páginas públicas
  { path: "carta", component: CartaComponent },
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
   loadComponent: () => import("./mozo/mozo-panel.component").then((m) => m.MozoPanelComponent),
    canActivate: [AuthGuard], // Puedes crear un guard específico para mozos
  },

  { path: "**", redirectTo: "/carta" }
]