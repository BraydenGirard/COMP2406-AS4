var loggedInUsers = {};
var LoggedIn = 'TheUserIsLoggedIn';

//Store list of users
var userDB = {};
userDB['student1'] = 'student1pass';
userDB['student2'] = 'student2pass';
userDB['chris'] = 'chrispass';
userDB['lucas'] = 'lucaspass';
userDB['muhammad'] = 'muhammadpass';
userDB['lee'] = 'leepass';
userDB['louis'] = 'louispass';

//Store user permissions
var userPerm = {};
userPerm['student1'] = 3;
userPerm['student2'] = 3;
userPerm['chris'] = 2;
userPerm['lucas'] = 2;
userPerm['muhammad'] = 2;
userPerm['lee'] = 2;
userPerm['louis'] = 1;

//Deadlines initalized to by empty
var deadline = {};
deadline['as1'] = '';
deadline['as2'] = '';
deadline['as3'] = '';
deadline['as4'] = '';

//Start date initalized to by empty
var start = {};
start['as1'] = '';
start['as2'] = '';
start['as3'] = '';
start['as4'] = '';

//TA submission status initalized to by empty
var currStatus = {};
currStatus['as1chris'] = '';
currStatus['as2chris'] = '';
currStatus['as3chris'] = '';
currStatus['as4chris'] = '';
currStatus['as1lucas'] = '';
currStatus['as2lucas'] = '';
currStatus['as3lucas'] = '';
currStatus['as4lucas'] = '';
currStatus['as1muhammad'] = '';
currStatus['as2muhammad'] = '';
currStatus['as3muhammad'] = '';
currStatus['as4muhammad'] = '';
currStatus['as1lee'] = '';
currStatus['as2lee'] = '';
currStatus['as3lee'] = '';
currStatus['as4lee'] = '';

//TA submission date initalized to by empty
var completion = {};
completion['as1chris'] = '';
completion['as2chris'] = '';
completion['as3chris'] = '';
completion['as4chris'] = '';
completion['as1lucas'] = '';
completion['as2lucas'] = '';
completion['as3lucas'] = '';
completion['as4lucas'] = '';
completion['as1muhammad'] = '';
completion['as2muhammad'] = '';
completion['as3muhammad'] = '';
completion['as4muhammad'] = '';
completion['as1lee'] = '';
completion['as2lee'] = '';
completion['as3lee'] = '';
completion['as4lee'] = '';

//Colour of submission
var colour = {};
colour['as1chris'] = 'black';
colour['as2chris'] = 'black';
colour['as3chris'] = 'black';
colour['as4chris'] = 'black';
colour['as1lucas'] = 'black';
colour['as2lucas'] = 'black';
colour['as3lucas'] = 'black';
colour['as4lucas'] = 'black';
colour['as1muhammad'] = 'black';
colour['as2muhammad'] = 'black';
colour['as3muhammad'] = 'black';
colour['as4muhammad'] = 'black';
colour['as1lee'] = 'black';
colour['as2lee'] = 'black';
colour['as3lee'] = 'black';
colour['as4lee'] = 'black';

//Redirects to appropriate page if logged in and have permissions
function index(req, res) {
    if (req.session.username && req.session.permission === 1) {
        res.redirect('/prof');
    } else if(req.session.username && req.session.permission === 2) {
    	res.redirect('/ta');
    } else if(req.session.username && req.session.permission === 3) {
		res.redirect('/student');
	} else {
	res.render('index', { title: 'COMP 2406 Assignment Grading', 
			      error: req.query.error });
    }
}

//Checks if you are logged in and have permissions then displays student page
function student(req, res) {
    if (req.session.username) {
		if(userPerm[req.session.username] === 3) {
			res.render('student.jade', buildReturnObject(req.session.username, 'Account', loggedInUsers, req.query.error));
		} else {
			res.redirect('/');
		}
    } else {
	res.redirect('/?error=Not Logged In');
    }
}

//Checks if you are logged in and have permissions then displays ta page
function ta(req, res) {
    if (req.session.username) {
		if(userPerm[req.session.username] === 2) {
			res.render('ta.jade', buildReturnObject(req.session.username, 'Account', loggedInUsers, req.query.error));
		} else {
			res.redirect('/');
		}
    } else {
	res.redirect('/?error=Not Logged In');
    }
}

//Checks if you are logged in and have permissions then displays prof page
function prof(req, res) {
    if (req.session.username) {
		if(userPerm[req.session.username] === 1) {
			res.render('prof.jade', buildReturnObject(req.session.username, 'Account', loggedInUsers, req.query.error));
		} else {
			res.redirect('/');
		}
    } else {
	res.redirect('/?error=Not Logged In');
    }
}

//Checks if login credentials are valid
function login(req, res) {
    var username = req.body.username;
	var password = req.body.password;

	if(userDB[username] && userDB[username] === password) {
	    req.session.username = username;
		req.session.permission = userPerm[username];
	    loggedInUsers[username] = LoggedIn;
		if(userPerm[username] === 3) {
	    	res.redirect('/student');
		} else if(userPerm[username] === 2) {
			res.redirect('/ta');
		} else if(userPerm[username] === 1) {
			res.redirect('/prof');
		}
	} else {
		res.redirect('/?error=Incorrect login');
	}
}

//Allows users to logout
function logout(req, res) {
    delete loggedInUsers[req.session.username];
    req.session.destroy(function(err){
        if(err){
            console.log('Error: %s', err);
        }
    });
    res.redirect('/');
}

//Adds a TA submission date if assignment exists
function taupdate(req, res) {
	var as = req.body.as;
	var username = req.session.username;
	var date = new Date(req.body.date);
	
	if(deadline[as] === '') {
		res.redirect('/ta/?error=Assignment does not exist');
	} else if(deadline[as] >= date) {
		//Assignemnt on time
		currStatus[as + username] = 'ON TIME';
		colour[as + username] = 'green';
		completion[as + username] = date;
		res.redirect('/ta');
	} else {
		//Not on time
		currStatus[as + username] = 'LATE';
		colour[as + username] = 'red';
		completion[as + username] = date;
		res.redirect('/ta');
	}
}

//Allows prof to post assignmnet start and deadline dates
function profupdate(req, res) {
	var as = req.body.as;
	var username = req.session.username;
	var dateStart = new Date(req.body.dateStart);
	var dateEnd = new Date(req.body.dateEnd);
	
	start[as] = dateStart;
	deadline[as] = dateEnd;
	
	//Loop through all users
	for (var user in userDB) {
		if(userPerm[user] === 2) {
			//If they are a TA update status 
			currStatus[as + user] = 'in progress';
		}
	}
	res.redirect('/prof');
}

//Function that builds page based on current data (normally would check with db)
function buildReturnObject(user, title, loggedInUsers, error) {
	var value = {username: user, title: title, loggedInUsers: loggedInUsers, as1chrisstatus: currStatus['as1chris'], 
	as2chrisstatus: currStatus['as2chris'], as3chrisstatus: currStatus['as3chris'], as4chrisstatus: currStatus['as4chris'], 
	as1lucasstatus: currStatus['as1lucas'], as2lucasstatus: currStatus['as2lucas'], as3lucasstatus: currStatus['as3lucas'], 
	as4lucasstatus: currStatus['as4lucas'], as1muhammadstatus: currStatus['as1muhammad'], as2muhammadstatus: currStatus['as2muhammad'], 
	as3muhammadstatus: currStatus['as3muhammad'], as4muhammadstatus: currStatus['as4muhammad'], as1leestatus: currStatus['as1lee'], 
	as2leestatus: currStatus['as2lee'], as3leestatus: currStatus['as3lee'], as4leestatus: currStatus['as4lee'], as1start: start['as1'], 
	as2start: start['as2'], as3start: start['as3'], as4start: start['as4'], as1dead: deadline['as1'], 
	as2dead: deadline['as2'], as3dead: deadline['as3'], as4dead: deadline['as4'], as1chrisstyle: colour['as1chris'], 
	as2chrisstyle: colour['as2chris'], as3chrisstyle: colour['as3chris'], as4chrisstyle: colour['as4chris'], 
	as1lucasstyle: colour['as1lucas'], as2lucasstyle: colour['as2lucas'], as3lucasstyle: colour['as3lucas'], 
	as4lucasstyle: colour['as4lucas'], as1muhammadstyle: colour['as1muhammad'], as2muhammadstyle: colour['as2muhammad'], 
	as3muhammadstyle: colour['as3muhammad'], as4muhammadstyle: colour['as4muhammad'], as1leestyle: colour['as1lee'], 
	as2leestyle: colour['as2lee'], as3leestyle: colour['as3lee'], as4leestyle: colour['as4lee'], as1chris: completion['as1chris'], 
	as2chris: completion['as2chris'], as3chris: completion['as3chris'], as4chris: completion['as4chris'], 
	as1lucas: completion['as1lucas'], as2lucas: completion['as2lucas'], as3lucas: completion['as3lucas'], 
	as4lucas: completion['as4lucas'], as1muhammad: completion['as1muhammad'], as2muhammad: completion['as2muhammad'], 
	as3muhammad: completion['as3muhammad'], as4muhammad: completion['as4muhammad'], as1lee: completion['as1lee'], 
	as2lee: completion['as2lee'], as3lee: completion['as3lee'], as4lee: completion['as4lee'], error: error};
	return value;
}

exports.index = index;
exports.student = student;
exports.ta = ta;
exports.prof = prof;
exports.login = login;
exports.logout = logout;
exports.taupdate = taupdate;
exports.profupdate = profupdate;