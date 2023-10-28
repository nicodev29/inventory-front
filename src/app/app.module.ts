import { NgModule,CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8082/',
        realm: 'inventory',
        clientId: 'angular-client'
      },
      initOptions: {
        onLoad: 'login-required',
        flow: 'standard',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html'
      },
      loadUserProfileAtStartUp: true
    });
}



@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DashboardModule,
    BrowserAnimationsModule,
    KeycloakAngularModule
  ],
  providers: [AppRoutingModule,BrowserModule, KeycloakAngularModule, KeycloakService,{
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class AppModule {}
