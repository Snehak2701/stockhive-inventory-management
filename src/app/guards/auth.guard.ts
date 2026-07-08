import { CanActivateFn } from '@angular/router';
import { getAuth } from 'firebase/auth';

export const authGuard: CanActivateFn = () => {

  const auth = getAuth();

  return auth.currentUser != null;

};