import { Observable } from 'rxjs';

export const loadScript = (doc: Document, url: string): Observable<any> => {
  const script = doc.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  doc.body.appendChild(script);
  return new Observable<any>(subscriber => {
    script.onload = () => {
      subscriber.next();
      subscriber.complete();
    };
  });
};