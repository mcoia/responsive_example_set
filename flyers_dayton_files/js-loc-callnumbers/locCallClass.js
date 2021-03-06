//js-loc-callnumbers
//A javascript class to normalize and perform various sorting options on Library of Congress Call Numbers within a library institution.

// constructor function
// Defines :
//	this.stacks_data -- json object of the library stacks
//	this.lc	-- regular expression that defines a Library of Congress Call Number
function locCallClass () {
	//the regular expression that defines the Library of Congress Call number
	this.lc = /^\s*([A-Z]{1,3})\s*(\d+(?:\s*\.\s*\d+)?)?\s*(?:\.?\s*([A-Z]+)\s*(\d+)?)?(?:\.?\s*([A-Z]+)\s*(\d+)?)?\s*(.*?)\s*$/;
}

// class method
// Takes :
//	call_number -- Library of Congress Call Number
// Returns :
//	padded string value of the call number
locCallClass.prototype.returnNormLcCall = function (call_number) {
	var result = this.lc.exec(call_number);
	if (!result) {
		return 0;
	}
	
	var return_string = "";
	
	//work through the results starting at 1 (the 0 value in the array is the original input)
	for(var i=1; i<=(result.length-1); i++) {
		if (i>1) {
			return_string = return_string + "."
		}
		return_string = return_string + this.padZed(result[i]);
	}		
	return return_string;
}

locCallClass.prototype.numStacks = function () {
	return this.stacks_data.length;
}

//class method
//Finds if a value "c" is between values "a" and "b"
locCallClass.prototype.isBetween = function (a, b, c) {
	a_norm = this.returnNormLcCall(a);
	b_norm = this.returnNormLcCall(b);
	c_norm = this.returnNormLcCall(c);
	
	//first make sure that a comes before b ...
	if (a_norm > b_norm) {
		console.log ("a bigger than b");
		return false;
	}
	if ( (a_norm < c_norm) && (c_norm < b_norm) ) {
		return true;
	}
	return false;
}

//class method
//takes a variable list of call numbers (either as multiple arguments, or as a 
//single array of values), and returns a sorted array of call numbers
locCallClass.prototype.sortCallNumbers = function () {
	var values = [];
	
	if ( (typeof arguments[0] === 'object') && (arguments.length == 1) ) {
		//this means that the first item in our arguments
		//debugger;
		for (var i=0; i<arguments[0].length; i++) {
			//debugger;
			values[i]=[];
			values[i][0] = this.returnNormLcCall(arguments[0][i]);
			values[i][1] = arguments[0][i];			
		}
	}
	else {
		for (var i=0; i<arguments.length; i++) {
			values[i]=[];
			values[i][0] = this.returnNormLcCall(arguments[i]);
			values[i][1] = arguments[i];
		}
	}
	
	//sort the 2d array on the [0][] set of values
	values.sort( function (a,b) {
		if (a[0] > b[0]) {
			return 1;
		}
		if (a[0] < b[0]) {
			return -1;
		}
		return 0;
	});
	
	var return_array = [];
	for (var i=0; i<values.length; i++) {
		return_array[i] = values[i][1];
	}
	
	return return_array;
}

// class method
// Takes :
//	value -- part of a call number to be padded with zeros
// Returns :
//	value -- padded part of call number 
// pads a string value with 0s if the string value has a length less than zero
locCallClass.prototype.padZed = function (value) {
	//pad value with zeros - return value will have a length of 9 
	var pad_zeros = "";
	if (value) {
		for (var i=0; i<(9 - value.length); i++) {
			pad_zeros = pad_zeros + "0";
		}
		return pad_zeros + value;
	}
	else
		return "000000000";
}
