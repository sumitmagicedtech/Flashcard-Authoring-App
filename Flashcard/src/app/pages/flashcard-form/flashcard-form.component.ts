import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SelectInputComponent } from '../../components/select-input/select-input.component';
import { TextInputComponent } from '../../components/text-input/text-input.component';
import { FlashcardDataService } from '../../shared/services/flashcard-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flashcard-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    SelectInputComponent,  // Add to the imports array
    TextInputComponent,
    // TagInputComponent,
  ],
  templateUrl: './flashcard-form.component.html',
  styleUrls: ['./flashcard-form.component.scss']
})
export class FlashcardFormComponent {
  form: FormGroup;
  difficulties = ['Easy', 'Medium', 'Hard'];
  animations = ['Flip', 'Slide', 'Fade'];

  constructor(
    private fb: FormBuilder,
    private flashcardService: FlashcardDataService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      images: this.fb.array([]),
      tags: this.fb.group({
        category: [''],
        subCategory: [''],
        subject: [''],
      }),
      difficulty: ['', Validators.required],
      animation: ['', Validators.required],
      question: ['', Validators.required],
      answer: ['', Validators.required],
    });
  }

  // Control Getters
  get titleControl(): FormControl {
    return this.form.get('title') as FormControl;
  }

  get difficultyControl(): FormControl {
    return this.form.get('difficulty') as FormControl;
  }

  get animationControl(): FormControl {
    return this.form.get('animation') as FormControl;
  }

  get questionControl(): FormControl {
    return this.form.get('question') as FormControl;
  }

  get answerControl(): FormControl {
    return this.form.get('answer') as FormControl;
  }

  get images(): FormArray {
    return this.form.get('images') as FormArray;
  }

  get categoryControl(): FormControl {
    return this.form.get('tags.category') as FormControl;
  }

  get subCategoryControl(): FormControl {
    return this.form.get('tags.subCategory') as FormControl;
  }

  get subjectControl(): FormControl {
    return this.form.get('tags.subject') as FormControl;
  }

  addImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.images.push(this.fb.control(file.name));
      input.value = '';
    }
  }

  removeImage(index: number): void {
    this.images.removeAt(index);
  }

  resetForm(): void {
    this.form.reset({
      title: '',
      tags: {
        category: '',
        subCategory: '',
        subject: '',
      },
      difficulty: '',
      animation: '',
      question: '',
      answer: '',
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  clearForm(): void {
    this.form.reset();
    this.images.clear();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  submit(): void {
    if (this.form.valid) {
      const newFlashcard = {
        id: Date.now(),
        ...this.form.value,
        images: this.images.controls.map(ctrl => ctrl.value),
      };
      this.flashcardService.addFlashcard(newFlashcard);
      this.router.navigate(['/dashboard']);
      console.log('Saved to LocalStorage:', newFlashcard);
      this.form.reset();
      this.images.clear();
    }
  }
}