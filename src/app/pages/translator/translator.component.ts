import { Component } from '@angular/core';

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.scss']
})
export class TranslatorComponent {
  inputText: string = '';
  outputText: string = '';

  translate() {
    // Simulation de traduction (mock)
    if (this.inputText.trim()) {
      this.outputText = `🔄 Traduction: ${this.inputText}`;
    } else {
      this.outputText = '';
    }
  }

  swapLanguages() {
    // Exemple simple : swap FR -> EN
    const temp = this.inputText;
    this.inputText = this.outputText;
    this.outputText = temp;
  }
}
