
apps.controller('manhoursCtrl', function ($cookies,$rootScope, $scope, $http, $filter, NgTableParams, $routeParams, $location, AjaxMethod, $q) {	 
    AjaxMethod.getPageLevelACl();
    $rootScope.selProjectID = ($cookies.get('selectedProjectID') === undefined) ? $rootScope.selProjectID : $cookies.get('selectedProjectID');
    $scope.data = {};
    $scope.frmData = {}; 
    $scope.headList = {}; 
    var data = []; 

    $scope.Datainit = function (page,type) { 
      AjaxMethod.postMethod('manhours/'+page, {prjId:$rootScope.selProjectID}).then(function(response){
          var data = response; 
          var uniqueList = [];
          var headList = [];
          for(i = 0; i< data.length; i++){    
              if(uniqueList.indexOf(data[i].man_hours_calc_id_pk) === -1){
                  uniqueList.push(data[i].man_hours_calc_id_pk);  
                  headList.push(data[i]);  
              }        
          }

          var totcomMat = [];
          if(headList.length > 0) {
              angular.forEach(headList, function (value, key) {
                  var subDat = {};
                  subDat['man_hours_calc_id_pk'] = value.man_hours_calc_id_pk;
                  subDat['project_id_fk'] = value.project_id_fk;
                  subDat['cost_per_hour_effort'] = value.cost_per_hour_effort;
                  subDat['tot_man_hour'] = value.tot_man_hour;
                  subDat['overall_effort'] = value.overall_effort;
                  $scope.sublist = alasql('SELECT * FROM ? WHERE man_hours_calc_id_fk = ?', [response,value.man_hours_calc_id_pk]);
                  subDat['subList'] = $scope.sublist;
                  totcomMat.push(subDat);
              });
          }
          $scope.headList = totcomMat[0];
          $scope.calOverallTot();
          $scope.costperhour = $scope.headList.cost_per_hour_effort;
          // $scope.addRowList($scope.headList.comm_matrix_id_pk);
          
      });
  };

  $scope.setval = function(val) {
    console.log($scope.costperhour+' = '+val);
    if(!val || val === '') {
      $scope.costperhour = $scope.headList.cost_per_hour_effort;
    }
  };

  $scope.checkValid = function(data, field) {
    if(data === "" || !data) {
      return "required";
    }
  };

  $scope.calOverallTot = function() {
    $scope.mhOverall = alasql('SELECT SUM(manhours) as mhours, SUM(effort_cost) as tcost FROM ? GROUP BY man_hours_calc_id_fk', [$scope.headList.subList])[0];
  };

  $scope.calculateData = function(type,data) {
    var res = 0;
    if(type === 'tmin') {
      res = (parseInt(data.recurrence, 10) * parseInt(data.minutes, 10));
    } else if(type === 'mhour') {
      res = ((parseInt(data.recurrence, 10) * parseInt(data.minutes, 10)) / 60);
    } else if(type === 'tcost') {
      res = ((parseInt(data.recurrence, 10) * parseInt(data.minutes, 10)) / 60) * parseInt($scope.costperhour, 10);
    }
    return (isNaN(res)) ? 0 : res.toFixed(2);
  };

  $scope.saveManHours = function(data, pid, id, ind) {
    //$scope.user not updated yet
    data['man_hours_calc_id_fk'] = pid;
    data['costperhour'] = $scope.costperhour;
    data['project_id_fk'] = $rootScope.selProjectID;
    angular.extend(data, {id: id});
    AjaxMethod.postMethod('manhours/saveManHours', data).then(function(response){
      if(ind >= 0) {
          var firstChar  = data.id[0];
          if(firstChar === 'n') {
            $scope.headList.subList[ind].man_hours_calc_trans_id_pk = response.insertId;
          } else {
            $scope.headList.subList[ind].man_hours_calc_trans_id_pk = data.id;
          }
          $scope.headList.subList[ind].man_hours_calc_id_fk = data.man_hours_calc_id_fk;
          $scope.headList.subList[ind].name = data.name;
          $scope.headList.subList[ind].recurrence = parseInt(data.recurrence, 10);
          $scope.headList.subList[ind].minutes = parseInt(data.minutes, 10);
          $scope.headList.subList[ind].overall_minutes = parseFloat($scope.calculateData('tmin',data), 10);
          $scope.headList.subList[ind].manhours = parseFloat($scope.calculateData('mhour',data), 10);
          $scope.headList.subList[ind].effort_cost = parseFloat($scope.calculateData('tcost',data), 10);
          console.log($scope.headList.subList[ind]);
          $scope.calOverallTot();
      }
    });
  };


    $scope.cancelNewRow = function(id,index){
        if(id[0] === 'n') {
            $scope.headList.subList.splice(index, 1);
        } 
    };
  // remove user
  $scope.removeUser = function(index) {
    $scope.users.splice(index, 1);
  };

  // add user
  $scope.addRowList = function(id) {
    var milliseconds = new Date().getTime();
    $scope.inserted = {
        man_hours_calc_trans_id_pk: 'n'+milliseconds,
        man_hours_calc_id_fk: id,
        name: '',
        recurrence: 0,
        minutes: 0,
        overall_minutes: 0,
        manhours: 0,
        effort_cost: 0
    };
    $scope.headList.subList.push($scope.inserted);
  };  

  //man_hours_calc_trans_id_pk man_hours_calc_id_fk name recurrence minutes overall_minutes manhours effort_cost

});

$(document).ready(function() {
//alert('test');
});