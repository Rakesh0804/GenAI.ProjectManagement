import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private config: any;

  constructor() {
    // Initialize configuration
    this.loadConfig();
  }

  private loadConfig(): void {
    this.config = {
      apiUrl: this.getApiUrl()
    };
  }

  private getApiUrl(): string {
    // First try to get from window object (injected by Aspire)
    if ((window as any)?.APP_CONFIG?.API_URL) {
      return (window as any).APP_CONFIG.API_URL;
    }
    
    // Fallback to environment
    return 'http://localhost:5052/api';
  }

  get apiUrl(): string {
    return this.config.apiUrl;
  }
}
