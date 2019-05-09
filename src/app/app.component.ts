import { Component } from '@angular/core';
import { FormBuilder,FormGroup } from '@angular/forms';
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular';

myForm:FormGroup;
  constructor(private fb:FormBuilder){

this.myForm=this.fb.group({
multiplier:[],
  percent:[],
  currency:[],
  otherNumber:[]
})
  }

  
 
}
