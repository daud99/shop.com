import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/requestApi.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-uploadporduct',
  templateUrl: './uploadporduct.component.html',
  styleUrls: ['./uploadporduct.component.css']
})
export class UploadporductComponent implements OnInit {
  categories = null;
  form: FormGroup;
  product;
  msg: string;
  constructor(private apiservice: ApiService) { }

  ngOnInit() {
    this.form = new FormGroup({
      'product_name': new FormControl(null, { validators: [Validators.required] }),
      'category_id': new FormControl(null, { validators: [Validators.required] }),
      'product_price': new FormControl(null, { validators: [Validators.required] }),
      'image': new FormControl(null, { validators: [Validators.required] , asyncValidators: [mimeType]}),
    });
    // this.form = this.fb.group({
    //   'product_name': ''
    // });
    this.form.valueChanges.subscribe(console.log);
    this.apiservice.getCategories().subscribe(category => {
      this.categories = category;
      console.log('these are the categories i got received in front end');
      console.log(this.categories);
    });
  }
  onSubmit() {
    if (this.form.invalid) {
      console.log('form is invalid');
      return;
    }
    console.log(this.form.value);
    console.log('this below is only form.value');
    console.log(this.form);
    this.apiservice.addProduct(this.form.value.product_name, this.form.value.category_id, this.form.value.product_price, this.form.value.image).subscribe(result => {
      console.log('successfully added');
      console.log(result);
      this.msg = result.message;
      this.form.reset();
    });
    // this.product = { product_name: this.product_name, category_id: this.category_id, product_price: this.product_price, img: this.img };
    // console.log(this.product);
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    console.log(file);
    console.log(this.form);
  }
}
