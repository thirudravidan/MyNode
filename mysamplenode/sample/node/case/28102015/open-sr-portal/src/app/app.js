var isAutoSave =false;
var apps = angular.module( 'srportal', [
  'templates-app',
  'templates-common',
  'srportal.login',
  'srportal.home',
  'ngRoute',
  'ngCookies',
  'ngTable',
  'xeditable',
  'angularTreeview',
  'ngFileUpload',
  'ui.bootstrap',
  'ui.bootstrap.showErrors',
  'ngTagsInput',
  'acute.select',
  'ngCkeditor',
  'chart.js',
  'nvd3',
  'jkuri.slimscroll',
  'anguFixedHeaderTable',
  'socket-io'
])
.run( function run ($rootScope,$http,$window,AjaxMethod,editableOptions) {
  //$rootScope.selProjectID = null; // response[0].project_id_pk;
  //$rootScope.selProjectName = null; // response[0].project_name;
    //  angular.element($window).on('beforeunload', function (event) {
    //     // do whatever you want in here before the page unloads.        
    //     console.log('Called');
    //     // the following line of code will prevent reload or navigating away.
    //     event.preventDefault();
    // });
  editableOptions.theme = 'bs3';
 
})
.controller( 'AppCtrl', function AppCtrl( $scope,$rootScope, $location,AjaxMethod, $route,$cookies,$cookieStore,Upload,socket) {
  $rootScope.loggedUserDet =JSON.parse(loggedUsrDet);
  $rootScope.profUrl =golobalconfigs.downloadURL+$rootScope.loggedUserDet.profilepicurl;
  console.log($rootScope.loggedUserDet);
  $rootScope.CreatedProjectID = 0;
  $scope.selProject=null;   
  $scope.isshowMenu=[];
  $scope.projectplanoverduealert = $scope.momalert = $scope.notificationcnt = 0;
  $scope.isshowprojectplanalert = $scope.isshowmomalert = false;
  if ($cookies.get('selectedProjectID') === undefined) {
     $cookies.put('selectedProjectID',$rootScope.loggedUserDet.project_id_fk);
  }
  
  $rootScope.proPlan = function() {
    ganttResize();
    $location.path('/projectplan');
  };

  $rootScope.loadClientDet =function (){
    AjaxMethod.postMethod('user/getUserRole', {"roleID" : $rootScope.loggedUserDet.user_role_id_fk}).then(function(response){
      $rootScope.userRole = response[0].user_role_name;
    });
  };

  $scope.showMenu=function (){
    var goLive,goLiveDate,gldt,currentDate,curDate,curdt;
    var golivemoment,curmoment;
    AjaxMethod.postMethod('project/getUserMenu', {"userID" : $rootScope.loggedUserDet.user_id_pk}).then(function(response){
      $rootScope.userAclMenulst =response;
      $scope.menuDyn = {};
        angular.forEach($rootScope.userAclMenulst,function(menu,idx){
            //$scope.isshowMenu[menu.module_id_fk] =(menu.acl_id_fk === 1) ? false : true;
            if(!$scope.menuDyn.hasOwnProperty(menu.project_id_fk)) {
                 $scope.menuDyn[menu.project_id_fk] = {};
                 $scope.menuDyn[menu.project_id_fk][menu.bucket_name]=[];
                 if (menu.acl_id_pk !== 1) {
                    if (menu.module_id_pk !== 31) {
                      $scope.menuDyn[menu.project_id_fk][menu.bucket_name].push({'moduleName': menu.module_name,'routePath':menu.routing_path,'aclID' :menu.acl_id_pk,'mmIcon':menu.icon}); 
                    }else if(menu.module_id_pk === 31) {    
                        goLive=moment(new Date(menu.go_live_date)).format('MM-DD-YYYY').split('-');
                        goLiveDate = goLive[0]+'/'+goLive[1]+'/'+goLive[2];
                        gldt = new Date(goLiveDate);

                        currentDate=moment().format('MM-DD-YYYY').split('-');
                        curDate = currentDate[0]+'/'+currentDate[1]+'/'+currentDate[2];
                        curdt = new Date(curDate);

                        golivemoment=moment([goLive[2],(goLive[0] -1),goLive[1]]);
                        curmoment=moment([currentDate[2],(currentDate[0] -1),currentDate[1]]);
                        if (curmoment.diff(golivemoment, 'days') > 0) {
                            $scope.menuDyn[menu.project_id_fk][menu.bucket_name].push({'moduleName': menu.module_name,'routePath':menu.routing_path,'aclID' :menu.acl_id_pk,'mmIcon':menu.icon}); 
                        }
                    }                    
                 }
                 
            } else {
                if(!$scope.menuDyn[menu.project_id_fk].hasOwnProperty(menu.bucket_name)) {
                  $scope.menuDyn[menu.project_id_fk][menu.bucket_name]=[];
                }
                if (menu.acl_id_pk !== 1) {
                   if (menu.module_id_pk !== 31) {
                      $scope.menuDyn[menu.project_id_fk][menu.bucket_name].push({'moduleName': menu.module_name,'routePath':menu.routing_path,'aclID' :menu.acl_id_pk,'mmIcon':menu.icon}); 
                    }else if(menu.module_id_pk === 31){
                        goLive=moment(new Date(menu.go_live_date)).format('MM-DD-YYYY').split('-');
                        goLiveDate = goLive[0]+'/'+goLive[1]+'/'+goLive[2];
                        gldt = new Date(goLiveDate);

                        currentDate=moment().format('MM-DD-YYYY').split('-');
                        curDate = currentDate[0]+'/'+currentDate[1]+'/'+currentDate[2];
                        curdt = new Date(curDate);

                        golivemoment=moment([goLive[2],(goLive[0] -1),goLive[1]]);
                        curmoment=moment([currentDate[2],(currentDate[0] -1),currentDate[1]]);
                        if (curmoment.diff(golivemoment, 'days') > 0) {
                            $scope.menuDyn[menu.project_id_fk][menu.bucket_name].push({'moduleName': menu.module_name,'routePath':menu.routing_path,'aclID' :menu.acl_id_pk,'mmIcon':menu.icon}); 
                        }
                    } 
                }
            }
        });
        if ($rootScope.selProjectID !== undefined) {
          $scope.proMenu =$scope.menuDyn[$rootScope.selProjectID];
        }
        $scope.adminmenu =$scope.menuDyn[0];
    });
     // $scope.isshowMenu[1] =true;
  }; 

  $scope.getAllProjects = function (callback) {
     var selPro =$cookies.get('selectedProj');
       AjaxMethod.postMethod('project/getActiveProjects', {"userID" : $rootScope.loggedUserDet.user_id_pk}).then(function(response){
          $rootScope.projectList = response;

          if ($rootScope.projectList.length > 0) {
            $scope.selProject =(selPro === undefined) ? $rootScope.projectList[0] :JSON.parse($cookies.get('selectedProj'));
            $rootScope.selProjectID = $scope.selProject.projID; // response[0].project_id_pk;
            $rootScope.selProjectName = $scope.selProject.ProjName; // response[0].project_name;
            $rootScope.logoUrl = $scope.selProject.logo_path;
            $cookies.put('selectedProjectID',$rootScope.selProjectID);
            $cookies.put('selectedProjectName',$rootScope.selProjectName);
            $cookies.put('selectedProj', JSON.stringify($scope.selProject)); 
            $cookies.put('projectLogo', $rootScope.logoUrl); 
          }                
          $scope.showMenu();
          callback($scope.projectList);
      });
  };

  $rootScope.logout =function (){
     $cookies.remove('selectedProjectID');
     $cookies.remove('selectedProjectName');
     $cookies.remove('selectedProj');
     $cookies.remove('selectedMenuACL');
     $cookies.remove('projectLogo');
     window.location.href="/logout";
  };

  $rootScope.getindividualMenuACL =function (aclid){
      $rootScope.pageACL =aclid;
      $cookies.put('selectedMenuACL',aclid);
  };

  // $rootScope.$watch($rootScope.go_live_date);
  $rootScope.$watch($rootScope.logoUrl);
  $rootScope.$watch($rootScope.pageACL);
  $rootScope.$watch($rootScope.isAddButtonEnabled);
  $rootScope.$watch($rootScope.isEditButtonEnabled);
  $rootScope.$watch($rootScope.isSaveButtonEnabled);
  $rootScope.redirecttoDashboard=function(value){ 
      $rootScope.selProjectID = value.projID; // response[0].project_id_pk;
      $rootScope.selProjectName = value.ProjName; // response[0].project_name; 
      $rootScope.logoUrl =  value.logo_path;
      $cookies.put('selectedProj', JSON.stringify(value));
      $cookies.put('selectedProjectID',$rootScope.selProjectID);
      $cookies.put('selectedProjectName',$rootScope.selProjectName); 
      $cookies.put('projectLogo', $rootScope.logoUrl);  
      $scope.proMenu = $scope.menuDyn[$rootScope.selProjectID];
      console.log(value);
      if(value.nxtPath !== undefined && value.nxtPath !== '') {
        var nextPath = value['nxtPath'];
        delete value['nxtPath'];
        $rootScope.isPathChg = 'pathChange';
        $cookies.put('selectedProj', JSON.stringify(value));
        $location.path('/'+nextPath);
      } else if ($location.path() === '' || $location.path() !== '/dashboard') {
        $location.path('/dashboard');
      } else if($location.path() === '/dashboard') {
        $route.reload();
      }
  };  

  $rootScope.$on( "$routeChangeSuccess", function(event, next, current) {
      // $rootScope.pageTitle=next.data.pageTitle;      
  });

  $rootScope.uploadprofilePic =function (filDet){    
    if (filDet) {
         if (filDet.type.indexOf('image') === -1) {
              $scope.profPic='';
              $scope.isInvalidFile =true; 
              alert('Invalid');
          }else{
            $scope.isInvalidFile =false;               
             Upload.upload({ 
                url: 'caseTracker/user/uploadprofilePic',
                data: {file: $scope.profPic}
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total, 10);
                }).success(function (data, status, headers, config) {
                     var param ={};
                     param.userID =$rootScope.loggedUserDet.user_id_pk;
                     param.profilePath ='download/userprofile/'+$scope.profPic.name;
                     AjaxMethod.postMethod('user/updateprofileurl', param).then(function(response){  
                        if (response.status) {  
                            $rootScope.profUrl =golobalconfigs.downloadURL+'download/userprofile/'+$scope.profPic.name;
                        } else
                        {
                          return false;
                        }
                    });
              });
          }
       }
    };

  $('.dropdown-menu').on('click',function(event){
     event.stopPropagation();
  });

  $('.dropdown-menu').on('mouseleave',function(event){
    $("#profiledrop").removeClass("open");
  });

  $('#profiledrop').on('click',function(event){
    $("#profiledrop").addClass("open");
  });

  
  $('#profileImage').on('mouseover',function () {
        $("#test").css("display","block");
    });
   $('#test').on('mouseover',function () {
        $("#test").css("display","block");
    });
   $('#test').on('mouseleave',function () {
      $("#test").css("display","none");
  });

  $('#profileImage').on('mouseleave',function () {
      $("#test").css("display","none");
  });

  $('#toggleMenu').on('click',function () {
      var isCollapsed =$('#srindexfrm').hasClass('sidebar-collapse');
      if (isCollapsed) {
        $(".slimaside").removeAttr("style");
        $(".slimaside").css({"overflow":"hidden", "width":"auto", "height":"250px"});
        $(".slimScrollDiv").removeAttr("style");
        $(".slimScrollDiv").css({"position":"relative","overflow":"hidden", "width":"auto", "height":"250px"});
      }else{
        $(".slimaside").removeAttr("style");
        $(".slimaside").css({"width":"auto", "height":"250px"});
        $(".slimScrollDiv").removeAttr("style");
        $(".slimScrollDiv").css({"position":"relative","width":"auto", "height":"250px"});
      }
  });

  $scope.getNotificationDetails =function (){
    var projplancnt=0,momcnt=0;
    $scope.momalert=0;
    $scope.projectplanoverduealert=0;
     AjaxMethod.postMethod('user/getUserNotifications', {"userID" : $rootScope.loggedUserDet.user_id_pk}).then(function(response){
        $scope.projplanlist =[];
        $scope.momlist =[];
        if (response.length > 0) {
          angular.forEach(response, function(val, key) {
            $scope.projplandet={};
            $scope.momdet={};
             if (val.notification_type == 'projectplan') {
                projplancnt++;
                $scope.isshowprojectplanalert = true;
                $scope.projectplanoverduealert = projplancnt;
                $scope.projplandet.notifyID = val.notificatoin_id_pk;
                $scope.projplandet.notifyName = val.notification_name;
                $scope.projplandet.notifyDesc = val.notification_desc;
                $scope.projplanlist.push($scope.projplandet);
            }else if(val.notification_type == 'mom'){
                momcnt++;
                $scope.isshowmomalert = true;
                $scope.momalert = momcnt;                
                $scope.momdet.notifyID = val.notificatoin_id_pk;
                $scope.momdet.notifyName = val.notification_name;
                $scope.momdet.notifyDesc = val.notification_desc;
                $scope.momlist.push($scope.momdet);
            }
            $scope.notificationcnt = parseInt($scope.projectplanoverduealert,10)+parseInt($scope.momalert,10);
          });
        }
        
    });
  };

  $scope.readNotification = function (notifyID,desc,title,type){
      $scope.notifytitle =  (type === 'PROJPLAN') ? 'Project Name' : 'Meeting Title';
      $scope.notifyDet =title;
      $scope.notifyDesc= desc;
      AjaxMethod.postMethod('user/readNotification', {"notifyID" : notifyID}).then(function(response){
        if (response.res) {
          $('#download').modal("show");
        }
      });
      // $('#download').modal("show");
  };

  $scope.closeModal =function (){
    $scope.getNotificationDetails();
    $('#download').modal("hide");
  };

  socket.on('eventToEmit',function (data){
    console.log(data);
    $scope.getNotificationDetails();
    // if (data.ntype == 'projectplan') {
    //     $scope.isshowprojectplanalert = true;
    //     $scope.projectplanoverduealert = data.ncnt;
    //     console.log($scope.projectplanoverduealert);
    // }else if(data.ntype == 'mom'){
    //     $scope.isshowmomalert = true;
    //     $scope.momalert = data.ncnt;
    // }
    // $scope.notificationcnt = parseInt($scope.projectplanoverduealert,10)+parseInt($scope.momalert,10);
  }); 
   
  socket.on('senddata', function(data) {
    console.log('server data',data);
  });

});




