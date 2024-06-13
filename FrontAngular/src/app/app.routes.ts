import { Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartaComponent } from './carta/carta.component';

export const routes: Routes = [

    {path: '', component: HomeComponent},
    {path: 'carta', component: CartaComponent},

];
