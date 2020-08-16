import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFirebaseCrudService } from './angular-firebase-crud.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AngularFirestoreModule
  ],
  providers: [
    AngularFirebaseCrudService
  ],
})
export class AngularFirebaseCrudModule { }
