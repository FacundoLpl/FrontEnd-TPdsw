import { Component, OnInit } from '@angular/core';
import { MiServPruebaService } from '../mi-serv-prueba.service.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HijoPruebaComponent } from './hijo-prueba/hijo-prueba.component.js';
import { NavbarComponent } from '../components/navbar/navbar.component.js';
import { User } from '../entities/user.entity.js';
import { UserFormComponent } from '../components/user-form/user-form.component.js';


@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule, HijoPruebaComponent,NavbarComponent, UserFormComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})


export class FaqComponent implements OnInit {
  usuariosPrueba = [{"dni":"123456","firstName":"Juan","lastName":"Perez","userType":"admin"},{"dni":"654321","firstName":"Maria","lastName":"Gomez","userType":"user"}]
  users: User[] = [];
  userBuscado: User = {id: '', dni: '', firstName: '', lastName: '', userType: ''};
  userPostRes = {}
  userDeleted = {
    dni: '',
    firstName: '',
    lastName: '',
    userType: ''
  }
  showId: boolean = false;
  edad = 23
  empresa = "Google"
  usuRegistrado=true
  textoDeRegistro= "No hay nadie registrado"
  empresaRecibidaCP:string= "no recibi nda"
  user = {
    dni: '',
    firstName: '',
    lastName: '',
    userType: ''
  }
  
  constructor(private service: MiServPruebaService) { }

  agregarEmpresaN(recibida:string){
    this.empresaRecibidaCP=recibida}
  
  llamaEmpresa(value:string){}

  getRegistroUsuario(){this.usuRegistrado=false}

  setUsuarioRegistrado(event:Event){
      if((<HTMLInputElement>event.target).value=="si"){
      this.textoDeRegistro="Usuario se acaba de registrar"
      }else{this.textoDeRegistro="No hay nadie registrado"}}

  ngOnInit(): void {}

  loadUsers() {this.service.getUsers().subscribe((response:any) => {this.users = response.data})}


  loadOneUser(id: string) {this.service.getOneUser(id).subscribe((response:any) => this.userBuscado = response.data)}

  postUser() {this.service.postUser(this.user).subscribe((response:any) => this.userPostRes=response)
    alert("Usuario registrado" + " " + this.user.firstName + " " + this.user.lastName)
  }

  deleteUser(id: string) {
    this.service.deleteUser(id).subscribe(
        (response: any) => {
            this.userDeleted = response;
            if (response) {
                alert(`Usuario eliminado`);
            } else {
              alert(`Usuario no encontrado`);
            }
        },
    );
}
}
