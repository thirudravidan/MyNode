'use strict';

function successMsg(title,msg) {
	BootstrapDialog.show({
	    type: BootstrapDialog.TYPE_SUCCESS,
	    title: title,
	    message: msg,
	    buttons: [{
	        label: 'Close',
	        action: function(dialogItself){
	            dialogItself.close();
	        }
	    }]
	});  
}