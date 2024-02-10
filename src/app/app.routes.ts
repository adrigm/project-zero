import { Routes } from '@angular/router';
import { LineStatusComponent } from './dashboards/line-status/line-status.component';

export const routes: Routes = [
  { path: 'line-status', component: LineStatusComponent },
  { path: '', redirectTo: '/line-status', pathMatch: 'full' },
  { path: '**', redirectTo: '/line-status', pathMatch: 'full' }
];
