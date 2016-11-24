apps.controller('dashboardCtrl', function ($cookies, $rootScope, $scope, $http, $filter, NgTableParams, $routeParams, $location, AjaxMethod, $q, $route) {   
  $rootScope.selProjectID = ($cookies.get('selectedProjectID') === undefined) ? $rootScope.selProjectID : $cookies.get('selectedProjectID');
  $rootScope.selProjectName = ($cookies.get('selectedProjectName') === undefined) ? $rootScope.selProjectName : $cookies.get('selectedProjectName');
  $scope.labels = [];
  $scope.colors = [];
  $scope.cdata = [];
  $scope.data = [];
  $scope.isBackShow=false;
  $scope.areaStatus = false;
  if($rootScope.sbarHeight === undefined) { $rootScope.sbarHeight = 270; }
  if($rootScope.barHeight === undefined) { $rootScope.barHeight = 260; }
  $scope.statuses = {'Open':'STATUS_UNDEFINED','Pending':'STATUS_SUSPENDED','Inprogress':'STATUS_ACTIVE','Closed':'STATUS_DONE','OverDue':'STATUS_FAILED'};
  $scope.chartData = {
    'STATUS_UNDEFINED':{'status':'Open','color':'#dd4b39','value':0},
    'STATUS_SUSPENDED':{'status':'Pending','color':'#00a65a','value':0},
    'STATUS_ACTIVE':{'status':'Inprogress','color':'#f39c12','value':0},
    'STATUS_DONE':{'status':'Closed','color':'#00c0ef','value':0},
    'STATUS_FAILED':{'status':'OverDue','color':'#3c8dbc','value':0}
  };

  $scope.pieOptions = {
    chart: {
      type: 'pieChart',
      height: 280,
      donut: true,
      x: function(d){return d.key;},
      y: function(d){return d.y;},
      showLabels: true,
      duration: 500,
      legend: {
        margin: {
          top: 5,
          right: 70,
          bottom: -20,
          left: 0
        }
      },
      pie: {
        dispatch: {
          elementClick: function(e) { $scope.onClickShow(e);}        
        }
      }
    }
  };  

  $scope.barOptions = {
    chart: {
      type: 'linePlusBarChart',
      height: $rootScope.barHeight,
      margin: {
        top: 30,
        right: 75,
        bottom: 50,
        left: 75
      },
      bars: {
        forceY: [0]
      },
      bars2: {
        forceY: [0]
      },
      color: ['#2ca02c', 'darkred'],
      x: function(d,i) { return i; },
      xAxis: {
        axisLabel: 'X Axis',
        tickFormat: function(d) {
          var dx = $scope.barData[0].values[d] && $scope.barData[0].values[d].x || 0;
          if (dx > 0) {
            return d3.time.format('%x')(new Date(dx));
          }
          return null;
        }
      },
      y1Axis: {
        axisLabel: 'Y1 Axis',
        tickFormat: function(d){
          return d3.format(',f')(d);
        },
        axisLabelDistance: 12
      },
      y2Axis: {
        axisLabel: 'Y2 Axis',
        tickFormat: function(d) {
          return d;
        }
      }
    }
  };

  $scope.chgSize = function(type) {
    if(type==='sbar') {
      if($scope.moptions.chart.height === 270) {
        $rootScope.sbarHeight = 500;
        $scope.moptions.chart.height = 500;
      } else {
        $rootScope.sbarHeight = 270;
        $scope.moptions.chart.height = 270;
      }
      //$route.reload();
    } else {
      if($scope.barOptions.chart.height === 270) {
        $rootScope.barHeight = 500;
        $scope.barOptions.chart.height = 500;
      } else {
        $rootScope.barHeight = 270;
        $scope.barOptions.chart.height = 270;
      }
    }
  };


  $scope.moptions = {
    chart: {
        type: 'multiBarChart',
        height: $rootScope.sbarHeight,
        margin : {
            top: 20,
            right: 20,
            bottom: 45,
            left: 20
        },
        clipEdge: true,
        duration: 500,
        stacked: true,
        staggerLabels: true,
        transitionDuration: 1000,
        showControls: false,
        tooltips: true,
        tooltipContent: function (key, x, y, e, graph) {
          return '<p>' + key + ': ' + y + '</p>';
        },
        xAxis: {
            axisLabel: 'Date',
            showMaxMin: true,
            tickFormat: function(d){
                return d;
            }
        },
        yAxis: {
            axisLabel: 'NO. of Task',
            axisLabelDistance: 100,
            tickFormat: function(d){
                return d3.format(',.f')(d);
            }
        }
    }
  };
  $scope.moptionsss = {
    chart: {
      type: 'multiBarChart',
      height: $rootScope.sbarHeight,
      margin : {
        top: 20,
        right: 0,
        bottom: 45,
        left: 45
      },
      clipEdge: true,
      staggerLabels: true,
      transitionDuration: 1000,
      tooltips: true,
      tooltipContent: function (key, x, y, e, graph) {
        return '<p>' + key + ': ' + y + '</p>';
      },
      stacked: true,
      showControls: false,
      xAxis: {
      axisLabel: 'Date',
      showMaxMin: true,
      tickFormat: function(d) {return d;}
      },
      yAxis: {
        axisLabel: 'NO. of Task',
        axisLabelDistance: 100,
        tickFormat: function(d){
          return d3.format(',.f')(d);
        }
      }
    }
  };


  $scope.statusBarMap = function() {
    $scope.pieData = [];
    AjaxMethod.postMethod('dashboard/statusBarMap',{'prjId':$rootScope.selProjectID}).then(function(response){
        $scope.statusChart = response;
        angular.forEach($scope.statusChart, function (value, key) {
            var arrData = $scope.chartData[value.status];
            arrData.value = value.cnt;
            $scope.pieData.push({'key':arrData.status,'y':arrData.value});
        });
    });
  };

  $scope.burnDownChart = function() {
    $scope.barData = [];
    var completedTask = [],  plannedTask = [],  actualTask = [], arr = [], tstamp = '';
    AjaxMethod.postMethod('dashboard/getBurnDownChart',{'prjId':$rootScope.selProjectID}).then(function(response){
        $scope.burnChart = response;
        angular.forEach($scope.burnChart, function (value, key) {
          //tstamp = 1136005200000;//(moment(value.Date+' 00:00:00').unix() * 1000);
          var myDate=moment(value.Date,'YYYY-MM-DD').format('MM,DD,YYYY');
          tstamp = new Date(myDate).getTime();
          arr = [value.Day, value.CompletedCount, tstamp];
          completedTask.push(arr);

          arr = [value.Day, value.PlannedCount, tstamp];
          plannedTask.push(arr);

          arr = [value.Day, value.ActualCount, tstamp];
          actualTask.push(arr);
        });

        $scope.barData = [
          {
              "key": "Completed Tasks",
              "bar": true,
              "values": completedTask
          },
          {
              "key": "Planned Count",
              "values": plannedTask
          },
          {
              "key": "Actual Count",
              "values": actualTask
          }

        ].map(function (series) {
            series.values = series.values.map(function (d) { return { x: d[2], y: d[1], y1: d[2] }; });
            return series;
        });

    });
  };

  $scope.statusBarChart = function() {
    $scope.sbarData = [];
    var completedTask = [],  inprogressTask = [],  openTask = [],  pendingTask = [],  overdueTask = [],tstamp='';
    AjaxMethod.postMethod('dashboard/getStatusBarChart',{'prjId':$rootScope.selProjectID}).then(function(response){
        $scope.sBarChart = response;

        angular.forEach($scope.sBarChart, function (value, key) {
          var myDate=moment(value.DATE,'YYYY-MM-DD').format('MM/DD');
          tstamp =myDate.toString(); //new Date(myDate).getTime();
          completedTask.push({x: tstamp, y: value.closedcnt});
          inprogressTask.push({x: tstamp, y: value.inprogresscnt});
          openTask.push({x: tstamp, y: value.opencnt});
          pendingTask.push({x: tstamp, y: value.pendingcnt});
          overdueTask.push({x: tstamp, y: value.overduecnt});
        });

        $scope.sbarData = [{
          key: 'Completed',
          color: '#bcbd22',
          values: completedTask
          },
          {
            key: 'In-Progress',
            color: '#1f77b4',
            values: inprogressTask
          },
          {
            key: 'Open',
            color: '#FF9F4A',
            values: openTask
          },
          {
            key: 'Pending',
            color: '#551AA5',
            values: pendingTask
          },
          {
            key: 'Overdue',
            color: '#5AB55A',
            values: overdueTask
          }
        ];

    });
  };


  $scope.changeWeek = function(type) {
    var sweek, eweek, sdate;
    if(type === 'next') {
      sdate = $scope.weeklyDatePicker.split(' - ');
      sweek = moment(sdate[0], "MM/DD/YYYY").add(1, 'weeks').startOf('isoWeek');
      eweek = moment(sdate[0], "MM/DD/YYYY").add(1, 'weeks').endOf('isoWeek');
    } else if(type === 'prev') {
      sdate = $scope.weeklyDatePicker.split(' - ');
      sweek = moment(sdate[0], "MM/DD/YYYY").subtract(1, 'weeks').startOf('isoWeek');
      eweek = moment(sdate[0], "MM/DD/YYYY").subtract(1, 'weeks').endOf('isoWeek');
    } else {
      sweek = moment().startOf('isoWeek');
      eweek = moment().endOf('isoWeek');
    }
    $scope.weeklyDatePicker = sweek.format('MM/DD/YYYY') + " - " + eweek.format('MM/DD/YYYY');
  };

  $scope.Datainit = function (page,tableName) { 
    // $scope.getCDMEmployee();
    var st, et;
    if (tableName === 'upcomingLst') {
      /*console.log('One: '+$scope.weeklyDatePicker);
      if($scope.weeklyDatePicker === '') {
      console.log('Two: '+$scope.weeklyDatePicker);
        st = moment().startOf('isoWeek');
        et = moment().endOf('isoWeek');
        $scope.weeklyDatePicker = st.format('MM/DD/YYYY') + " - " + et.format('MM/DD/YYYY');
      }*/
      
      var sdate = $scope.weeklyDatePicker.split(' - ');
      st = moment(sdate[0], "MM/DD/YYYY").format('YYYY-MM-DD');
      et = moment(sdate[1], "MM/DD/YYYY").format('YYYY-MM-DD');
      AjaxMethod.postMethod('dashboard/'+page, {'prjId':$rootScope.selProjectID,'proStart':st,'proEnd':et}).then(function(response){
          $scope.data = response;
          $scope[tableName].page(1);
          $scope[tableName].reload();
       });
    }else if(tableName ==='highlevelLst'){
        AjaxMethod.postMethod('dashboard/'+page, {'prjId':$rootScope.selProjectID}).then(function(response){
            $scope.data = response;    
            $scope[tableName].page(1);
            $scope[tableName].reload();                
         });
    }
  };

  $scope.onClickShow = function (evt) {
    $scope.isBackShow=true;
    AjaxMethod.postMethod('dashboard/statusBarList',{'prjId':$rootScope.selProjectID,'status':$scope.statuses[evt.data.key]}).then(function(response){
        $scope.data = response;
        $scope.statusLst.page(1);
        $scope.statusLst.reload();
        $(".paneldash").slideToggle("slow");
    });
  };

  $scope.onClick = function (points, evt) {
    $scope.isBackShow=true;
    AjaxMethod.postMethod('dashboard/statusBarList',{'prjId':$rootScope.selProjectID,'status':$scope.statuses[points[0].label]}).then(function(response){
        $scope.data = response;
        $scope.statusLst.page(1);
        $scope.statusLst.reload();
        $(".paneldash").slideToggle("slow");
    });
    
  };

  $scope.getTables = function () {
    return new NgTableParams({
            page: 1,            // show first page
            count: 15          // count per page
        }, {
            counts: [],
            total: $scope.data.length, // length of data
            getData: function($defer, params) {
            // use build-in angular filter
                var orderedData = params.sorting() ?
                $filter('orderBy')($scope.data, params.orderBy()) :
                $scope.data;
                orderedData = params.filter() ?
                $filter('filter')(orderedData, params.filter()) :
                orderedData;
                params.total(orderedData.length);
                if(orderedData.length > 0) {
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                } else {
                  return orderedData;
                }
            }
    });
  };

  $scope.statusLst = $scope.getTables();
  $scope.upcomingLst = $scope.getTables();
  $scope.highlevelLst = $scope.getTables();

  $(".flipdash").click(function(){
    $(".paneldash").slideToggle("slow");
  });

  $scope.showGoliveDate =function (){
    AjaxMethod.postMethod('dashboard/getGoliveDate',{'projectID':$rootScope.selProjectID}).then(function(response){
        
        $scope.goliveDate =$rootScope.projectGoliveDate = response.go_live_date;
        $rootScope.liveDate = moment(new Date($scope.goliveDate)).format('DD-MMM-YYYY').toString();
        $scope.projLocation = response.projloc;
        $scope.goLiveLocation = response.Goliveloc;
        $scope.projTimeZone ="http://www.zeitverschiebung.net/clock-widget-iframe?language=en&timezone="+response.ProjTimeZone;
        $scope.goLiveTimeZone = "http://www.zeitverschiebung.net/clock-widget-iframe?language=en&timezone="+response.GoliveTimeZone;
        $('#projLoc').attr('src',$scope.projTimeZone);
        $('#goliveLoc').attr('src',$scope.goLiveTimeZone);
        FlipClock.Lang.Custom = { days:'Days', hours:'Hours', minutes:'Minutes'};
        // FlipClock.Lang.Custom = { days:'Days', hours:'Hours', minutes:'Minutes', seconds:'Seconds' };
        var opts = {
          clockFace: 'DailyCounter',
          countdown: true,
          language: 'Custom',
          showSeconds: false
        };
        opts.classes = {
          active: 'flip-clock-active',
          before: 'flip-clock-before',
          divider: 'flip-clock-divider',
          dot: 'flip-clock-dot',
          label: 'flip-clock-label',
          flip: 'flip',
          play: 'play',
          wrapper: 'flip-clock-small-wrapper'
        };  
        var countdown = ((new Date($scope.goliveDate).getTime())/1000) - ((new Date().getTime())/1000); // from: 10/10/2016 08:04 pm +0530
        countdown = Math.max(1, countdown);
        $('.clock-builder-output').FlipClock(countdown, opts);
        /*fullscreen*/
        $('.fullscreen').click(function(e){
            $('.maxfull').toggleClass('fullscreen'); 
        });
        $('.fullscreen2').click(function(e){
            $('.maxfull2').toggleClass('fullscreen2'); 
        });
        $('.fullscreen3').click(function(e){
            $('.maxfull3').toggleClass('fullscreen3'); 
        });
        $('.fullscreen4').click(function(e){
            $('.maxfull4').toggleClass('fullscreen4'); 
        });
        $('.fullscreen5').click(function(e){
            $('.maxfull5').toggleClass('fullscreen5'); 
        });
        $('.fullscreen6').click(function(e){
            $('.maxfull6').toggleClass('fullscreen6'); 
        });
        /*fullscreen*/ 
        $(".flipchtm").click(function(){
        $(".panelchtm").slideToggle("slow");
    });      
    });

  };

  $scope.showDashboardACL =function (usrdet){
      AjaxMethod.postMethod('user/getUserDashboard',{"userID" : $rootScope.loggedUserDet.user_id_pk}).then(function(data){
          $scope.userDashboardDetails =data;
          $scope.userDashboardDetails.forEach(function (val,idx){
              switch(val.db_id_pk){
                case 1:
                  $scope.isShowStatusBarMap = val.STATUS;
                  break;
                case 2:
                  $scope.isShowUpcomingActionItems = val.STATUS;
                  break;
                case 3:
                  $scope.isShowHighLevelImplementation = val.STATUS;
                  break;
                case 4:
                  $scope.isShowBurnDownChart = val.STATUS;
                  break;
                case 5:
                  $scope.isShowStatusReportChart = val.STATUS;
                  break;
                default:                  
                  break;
              }
          });
      });
      $scope.checkValid = function(data, field) {
          if(data === "" || !data) {
              return "required";
          }
      };
      $scope.checkDate = function(data,id) {
          var fdata = {};
          fdata['projectID'] = $rootScope.selProjectID;
          if(data === '') { 
              return false;
          } 
          fdata['goLiveDate'] = data;
          AjaxMethod.postMethod('dashboard/updateGoliveDate', fdata).then(function(response){
              $scope.goliveDate= data;
              FlipClock.Lang.Custom = { days:'Days', hours:'Hours', minutes:'Minutes'};
              // FlipClock.Lang.Custom = { days:'Days', hours:'Hours', minutes:'Minutes', seconds:'Seconds' };
              var opts = {
                clockFace: 'DailyCounter',
                countdown: true,
                language: 'Custom',
                showSeconds: false
              };
              opts.classes = {
                active: 'flip-clock-active',
                before: 'flip-clock-before',
                divider: 'flip-clock-divider',
                dot: 'flip-clock-dot',
                label: 'flip-clock-label',
                flip: 'flip',
                play: 'play',
                wrapper: 'flip-clock-small-wrapper'
              };  
              var sdate = moment($scope.goliveDate).format('YYYY, MM, DD');
              console.log($scope.goliveDate);
              $('.clock-builder-output').html('');
              var countdown = ((new Date(sdate.toString()).getTime())/1000) - ((new Date().getTime())/1000); // from: 10/10/2016 08:04 pm +0530
              countdown = Math.max(1, countdown);
              $('.clock-builder-output').FlipClock(countdown, opts);
          });
      };
  }; 
  $('.dtpicker').datepicker({
         format: 'yyyy-mm-dd'
    });
});

apps.directive('weekCalendar', function () {
    return {
        require: 'ngModel',
        link: function (scope, el, attr, ngModel) {
            $(el).datepicker({
                format: 'mm/dd/yyyy',
                autoclose: true,
                weekStart: 1
            })
            .on('hide', function(ev){
                //changeDate
                if(ev.target.value) {
                  var firstDate = moment(ev.target.value, "MM/DD/YYYY").day(1).format("MM/DD/YYYY");
                  var lastDate =  moment(ev.target.value, "MM/DD/YYYY").day(7).format("MM/DD/YYYY");
                  ngModel.$setViewValue(firstDate + " - " + lastDate);
                  $(el).val(firstDate + " - " + lastDate);
                }
               /* scope.$apply(function () {
                    ngModel.$setViewValue(firstDate + " - " + lastDate);
                });*/
            });
        }
    };
});

 /*toggle*/
