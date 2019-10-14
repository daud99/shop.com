import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ApiService } from './services/requestApi.service';
import { ContactComponent } from './components/contact/contact.component';
import { ViewMsgComponent } from './components/view-msg/view-msg.component';
import { FooterComponent } from './components/footer/footer.component';
import { OrderTrackerComponent } from './components/order-tracker/order-tracker.component';
import { HomeComponent } from './components/home/home.component';
import { HelpComponent } from './components/help/help.component';
import { AuthInterceptor } from './auth-interceptor';
import { AuthGuard } from './auth.guard';
import { AuthAdminGuard } from './auth_admin.guard';
import { PayComponent } from './components/pay/pay.component';
import { SearchComponent } from './components/navbar/search/search.component';
import { ViewCategoryComponent } from './components/navbar/view-category/view-category.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ShowAddressComponent } from './components/show-address/show-address.component';
import { AddAddressComponent } from './components/add-address/add-address.component';
import { UploadporductComponent } from './components/uploadporduct/uploadporduct.component';
import { ViewOrderComponent } from './components/view-order/view-order.component';
import { SafePipe } from './components/safe.pipe';
const appRoutes: Routes = [
  { path: "signup", component: SignupComponent },
  { path: "login", component: LoginComponent },
  { path: "contact", component: ContactComponent },
  { path: "msg", component: ViewMsgComponent, canActivate: [AuthGuard, AuthAdminGuard] },
  { path: "help", component: HelpComponent },
  { path: "", component: HomeComponent },
  { path: "ordertracker", component: OrderTrackerComponent , canActivate: [AuthGuard]},
  { path: "pay", component: PayComponent , canActivate: [AuthGuard]},
  { path: "search ", component: SearchComponent },
  { path: "view", component: ViewCategoryComponent },
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
  { path: "edit", component: EditProfileComponent, canActivate: [AuthGuard] },
  { path: "changePassword", component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: "addAddress", component: AddAddressComponent},
  { path: "showAddress", component: ShowAddressComponent, canActivate: [AuthGuard] },
  { path: "upload", component: UploadporductComponent, canActivate: [AuthGuard, AuthAdminGuard]},
  { path: "viewOrders", component: ViewOrderComponent, canActivate: [AuthGuard] },
];
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent,
    ContactComponent,
    ViewMsgComponent,
    FooterComponent,
    OrderTrackerComponent,
    HomeComponent,
    HelpComponent,
    SearchComponent,
    ViewCategoryComponent,
    PayComponent,
    DashboardComponent,
    ChangePasswordComponent,
    EditProfileComponent,
    ShowAddressComponent,
    AddAddressComponent,
    UploadporductComponent,
    ViewOrderComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [ApiService, AuthGuard , AuthAdminGuard, { provide: HTTP_INTERCEPTORS , useClass: AuthInterceptor , multi: true }],
  bootstrap: [AppComponent]
})
  //  HTTP_INTERCEPTORS is an token identifier module
export class AppModule { }
