import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private activeRequests = 0;
  private loadingState = false;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip loading for certain requests (like config or login)
    if (req.url.includes('/config') || req.url.includes('/auth/login')) {
      return next.handle(req);
    }

    this.activeRequests++;
    this.updateLoadingState();

    return next.handle(req).pipe(
      finalize(() => {
        this.activeRequests--;
        this.updateLoadingState();
      })
    );
  }

  private updateLoadingState(): void {
    const newLoadingState = this.activeRequests > 0;
    if (this.loadingState !== newLoadingState) {
      this.loadingState = newLoadingState;
      // You can emit this to a service if you want to show a global loading indicator
      // this.loadingService.setLoading(this.loadingState);
    }
  }

  get isLoading(): boolean {
    return this.loadingState;
  }
}
