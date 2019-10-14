import { CanActivate , ActivatedRouteSnapshot , RouterStateSnapshot, Router} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './services/requestApi.service';

@Injectable()
    // in order to add service into the service you need to add @injectable
export class AuthAdminGuard implements CanActivate {
  constructor(private apiService: ApiService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
      const isAuth = this.apiService.getUserType();
      let allow = false;
      if (isAuth === 'admin') {
          allow = true;
      }
    if (!allow) {
      this.router.navigate(['/'] , { queryParams: { error: 'Warning! You are not Admin.' } });
    }
    return allow;
  }
}
