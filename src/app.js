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
new Rx.Observable(subject => {
	subject.next('Creating Observable');
	subject.next('Hello world');
	timeOut(subject);
	// subject.error(new Error('An error has occured...')); // this will cancel setTimeout
})
.catch(err => Rx.Observable.of(err))
.subscribe(
	x => console.log(x),
	error => console.log(error),
	complete => console.log('completed 3')
);

function timeOut(subject) {
    setTimeout(() => {
        subject.next('Yet another value!');
        subject.complete(); // To end the stream
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
	.map(x => x * 2)
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
	.mergeMap(x => Rx.Observable.of(x + ' Everybody'))
	.subscribe(x => console.log(x));

function getUser(username) {
	return $.ajax({
		url: 'https://api.github.com/users/' + username,
		dataType: 'jsonp'
	}).promise();
}

Rx.Observable.fromEvent($("#input"), "keyup")
	.map(e => e.target.value)
	// same as map but return a observable and not a value
	.switchMap(v => Rx.Observable.fromPromise(getUser(v)))
	.map(x => x.data)
	.subscribe(v => {
		$("#result").text(v.blog);
	});