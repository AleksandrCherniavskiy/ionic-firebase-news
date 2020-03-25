import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../shared/authentication.service';
import { NewsService } from '../../shared/news.service';
import { NewsItem } from '../../shared/news-item.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.page.html',
  styleUrls: ['./news-list.page.scss'],
})
export class NewsListPage implements OnInit {

  private news: NewsItem[];
  private subscription: Subscription;

  constructor(
    private newsService: NewsService,
    public authService: AuthenticationService
    ) { }

  ngOnInit() {
    this.subscription = this.newsService.getNews().subscribe(data => {
      this.news = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as NewsItem;
      });
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

}
