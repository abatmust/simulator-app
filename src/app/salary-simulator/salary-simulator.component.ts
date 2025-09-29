import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import situationsAdministratives from '../situationsAdministratives.json';

@Component({
  selector: 'app-salary-simulator',
   imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './salary-simulator.component.html',
  styleUrls: ['./salary-simulator.component.scss'],
  standalone: true
})
export class SalarySimulatorComponent {
  salairConfig = signal({});
  sitadm = situationsAdministratives;
  // Situation administrative
  corps: string = '';
  grade: string = '';
  // store the full grille item (object) for the selected échelon
  echelon: any = null;
  

  // Eléments variables
  deductions: number = 0;
  primes: number = 0;

  // Résultat
  fichePaie: any = null;

  calculerSalaire() {
    // Logique de calcul simplifiée (à adapter selon les règles marocaines)
    const salaireBase = this.getSalaireBase( this.echelon).monthly;
    const totalPrimes = this.primes;
    const totalDeductions = this.deductions;
    const salaireNet = salaireBase + totalPrimes - totalDeductions;
    this.fichePaie = {
      salaireBase,
      totalPrimes,
      totalDeductions,
      salaireNet
    };
  }

  getSalaireBase(echelon: any): { annual: number, monthly: number } {
  const echelonVal = parseInt(this.getIndiceValue(echelon)) || 0;
  if (echelonVal <= 0) return { annual: 0, monthly: 0 };

  // Define salary tranches
  const tranches = [
    { max: 100, value: 98.85 },   // 1 → 100
    { max: 150, value: 79.62 },   // 101 → 150
    { max: Infinity, value: 50.92 } // 151+
  ];

  let annualSalary = 0;
  let remaining = echelonVal;
  let lastMax = 0;

  for (const tranche of tranches) {
    if (remaining <= 0) break;

    const tranchePoints = Math.min(remaining, tranche.max - lastMax);
    annualSalary += tranchePoints * tranche.value;

    remaining -= tranchePoints;
    lastMax = tranche.max;
  }

  return {
    annual: annualSalary,
    monthly: annualSalary / 12
  };
}


  // Return grades for the currently selected corps
  get grades() {
    const found = this.sitadm.find((c: any) => c.corp === this.corps);
    return found ? found.grades : [];
  }

  // Return grille items for the currently selected grade so we can show the label
  // but keep the full object when selecting (use [ngValue] in template).
  get echelons() {
    const corpsFound = this.sitadm.find((c: any) => c.corp === this.corps);
    if (!corpsFound) return [];
    const gradeFound = corpsFound.grades.find((g: any) => g.grade === this.grade);
    if (!gradeFound) return [];
    return gradeFound.grille; // array of objects {echelon: 'x', ...}
  }

  // Reset grade and echelon when the corps changes
  onCorpsChange() {
    this.grade = '';
    this.echelon = null;
  }

  // Reset echelon when the grade changes
  onGradeChange() {
    this.echelon = null;
    this.salairConfig.set({ "grade": this.grade });
    this.salairConfig.update(config => ({
      ...config,           // keep the existing properties
      indSuj: 1400,  // only update `corps`  
  }))};
  onEchelonChange() {
  this.salairConfig.update(config => ({
    ...config,           // keep the existing properties
    indice: this.echelon.indice,  // only update `indice`
    
  }));
}

  // helper to extract numeric echelon value (handles both raw string/number and object)
  private getIndiceValue(echelon: any): string {
    if (!echelon && echelon !== 0) return '';
    if (typeof echelon === 'object') return echelon.indice ?? '';
    return String(echelon);
  }
}
