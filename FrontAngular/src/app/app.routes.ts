import { Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartaComponent } from './carta/carta.component';
import { ReservaComponent } from './reserva/reserva.component';
import { FaqComponent } from './faq/faq.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { LoginComponent } from './authentication/login/login.component.js';
import { AuthGuard } from './core/guards/auth.guard.js'; // importo el guard de autenticacion
import { AuthenticatedGuard } from './core/guards/authenticated.guard.js'; // importo el guard de autenticacion
export const routes: Routes = [

    {path: '', component: HomeComponent,
    //canActivate: [AuthGuard], // protejo la ruta de inicio con el guard
    },
    {path: 'carta', component: CartaComponent},
    {path: 'reserva', component: ReservaComponent},
    {path: 'faq', component: FaqComponent},
    {path: 'nosotros', component: NosotrosComponent},
    {path: 'carrito', component: CarritoComponent},
    {path: 'login', component: LoginComponent,
    canActivate: [AuthenticatedGuard], // protejo la ruta de login con el guard
    },
    
];
