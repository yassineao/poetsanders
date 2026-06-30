import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Car, CarPicture, CarPictureRequest, CarRequest } from '../interfaces/Car';






@Injectable({ providedIn: 'root' })
export class CarsService {
  private readonly http = inject(HttpClient);
  private readonly carsUrl = `${environment.apiBaseUrl}/cars`;
  private readonly requestOptions = { withCredentials: true };

  readonly currentCar = signal<Car | null>(null);

  addCar(car: CarRequest): Observable<Car> {
    return this.http
      .post<Car>(this.carsUrl, car, this.requestOptions)
      .pipe(tap((savedCar) => this.currentCar.set(savedCar)));
  }

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.carsUrl, this.requestOptions);
  }

  getCar(id: string): Observable<Car> {
    return this.http
      .get<Car>(`${this.carsUrl}/${id}`, this.requestOptions)
      .pipe(tap((car) => this.currentCar.set(car)));
  }

  updateCar(id: string, car: CarRequest): Observable<Car> {
    return this.http
      .put<Car>(`${this.carsUrl}/${id}`, car, this.requestOptions)
      .pipe(tap((updatedCar) => this.currentCar.set(updatedCar)));
  }

  updateCarStatus(id: string, status: Car['status']): Observable<Car> {
    return this.http
      .patch<Car>(`${this.carsUrl}/statusUpdate/${id}`, status, this.requestOptions)
      .pipe(tap((updatedCar) => this.currentCar.set(updatedCar)));
  }

  deleteCar(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.carsUrl}/${id}`, this.requestOptions)
      .pipe(
        tap(() => {
          if (this.currentCar()?.id === id) {
            this.currentCar.set(null);
          }
        })
      );
  }

  deleteCarPicture(carId: string, pictureId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.carsUrl}/${carId}/pictures/${pictureId}`,
      this.requestOptions,
    );
  }

  addCarPicture(carId: string, picture: CarPictureRequest): Observable<CarPicture> {
    const formData = new FormData();
    formData.append('file', picture.file);
    formData.append('width', String(picture.width));
    formData.append('height', String(picture.height));

    if (picture.title) {
      formData.append('title', picture.title);
    }

    if (picture.description) {
      formData.append('description', picture.description);
    }

    return this.http.post<CarPicture>(
      `${this.carsUrl}/${carId}/pictures`,
      formData,
      this.requestOptions
    );
  }

  addCarPictures(carId: string, pictures: CarPictureRequest[]): Observable<CarPicture[]> {
    const formData = new FormData();

    for (const picture of pictures) {
      formData.append('files', picture.file);
    }

    formData.append('width', String(pictures[0]?.width ?? 0));
    formData.append('height', String(pictures[0]?.height ?? 0));

    return this.http.post<CarPicture[]>(
      `${this.carsUrl}/${carId}/pictures/batch`,
      formData,
      this.requestOptions
    );
  }


  getCarPictures(carId: string): Observable<CarPicture[]> {
    return this.http.get<CarPicture[]>(
      `${this.carsUrl}/${carId}/pictures`,
      this.requestOptions
    );
  }

  getAvailableCars(): Observable<Car[]> {
    return this.http.get<Car[]>(
      `${this.carsUrl}/accepted`,
      this.requestOptions
    );

  }

  getCarsByCurrentUser(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.carsUrl}/by_user`, this.requestOptions);
  }

  AddCar(car: CarRequest): Observable<Car> {
    return this.addCar(car);
  }

  GetCars(): Observable<Car[]> {
    return this.getCars();
  }

  GetAvailableCars(): Observable<Car[]>{
    return this.getAvailableCars();
  }

  UpdateCar(car: Car): Observable<Car> {
    return this.updateCar(car.id, car);
  }

  DeleteCar(id: string): Observable<void> {
    return this.deleteCar(id);
  }

  DeleteCarPicture(carId: string, pictureId: string): Observable<void> {
    return this.deleteCarPicture(carId, pictureId);
  }

  AddCarPicture(carId: string, picture: CarPictureRequest): Observable<CarPicture> {
    return this.addCarPicture(carId, picture);
  }

  AddCarPictures(carId: string, pictures: CarPictureRequest[]): Observable<CarPicture[]> {
    return this.addCarPictures(carId, pictures);
  }
}
