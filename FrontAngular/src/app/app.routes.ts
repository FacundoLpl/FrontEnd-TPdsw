import { Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartaComponent } from './carta/carta.component';
import { ReservaComponent } from './reserva/reserva.component';
import { FaqComponent } from './faq/faq.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { CarritoComponent } from './components/carrito/carrito.component';

export const routes: Routes = [

    {path: '', component: HomeComponent},
    {path: 'carta', component: CartaComponent},
    {path: 'reserva', component: ReservaComponent},
    {path: 'faq', component: FaqComponent},
    {path: 'nosotros', component: NosotrosComponent},
    {path: 'carrito', component: CarritoComponent},



];
