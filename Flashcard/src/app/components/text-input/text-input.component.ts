import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text-input',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule,ReactiveFormsModule],
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit {
  @Input() label: string = '';  // The label for the input field
  // @Input() control: FormControl;  // The FormControl bound to the input field
 @Input() control: FormControl = new FormControl(); 
  @Input() required: boolean = false;  // Whether the field is required
  @Input() maxLength: number | null = null;  // Max length for the input

  ngOnInit(): void {
    // You can add any initializations or logic here if needed
  }
}