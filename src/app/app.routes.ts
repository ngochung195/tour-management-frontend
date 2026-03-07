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
import { HomeComponent } from './features/customer/home/home.component';
import { ManagerComponent } from './features/manager/manager.component';
import { CreateTourComponent } from './features/manager/manager-tour/create-tour/create-tour.component';
import { EditTourComponent } from './features/manager/manager-tour/edit-tour/edit-tour.component';
import { CreateCategoryComponent } from './features/manager/manager-category/create-category/create-category.component';
import { EditCategoryComponent } from './features/manager/manager-category/edit-category/edit-category.component';

export const routes: Routes = [

    {
        path: '',
        component: CustomerLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'tour-list', component: TourListComponent },

            {
                path: 'booking/:tourId',
                component: BookingComponent,
                canActivate: [authGuard],
                data: { role: 'ROLE_CUSTOMER' }
            },

            {
                path: 'my-bookings',
                loadComponent: () =>
                    import('./features/customer/my-booking/my-booking.component')
                        .then(m => m.MyBookingComponent),
                canActivate: [authGuard],
                data: { role: 'ROLE_CUSTOMER' }
            }
        ]
    },

    { path: 'login', component: LoginComponent },


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
            { path: '', component: ManagerComponent },

            { path: 'tours', component: ManagerTourComponent },
            { path: 'tours/create', component: CreateTourComponent },
            { path: 'tours/edit/:id', component: EditTourComponent },

            { path: 'bookings', component: ManagerBookingComponent },

            { path: 'categories', component: ManagerCategoryComponent },
            { path: 'categories/create', component: CreateCategoryComponent },
            { path: 'categories/edit/:id', component: EditCategoryComponent },
        ]
    },

    {
        path: '403',
        loadComponent: () =>
            import('./pages/forbidden/forbidden.component')
                .then(m => m.ForbiddenComponent)
    }
];
