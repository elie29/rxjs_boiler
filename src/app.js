import $ from 'jquery';
import Rx from 'rxjs/Rx';

console.log('RxJS Boiler Running...');

const btn = $('#btn');
const output = $('#div');

// btn.click becomes an observable
const btnStream = Rx.Observable.fromEvent(btn, 'click');
// to the observable, we subscribe a log observer
btnStream.subscribe((e) => console.log(e));

// Same for mousemove
const mouseMove = Rx.Observable.fromEvent(document, 'mousemove');
mouseMove.subscribe((e) => output.html('<h1>X: ' + e.clientX + ', Y: ' + e.clientY));

// Create Observable from Array
const numbers = [33, 44, 55, 66];
Rx.Observable.from(numbers).subscribe(
	v => console.log(v),
	error => console.log(error),
	() => console.log('completed 1') // Array stream is limited so completed will be fired !!
);

const map = new Map([[1,'1'], [2,'2'], [3,'3']]);
Rx.Observable.from(map).subscribe(
	v => console.log(v),
	error => console.log(error),
	() => console.log('completed 2') // Map stream is limited so completed will be fired !!
);

// From scratch
// new Rx.Observable same as below taking an observer interface
Rx.Observable.create(observer => {
	observer.next('Creating Observable');
	observer.next('Hello world');
	timeOut(observer);
	// observer.error(new Error('An error has occured...')); // this will cancel setTimeout
})
.catch(err => Rx.Observable.of(err))
// Another way to pass an observer by using next, error and complete object
.subscribe({
	next: x => console.log(x),
	error: e => console.log(e),
	complete: () => console.log('completed 3')
});

function timeOut(observer) {
	setTimeout(() => {
			observer.next('Yet another value!');
			observer.complete(); // To end the stream
	}, 3000);
}

// From Promise
const promise = new Promise(resolve => {
	setTimeout(() => resolve("Hello from my promise"), 6000);
});

/**
 * promise.then(x => console.log(x));
 */
Rx.Observable.fromPromise(promise).subscribe(x => console.log(x));

// Interval
Rx.Observable.interval(1000)
	.take(10)
	.map(x => x * 2) // return the same observable by changing the value
	.subscribe(x => console.log(x));

// Double subscribe switched to mergeMap
/**
Rx.Observable.of('Hello')
	.subscribe(x => {
		Rx.Observable.of(x + ' Everyone')
			.subscribe(x => console.log(x));
	});
*/
Rx.Observable.of('Hello')
	.mergeMap(x => Rx.Observable.of(x + ' Everybody')) // return another observable
	.subscribe(x => console.log(x));

function getUser(username) {
	return $.ajax({
		url: 'https://api.github.com/users/' + username,
		dataType: 'jsonp'
	}).promise();
}

Rx.Observable.fromEvent($("#input"), "keyup")
	.map(e => e.target.value)
	// same as mergeMap but it cancels previous calls
	.switchMap(v => Rx.Observable.fromPromise(getUser(v)))
	.map(x => x.data)
	.subscribe(v => {
		$("#result").text(v.blog);
	});

/**
 * Subttle difference between mergeMap and switchMap
 *  mergeMap: merge all data, no element is ever lost.
 * 	switchMap: When outer element became avail­able,
 * 		switchMap switches over to outer and unsub­scribes
 * 		from its inner stream.
 */
Rx.Observable.interval(1000).take(2)
	.mergeMap(x => Rx.Observable.interval(500).take(3).map(y => `mergeMap -> ${x}:${y}`))
	.subscribe(d => console.log(d));

Rx.Observable.interval(1000).take(2)
	.switchMap(x => Rx.Observable.interval(500).take(3).map(y => `switchMap -> ${x}:${y}`))
	.subscribe(d => console.log(d));

var subject = new Rx.Subject();

/**
 * Here the subject is acting like a data producer: As Observable
 * because it is being subscribed to
 */
subject.subscribe(v => console.log('consumer A: ' + v)); // first consumer
subject.subscribe(v => console.log('consumer B: ' + v)); // second consumer

// Create a source of the data, which in our case is an observable
var observable = Rx.Observable.from([0, 1, 2]); // Another producer

// Here the same subject acts as a data consumer because it
// can subscribe to another observable
observable.subscribe(subject);