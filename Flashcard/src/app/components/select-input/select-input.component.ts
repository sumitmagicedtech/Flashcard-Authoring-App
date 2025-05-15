import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-select-input',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule,ReactiveFormsModule ],
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.scss'
})
export class SelectInputComponent implements OnInit {
   @Input() label: string = '';
  @Input() options: string[] = [];
@Input() control: FormControl = new FormControl(); 
  @Input() required: boolean = false;

  ngOnInit(): void {
    if (this.control) {
      // Only add 'Validators.required' if 'required' is true
      const validators = this.required ? [Validators.required] : [];
      this.control.setValidators(validators);
    }
  }
}