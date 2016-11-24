exports.settings = function() {
    
    var settings = new Object;
    
    // Server Details
    settings.server = new Object;
    settings.server.ip = "127.0.0.1";
    settings.server.port = 9124;
    
    //DB Details
    settings.db = new Object;
    settings.db.host = "10.40.2.81";
    settings.db.user = "isteam";
    settings.db.password = "Ictl0g!23";
    settings.db.database = "srportal";
    
       
	//Mail Details
	settings.mail = new Object;
	settings.mail.host = "mail.bluelotusservices.com";
	settings.mail.user = "admin@bluelotusservices.com";
	settings.mail.pwd = "sHefl1e0LtRl";
	settings.mail.port = 25;
	settings.mail.sender = "Admin <admin@bluelotusservices.com>";
	settings.mail.receiver1 = "Arun Kumar <arunkumar.v@bluelotusservices.com>";
	//settings.mail.receiver2 = "BLSS <blsspvtltd@gmail.com>";
    return settings;
    
};