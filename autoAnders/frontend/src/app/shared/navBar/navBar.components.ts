import { CommonModule, DOCUMENT, isPlatformBrowser } from "@angular/common";
import { Component, HostListener, PLATFORM_ID, computed, inject, input, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import type { LocaleDictionary } from "../../core/interfaces/LocaleDictionary";
import type { Locale } from "../../core/interfaces/locale";
import { AuthService } from "../../core/auth/auth.service";

@Component({
  selector: "app-navbar",
  imports: [CommonModule, RouterLink],
  templateUrl: "./navBar.components.html",
})
export class NavBarComponent {
  readonly locale = input.required<Locale>();
  readonly content = input.required<LocaleDictionary["nav"]>();
  

  protected readonly mobileOpen = signal(false);
  protected readonly localeOpen = signal(false);
  protected readonly lightTheme = signal(false);
  protected readonly locales = ["de", "en", "nl"] as const;

  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly auth = inject(AuthService);

  protected readonly isAuthenticated = computed(() => this.auth.currentUser() !== null);
  protected readonly isAdmin = computed(() => this.auth.currentUser()?.role === 'ADMIN');
  protected readonly userName = computed(() => {
    const user = this.auth.currentUser();
    return user?.user || user?.email || '';
  });

  constructor() {
    const savedTheme = this.isBrowser
      ? this.document.defaultView?.localStorage.getItem("autoanders-theme")
      : null;
    this.applyTheme(savedTheme === "light" ? "light" : "dark");
  }

  protected localizedHref(href: string): string {
    return `/${this.locale()}${href}`;
  }

  protected switchLocale(locale: Locale): void {
    const tree = this.router.parseUrl(this.router.url);
    const segments = tree.root.children["primary"]?.segments.map((segment) => segment.path) ?? [];
    if (segments.length > 0 && this.locales.includes(segments[0] as Locale)) {
      segments[0] = locale;
    } else {
      segments.unshift(locale);
    }
    this.localeOpen.set(false);
    void this.router.navigateByUrl(`/${segments.join("/")}`);
  }

  protected toggleTheme(): void {
    this.applyTheme(this.lightTheme() ? "dark" : "light");
  }

  protected closeMenus(): void {
    this.mobileOpen.set(false);
    this.localeOpen.set(false);
  }

  private applyTheme(theme: "dark" | "light"): void {
    this.lightTheme.set(theme === "light");
    if (!this.isBrowser) {
      return;
    }
    this.document.documentElement.dataset["theme"] = theme;
    this.document.documentElement.style.colorScheme = theme;
    this.document.defaultView?.localStorage.setItem("autoanders-theme", theme);
  }

  @HostListener("document:keydown.escape")
  protected onEscape(): void {
    this.closeMenus();
  }
}
