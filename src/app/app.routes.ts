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
import { ManagerCreateTourComponent } from './features/manager/manager-tour/create-tour/create-tour.component';
import { ManagerEditTourComponent } from './features/manager/manager-tour/edit-tour/edit-tour.component';
import { ManagerCreateCategoryComponent } from './features/manager/manager-category/create-category/create-category.component';
import { ManagerEditCategoryComponent } from './features/manager/manager-category/edit-category/edit-category.component';
import { AdminComponent } from './features/admin/admin.component';
import { AdminUserComponent } from './features/admin/admin-user/admin-user.component';
import { AdminTourComponent } from './features/admin/admin-tour/admin-tour.component';
import { AdminBookingComponent } from './features/admin/admin-booking/admin-booking.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { AdminCreateTourComponent } from './features/admin/admin-tour/create-tour/create-tour.component';
import { AdminEditTourComponent } from './features/admin/admin-tour/edit-tour/edit-tour.component';
import { CreateUserComponent } from './features/admin/admin-user/create-user/create-user.component';
import { EditUserComponent } from './features/admin/admin-user/edit-user/edit-user.component';
import {TourDetailComponent} from './features/customer/tour-detail/tour-detail.component';
import {ProfileComponent} from './features/profile/profile.component';
import {PaymentResultComponent} from './features/customer/payment-result/payment-result.component';

export const routes: Routes = [

    {
        path: '',
        component: CustomerLayoutComponent,
        children: [
            { path: '', component: HomeComponent },

            { path: 'tour-list', component: TourListComponent },
            { path: 'tour/:id', component: TourDetailComponent},

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
            },

          { path: 'payment-result', component: PaymentResultComponent }
        ]
    },

    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [authGuard],
        data: { role: 'ROLE_ADMIN' },
        children: [
            { path: '', component: AdminComponent },

            { path: 'users', component: AdminUserComponent },
            { path: 'users/create', component: CreateUserComponent },
            { path: 'users/edit/:id', component: EditUserComponent },

            { path: 'tours', component: AdminTourComponent },
            { path: 'tours/create', component: AdminCreateTourComponent },
            { path: 'tours/edit/:id', component: AdminEditTourComponent },

            { path: 'bookings', component: AdminBookingComponent }
        ]
    },

    {
        path: 'manager',
        component: ManagerLayoutComponent,
        canActivate: [authGuard],
        data: { role: 'ROLE_MANAGER' },
        children: [
            { path: '', component: ManagerComponent },

            { path: 'tours', component: ManagerTourComponent },
            { path: 'tours/create', component: ManagerCreateTourComponent },
            { path: 'tours/edit/:id', component: ManagerEditTourComponent },

            { path: 'bookings', component: ManagerBookingComponent },

            { path: 'categories', component: ManagerCategoryComponent },
            { path: 'categories/create', component: ManagerCreateCategoryComponent },
            { path: 'categories/edit/:id', component: ManagerEditCategoryComponent },
        ]
    },

    { path: 'login', component: LoginComponent },

    { path: 'users/me', component: ProfileComponent },

    {
        path: '403',
        loadComponent: () =>
            import('./pages/forbidden/forbidden.component')
                .then(m => m.ForbiddenComponent)
    }
];
