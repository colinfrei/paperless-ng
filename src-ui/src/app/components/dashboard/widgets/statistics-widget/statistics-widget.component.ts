import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ConsumerStatusService } from 'src/app/services/consumer-status.service';
import { environment } from 'src/environments/environment';
import { FILTER_IS_IN_INBOX } from 'src/app/data/filter-rule-type';

export interface Statistics {
  documents_total?: number
  documents_inbox?: number
}


@Component({
  selector: 'app-statistics-widget',
  templateUrl: './statistics-widget.component.html',
  styleUrls: ['./statistics-widget.component.scss']
})
export class StatisticsWidgetComponent implements OnInit, OnDestroy {

  constructor(private http: HttpClient,
    private consumerStatusService: ConsumerStatusService,
    private list: DocumentListViewService) { }

  statistics: Statistics = {}

  subscription: Subscription
  
  private getStatistics(): Observable<Statistics> {
    return this.http.get(`${environment.apiBaseUrl}statistics/`)
  }

  reload() {
    this.getStatistics().subscribe(statistics => {
      this.statistics = statistics
    })
  }

  ngOnInit(): void {
    this.reload()
    this.subscription = this.consumerStatusService.onDocumentConsumptionFinished().subscribe(status => {
      this.reload()
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
  
  filterDocuments() {
    this.list.quickFilter([{rule_type: FILTER_IS_IN_INBOX}])
  }
}
