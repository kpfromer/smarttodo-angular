import {DefaultErrorMatcher} from './default.error-matcher';
import {FormControl, NgForm, Validators} from '@angular/forms';

describe('DefaultErrorMatcher', () => {
  let errorMatcher: DefaultErrorMatcher;
  beforeEach(() => {
    errorMatcher = new DefaultErrorMatcher();
  });

  describe('form', () => {
    it('should be ok if there is no form', () => {
      const error = errorMatcher.isErrorState(undefined, null);

      expect(error).toBe(false);
    });

    it('should be ok if form is not submitted', () => {
      const form = new NgForm([], []);
      const error = errorMatcher.isErrorState(undefined, form);

      expect(error).toBe(false);
    });
  });

  describe('control', () => {
    it('should be ok if there is no control', () => {
      const error = errorMatcher.isErrorState(null, undefined);

      expect(error).toBe(false);
    });

    it('should error if invalid and touched', () => {
      const control = new FormControl('', Validators.required);
      control.markAsTouched();
      const error = errorMatcher.isErrorState(control, undefined);

      expect(error).toBe(true);
    });

    it('should error if invalid and dirty', () => {
      const control = new FormControl('', Validators.required);
      control.markAsDirty();
      const error = errorMatcher.isErrorState(control, undefined);

      expect(error).toBe(true);
    });

    it('should be ok if valid', () => {
      const control = new FormControl('valid input', Validators.required);
      control.markAsTouched();
      control.markAsDirty();
      const error = errorMatcher.isErrorState(control, undefined);

      expect(error).toBe(false);
    });
  });
});
