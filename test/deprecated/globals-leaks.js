var globalsBefore = Object.keys(global)
  , path = require("path");

console.log(__dirname);
console.log(path.resolve(__dirname, "../lib/radamn.node"));
  
require(path.resolve(__dirname, "../lib/radamn"));

//console.log(Radamn);
  
try {
	var globalsAfter = Object.keys(global);
	
	var i=0,
		max = globalsBefore.length;
	for(;i<max; ++i) {
		var pos = globalsAfter.indexOf( globalsBefore[i] );
		if(pos !== -1) {
			globalsAfter.splice(pos,1);
		}
	}
	
	console.log(globalsAfter);
	
	if (globalsAfter !== globalsBefore) {
		var er = new Error("new globals introduced\n"+
			"expected: "+globalsBefore+"\n"+
			"actual: "+globalsAfter)
		globalsBefore = globalsAfter
		throw er
	}
	console.log("OK");
} catch (er) {
	console.log("KO");
}
