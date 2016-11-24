'user strict';

var db = mysqldb.getDb()
, _this = module.exports
, util = require('util')
, func = require('../config/func.js')
, alasql = require('alasql')
, moment = require('moment')
, mailtplmasDB = 't_mailtpl_mas'


module.exports.getMailTemplate = function (req, res) {
	var postData = req.body;
	
	// var query = db.query("SELECT * FROM "+mailtplmasDB, function(err, results) {
	var query = db.query("SELECT * FROM "+mailtplmasDB+" ORDER BY mailtpl_id_pk DESC", function(err, results) {
		if (err) throw err;
		res.json(results);
	});
};

module.exports.getMailtplByKey = function (tplKey, callback) {

	var query = db.query("SELECT * FROM "+mailtplmasDB+" WHERE mailtpl_key = ?",[tplKey], function(err, results) {
		if (err) throw err;
		callback(results[0]);
	});
};

module.exports.addMailTemplate = function (req, res) {
	var postData = req.body;
	var tplData = {
		mailtpl_name : postData.tplname,
		mailtpl_subject : postData.subject,
		mailtpl_content : postData.content,
		mailtpl_key : postData.tkey,
		created_by : 3,
		updated_by : 3,
		created_date : new Date(),
		updated_date : new Date(),
	};
	var query = db.query('INSERT INTO '+mailtplmasDB+' SET ?', tplData, function (err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.updMailTemplate = function (req, res) {
	//mailtpl_id_pk mailtpl_name mailtpl_subject mailtpl_content mailtpl_key 
	var postData = req.body;
	var tplData = {
		mailtpl_name : postData.tplname,
		mailtpl_subject : postData.subject,
		mailtpl_content : postData.content,
		mailtpl_key : postData.tkey,
		updated_by : 3,
		updated_date : new Date()
	};
	var query = db.query("UPDATE "+mailtplmasDB+" SET ? WHERE mailtpl_id_pk = ? ", [tplData,postData.id], function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

module.exports.sendEmail = function (emailKey, postData, callBack) {

	var mailOptions = {
		from: 'mnagas@gmail.com', // sender address 
		to: postData.to, // list of receivers
		cc: 'mnagas@gmail.com',
		bcc: '',
		replyTo: 'mnagas@gmail.com',
		subject: '', // Subject line 
		text: '', // plaintext body 
		html: '' // html body 
	};
	var str_replace = postData.replace;
	_this.getMailtplByKey(emailKey, function (result) {
		//console.log(result);
		var mailSubject = result.mailtpl_subject;
		var mailContent = result.mailtpl_content;
		var re = new RegExp(Object.keys(str_replace).join("|"),"gi");
		mailContent = mailContent.replace(re, function(matched){
		  return str_replace[matched];
		});
		var re = new RegExp(Object.keys(str_replace).join("|"),"gi");
		mailSubject = mailSubject.replace(re, function(matched){
		  return str_replace[matched];
		});
		mailOptions.subject = mailSubject;
		mailOptions.html = mailContent;
		console.log(mailOptions);
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        callBack({status:false, res: error})
		    } else {
		        callBack({status:true, msg:'', mailOptions:mailOptions, res:'Message sent: ' + info.response})
		    }
		});
		//callBack({status:false, res: result});
	});

	/*mailOptions.subject = postData.subject;
	mailOptions.html = postData.content;

	//mailOptions.html = mailOptions.html.replace(new RegExp('%CUSTOMERNAME%', 'g'), result['First Name']+' '+result['Last Name']);
	//mailOptions.html = mailOptions.html.replace(new RegExp('%RMANUMBER%', 'g'), postData.RMA_Number);
	//mailOptions.html = mailOptions.html.replace(new RegExp('%PARTNUMBER%', 'g'), postData.Part_Number);
	//mailOptions.html = mailOptions.html.replace(new RegExp('%SHIPPINGADDRESS%', 'g'), postData['Shipping Address (Line 1)']+'\n'+postData['Shipping Address (Line 2)']+'\n'+postData.City+'\n'+postData.State_Text+'\n'+postData.Country_Text);

	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        callBack({status:false, res: error})
	    } else {
	        callBack({status:true, msg:'', mailOptions:mailOptions, res:'Message sent: ' + info.response})
	    }
	});*/
};