import { inject } from '@angular/core';
import type { ActivatedRouteSnapshot } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CarsService } from './cars.service';
import { SupabaseService } from '../supabase/supabase.service';
import type { Car } from '../interfaces/Car';

export interface VehicleResult {
  car: Car | null;
  images: string[];
  unavailable?: boolean;
}

export async function resolveVehicle(route: ActivatedRouteSnapshot): Promise<VehicleResult> {
  const cars = inject(CarsService);
  const storage = inject(SupabaseService);
  try {
    // Only published inventory may become a public landing page.
    const inventory = await firstValueFrom(cars.getAvailableCars());
    const car = inventory.find(item => item.id === route.paramMap.get('id'));
    if (!car) return { car: null, images: [] };
    let images: string[] = [];
    try {
      const pictures = car.pictures?.length ? car.pictures : await firstValueFrom(cars.getPublicCarPictures(car.id));
      images = (await Promise.all(pictures.map(picture => {
        const path = picture.storage_path;
        if (!path) return null;
        if (/^https?:\/\//i.test(path) || path.startsWith('/')) return path;
        return storage.getPrivateImageUrl('car-pictures', path);
      }))).filter((image): image is string => Boolean(image));
    } catch { /* Keep vehicle facts available if its photographs fail. */ }
    return { car, images: images.length ? images : ['/no-image-icon.png'] };
  } catch {
    // An upstream outage is not a missing vehicle (503, not 404).
    return { car: null, images: [], unavailable: true };
  }
}
