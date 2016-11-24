'user strict';

var _this = module.exports
, mailtplmasDB = 't_mailtpl_mas'


module.exports.getMailtplByKey = function (tplKey, callback) {	
	GLOBAL.connection.query("SELECT * FROM "+mailtplmasDB+" WHERE mailtpl_key = ?",[tplKey], function(err, results) {
		if (err) throw err;
		callback(results[0]);
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