import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';


@Component({
  selector: 'app-tag-input',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule, // Add MatChipsModule here
    ],
  templateUrl: './tag-input.component.html',
  styleUrl: './tag-input.component.scss'
})
export class TagInputComponent implements OnInit {
  @Input() control!: FormControl;
  @Input() label: string = '';

  inputValue = '';

  ngOnInit() {
    if (!(this.control instanceof FormControl)) {
      console.error('Invalid FormControl passed to app-tag-input');
    }
    if (!this.control.value) {
      this.control.setValue([]);
    }
  }

  addTag() {
    const tag = this.inputValue.trim();
    if (tag && !this.control.value.includes(tag)) {
      this.control.setValue([...this.control.value, tag]);
    }
    this.inputValue = '';
  }

  removeTag(index: number) {
    const updated = [...this.control.value];
    updated.splice(index, 1);
    this.control.setValue(updated);
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addTag();
    }
  }
}