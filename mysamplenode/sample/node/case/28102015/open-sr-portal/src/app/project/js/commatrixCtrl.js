
apps.controller('commatrixCtrl', function ($cookies,$rootScope, $scope, $http, $filter, NgTableParams, $routeParams, $location, AjaxMethod, $q) {	 
    AjaxMethod.getPageLevelACl();
    $rootScope.selProjectID = ($cookies.get('selectedProjectID') === undefined) ? $rootScope.selProjectID : $cookies.get('selectedProjectID');
    $rootScope.selProjectName = ($cookies.get('selectedProjectName') === undefined) ? $rootScope.selProjectName : $cookies.get('selectedProjectName');
    $scope.data = {};
    $scope.frmData = {}; 
    $scope.headList = {}; 
    var data = []; 

    AjaxMethod.postMethod('commatrix/getUser', {}).then(function(response){
        $scope.userData = response; 
        //console.log($scope.userData);
    });

    AjaxMethod.postMethod('commatrix/getTimezone', {}).then(function(response){
        $scope.tzoneData = response; 
        //console.log(response);
    });

    $scope.Datainit = function (page,type) { 
        AjaxMethod.postMethod('commatrix/'+page, {prjId:$rootScope.selProjectID}).then(function(response){
            var data = response; 
            $scope.fulldata = response; 
            var uniqueList = [];
            var headList = [];
            console.log(response);
            for(i = 0; i< data.length; i++){    
                if(uniqueList.indexOf(data[i].comm_matrix_id_pk) === -1){
                    uniqueList.push(data[i].comm_matrix_id_pk);  
                    headList.push(data[i]);  
                }        
            }

            var totcomMat = [];
            if(headList.length > 0) {
                angular.forEach(headList, function (value, key) {
                    var subDat = {};
                    subDat['comm_matrix_id_pk'] = value.comm_matrix_id_pk;
                    subDat['comm_matrix_title'] = value.comm_matrix_title;
                    subDat['project_id_fk'] = value.project_id_fk;
                    subDat['client_emailid'] = value.client_emailid;
                    subDat['email_status'] = value.email_status;
                    subDat['internal'] = value.internal;
                    $scope.sublist = alasql('SELECT * FROM ? WHERE comm_matrix_id_fk = ?', [response,value.comm_matrix_id_pk]);
                    subDat['subList'] = $scope.sublist;
                    totcomMat.push(subDat);
                });
            }
            $scope.headList = totcomMat;
        });
    };

    $scope.checkValid = function(data, field) {
        if(data === "" || !data) {
            return "required";
        }
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
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

    $scope.exportData = function () {
        var cols = "*";
        cols = "'"+$rootScope.selProjectName+"'[Project], t1.comm_matrix_title[Section], t1.comm_matrix_stkname[StakeholderName], t1.comm_matrix_role[Role], t1.comm_matrix_email[Official Mail], t1.comm_matrix_telephone[Office Telephone], t1.comm_matrix_mobile[Mobile], t1.comm_matrix_subcomm[SubComm], t3.timezone_name[TimeZone]";

        // comm_matrix_trans_id_pk: 'n'+milliseconds,
        // comm_matrix_id_fk: id,
        // comm_matrix_stkname: '',
        // comm_matrix_role: '',
        // comm_matrix_email: '',
        // comm_matrix_telephone: '',
        // comm_matrix_mobile: '',
        // comm_matrix_subcomm: '',
        // timezone_id_fk: ''

        // Project StakeholderName Role    Official Mail   Office Telephone    Mobile  SubComm TimeZone
        var obj = $scope.fulldata;

        /*alasql('SELECT '+cols+' INTO XLSX("comMatrix.xlsx",{headers:true}) FROM ? t1 INNER JOIN ? t2 ON t2.user_id_pk = t1.user_id_fk INNER JOIN ? t3 ON t3.timezone_id_pk = t1.timezone_id_fk',[obj,$scope.userData,$scope.tzoneData]);*/
        alasql('SELECT '+cols+' INTO XLSX("comMatrix.xlsx",{headers:true}) FROM ? t1 INNER JOIN ? t3 ON t3.timezone_id_pk = t1.timezone_id_fk',[obj,$scope.tzoneData]);
    };

    $scope.showSelVal = function(type, val) {
        var sArr = [];
        var selected = [];
        $scope.sArr = [];
        var cond = {};
        var dfield = '';
        if(type === 'user') {
            $scope.sArr = $scope.userData;
            cond = {user_id_pk: val};
            dfield = "first_name";
        } else if(type === 'tzone') {
            $scope.sArr = $scope.tzoneData;
            cond = {timezone_id_pk: val};
            dfield = "timezone_name";
        }
        if($scope.sArr.length) {
            selected = $filter('filter')($scope.sArr, cond);
        } 
        return selected.length ? selected[0][dfield] : '';
    };

    $scope.updateTitle = function(data) {
        return $http.post('/updateUser', {id: $scope.user.id, name: data});
    };

    $scope.comMatrixSendMail = function(index,id) {
        var fdata = {};
        console.log(index+' = '+id);
        $scope.frmData.prjName = $rootScope.selProjectName; 
        $scope.frmData.comName = $scope.headList[index].comm_matrix_title; 
        $scope.frmData.sEmail = $scope.frmData.cEmail[index]; 
        console.log($scope.frmData);

        AjaxMethod.postMethod('commatrix/sendMailCommTrans', $scope.frmData).then(function(response){
            console.log(response);
            if(response.status === true) {
                $scope.frmData = {};
                successMsg('Send Mail', 'Mail sent successfully'); 
            } else {
                $scope.frmData = {};
                successMsg('Send Mail', 'Mail not sent please try again later'); 
            }
        });
    };

    $scope.checkName = function(data,id) {
        var fdata = {};
        console.log(data);
        fdata['comm_matrix_id_pk'] = id;
        if(data === '') { 
            return false;
        } 
        fdata['comm_matrix_title'] = data;
        console.log(data);
        AjaxMethod.postMethod('commatrix/updateCommTrans', fdata).then(function(response){
            console.log(response);
        });
        
    };
  $scope.getName = function(val) {
    var selected = [];

    if($scope.userData.length) {
      selected = $filter('filter')($scope.userData, {user_id_pk: val});
    } 
    return selected.length ? selected[0].first_name : val;
  };

    $scope.saveComMatrix = function(data, pid, id, index, pindex) {
        data['prjId'] = $rootScope.selProjectID;
        data['prjName'] = $rootScope.selProjectName; 
        data['comm_matrix_id_fk'] = pid;
        data['section_name'] = alasql('SELECT comm_matrix_title FROM ? WHERE comm_matrix_id_pk = ?', [$scope.headList,pid])[0];
        data['timezone_name'] = $scope.showSelVal('tzone',data.timezone_id_fk);
        //data['comm_matrix_stkname'] = $scope.getName(data.user_id_fk);
        angular.extend(data, {id: id});
        AjaxMethod.postMethod('commatrix/saveCommTrans', data).then(function(response){
            var firstChar  = data.id[0];
            if(id[0] === 'n') {
                $scope.headList[pindex].subList[index].comm_matrix_trans_id_pk = response.insertId;
            } 
        });
    //return $http.post('/saveUser', data);
    };

    $scope.cancelNewRow = function(id, key,index){
        if(id[0] === 'n') {
            $scope.headList[key].subList.splice(index, 1);
        } 
    };
  // remove user
  $scope.removeUser = function(index) {
    $scope.users.splice(index, 1);
  };

  // add user
  $scope.addComMatrix = function(key,id) {
    var milliseconds = new Date().getTime();
    $scope.inserted = {
        comm_matrix_trans_id_pk: 'n'+milliseconds,
        comm_matrix_id_fk: id,
        comm_matrix_stkname: '',
        comm_matrix_role: '',
        comm_matrix_email: '',
        comm_matrix_telephone: '',
        comm_matrix_mobile: '',
        comm_matrix_subcomm: '',
        timezone_id_fk: ''
    };
    $scope.headList[key].subList.push($scope.inserted);
  };  

  //comm_matrix_trans_id_pk comm_matrix_id_fk user_id_fk comm_matrix_stkname comm_matrix_role comm_matrix_email   comm_matrix_telephone comm_matrix_mobile comm_matrix_subcomm timezone_id_fk

});
