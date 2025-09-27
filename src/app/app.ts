
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SalarySimulatorComponent } from './salary-simulator/salary-simulator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('simulator-app');
}
