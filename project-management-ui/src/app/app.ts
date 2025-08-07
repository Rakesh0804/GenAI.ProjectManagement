import { Component, signal } from '@angular/core';
import { LayoutComponent } from './shared/layout/layout';

@Component({
  selector: 'app-root',
  imports: [LayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('project-management-ui');
}
