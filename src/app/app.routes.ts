import { Routes } from '@angular/router';
import { TourListComponent } from './features/customer/tour-list/tour-list.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './guards/auth.guard';
import { BookingComponent } from './features/customer/booking/booking.component';
import { CustomerLayoutComponent } from './layout/customer-layout/customer-layout.component';
import { ManagerLayoutComponent } from './layout/manager-layout/manager-layout.component';
import { ManagerBookingComponent } from './features/manager/manager-booking/manager-booking.component';
import { ManagerTourComponent } from './features/manager/manager-tour/manager-tour.component';
import { ManagerCategoryComponent } from './features/manager/manager-category/manager-category.component';

export const routes: Routes = [

    {
        path: '',
        component: CustomerLayoutComponent,
        children: [
            { path: '', component: TourListComponent },
            { path: 'login', component: LoginComponent },
            {
                path: 'customer/booking/:tourId',
                component: BookingComponent,
                canActivate: [authGuard],
                data: { role: 'ROLE_CUSTOMER' }
            }
        ]
    },

    {
        path: 'admin',
        canActivate: [authGuard],
        data: { role: 'ROLE_ADMIN' },
        loadComponent: () =>
            import('./features/admin/admin.component')
                .then(m => m.AdminComponent)
    },

    {
        path: 'manager',
        component: ManagerLayoutComponent,
        canActivate: [authGuard],
        data: { role: 'ROLE_MANAGER' },
        children: [
            { path: 'tours', component: ManagerTourComponent },
            { path: 'bookings', component: ManagerBookingComponent },
            { path: 'categories', component: ManagerCategoryComponent }
        ]
    },


    {
        path: '403',
        loadComponent: () =>
            import('./pages/forbidden/forbidden.component')
                .then(m => m.ForbiddenComponent)
    }
];
