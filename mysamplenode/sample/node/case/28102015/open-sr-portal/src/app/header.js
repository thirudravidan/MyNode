//.config(function($sceDelegateProvider) {
//  $sceDelegateProvider.resourceUrlWhitelist([
//    // Allow same origin resource loads.
//    'self',
//    // Allow loading from our assets domain.  Notice the difference between * and **.
//    'http://google.com/**'
//]);
//})    
apps.directive('myHeader', function() {
    return {
        restrict: 'E',
        transclude: true,   
        scope: {
            enableShow : '=headershow'
        },
        controller: function($scope, $rootScope, $route, $filter, $routeParams, $location, AjaxMethod,$cookies,Upload,socket) {  
            $scope.projectplanoverduealert =0;
            $scope.isshowprojectplanalert = true; 
            $scope.profUrl =golobalconfigs.downloadURL+$rootScope.loggedUserDet.profilepicurl;
            $scope.userName=$rootScope.loggedUserDet.first_name;

             $scope.loadClientDet =function (){
                AjaxMethod.postMethod('user/getUserRole', {"roleID" : $rootScope.loggedUserDet.user_role_id_fk}).then(function(response){
                  $scope.userRole = response[0].user_role_name;
                });
              };
            $scope.logout =function (){
             $cookies.remove('selectedProjectID');
             $cookies.remove('selectedProjectName');
             $cookies.remove('selectedProj');
             $cookies.remove('selectedMenuACL');
             $cookies.remove('projectLogo');
             window.location.href="/logout";
           };

            $scope.uploadprofilePic =function (filDet){    
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
                                        $scope.profUrl =golobalconfigs.downloadURL+'download/userprofile/'+$scope.profPic.name;
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

               $scope.$watch('projectplanoverduealert',function (oldval,newval){
                    console.log('newval',newval);
                    // $scope.projectplanoverduealert =newval;
                 });
                console.log(socket);
              socket.on('eventToEmit',function (data){
                console.log(data);
                if (data.ntype == 'projectplan') {
                    $scope.isshowprojectplanalert = true;
                    $scope.projectplanoverduealert = data.ncnt;
                    console.log($scope.projectplanoverduealert);

                }else{
                    
                  }
              }); 
               
              socket.on('senddata', function(data) {
                console.log('server data',data);
              });
        },
        templateUrl : '../top_menu.ejs'
        // template: '<li class="dropdown notifications-menu"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><span class="label label-warning">10</span></a><ul class="dropdown-menu"><li class="header">You have 10 notifications</li><li><!-- inner menu: contains the actual data --><ul class="menu"><li ng-show="isshowprojectplanalert"><a href="#"><i class="fa fa-users text-aqua"></i> {{projectplanoverduealert}} Overdue tasks</a></li></ul></li><li class="footer"><a href="#">View all</a></li></ul></li>'
    };
});