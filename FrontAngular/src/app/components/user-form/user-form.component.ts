import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserFormService } from '../../services/user-form.service.js';



@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  user = {dni: '' ,firstName: '', lastName: '', userType: ''};
 constructor(private service:UserFormService) { }
 postUser() {this.service.postUser(this.user).subscribe((response:any) => this.user=response)
  alert("Usuario registrado" + " " + this.user.firstName + " " + this.user.lastName)
}
}
