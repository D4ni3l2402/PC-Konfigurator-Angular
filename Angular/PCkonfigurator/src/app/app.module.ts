import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { StartseiteComponent } from './startseite/startseite.component';
import { KonfiguratorComponent } from './konfigurator/konfigurator.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { FooterComponent } from './footer/footer.component';
import { CpuComponent } from './cpu/cpu.component';
import { GpuComponent } from './gpu/gpu.component';
import { FertigpcComponent } from './fertigpc/fertigpc.component';
import { KonfiguratorDataService } from './konfigurator-data.service';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { ShoppingcartComponent } from './shoppingcart/shoppingcart.component';
import { ShoppingcartDataService } from './shoppingcart-data.service';
import { AccountComponent } from './account/account.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/start', pathMatch: 'full'},
  { path: 'start', component: StartseiteComponent},
  { path: 'konfigurator', component: KonfiguratorComponent},
  { path: 'konfigurator/cpu', component: CpuComponent},
  { path: 'konfigurator/gpu', component: GpuComponent},
  { path: 'impressum', component: ImpressumComponent},
  { path: 'fertigepcs', component: FertigpcComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent},
  { path: 'cart', component: ShoppingcartComponent},
  { path: 'account', component: AccountComponent}

];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    StartseiteComponent,
    KonfiguratorComponent,
    ImpressumComponent,
    FooterComponent,
    CpuComponent,
    GpuComponent,
    FertigpcComponent,
    RegisterComponent,
    LoginComponent,
    ShoppingcartComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true}
    )
  ],
  providers: [ShoppingcartDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
