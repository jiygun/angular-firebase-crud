# Angular Firebase Crud Operation
  

# Usage

```hs
npm install angular-firebase-crud --save
```

-Firebase must be installed in your project.
```hs
ng add @angular/fire
```

Import Module

```

import { AngularFireModule } from '@angular/fire';

@NgModule({

imports: [

AngularFireModule.initializeApp(environment.firebaseConfig)//Your firebase config

]

})

```

In Component

-Inject service on component
  ```hs

import { AngularFirebaseCrudService,QueryModel } from 'angular-firebase-crud';

constructor(private  firebaseService:AngularFirebaseCrudService){}
```

Query Models

```hs
new QueryModel("where","your column","order",data)
new QueryModel("orderBy","your column","asc or desc")
new QueryModel("limit",null,null,"your limit")
new QueryModel("startAt",null,null,"your pos")
new QueryModel("startAfter",null,null,"your pos")
new QueryModel("endAt",null,null,"your pos")
new QueryModel("endBefore",null,null,"your pos")
```

Insert
```hs
this.firebaseService.insert("Your firebase Path",Object Or JSON).pipe(...).subscribe(res=>...);
```
Get

 - İf you used without query models this would get all selected collection in firebase.

```hs
this.firebaseService.get("Your firebase Path",Your query Models).pipe(...).subscribe(res=>...);

Example :
this.firebaseService.get("myPath").pipe(...).subscribe(res=>...);

this.firebaseService.get("myPath",new QueryModel("where","myFirstCloumn","==",10),QueryModel("where","mySecondCloumn",">=",3),QueryModel("orderBy","myThirdCloumn","asc"),QueryModel("limit",null,null,3)).pipe(...).subscribe(res=>...);
```

Value Changes
```hs
this.firebaseService.valueChanges("Your firebase Path",Your query Models).pipe(...).subscribe(res=>...);
```
Update
```hs
this.firebaseService.update("Your firebase Path",Object Or JSON,Your query Models).pipe(...).subscribe(res=>...);
```
Delete

 - Don't use delete request without testing in your published project.
 - İf you requested without query model this would delete all selected collection in firebase.

```hs
this.firebaseService.delete("Your firebase Path",Your query Models).pipe(...).subscribe(res=>...);
```