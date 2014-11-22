var PATH;
var start;
var end;
var date;

function validateForm() {
	var result = false;
	if(PATH.indexOf("prof") > -1) {
		result = checkValidProfForm();
	} else if(PATH.indexOf("ta") > -1) {
		result = checkValidTaForm();
	}
	
	if(result == false) 
		alert("Invalid date! Must be format yyyy-mm-dd");
		
	return result;
}

function checkValidProfForm() {
	console.log(start.val());
	if(start.val() != undefined && start.val() != null && end.val() != undefined && end.val() != null) {
		var date1 = new Date(start.val());
		var date2 = new Date(end.val());
		return (isValidDate(date1) && isValidDate(date2));
	} 
	return false;
}

function checkValidTaForm() {
	if(date.val() != undefined && date.val() != null) {
		var date1 = new Date(date.val());
		return isValidDate(date1);
	} 
	return false;
}


function isValidDate(d) {
  if ( Object.prototype.toString.call(d) !== "[object Date]" )
    return false;
  return !isNaN(d.getTime());
}

$(document).ready(function () {
	
	PATH = window.location.pathname;
	start = $('input[name=dateStart]');
	end = $('input[name=dateEnd]');
	date = $('input[name=date]');
	
});