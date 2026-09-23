import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServicesHeroCopy } from '../../../../core/interfaces/services';


const defaultHero: ServicesHeroCopy = {
    title: '',
    description: '',
    ctaPrimary: '',
    ctaSecondary: '',
    announcement: '',
};

@Component({
  selector: 'app-hero-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './Hero-services.component.html',
})

export class HeroServicesComponent {
    @Input({ required: true }) hero : ServicesHeroCopy = defaultHero;
}
