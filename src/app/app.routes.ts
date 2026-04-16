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
import {RegisterComponent} from './auth/register/register.component';
import {LoginSuccessComponent} from './auth/login-success/login-success.component';
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './auth/reset-password/reset-password.component';
import {ManagerHotelComponent} from './features/manager/manager-hotel/manager-hotel.component';
import {ManagerCreateHotelComponent} from './features/manager/manager-hotel/create-hotel/create-hotel.component';
import {ManagerEditHotelComponent} from './features/manager/manager-hotel/edit-hotel/edit-hotel.component';
import {ManagerVehicleComponent} from './features/manager/manager-vehicle/manager-vehicle.component';
import {
  ManagerCreateVehicleComponent
} from './features/manager/manager-vehicle/create-vehicle/create-vehicle.component';
import {ManagerEditVehicleComponent} from './features/manager/manager-vehicle/edit-vehicle/edit-vehicle.component';
import {ManagerTourDetailComponent} from './features/manager/manager-tour-detail/manager-tour-detail.component';
import {
  ManagerCreateTourDetailComponent
} from './features/manager/manager-tour-detail/create-tour-detail/create-tour-detail.component';
import {
  ManagerEditTourDetailComponent
} from './features/manager/manager-tour-detail/edit-tour-detail/edit-tour-detail.component';
import {ManagerItineraryComponent} from './features/manager/manager-itinerary/manager-itinerary.component';
import {
  ManagerCreateItineraryComponent
} from './features/manager/manager-itinerary/create-itinerary/create-itinerary.component';
import {
  ManagerEditItineraryComponent
} from './features/manager/manager-itinerary/edit-itinerary/edit-itinerary.component';

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

            { path: 'hotels', component: ManagerHotelComponent},
            { path: 'hotels/create', component: ManagerCreateHotelComponent },
            { path: 'hotels/edit/:id', component: ManagerEditHotelComponent },

            { path: 'vehicles', component: ManagerVehicleComponent},
            { path: 'vehicles/create', component: ManagerCreateVehicleComponent },
            { path: 'vehicles/edit/:id', component: ManagerEditVehicleComponent },

            { path: 'tour-details', component: ManagerTourDetailComponent },
            { path: 'tour-details/create', component: ManagerCreateTourDetailComponent},
            { path: 'tour-details/edit/:id', component: ManagerEditTourDetailComponent },

            { path: 'itineraries', component: ManagerItineraryComponent},
            { path: 'itineraries/create', component: ManagerCreateItineraryComponent },
            { path: 'itineraries/edit/:tourId', component: ManagerEditItineraryComponent }        ]
    },

    { path: 'login', component: LoginComponent },

    { path: 'login-success', component: LoginSuccessComponent},

    { path: 'register', component: RegisterComponent },

    { path: 'forgot-password', component: ForgotPasswordComponent},

    { path: 'reset-password', component: ResetPasswordComponent},

    { path: 'users/me', component: ProfileComponent },

    {
        path: '403',
        loadComponent: () =>
            import('./pages/forbidden/forbidden.component')
                .then(m => m.ForbiddenComponent)
    }
];
