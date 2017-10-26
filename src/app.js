import $ from 'jquery';
import Rx from 'rxjs/Rx';

console.log('RxJS Boiler Running...');

const btn = $('#btn');

// btn.click becomes an observable
const btnStream = Rx.Observable.fromEvent(btn, 'click');
// to the observable, we subscribe a log observer
btnStream.subscribe((e) => console.log(e));

