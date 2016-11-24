
apps.controller('rptassessmentCtrl', function ($rootScope, $scope, $http, $filter, NgTableParams, $routeParams, $location, AjaxMethod, $q, Upload, $timeout) {	 
    
    $scope.data = {};
    $scope.frmData = {}; 
    $scope.dateRange = []; 
    var data = []; 
    $scope.srchData = {};

    $scope.months = {
      "1": "01 - Jan",
      "2": "02 - Feb",
      "3": "03 - Mar",
      "4": "04 - Apr",
      "5": "05 - May",
      "6": "06 - Jun",
      "7": "07 - Jul",
      "8": "08 - Aug",
      "9": "09 - Sep",
      "10": "10 - Oct",
      "11": "11 - Nov",
      "12": "12 - Dec"
    };

    $scope.srchData.month = (moment().month()+1).toString();
    $scope.srchData.year = moment().year();

    $scope.dRange = function () {
        $scope.dateRange = []; 
        var selDate = $scope.srchData.month+'/01/'+$scope.srchData.year;
        var dt = new Date(selDate);

        // GET THE MONTH AND YEAR OF THE SELECTED DATE.
        var month = dt.getMonth(),
            year = dt.getFullYear(),
            day = dt.getDay();

        var FirstDay = new Date(year, month, 1);
        var LastDay = new Date(year, month + 1, 0);
        var ndate = moment(FirstDay).day(i);
        for(var i=1; i<=moment(LastDay).date(); i++) {
            $scope.dateRange.push({'day':i,'date':moment(FirstDay).day(i).format("YYYY-MM-DD"),'wday':moment(FirstDay).day(i).format("e")});
        }

    };
    
    $scope.Datainit = function (page) {
        AjaxMethod.postMethod('report/'+page).then(function(response){
            $scope.colHeader = response.catData;
            $scope.data = response.scoreSet;
            $scope.subCat = [];
            angular.forEach($scope.colHeader, function (value, key) {
                angular.forEach(value.sub, function (value, key) {
                    $scope.subCat.push(value);
                });
            });
            $scope.tableParams.reload();
        });
    };

    $scope.dataAttandance = function (page) {
        $scope.dRange();
        $scope.subCat = [];
        AjaxMethod.postMethod('report/'+page,$scope.srchData).then(function(response){
            $scope.data = response;
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

    $scope.getDateMark = function(date, data) {
        var temp = '';
        return angular.forEach(data, function (value, key) {
            if(moment(value.date).date() === date) {
                console.log(moment(value.date).date()+'==='+date);
                console.log('ok');
                return '1';
            } else {
                return '2';
            }
        });
        // return (temp === 1)?'1':'2';
    };
    
});

apps.filter('markattendance', function() {

    return function(input, data) {
        var out = 2;
        angular.forEach(data, function (value, key) {
            if(moment(value.date).date() === input) {
                out = 1;
            }
        });
        return out;
    };
});
