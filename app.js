const express = require('express')
var app = express()
const formidable = require('formidable')
const util = require('util')
const http = require('http')
const fs = require('fs')
const nodemailer = require('nodemailer')
const session = require('express-session')
const socket = require('socket.io')
const server = new http.createServer(app)
var io= socket(server)
io = io.listen(server)


var connect
io.on('connection', (socket) => {
	connect = socket
    socket.on('disconnect', () => {
    	connect = null
    });
});

function getJson(file){
	let text = fs.readFileSync(file);
	return JSON.parse(text);
}

function saveJson(json, file){
	let data = JSON.stringify(json);
	fs.writeFileSync(file, data);
}

app.set('view engine', 'ejs');

app.use(express.static(__dirname));
app.use('/css', express.static('css'));
app.use('/uploads', express.static('uploads'));

app.use(session({
  secret: 'abcdefg',
  resave: true,
  saveUninitialized: false
}));

async function clientSendEmail(name, day, month, hour, email) {
	month++
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		secure: 'false',
		auth: {
			user: 'amy.smith.photography01@gmail.com',
			pass: 'amysmith01'
		},
		tls: {
			rejectUnauthorized: false
		}
	});

	let info = await transporter.sendMail({
		from: '"amy.smith.photography01" <amy.smith.photography01@example.com',
		to: email,
		subject: 'Meeting confirmation',
		text: 'Hello ' + name + ', \nThis is a confirmation for your meeting on ' + day + '/' + month + '/2020, at ' + hour + ':00. Have a nice day!',
		html: '<p>Hello ' + name + ', <br>This is a confirmation for your meeting on ' + day + '/' + month + '/2020, at ' + hour + ':00. Have a nice day!</p>'
	});

	//console.log("Message sent: %s", info.messageId)
}

async function adminSendEmail(name, day, month, hour, email) {
	month++
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		secure: 'false',
		auth: {
			user: 'amy.smith.photography01@gmail.com',
			pass: 'amysmith01'
		},
		tls: {
			rejectUnauthorized: false
		}
	});

	let info = await transporter.sendMail({
		from: '"amy.smith.photography01" <amy.smith.photography01@example.com',
		to: email,
		subject: 'Meeting confirmation',
		text: 'You scheduled a meeting with ' + name + ' on ' + day + '/' + month + '/2020, at ' + hour + ':00.',
		html: '<p>You scheduled a meeting with ' + name + ' on ' + day + '/' + month + '/2020, at ' + hour + ':00.</p>'
	});

	//console.log("Message sent: %s", info.messageId)
}

app.get('/', function(req, res) {
	res.render('html/home')
})

app.get('/about', function(req, res) {
	res.render('html/about')
})

app.get('/blog', function(req, res) {
	let rawdata = fs.readFileSync('posts.json')
	let jsonFile = JSON.parse(rawdata)

	res.render('html/blog', {posts: jsonFile.posts, user: req.session.user})
})

app.get('/projects', function(req, res) {
	res.render('html/projects')
})

app.post('/blog', function(req, res) {
	var form = new formidable.IncomingForm()
	form.parse(req, function(err, fields, files) {
		let admin = getJson('user.json')
		var username = fields.username
		var password = fields.password

		let x = admin.user
		console.log(x)
		let user = (x.username == fields.username && x.password == fields.password)

		if(user) {
			req.session.user = x
		}

		let rawdata = fs.readFileSync('posts.json')
		let jsonFile = JSON.parse(rawdata)
		res.render('html/blog', {user: req.session.user, posts: jsonFile.posts})
	})
})

app.get('/logout', function(req, res) {
    req.session.destroy();
	res.redirect('/blog');
});

app.get('/new_post', function(req, res) {
	res.render('html/new_post', {user: req.session.user})
})

app.post('/new_post', function(req, res) {
	var form = new formidable.IncomingForm()
	form.parse(req, function(err, fields, files) {
		console.log(req.session.user)
		let rawdata = fs.readFileSync('posts.json')
		let jsonFile = JSON.parse(rawdata)
		jsonFile.posts.push({id:jsonFile.lastId, link:fields.link, description:fields.description, text:fields.text, date: new Date()})
		jsonFile.lastId++
		saveJson(jsonFile, 'posts.json')
		res.render('html/new_post', {user: req.session.user, rsstatus:"ok"})
	})
})

app.get('/post', function(req, res) {
	jsonFile = getJson('posts.json')
	res.render('html/post', {user: req.session.user, posts: jsonFile.posts, id: req.query.index})
})

app.get('/contact', function(req, res) {
	let jsonFile = getJson('calendar.json')
	let schedule_ = getJson('schedule.json')
	req.session.date = new Date()
	let date_ = req.session.date

	if(schedule_.lastMonth == 0) {
		for(let i = 0; i < 12; i++) {
			schedule_.months.push({"daysNumber":0, "days":[]})
			schedule_.months[i].daysNumber = jsonFile.months[i].length
			for(let j = 0; j < schedule_.months[i].daysNumber; j++) {
				schedule_.months[i].days.push({"id":j, "meetings":[{"busy":false, "hour":12}, {"busy":false, "hour":14}, {"busy":false, "hour":16}, {"busy":false, "hour":18}]})
			}
			schedule_.lastMonth++
		}
	}

	saveJson(schedule_, 'schedule.json')
	req.session.schedule = schedule_
	req.session.calendar = jsonFile.months
	res.render('html/contact', 
		{user: req.session.user, 
		schedule: req.session.schedule, 
		calendar: req.session.calendar, 
		date: req.session.date,
		month_: req.query.month})
})

app.post('/contact', function(req, res) {
	var form = new formidable.IncomingForm()
	form.parse(req, function(err, fields, files) {
		let name = fields.name
		let email = fields.email
		let phone = fields.phone
		let day = fields.day
		let hour = fields.hour
		let month = fields.month
		hour = (hour == "12")?0:((hour == "14")?1:((hour == "16")?2:3))

		let jsonFile = getJson('schedule.json')
		let calendar_ = getJson('calendar.json')
		let status = "busy"

		if(jsonFile.months[month].days[day - 1].meetings[hour].busy == false) {
			jsonFile.months[month].days[day - 1].meetings[hour].busy = true
			jsonFile.months[month].days[day - 1].meetings[hour].client = {"name":name, "email":email, "phone":phone}
			status = "available"
			clientSendEmail(fields.name, fields.day, fields.month, fields.hour, fields.email).catch((err) => {console.log(err)})
			adminSendEmail(fields.name, fields.day, fields.month, fields.hour, 'amy.smith.photography01@gmail.com').catch((err) => {console.log(err)})
		}

		saveJson(jsonFile, 'schedule.json')
		res.render('html/contact', 
			{user: req.session.user, 
			schedule: req.session.schedule, 
			calendar: req.session.calendar, 
			date: req.session.date, 
			rsstatus: status})
	})
})

server.listen(3000)
console.log('Serverul a pornit pe portul 3000');