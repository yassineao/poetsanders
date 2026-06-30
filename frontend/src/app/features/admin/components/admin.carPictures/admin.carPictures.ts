import { CommonModule } from '@angular/common';
import { afterNextRender, Component, computed, effect, inject, Injector, input, output, signal, untracked } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CarsService } from '../../../../core/cars/cars.service';
import { I18nService } from '../../../../core/i18/i18n.service';
import type { Car, CarPicture, CarPictureRequest } from '../../../../core/interfaces/Car';
import { SupabaseService } from '../../../../core/supabase/supabase.service';

interface PendingPicture {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
}

@Component({
  selector: 'car-picture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.carPicture.html',
})
export class AdminCarPicturesComponent {
  readonly car = input<Car | null>(null);
  readonly closed = output<void>();
  readonly picturesChanged = output<CarPicture[]>();

  private readonly i18n = inject(I18nService);
  private readonly cars = inject(CarsService);
  private readonly supabase = inject(SupabaseService);
  private readonly injector = inject(Injector);
  private loadRequestId = 0;

  protected readonly copy = computed(() => this.i18n.copy().admin);
  protected readonly pictures = signal<CarPicture[]>([]);
  protected readonly pendingPictures = signal<PendingPicture[]>([]);
  protected readonly removedPictureIds = signal<string[]>([]);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly signedImageUrls = signal<Record<string, string>>({});
  protected readonly hasChanges = computed(() => this.pendingPictures().length > 0 || this.removedPictureIds().length > 0);

  constructor() {
    afterNextRender(() => {
      effect(() => {
        const car = this.car();
        untracked(() => {
          this.resetPendingPictures();
          this.removedPictureIds.set([]);
          this.pictures.set(car?.pictures ?? []);
          void this.loadImageUrls(car?.pictures ?? []);
        });
      }, { injector: this.injector });
    });
  }

  protected closePictures(): void {
    this.resetPendingPictures();
    this.closed.emit();
  }

  protected imageUrl(pictureId: string): string | null {
    return this.signedImageUrls()[pictureId] ?? null;
  }

  protected pictureStyles(picture: CarPicture): Record<string, string> {
    const width = this.validDimension(picture.width);
    const height = this.validDimension(picture.height);

    if (!width || !height) {
      return {};
    }

    return {
      width: `${width}px`,
      height: `${height}px`,
      'aspect-ratio': `${width} / ${height}`,
    };
  }

  protected pictureWidth(picture: CarPicture): number | null {
    return this.validDimension(picture.width);
  }

  protected pictureHeight(picture: CarPicture): number | null {
    return this.validDimension(picture.height);
  }

  protected async addPictures(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';

    if (!files.length) {
      return;
    }

    const pending = await Promise.all(
      files.map(async (file) => {
        const dimensions = await this.readImageDimensions(file);

        return {
          id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
          file,
          previewUrl: URL.createObjectURL(file),
          width: dimensions.width,
          height: dimensions.height,
        };
      }),
    );

    this.pendingPictures.update((pictures) => [...pictures, ...pending]);
  }

  protected removePicture(picture: CarPicture): void {
    this.pictures.update((pictures) => pictures.filter((item) => item.id !== picture.id));
    this.removedPictureIds.update((ids) => ids.includes(picture.id) ? ids : [...ids, picture.id]);
  }

  protected removePendingPicture(picture: PendingPicture): void {
    URL.revokeObjectURL(picture.previewUrl);
    this.pendingPictures.update((pictures) => pictures.filter((item) => item.id !== picture.id));
  }

  protected async saveChanges(): Promise<void> {
    const selectedCar = this.car();

    if (!selectedCar || this.saving() || !this.hasChanges()) {
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    try {
      await Promise.all(
        this.removedPictureIds().map((pictureId) =>
          firstValueFrom(this.cars.deleteCarPicture(selectedCar.id, pictureId)),
        ),
      );

      const newPictures = this.pendingPictures();
      const uploadedPictures = newPictures.length
        ? await firstValueFrom(this.cars.addCarPictures(selectedCar.id, this.toPictureRequests(newPictures)))
        : [];

      const updatedPictures = [...this.pictures(), ...uploadedPictures];
      this.pictures.set(updatedPictures);
      this.picturesChanged.emit(updatedPictures);
      this.resetPendingPictures();
      this.removedPictureIds.set([]);
      await this.loadImageUrls(updatedPictures);
    } catch {
      this.errorMessage.set('Could not save picture changes. Please try again.');
    } finally {
      this.saving.set(false);
    }
  }

  private async loadImageUrls(pictures: CarPicture[]): Promise<void> {
    const requestId = ++this.loadRequestId;
    this.errorMessage.set('');
    this.signedImageUrls.set({});

    if (!pictures.length) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);

    const entries = await Promise.all(
      pictures.map(async (picture) => {
        if (this.isAbsoluteUrl(picture.storage_path)) {
          return [picture.id, picture.storage_path] as const;
        }

        const signedUrl = await this.supabase.getPrivateImageUrl('car-pictures', picture.storage_path);
        return signedUrl ? ([picture.id, signedUrl] as const) : null;
      }),
    );

    if (requestId !== this.loadRequestId) {
      return;
    }

    const urls = Object.fromEntries(entries.filter((entry): entry is readonly [string, string] => entry !== null));
    this.signedImageUrls.set(urls);
    this.loading.set(false);

    if (Object.keys(urls).length !== pictures.length) {
      this.errorMessage.set(
        'Some pictures could not be loaded. Check SUPABASE_URL, SUPABASE_KEY, and your Storage SELECT policy.',
      );
    }
  }

  private isAbsoluteUrl(value: string): boolean {
    return /^https?:\/\//i.test(value);
  }

  private validDimension(value: number): number | null {
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  private toPictureRequests(pictures: PendingPicture[]): CarPictureRequest[] {
    return pictures.map((picture) => ({
      file: picture.file,
      title: picture.file.name,
      description: picture.file.name,
      width: picture.width,
      height: picture.height,
    }));
  }

  private readImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const previewUrl = URL.createObjectURL(file);
      const image = new Image();

      const finish = (width = 0, height = 0) => {
        URL.revokeObjectURL(previewUrl);
        resolve({ width, height });
      };

      image.onload = () => finish(image.naturalWidth, image.naturalHeight);
      image.onerror = () => finish();
      image.src = previewUrl;
    });
  }

  private resetPendingPictures(): void {
    this.pendingPictures().forEach((picture) => URL.revokeObjectURL(picture.previewUrl));
    this.pendingPictures.set([]);
  }
}
