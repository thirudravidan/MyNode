
function ajaxServiceCall(MethodName, ServiceType, Parameter) {  
    var response = [];
    try {
        Parameter = (Parameter === undefined) ? "" : Parameter;
        $.support.cors = true;
        $.ajax({
            type: ServiceType,
            async: false,
            processdata: false,
            url: MethodName,
            data: Parameter,
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                response = res;
            },
            error: function (err) {
            }
        });
    }
    catch (e) {

        errorHandler("common.js ->> ", "ajaxJSONCall ->> ", e);
    }
    return response;
}

/* AJAX Call JSON for Project Service*/
function ajaxJSONCall(MethodName, ServiceType, Parameter) {   
    var response = [];
    try {        
        Parameter = (Parameter === undefined) ? "" : Parameter;
        $.support.cors = true;
        $.ajax({
            type: ServiceType,
            async: false,
            processdata: false,
            url: MethodName,
            data: Parameter,
            contentType: "application/json",
            dataType: "json",
            success: function (res) {           
                response = res;
            },
            error: function (err) {              
            }
        });
    }
    catch (e) {

        errorHandler("common.js ->> ", "ajaxJSONCall ->> ", e);
    }
    return response;
}