import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private keycloakService: KeycloakService) { }

  getRole(){
    return this.keycloakService.getUserRoles();
  }

  isAdmin(){
    let roles = this.keycloakService.getUserRoles().filter((role: any) => role == 'admin');
  
    if(roles.length > 0){
      return true;
    }else{
      return false;
    }
  }

}
