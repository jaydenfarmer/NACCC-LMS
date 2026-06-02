import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SearchResults } from '../../services/search.service';
import { HighlightPipe } from '../../pipes/highlight.pipe';

@Component({
  selector: 'app-search-dropdown',
  standalone: true,
  imports: [CommonModule, RouterLink, HighlightPipe],
  templateUrl: './search-dropdown.component.html',
  styleUrl: './search-dropdown.component.css',
})
export class SearchDropdownComponent {
  @Input() results: SearchResults | null = null;
  @Input() term = '';
  @Output() resultSelected = new EventEmitter<void>();
}
