function benchmark(context) {
	//console.log(Array.prototype);
	
	var output = [];
	
	var i=0,
		max = 1000000; //1m


	// this test is amaizing! mootools perform x2... WHY in the name of the GOD?!
	console.time(context+'clean-array');
	for(;i<max;++i) {
		var ar = [];
	}
	console.timeEnd(context+'clean-array');

	// the same
	console.time(context+'clean-array-access');
	i=0;
	for(;i<max;++i) {
		var ar = [];
		ar[0] = 1;
		ar[2] = 1;
		ar[3] = ar[0];
	}
	console.timeEnd(context+'clean-array-access');
	
	// this test is incredible! this is what i mean with pollution
	// mootools is crappy ? WHY?!!!!!!!!!!!!
	console.time(context+'array-functions');
	i=0;
	for(;i<max;++i) {
		var ar = [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1];
		ar.slice(5,3);
		ar.pop();
		ar.pop();
		ar.push(1);
		ar.push(0);
		ar.sort();
	}
	console.timeEnd(context+'array-functions');

    // almost the same, mootools allways a bit slower
	console.time(context+'function-instance');
	i=0;
	for(;i<max;++i) {
		var x = function(a,b,c) {
			this.test = 1;
		};
		var y = new x();
		y.test = 2;
	}
	console.timeEnd(context+'function-instance');
	

}

benchmark("clean");
require("./../lib/mootools-core-1.4.1-server.js");
benchmark("mootools");
