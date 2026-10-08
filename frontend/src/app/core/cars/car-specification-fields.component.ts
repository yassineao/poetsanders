import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarSpecifications } from '../interfaces/Car';
import { specificationFields, normalizeFeatures } from './car-specifications';
import { I18nService } from '../i18/i18n.service';
import { translateUi } from '../i18/ui-translations';

@Component({
  selector: 'app-car-specification-fields',
  imports: [FormsModule],
  template: `
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      @for (field of fields; track field.key) {
        <label class="block text-sm text-slate-300">{{ t(field.label) }}
          @if (field.type === 'boolean' || field.type === 'select') {
            <select [ngModel]="values()[field.key] ?? null" (ngModelChange)="set(field.key, $event)" [ngModelOptions]="{standalone: true}" class="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 p-3">
              <option [ngValue]="null">—</option>
              @if (field.type === 'boolean') {
                <option [ngValue]="true">{{ t('Yes') }}</option><option [ngValue]="false">{{ t('No') }}</option>
              } @else {
                @for (option of field.options; track option) { <option [value]="option">{{ t(option.replaceAll('_', ' ')) }}</option> }
              }
            </select>
          } @else {
            <input [type]="field.type" [ngModel]="values()[field.key]" (ngModelChange)="set(field.key, $event)" [ngModelOptions]="{standalone: true}" [attr.min]="field.min" [attr.step]="field.step" [attr.maxlength]="field.maxLength" class="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 p-3" />
          }
        </label>
      }
    </div>
    <label class="mt-5 block text-sm text-slate-300">{{ t('Features') }} — {{ t('One feature per line') }}
      <textarea rows="4" [ngModel]="featureText" (ngModelChange)="featureText = $event; values().features = normalize($event)" [ngModelOptions]="{standalone: true}" class="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 p-3"></textarea>
    </label>
  `,
})
export class CarSpecificationFieldsComponent {
  readonly values = input.required<CarSpecifications>();
  protected readonly fields = specificationFields;
  protected readonly normalize = normalizeFeatures;
  private readonly i18n = inject(I18nService);
  protected t(value: string): string { return translateUi(value, this.i18n.getCurrentLanguage()); }
  private draft: string | undefined;
  protected get featureText(): string { return this.draft ?? (this.values().features ?? []).join('\n'); }
  protected set featureText(value: string) { this.draft = value; }
  protected set(key: keyof CarSpecifications, value: unknown): void {
    Object.assign(this.values(), { [key]: value === '' ? null : value });
  }
}
