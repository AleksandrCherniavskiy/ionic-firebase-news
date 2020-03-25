import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NewsItem } from './news-item.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  news;

  constructor(private firestore: AngularFirestore) { }

  getNews() {
    return this.firestore.collection('news').snapshotChanges();
  }

}
