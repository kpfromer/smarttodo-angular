import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InlineEditorComponent} from './inline-editor.component';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {Component, ViewChild} from '@angular/core';

@Component({
  template: `
    <app-inline-editor #inlineEditor [type]="type" [required]="required" [disabled]="disabled" [ngModel]="value"
                       (onSave)="save($event)"></app-inline-editor>`
})
class TestHostComponent {

  @ViewChild('inlineEditor') inlineEditor: InlineEditorComponent;

  required = true;
  disabled = false;
  type = 'text';
  value = 'My name is jack.';

  save(data) {
    console.log(data);
  }
}


describe('InlineEditorComponent', () => {

  describe('only create inline editor component', () => {
    let component: InlineEditorComponent;
    let fixture: ComponentFixture<InlineEditorComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [InlineEditorComponent],
        imports: [FormsModule]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(InlineEditorComponent);
      component = fixture.componentInstance;

      component.forId = 'inputId';
      component.required = true;
      component.disabled = false;
      component.type = 'text';
      component.value = 'My name is jack.';

      fixture.detectChanges();
    });

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should throw error if type is password', () => {
      const handler = function () {
        component.type = 'password';
      };

      expect(handler).toThrowError('Type cannot be password');
    });

    describe('input', () => {

      it('should be displayed only when editing', () => {
        let inputElement = fixture.debugElement.query(By.css('input'));
        expect(inputElement).toBeNull();
        component.startEditing();
        fixture.detectChanges();
        inputElement = fixture.debugElement.query(By.css('input'));
        expect(inputElement).toBeTruthy();
      });

      describe('Needs to be in editing mode', () => {

        beforeEach(() => {
          component.startEditing();
          fixture.detectChanges();
        });

        it('should have a type', () => {
          const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
          expect(inputElement.getAttribute('type')).toBe('text');
        });

        it('should be required', () => {
          const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
          expect(inputElement.hasAttribute('required')).toBe(true);
        });

        it('should cancelEditing on escape keypress', () => {
          const inputElement = fixture.debugElement.query(By.css('input'));

          inputElement.triggerEventHandler('click', null);
          fixture.detectChanges();
          spyOn(component, 'cancelEditing');
          inputElement.triggerEventHandler('keyup.esc', null);
          fixture.detectChanges();

          expect(component.cancelEditing).toHaveBeenCalled();
        });

        it('should doneEditing on enter keypress', () => {
          const inputElement = fixture.debugElement.query(By.css('input'));

          inputElement.triggerEventHandler('click', null);
          fixture.detectChanges();
          spyOn(component, 'doneEditing');
          inputElement.triggerEventHandler('keyup.enter', null);
          fixture.detectChanges();

          expect(component.doneEditing).toHaveBeenCalled();
        });

      });
    });

    describe('display', () => {

      it('should be displayed when not editing', () => {
        let textElement = fixture.debugElement.query(By.css('.inline-text'));
        expect(textElement).toBeTruthy();
        component.startEditing();
        fixture.detectChanges();
        textElement = fixture.debugElement.query(By.css('.inline-text'));
        expect(textElement).toBeNull();
      });

      it('should display value', () => {
        const textElement = fixture.debugElement.query(By.css('.inline-text')).nativeElement;
        expect(textElement.textContent).toBe('My name is jack.');
      });

      it('should startEditing on click', () => {
        spyOn(component, 'startEditing');

        const textElement = fixture.debugElement.query(By.css('.inline-text'));
        textElement.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(component.startEditing).toHaveBeenCalled();
      }); // https://stackoverflow.com/questions/40093013/unit-testing-click-event-in-angular

      it('should startEditing on focus', () => {
        spyOn(component, 'startEditing');

        const textElement = fixture.debugElement.query(By.css('.inline-text'));
        textElement.triggerEventHandler('focus', null);
        fixture.detectChanges();

        expect(component.startEditing).toHaveBeenCalled();
      });

      it('should be set for id', () => {
        const textElement = fixture.debugElement.query(By.css('.inline-text'));

        expect(textElement.nativeElement.getAttribute('for')).toBe('inputId');
      });
    });

    describe('startEditing', () => {

      it('should do nothing when disabled', () => {
        component.disabled = true;
        component.startEditing();
        fixture.detectChanges();
        expect(component.editing).toBe(false);
      });

      it('should start editing', () => {
        component.startEditing();
        fixture.detectChanges();
        expect(component.editing).toBe(true);
      });

    });

    describe('doneEditing', () => {

      beforeEach(() => {
        component.startEditing();
        fixture.detectChanges();
      });

      it('should do nothing when disabled', () => {
        component.disabled = true;
        component.doneEditing();
        expect(component.editing).toBe(true);
      });

      it('should do nothing when value is empty', () => {
        component.value = '';
        fixture.detectChanges();
        component.doneEditing();
        fixture.detectChanges();
        expect(component.editing).toBe(true);
      });

      it('should stop editing', () => {
        component.doneEditing();
        fixture.detectChanges();
        expect(component.editing).toBe(false);
      });

    });

    describe('cancelEditing', () => {

      beforeEach(() => {
        component.startEditing();
        fixture.detectChanges();
      });

      it('should do nothing when disabled', () => {
        component.disabled = true;
        component.cancelEditing();
        expect(component.editing).toBe(true);
      });

      it('should undo entered value', () => {
        component.value = 'My new name is kyle.';
        fixture.detectChanges();
        component.cancelEditing();
        expect(component.value).toBe('My name is jack.');
      });

      it('should stop editing', () => {
        component.cancelEditing();
        expect(component.editing).toBe(false);
      });

    });

    describe('value', () => {
      describe('setter', () => {
        it('should call onChange', () => {
          spyOn(component, 'onChange');
          component.value = 'New value';
          expect(component.onChange).toHaveBeenCalledWith('New value');
        });
      });
    });

    describe('writeValue', () => {
      it('should write new value', () => {
        component.writeValue('New Value!');
        expect(component.value).toBe('New Value!');
      });
    });
    describe('setDisabledState', () => {
      it('should disable component', () => {
        component.setDisabledState(true);
        expect(component.disabled).toBe(true);
      });
    });

  });

  describe('InlineEditorComponent: HostComponent', () => {
    let component: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [InlineEditorComponent, TestHostComponent],
        imports: [FormsModule]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestHostComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    describe('doneEditing', () => {
      it('should emit onSave event', () => {
        component.inlineEditor.startEditing();
        fixture.detectChanges();
        component.inlineEditor.value = 'my name is now kyle.';
        fixture.detectChanges();
        spyOn(component, 'save');
        component.inlineEditor.doneEditing();
        fixture.detectChanges();
        expect(component.save).toHaveBeenCalledWith({input: 'my name is now kyle.'});
      });
    });

    // todo: add tests for inputs!
  });

});
