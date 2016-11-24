
apps.controller('mailtemplateCtrl', function ($rootScope, $scope, $http, $filter, NgTableParams, $routeParams, $location, AjaxMethod, $q) {    
    AjaxMethod.getPageLevelACl();
    $scope.data = {};
    $scope.frmData = {}; 
    var data = []; 
    $scope.menuTree = [];
    $scope.rolePer = false;
    $scope.datas = {};
    $scope.isTemplateKeyDis =false;

    $scope.editorOptions = {
        language: 'en',
        uiColor: '#ffffff'
    };

    $scope.saveMailtemplate = function(frmData) { 
        var insPath = 'addMailTemplate';
        if($scope.frmData.id) { insPath = 'updMailTemplate'; }
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmmailtpl.$valid) {
            AjaxMethod.postMethod('mailtemplate/'+insPath,$scope.frmData).then( function (response){
                if (data.errorMessage === null) 
                {  
                    $scope.frmData = {};
                } else { 
                    if($scope.frmData.id) {
                        successMsg('Mail Template', 'Mail Template Updated successfully');
                        $scope.clearfrm();
                    } else {
                        $scope.clearfrm();
                        successMsg('Mail Template', 'Mail Template Created successfully'); 
                    }
                }
                AjaxMethod.collapseToggle('collapse');
                $scope.Datainit('getMailTemplate','i');
            });
        }
    };

    $scope.reset = function() {
        $scope.$broadcast('show-errors-reset');
    };

    $scope.clearfrm = function() {
        $scope.reset();
         $scope.isTemplateKeyDis =false;
        $scope.frmData = {};
    };

    $scope.Datainit = function (page,type) { 
        AjaxMethod.postMethod('mailtemplate/'+page, {}).then(function(response){
            var data = response; 
            $scope.data = data; 
            $scope.tableParams.reload();
        });
    };
    
    $scope.tableParams = new NgTableParams({
        page: 1, // show first page
        count: 10, // count per page
        filter: $scope.searchtxt // Filter Text
    }, {
        counts: [],
        total: $scope.data.length, // length of data
        getData: function ($defer, params) {
            var filteredData = $scope.searchtxt ?
                    $filter('filter')($scope.data, $scope.searchtxt) :
                    $scope.data;
            var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.data; 
            if(orderedData.length === 0) {
                $('#norecords').hide();    
            }           
            params.total(orderedData.length); // set total for recalc pagination
            $scope.fdata = orderedData;
            if(orderedData.length > 0) {
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        }
    });

    $scope.editMailtpl = function (tplDet) {
        $scope.clearfrm();
        $scope.isTemplateKeyDis =true;
        $scope.frmData.id = tplDet.mailtpl_id_pk;
        $scope.frmData.tplname = tplDet.mailtpl_name;
        $scope.frmData.subject = tplDet.mailtpl_subject;
        $scope.frmData.content = tplDet. mailtpl_content;
        $scope.frmData.tkey = tplDet.mailtpl_key;
    };
    
    $scope.AVSelected = function (aVars) {
        //$scope.stateInfo = state.aTitle + ' (' + state.aKey + ')';
        //alert($scope.insOpt);
        if($scope.insOpt === 'message') {
            var ck = CKEDITOR.instances.eMessage;
            ck.insertText(aVars.aKey);
        } else {
            var caretPos = document.getElementById('eSubject').selectionStart;
            var textAreaTxt = jQuery('#eSubject').val();
            var txtToAdd = aVars.aKey;
            jQuery('#eSubject').val(textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos) );
        }
        
    };

});