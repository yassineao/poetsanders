import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactPageComponent } from '../pages/contact-page.component';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { ContactService } from '../../../core/contact/contact.service';
import { By } from '@angular/platform-browser';
import { NgModel } from '@angular/forms';

describe('ContactPageComponent', () => {
  let fixture: ComponentFixture<ContactPageComponent>;
  let getMessages: ReturnType<typeof vi.fn>;
  let sendMessage: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    getMessages = vi.fn(() => of([]));
    sendMessage = vi.fn(() => of({}));

    TestBed.configureTestingModule({
      imports: [ContactPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: ContactService,
          useValue: { getMessages, sendMessage },
        },
      ],
    });

    fixture = TestBed.createComponent(ContactPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('reloads messages when Refresh is clicked', () => {
    // The constructor loads messages once before any user interaction.
    expect(getMessages).toHaveBeenCalledTimes(1);
    getMessages.mockClear();

    const element: HTMLElement = fixture.nativeElement;

    const button = Array.from(element.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Refresh',
    );

    expect(button).toBeDefined();

    button!.click();

    expect(getMessages).toHaveBeenCalledTimes(1);
  });

  it('does not send an empty message', async () => {
    const element: HTMLElement = fixture.nativeElement;

    const controls = fixture.debugElement.queryAll(By.directive(NgModel));
    const companyControl = controls.find(
      (control) => control.injector.get(NgModel).name === 'companyName',
    );
    expect(companyControl).toBeDefined();
    const company = companyControl!.nativeElement as HTMLInputElement;
    company.value = 'Testfirma';
    company.dispatchEvent(new Event('input'));

    const consent = element.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    consent.click();

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const messageControl = controls.find(
      (control) => control.injector.get(NgModel).name === 'message',
    );
    expect(messageControl).toBeDefined();
    const message = messageControl!.nativeElement as HTMLTextAreaElement;
    const button = element.querySelector<HTMLButtonElement>('#submit-button')!;

    expect(message.value).toBe('');
    expect(button.disabled).toBe(true);

    button.click();

    expect(sendMessage).not.toHaveBeenCalled();
  });

  it('does not send message without sender', async () => {
    const element: HTMLElement = fixture.nativeElement;
    const controls = fixture.debugElement.queryAll(By.directive(NgModel));

    const messageControl = controls.find(
      (control) => control.injector.get(NgModel).name === 'message',
    );

    expect(messageControl).toBeDefined();
    const message = messageControl!.nativeElement as HTMLTextAreaElement;
    const button = element.querySelector<HTMLButtonElement>('#submit-button')!;

    message.value = 'test the message';
    message.dispatchEvent(new Event('input', { bubbles: true }));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(messageControl!.injector.get(NgModel).value).toBe('test the message');
    expect(button.disabled).toBe(true);

    button.click();

    expect(sendMessage).not.toHaveBeenCalled();

  });

});
