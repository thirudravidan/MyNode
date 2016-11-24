var proPlanTask;
var projectplan;
var myInterval;
var canWrite = true;
var canWriteOnParent = true;
var isneedCxtmenu = true;
var isneedDragdrop = true;
var rowSet = [];
var parentgconfig={};
var selectedFiles = null;
var newFileList=[];
var phaseChanged=false;
parentgconfig.hideshowoptions = [];
var pageLevelACL ;
var isNewTasks =true;
var loggedUserRole;
var loggedUserName;
var selectedProjectName;

apps.controller('projectplanCtrl', function ($cookies,$rootScope, $scope, $http, $filter, ngTableParams, $routeParams, $location, AjaxMethod, $q,Upload,$route) {
// parentgconfig.projectTaskStatus = [{ 'id': 1, 'value': 'Open' }, { 'id': 2, 'value': 'Pending' }, { 'id': 3, 'value': 'Inprogress' }, { 'id': 4, 'value': 'Closed' }, { 'id': 5, 'value': 'OverDue'}];
parentgconfig.projectTaskStatus = [{ 'id': "STATUS_UNDEFINED", 'value': 'Open' }, { 'id': "STATUS_SUSPENDED", 'value': 'Pending' }, { 'id': "STATUS_ACTIVE", 'value': 'In-progress' }, { 'id': "STATUS_DONE", 'value': 'Closed' }, { 'id': "STATUS_FAILED", 'value': 'OverDue'}];
$rootScope.selProjectID = ($cookies.get('selectedProjectID') === undefined) ? $rootScope.selProjectID : $cookies.get('selectedProjectID');
$rootScope.selProjectName = ($cookies.get('selectedProjectName') === undefined) ? $rootScope.selProjectName : $cookies.get('selectedProjectName');
parentgconfig.ZoomLevel='m';
AjaxMethod.getPageLevelACl();
pageLevelACL =parseInt($cookies.get('selectedMenuACL'),10);
parentgconfig.projectID = ($rootScope.CreatedProjectID > 0) ? $rootScope.CreatedProjectID : $rootScope.selProjectID;
isAutoSave =true;
parentgconfig.userID = $rootScope.loggedUserDet.user_id_pk;
loggedUserRole =$rootScope.loggedUserDet.user_role_id_fk;
loggedUserName =$rootScope.loggedUserDet.first_name;
selectedProjectName = $rootScope.selProjectName;

$scope.$on('$destroy', function() {
   isAutoSave =false;
   $rootScope.CreatedProjectID = 0;
});

/*$scope.checkGantt =function(){
  alert($cookies.get('hideGantt')+'test');
  if ($cookies.get('hideGantt')) {
     $('#chkshowGantt').prop( "checked", $cookies.get('hideGantt'));
      showGantt({'checked':true});
  }
};
*/
$scope.hideGantt =function(val){
  $cookies.put('hideGantt',val);
};

/*$rootScope.savepp=function(){
  if (newFileList.length > 0) {
      Upload.upload({ 
            url: 'caseTracker/projectplan/uploadDoc',
            data: {file: newFileList}
        }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total, 10);
            //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n');
        }).success(function (data, status, headers, config) {
            newFileList=[];
            $('#workSpace').trigger('saveGanttOnServer.gantt');
        });
    }else{
        $('#workSpace').trigger('saveGanttOnServer.gantt');    
    }
};*/

$rootScope.savepp=function(){
  if (newFileList.length > 0) {
      Upload.upload({ 
            method: 'POST',
            url: 'caseTracker/projectplan/uploadDoc',
            headers: { 'Content-Type': undefined },
            data: {file: newFileList}
        }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total, 10);
            //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n');
        }).success(function (data, status, headers, config) {
            newFileList=[];
            $('#workSpace').trigger('saveGanttOnServer.gantt');
        });
    }else{
        $('#workSpace').trigger('saveGanttOnServer.gantt');    
    }
};

$scope.sendMailtoClient =function (){
    var projectphaseDet= $rootScope.selProjectName+' - ' +parentgconfig.CurrentprojectPlanPhase.planphasename;
    var msg='Do you want to send the project plan('+projectphaseDet+') details to client approval ?';
        BootstrapDialog.confirm(msg, function(result){
            if(result) {  
                var param={};
                param.projectID =$rootScope.selProjectID;
                param.phaseName =parentgconfig.CurrentprojectPlanPhase.planphasename;
                param.projectName =$rootScope.selProjectName.split('(')[0];
                AjaxMethod.postMethod('projectplan/sendMailToClient',param).then(function(response){
                  if (response.status) {
                    successMsg("Project Plan", "Mail has been sent to client");
                    $scope.reloadPage();
                  } else{
                    successMsg("Project Plan", "Mail not sent to the client");
                  }                  
                });
            }
        });
};

$scope.reloadPage = function(){
  $route.reload();
};

$scope.uploadFiles = function ($files) {
  angular.forEach($files, function (file, key) {
    if (file) {
        var fl={};
        fl.fileid = "";
        fl.filename = file.name;
        fl.filepath = "download/taskattachments/";
        fl.isuploaded = false;        
        fl.size = Math.round((file.size/1024)) +" KB";
        fl.tempfilename = file.name;
        fl.uploadedby = parentgconfig.userID;
        fl.uploadedbyName = alasql("SELECT value FROM ? WHERE id = ?",[parentgconfig.projectUser,parentgconfig.userID])[0].value;
        fl.uploadedon = new Date();
        selectedFiles.splice(0, 0, fl);
        // selectedFiles.push(fl);
        newFileList.push(file);
        binddata(selectedFiles);
    }
  });
    
};

$scope.loadscripts=function(){
  
	// loadGantTemplate();
	// loadJte();
	bindWorkspace(false);

  $(function() {
      $( document ).on( "idle.idleTimer", function(event, elem, obj){
          // function you want to fire when the user goes idle
          if (isAutoSave) {
            projectplan.autosaveGanttOnServer();  
          }
      });

      $( document ).on( "active.idleTimer", function(event, elem, obj, triggerevent){
          // function you want to fire when the user becomes active again
          console.log('User Active');
      });
      $(document).idleTimer(golobalconfigs.docTimeout);
      /*
      *   Here are the arguments
      */
      // event
      // will be either idle.idleTimer or active.idleTimer
      // use event.stopPropagation(); to stop element from bubbling up to document

      // elem
      // is the element that the event was triggered on

      // obj
      // is a copy of the internal data used by idleTimer

      // triggerevent
      // is the initial event that triggered the element to become active
      // obviously for idle state this will be undefined
  });
};
});

function bindWorkspace(isloadlocal){
  parentgconfig.projectPlanStatus = ajaxServiceCall("caseTracker/projectplan/getPhaseDetails", "POST", '{}');
  parentgconfig.projectUser = ajaxServiceCall("caseTracker/projectplan/getUsers", "POST", '{}');
  var curphaseDet =ajaxServiceCall("caseTracker/projectplan/getCurrentPhase", "POST", '{"projectId" : '+ parentgconfig.projectID +'}');
  parentgconfig.CurrentprojectPlanPhase = { "PlanphaseId": curphaseDet.PropDet[0].PhaseID, "planphasename": curphaseDet.PropDet[0].PhaseName };
  parentgconfig.phaseID = curphaseDet.PropDet[0].PhaseID;
  parentgconfig.isProposal = curphaseDet.Isproposal;
  var currentOption = ajaxServiceCall("caseTracker/projectplan/getCurrentPlanOption", "POST", '{"projectId" : '+ parentgconfig.projectID +'}');
  var projectLocCalendar = ajaxServiceCall("caseTracker/projectplan/getProjectCalendar", "POST", '{"projectId" : '+ parentgconfig.projectID +'}')[0];
  parentgconfig.hideshowoptions = JSON.parse(currentOption.coldetails);
  parentgconfig.isExecutionPlan = currentOption.isExecution;
  parentgconfig.isapprovalmail = currentOption.isapprovalmail;
  parentgconfig.isclientapproved = currentOption.isclientapproved;
  parentgconfig.holidays =[];
  parentgconfig.wekkoff=[];
  if (projectLocCalendar !==undefined) {
    parentgconfig.wekkoff = JSON.parse(projectLocCalendar.weekoff_days === null ? '[]' : projectLocCalendar.weekoff_days);
    if (projectLocCalendar.hasOwnProperty('HT')) {
        parentgconfig.holidays = projectLocCalendar.HT;
    }    
  }
  var specialDays = ajaxServiceCall("caseTracker/calendar/getSpecialWorkingDays", "POST", '{"projectID" : '+ parentgconfig.projectID +'}')[0];
  console.log(specialDays);
  parentgconfig.specialWorking=[];
  if (specialDays !==undefined) {
    if (specialDays.hasOwnProperty('SWT')) {
        parentgconfig.specialWorking = specialDays.SWT;
    }    
  }
 
  /* Prepare templates */
    //Columns Rowset
    // rowSet = getROWSET(parent.gconfig.CurrentprojectPlanPhase.PlanphaseId);
    // console.log('parentgconfig.phaseID-----',parentgconfig.phaseID);
    $("#workSpace").empty();
    rowSet = getROWSET(parentgconfig.phaseID);
    // console.log('rowSet',rowSet);
    var rowIds = $.map(rowSet, function (n, i) {
        return [n.id];
    });

    var table = $("<table>");
    $(table).addClass('gdfTable');
    $(table).attr('cellspacing', 0);
    $(table).attr('cellpadding', 0);

    var trH = $("<tr>");
    $(trH).attr('style', 'height:40px');
    $.each(rowSet, function (index, row) {
        if (row.visibility) {
            var th = $("<th>");
            $(th).addClass('gdfColHeader');
            if (row.resizable) {
                $(th).addClass('gdfResizable');
            }
            if (row.style) {
                $(th).attr('style', row.style);
            }
            $(th).attr('title', row.name);
            if (row.customHeaderHTML && row.visibility){
                $(th).append(row.customHeaderHTML);
            }
            else if (row.visibility){
                $(th).append(row.name);
            }
            $(trH).append(th);
        }
    });
    var thead = $("<thead>");
    $(thead).append(trH);
    table.append(thead);
    //alert(table.html());  
    //TASKSEDITHEAD
    var headTemplate = $('div.__template__[type="TASKSEDITHEAD"]');
    headTemplate.html(table);
    //TASKROW
    var tr = $("<tr>");
    $(tr).attr('taskId', '(#=obj.id#)');
    $(tr).attr('level', '(#=level#)');
    $(tr).addClass('taskEditRow');
    var trf = addRowTemplate($(tr));
    var taskRow = $('div.__template__[type="TASKROW"]');
    taskRow.html(trf);
    //TASKEMPTYROW
    var tr1 = $("<tr>");
    $(tr1).addClass('taskEditRow nodrag nodrop');
    $(tr1).addClass('emptyRow');
    var tre = addEmptyRowTemplate($(tr1));
    tre.find('.dragHandle').removeClass('dragHandle');
    var taskEmptyRow = $('div.__template__[type="TASKEMPTYROW"]');
    taskEmptyRow.html(tre);
    projectplan = new GanttMaster();
    var workSpace = $("#workSpace");
    workSpace.css({ width: $(window).width() - 0, height: $(window).height() - 100 });
    projectplan.init(workSpace);
    loadI18n();
    if (isloadlocal) {
      loadFromClientStorage(0);
    }
    else {
      loadFromLocalStorage();
    }
    
    $(window).resize(function () {
        var sideMnuSize = $( ".main-sidebar" ).width();
        workSpace.css({ width: $(window).width() - (sideMnuSize + 20), height: $(window).height() - workSpace.position().top });
        workSpace.trigger("resize.gantt");
    }).oneTime(150, "resize", function () { $(this).trigger("resize"); });

    initdropdownmenus(projectplan);
    ppACL();
   // $('.leftside-navigation').niceScroll();
}

function ganttResize() {
    var workSpace = $("#workSpace");
    //workSpace.css({ width: $(window).width() - 0, height: $(window).height() - 100 });
    var sideMnuSize = $( ".main-sidebar" ).width();
    sideMnuSize = (sideMnuSize > 200)?50:230;
    $(window).resize(function () {
        workSpace.css({ width: $(window).width() - (sideMnuSize + 20), height: $(window).height() - workSpace.position().top });
        workSpace.trigger("resize.gantt");
    }).oneTime(150, "resize", function () { $(this).trigger("resize"); });
}

var ge;  //this is the hugly but very friendly global var for the gantt editor




//-------------------------------------------  Create some demo data ------------------------------------------------------
function setRoles() {
  ge.roles = [
    {
      id:"tmp_1",
      name:"Project Manager"
    },
    {
      id:"tmp_2",
      name:"Worker"
    },
    {
      id:"tmp_3",
      name:"Stakeholder/Customer"
    }
  ];
}

function setResource() {
  var res = [];
  for (var i = 1; i <= 10; i++) {
    res.push({id:"tmp_" + i,name:"Resource " + i});
  }
  ge.resources = res;
}


function editResources(){

}

function clearGantt() {
  ge.reset();
}

function loadI18n() {
  GanttMaster.messages = {
    "CANNOT_WRITE":                  "CANNOT_WRITE",
    "CHANGE_OUT_OF_SCOPE":"NO_RIGHTS_FOR_UPDATE_PARENTS_OUT_OF_EDITOR_SCOPE",
    "START_IS_MILESTONE":"START_IS_MILESTONE",
    "END_IS_MILESTONE":"END_IS_MILESTONE",
    "TASK_HAS_CONSTRAINTS":"TASK_HAS_CONSTRAINTS",
    "GANTT_ERROR_DEPENDS_ON_OPEN_TASK":"GANTT_ERROR_DEPENDS_ON_OPEN_TASK",
    "GANTT_ERROR_DESCENDANT_OF_CLOSED_TASK":"GANTT_ERROR_DESCENDANT_OF_CLOSED_TASK",
    "TASK_HAS_EXTERNAL_DEPS":"TASK_HAS_EXTERNAL_DEPS",
    "GANTT_ERROR_LOADING_DATA_TASK_REMOVED":"GANTT_ERROR_LOADING_DATA_TASK_REMOVED",
    "ERROR_SETTING_DATES":"ERROR_SETTING_DATES",
    "CIRCULAR_REFERENCE":"CIRCULAR_REFERENCE",
    "CANNOT_DEPENDS_ON_ANCESTORS":"CANNOT_DEPENDS_ON_ANCESTORS",
    "CANNOT_DEPENDS_ON_DESCENDANTS":"CANNOT_DEPENDS_ON_DESCENDANTS",
    "INVALID_DATE_FORMAT":"INVALID_DATE_FORMAT",
    "TASK_MOVE_INCONSISTENT_LEVEL":"TASK_MOVE_INCONSISTENT_LEVEL",

    "GANTT_QUARTER_SHORT":"trim.",
    "GANTT_SEMESTER_SHORT":"sem."
  };
}



//-------------------------------------------  Get project file as JSON (used for migrate project from gantt to Teamwork) ------------------------------------------------------
function getFile() {
  $("#gimBaPrj").val(JSON.stringify(ge.saveProject()));
  $("#gimmeBack").submit();
  $("#gimBaPrj").val("");

  /*  var uriContent = "data:text/html;charset=utf-8," + encodeURIComponent(JSON.stringify(prj));
   neww=window.open(uriContent,"dl");*/
}


//-------------------------------------------  LOCAL STORAGE MANAGEMENT (for this demo only) ------------------------------------------------------
Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
};


Storage.prototype.getObject = function(key) {
  return this.getItem(key) && JSON.parse(this.getItem(key));
};


function loadFromLocalStorage() {
 var ret;
    if (localStorage) {
        if (localStorage.getObject("teamworkGantDemo")) {
            ret = localStorage.getObject("teamworkGantDemo");
        }
    }
    if (!ret || !ret.tasks || ret.tasks.length === 0) {
      // console.log("#############################",canWrite);
        ret = {};
        ret.selectedRow = 0;        
        ret.canWrite = canWrite;
        ret.canWriteOnParent = canWriteOnParent;
        ret.columns = rowSet;
        // console.log("rowSet",rowSet);
        ret.zoom = parentgconfig.ZoomLevel;
        var projectID = parentgconfig.projectID;
        var phaseID = parentgconfig.phaseID;
        // console.log('1');
        //  AjaxMethod.postMethod('projectplan/getProjectPlanDetails', {"ProjectID" : 2}).then(function(res){
        //   console.log('2');
        //   console.log(res);
        // });
       var task = ajaxServiceCall("caseTracker/projectplan/getProjectPlanDetails", "POST", '{"ProjectID": '+projectID+'}');

       // console.log("Task from server",task);
       // console.log('3');
       // console.log(task);
        // var projectid = parent.getIDs().projectid;
        // var phaseid = parent.getIDs().phaseid;
        // console.log('1');
        // angular.element(document.getElementById("mainCont")).scope().getAllPhaseDetails();
        // console.log('3');
        // var task = ajaxServiceCall("GetProjectPlanDetails", "POST", '{"projectID":' + projectid + '}').GetProjectPlanDetailsResult;
        // $.each(task.ProjectUsers, function (idx, rec) {
        //     var user = { "id": rec.userid, "value": rec.username };
        //     parent.gconfig.projectUser.push(user);
        // });

        // ret.tasks = datatotree(task.ProjectPlanList, phaseid);
        // ret.tasks = datatotree(proPlanTask.tasks, 1);
        ret.tasks = datatotree(task, phaseID);
    }
    projectplan.loadProject(ret);
    projectplan.checkpoint(); //empty the undo stack

}

function loadFromClientStorage(row) {
    var ret;
    if (localStorage) {
        if (localStorage.getObject("teamworkGantDemo")) {
            ret = localStorage.getObject("teamworkGantDemo");
        }
    }
    if (!ret || !ret.tasks || ret.tasks.length === 0) {
        ret = {};
        ret = projectplan;
        ret.selectedRow = row;
        ret.canWrite = canWrite;
        ret.canWriteOnParent = canWriteOnParent;
        ret.zoom = parentgconfig.ZoomLevel;
    }
    projectplan.loadProject(ret);
    projectplan.checkpoint(); //empty the undo stack

    // initdropdownmenus(projectplan);
}

//Convert from jsondata to tree json
function datatotree(task, phaseid) {
    // console.log("Tasks",task);
    var treedata = [];
    $.each(task, function (idx, tas) {
      // console.log("tas.hasOwnProperty(tas.Files)",tas.Files);
        var ttask = {};
        ttask.id = tas.project_plan_trans_id_pk;
        ttask.name = tas.task_name;
        // ttask.name = tas.Taskname;
        if (phaseid == 1) {
            ttask.primaryowner = (tas.primary_owner === '[object Object]') ? '' : tas.primary_owner;
            ttask.secondaryowner = (tas.secondary_owner === '[object Object]') ? '' : tas.secondary_owner;
            // ttask.primaryowner = 1;
            // ttask.secondaryowner = 1;
        }
        else {
            // ttask.primaryowner = (tas.primary_owner === undefined ? {} : tas.PrimaryOwner);
            // ttask.secondaryowner = (tas.secondary_owner === undefined ? {} : tas.SecondaryOwner);
            ttask.primaryowner =((tas.primary_owner === '') ? {} : (tas.primary_owner === undefined ? {} : {"userid":tas.primary_owner,"username" :""}));
            ttask.secondaryowner = ((tas.secondary_owner === '') ? {} : (tas.secondary_owner === undefined ? {} : {"userid":tas.secondary_owner,"username" :""}));
        }
        ttask.duration = tas.duration;
        // ttask.duration = tas.Duration;
        var startDate;
        if (tas.start_date !== "") {
            var stdate = new Date(tas.start_date);
            startDate =(stdate.getMonth() + 1) + '/' + stdate.getDate() + '/' +  stdate.getFullYear();
        }

         var endDate;
        if (tas.end_date !== "") {
            var endate = new Date(tas.end_date);
            endDate =(endate.getMonth() + 1) + '/' + endate.getDate() + '/' +  endate.getFullYear();
        }
        ttask.start = gettimestamp((tas.start_date === "")? getFormattedDate(new Date()) : startDate);
        ttask.end = gettimestamp((tas.end_date === "")? getFormattedDate(new Date()) : endDate);
        // ttask.start = gettimestamp((tas.Startdate === "")? getFormattedDate(new Date()): tas.Startdate);
        // ttask.end = gettimestamp((tas.Enddate === "")? getFormattedDate(new Date()): tas.Enddate);
        ttask.startday = tas.start_day;
        ttask.endday = tas.end_day;
        ttask.status = tas.status;
        
        ttask.progress = tas.progress_percent;
        ttask.depends = tas.precedence;
        ttask.level = tas.parent_id;
        ttask.hasChild = tas.haschild;
        ttask.startIsMilestone = tas.startIsMilestone;

         ttask.files=[];
         if (tas.Files !== undefined) {
             var filesdetails = alasql("SELECT * FROM ? ORDER BY attachment_uploaded_date DESC",[tas.Files]);
             $.each(filesdetails, function (idx, files) {
                var filedet={};
                filedet.filepath = files.attachment_file_path;
                // filedet.fileext = files.Extension;
                filedet.filename = files.attachment_original_file_name;
                filedet.tempfilename = files.attachment_temp_file_name;
                filedet.size = files.attachment_file_size;  
                filedet.projectplanId = files.project_plan_trans_id_fk;               
                filedet.uploadedby =  files.attachment_uploaded_by;
                filedet.uploadedbyName =  alasql("SELECT value FROM ? WHERE id = ?",[parentgconfig.projectUser,files.attachment_uploaded_by])[0].value;//
                filedet.uploadedon = files.attachment_uploaded_date;
                filedet.fileid = files.attachment_id_pk;
                filedet.isuploaded=true;
                ttask.files.push(filedet);
             });
         }

         ttask.comments = [];
         if (tas.comment !== undefined) {
          var commentsdetails = alasql("SELECT * FROM ? ORDER BY comments_date DESC",[tas.comment]);
            $.each(commentsdetails, function (idx, comm) {
                var commdet={};
                commdet.Comments = comm.comments_desc;  
                commdet.ProjectsPlanTaskId = comm.project_plan_trans_id_fk;               
                commdet.CommentsBy =  comm.comments_uploaded_by;
                commdet.commentsUser =  alasql("SELECT value FROM ? WHERE id = ?",[parentgconfig.projectUser,comm.comments_uploaded_by])[0].value;//
                commdet.CommentOn = comm.comments_date;
                commdet.CommentsID = comm.comments_id_pk;
                commdet.isInserted = true;
                ttask.comments.push(commdet);
             });
         }
        // ttask.files = tas.Files;
        //        ttask.TreeId = (idx + 1);
        
        // ttask.hasChild = tas.isChecked;
       
        ttask.ishighlevelplan = tas.ishighLevelPlan;
        ttask.actualstartdate = tas.actual_startdate;
        ttask.actualenddate = tas.actual_enddate;
        treedata.push(ttask);
    });
    return treedata;
}

function getFormattedDate(date) {
  var year = date.getFullYear();
  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;
  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  // console.log("Formatted Date",month + '/' + day + '/' + year);
  return month + '/' + day + '/' + year;
}


function saveInLocalStorage() {
  var prj = ge.saveProject();
  if (localStorage) {
    localStorage.setObject("teamworkGantDemo", prj);
  } else {
    // $("#ta").val(JSON.stringify(prj));
    proPlanTask=JSON.stringify(prj);
  }
}


function addEmptyRowTemplate(tr) {
    $.each(rowSet, function (i, row) {
  var tds;
  if (row.visibility) {
            if (row.celltype) {
                if (row.celltype == 'th'){
                     tds= $("<th>");
                }
                else{
                    tds = $("<td>");
                }
            } else {
                tds = $("<td>");
            }
            var variable = row.id;
            if (row.dvalue) {
                variable = row.dvalue;
            }
            $(tds).addClass('gdfCell');
            if (row.splclass) {
                $(tds).addClass(row.splclass);
            }
            if (row.align) {
                $(tds).attr('align', row.align);
            }

            $(tr).append(tds);
        }
    });
    return tr;
}

function addRowTemplate(tr) {
    $.each(rowSet, function (i, row) {
    var tds;
    var temp ;
        if (row.visibility) {
            if (row.celltype) {
                if (row.celltype === 'th'){
                    tds = $("<th>");
                }
                else{
                    tds = $("<td>");
                }
            } else {
                tds = $("<td>");
            }
            var variable = row.id;
            if (row.dvalue) {
                variable = row.dvalue;
            }
            $(tds).addClass('gdfCell');
            if (row.splclass) {
                $(tds).addClass(row.splclass);
            }
            if (row.align) {
                $(tds).attr('align', row.align);
            }
            if (row.style) {
                $(tds).attr('style', row.style);
            }
            if (row.tdData.length > 0) {
                $.each(row.tdData, function (i, obj) {
                    for (var key in obj) {
                        $(tds).attr(obj[key]); //'data-' + 
                    }
                });
            }
            if (row.editable && !row.customHTML) {
                if (row.type === 'text') {
                    temp = document.createElement("input");
                    temp.setAttribute('type', row.type);
                    temp.setAttribute('name', row.id);
                    temp.setAttribute('value', "(#=obj." + row.id + "?obj." + row.id + ":''#)");
                    //temp.type = row.type;
                    //temp.name = row.id;
                    //temp.value ="(#=obj."+row.id+"?obj."+row.id+":''#)";
                    $(temp).addClass(row.id);
                } else if (row.type == 'select') {
                    temp = document.createElement("select");
                    temp.name = row.id;
                    $(temp).addClass(row.id);
                    //                        $(temp).append('<option value="" text="--Select ' + row.name + '--">' + row.name + '</option>');
                    $(temp).append('<option value="" text="--Select--">--Select--</option>');
                    if (row.options) {
                        var dyvar = row.options;
                        // console.log('dyvar--',parentgconfig[dyvar]);
                        var opt = parentgconfig[dyvar];
                        if (opt && opt.length > 0) {
                            $.each(opt, function (i, opts) {
                                $(temp).append('<option value="' + opts.id + '" text="' + opts.value + '">' + opts.value + '</option>');
                            });
                        }
                    }
                }
            } else if (row.customHTML) {
                temp = row.customHTML;
                temp = temp.replace(new RegExp('{{' + variable + '}}', 'gi'), 0);
            } else {
                temp = '';
            }
            $(tds).append(temp);
            $(tr).append(tds);
            //alert(tds);
        }
    });
    return tr;
}


//Columns Rowset
function getROWSET(phaseId) {
    phaseId = parseInt(phaseId,10);
    var rowset = [];
    switch (phaseId) {
        case 1:
            rowset = [
      { 'id': 'id', 'ishideshow': false, 'name': '', 'type': 'text', 'visibility': true, 'editable': false, 'customHTML': '<span class="taskRowIndex">(#=obj.getRow()+1#)</span>', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': 'edit dragHandle', 'editableRegion': '', 'options': '', 'style': 'width:35px;', 'resizable': false, 'celltype': 'th', 'align': 'right', 'storage': 'number' }, /*<span class="teamworkIcon" style="font-size:12px;" >e</span>*/
      {'id': 'chk', 'ishideshow': false, 'name': '', 'type': 'text', 'visibility': true, 'editable': false, 'customHTML': '<input type="checkbox" name="chk[]" class="chkstyle"/>', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': 'chkstyle', 'editableRegion': '', 'options': '', 'style': 'width:30px;', 'resizable': false, 'celltype': '', 'align': 'center', 'storage': 'boolean' },/*'storage': 'number', */
      { 'id': 'status', 'ishideshow': false, 'name': 'Status', 'type': 'select', 'visibility': true, 'editable': true, 'customHTML': '', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': 'projectTaskStatus', 'style': 'width:100px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'number' },
      { 'id': 'code', 'ishideshow': false, 'name': 'Code', 'type': 'text', 'visibility': false, 'editable': true, 'customHTML': '', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': 'projectTaskStatus', 'style': 'width:25px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'string' },
      { 'id': 'name', 'ishideshow': true, 'name': 'Task Description', 'type': 'text', 'visibility': true, 'editable': true, 'customHTML': '<div class="(#=obj.isParent()?\'exp-controller expcoll exp\':\'exp-controller\'#)" align="center"></div><input type="text" name="name" value="(#=obj.name#)" title="(#=obj.name#)">', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': 'indentCell', 'editableRegion': 'span.editablearea', 'options': '', 'style': 'width:300px;padding-left:(#=obj.level*10#)px;', 'resizable': true, 'celltype': '', 'align': '', 'storage': 'string' },
      { 'id': 'primaryowner', 'ishideshow': true, 'name': 'Primary Owner', 'type': 'text', 'visibility': true, 'editable': true, 'customHTML': '', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:110px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'string' },
      { 'id': 'secondaryowner', 'ishideshow': true, 'name': 'Secondary Owner', 'type': 'text', 'visibility': true, 'editable': true, 'customHTML': '', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:117px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'string' },
      { 'id': 'duration', 'ishideshow': true, 'name': 'Duration', 'type': 'text', 'visibility': true, 'editable': true, 'customHTML': '', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:57px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'number' },
      { 'id': 'start', 'ishideshow': true, 'name': 'Start Date', 'type': 'text', 'visibility': true, 'editable': true, 'customHTML': '', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': 'date', 'editableRegion': '', 'options': '', 'style': 'width:70px; text-align:center;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'number' },
      { 'id': 'end', 'ishideshow': true, 'name': 'End Date', 'type': 'text', 'visibility': true, 'editable': true, 'customHTML': '', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': 'date', 'editableRegion': '', 'options': '', 'style': 'width:70px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'string' },
      { 'id': 'depends', 'ishideshow': true, 'name': 'Predecessors', 'type': 'text', 'visibility': true, 'editable': true, 'customHTML': '', 'customHeaderHTML': '', 'tdData': [{ 'condition': '(#=obj.hasExternalDep?"readonly":""#)'}], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:100px;text-align:center;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'string' },
      { 'id': 'startday', 'ishideshow': true, 'name': 'Start Day', 'type': 'text', 'visibility': true, 'editable': false, 'customHTML': '<tt>Day<tt> <input type="text" style="width:28px;" name="startday" readonly value="" class="startday">', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:64px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'number' },
      { 'id': 'endday', 'ishideshow': true, 'name': 'End Day', 'type': 'text', 'visibility': true, 'editable': false, 'customHTML': '<tt>Day<tt> <input type="text" style="width:28px;" name="endday" readonly value="" class="endday">', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:60px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'number' },
      { 'id': 'progress', 'ishideshow': true, 'name': 'Progress', 'type': 'text', 'visibility': true, 'editable': false, 'customHTML': '<input type="text" name="progress" readonly value="(#=obj.progress#)" class="progress">', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:60px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'number' },
      { 'id': 'progressbar', 'ishideshow': true, 'name': 'Progress Bar', 'type': 'text', 'visibility': true, 'editable': false, 'customHTML': '<div class="progress"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: (#=obj.progress#)%"><span class="sr-only">(#=obj.progress#)</span></div></div>', 'customHeaderHTML': '', 'tdData': [], 'dvalue': 'progress', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:80px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'number' },
      { 'id': 'files', 'ishideshow': true, 'name': 'Files', 'type': 'text', 'visibility': true, 'editable': false, 'customHTML': '<span class="fileinput-button high-light" style="border-radius: 5px;padding: 4px;font-size: 15px;color: green;cursor:pointer;"><i class="fa fa-plus-square" title="Attach Files"></i><i class="fa fa-paperclip paper-clip" title="Attach Files"></i></span></a>', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:40px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'array' },
      { 'id': 'comments', 'ishideshow': true, 'name': 'Comments', 'type': 'text', 'visibility': true, 'editable': false, 'customHTML': '<a class="default pb comments high-light"  data-toggle="modal" data-close-others="true"><i class="fa fa-comments-o previewfile" style="cursor:pointer;font-size: 17px;" title="click to view the comments"></i></a>', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:75px;', 'resizable': false, 'celltype': '', 'storage': 'array' }
            ];
            projectplanACL();
            break;
        case 2:
            rowset = [
      { 'id': 'id', 'ishideshow': false, 'name': '', 'type': 'text', 'visibility': true, 'editable': false, 'customHTML': '<span class="taskRowIndex">(#=obj.getRow()+1#)</span>', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': 'edit dragHandle fixcol', 'editableRegion': '', 'options': '', 'style': 'width:35px;', 'resizable': false, 'celltype': 'th', 'align': 'right', 'storage': 'number' },
      { 'id': 'chk', 'ishideshow': false, 'name': '', 'type': 'text', 'visibility': true, 'editable': false, 'customHTML': '<input type="checkbox" name="chk[]" class="chkstyle"/>', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': 'chkstyle fixcol', 'editableRegion': '', 'options': '', 'style': 'width:30px;', 'resizable': false, 'celltype': '', 'align': 'center', 'storage': 'boolean' }, /*'storage': 'number', */
            { 'id': 'status', 'ishideshow': false, 'name': 'Status', 'type': 'select', 'visibility': true, 'editable': true, 'customHTML': '', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': 'fixcol', 'editableRegion': '', 'options': 'projectTaskStatus', 'style': 'width:100px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'number' },
      { 'id': 'code', 'ishideshow': false, 'name': 'Code', 'type': 'text', 'visibility': false, 'editable': true, 'customHTML': '', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': 'fixcol', 'editableRegion': '', 'options': '', 'style': 'width:25px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'string' },
      { 'id': 'name', 'ishideshow': true, 'name': 'Task Description', 'type': 'text', 'visibility': true, 'editable': true, 'customHTML': '<div class="(#=obj.isParent()?\'exp-controller expcoll exp\':\'exp-controller\'#)" align="center"></div><input type="text" name="name" value="(#=obj.name#)" title="(#=obj.name#)">', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': 'indentCell fixcol', 'editableRegion': 'span.editablearea', 'options': '', 'style': 'width:300px;padding-left:(#=obj.level*10#)px;', 'resizable': true, 'celltype': '', 'align': '', 'storage': 'string' },
      { 'id': 'primaryowner', 'ishideshow': true, 'name': 'Primary Owner', 'type': 'select', 'visibility': true, 'editable': true, 'customHTML': '', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': 'projectUser', 'style': 'width:110px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'string' },
      { 'id': 'secondaryowner', 'ishideshow': true, 'name': 'Secondary Owner', 'type': 'select', 'visibility': true, 'editable': true, 'customHTML': '', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': 'projectUser', 'style': 'width:117px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'string' },
      { 'id': 'duration', 'ishideshow': true, 'name': 'Duration', 'type': 'text', 'visibility': true, 'editable': true, 'customHTML': '', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:57px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'number' },
      { 'id': 'start', 'ishideshow': true, 'name': 'Start Date', 'type': 'text', 'visibility': true, 'editable': true, 'customHTML': '', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': 'date', 'editableRegion': '', 'options': '', 'style': 'width:70px; text-align:center;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'number' },
      { 'id': 'end', 'ishideshow': true, 'name': 'End Date', 'type': 'text', 'visibility': true, 'editable': true, 'customHTML': '', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': 'date', 'editableRegion': '', 'options': '', 'style': 'width:70px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'string' },
      { 'id': 'depends', 'ishideshow': true, 'name': 'Predecessors', 'type': 'text', 'visibility': true, 'editable': true, 'customHTML': '', 'customHeaderHTML': '', 'tdData': [{ 'condition': '(#=obj.hasExternalDep?"readonly":""#)'}], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:100px;text-align:center;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'string' },
      { 'id': 'startday', 'ishideshow': true, 'name': 'Start Day', 'type': 'text', 'visibility': true, 'editable': false, 'customHTML': '<tt>Day<tt> <input type="text" style="width:28px;" name="startday" readonly value="" class="startday">', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:64px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'number' },
      { 'id': 'endday', 'ishideshow': true, 'name': 'End Day', 'type': 'text', 'visibility': true, 'editable': false, 'customHTML': '<tt>Day<tt> <input type="text" style="width:28px;" name="endday" readonly value="" class="endday">', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:60px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'number' },
      { 'id': 'progress', 'ishideshow': true, 'name': 'Progress', 'type': 'text', 'visibility': true, 'editable': true, 'customHTML': '<input type="text" name="progress" readonly value="(#=obj.progress#)" class="progress">', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:60px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'number' },
      { 'id': 'progressbar', 'ishideshow': true, 'name': 'Progress Bar', 'type': 'text', 'visibility': true, 'editable': false, 'customHTML': '<div class="progress"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: (#=obj.progress#)%"><span class="sr-only">(#=obj.progress#)</span></div></div>', 'customHeaderHTML': '', 'tdData': [], 'dvalue': 'progress', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:87px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'number' },
      { 'id': 'files', 'ishideshow': true, 'name': 'Files', 'type': 'text', 'visibility': true, 'editable': false, 'customHTML': '<span class="fileinput-button high-light" style="border-radius: 5px;padding: 4px;font-size: 15px;color: green;cursor:pointer;"><i class="fa fa-plus-square" title="Attach Files"></i><i class="fa fa-paperclip paper-clip" title="Attach Files"></i></span></a>', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:40px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'array' },
      { 'id': 'comments', 'ishideshow': true, 'name': 'Comments', 'type': 'text', 'visibility': true, 'editable': false, 'customHTML': '<a class="default pb comments high-light"  data-toggle="modal" data-close-others="true"><i class="fa fa-comments-o previewfile" style="cursor:pointer;font-size: 17px;" title="click to view the comments"></i></a>', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:75px;', 'resizable': false, 'celltype': '', 'storage': 'array' }
      ];
       projectplanACL();
       break;
        default:
     rowset = [
      { 'id': 'id', 'ishideshow': false, 'name': '', 'type': 'text', 'visibility': true, 'editable': false, 'customHTML': '<span class="taskRowIndex">(#=obj.getRow()+1#)</span>', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': 'edit', 'editableRegion': '', 'options': '', 'style': 'width:35px;', 'resizable': false, 'celltype': 'th', 'align': 'right', 'storage': 'number' },
      { 'id': 'chk', 'ishideshow': false, 'name': '', 'type': 'text', 'visibility': true, 'editable': false, 'customHTML': '<input type="checkbox" name="chk[]" class="chkstyle"/>', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': 'chkstyle', 'editableRegion': '', 'options': '', 'style': 'width:30px;', 'resizable': false, 'celltype': '', 'align': 'center',  'storage': 'boolean' }, /*'storage': 'number',*/
      { 'id': 'status', 'ishideshow': false, 'name': 'Status', 'type': 'select', 'visibility': true, 'editable': true, 'customHTML': '', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': 'projectTaskStatus', 'style': 'width:100px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'number' },
      { 'id': 'code', 'ishideshow': false, 'name': 'Code', 'type': 'text', 'visibility': false, 'editable': true, 'customHTML': '', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:25px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'string' },
      { 'id': 'name', 'ishideshow': true, 'name': 'Task Description', 'type': 'text', 'visibility': true, 'editable': true, 'customHTML': '<div class="(#=obj.isParent()?\'exp-controller expcoll exp\':\'exp-controller\'#)" align="center"></div><input type="text" name="name" value="(#=obj.name#)" title="(#=obj.name#)">', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': 'indentCell', 'editableRegion': 'span.editablearea', 'options': '', 'style': 'width:300px;padding-left:(#=obj.level*10#)px;', 'resizable': true, 'celltype': '', 'align': '', 'storage': 'string' },
      { 'id': 'primaryowner', 'ishideshow': true, 'name': 'Primary Owner', 'type': 'select', 'visibility': true, 'editable': true, 'customHTML': '', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': 'projectUser', 'style': 'width:110px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'string' },
      { 'id': 'secondaryowner', 'ishideshow': true, 'name': 'Secondary Owner', 'type': 'select', 'visibility': true, 'editable': true, 'customHTML': '', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': 'projectUser', 'style': 'width:117px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'string' },
      { 'id': 'duration', 'ishideshow': true, 'name': 'Duration', 'type': 'text', 'visibility': true, 'editable': true, 'customHTML': '', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width::57px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'number' },
      { 'id': 'start', 'ishideshow': true, 'name': 'Start Date', 'type': 'text', 'visibility': true, 'editable': true, 'customHTML': '', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': 'date', 'editableRegion': '', 'options': '', 'style': 'width:70px;text-align:center;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'number' },
      { 'id': 'end', 'ishideshow': true, 'name': 'End Date', 'type': 'text', 'visibility': true, 'editable': true, 'customHTML': '', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': 'date', 'editableRegion': '', 'options': '', 'style': 'width:70px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'string' },
      { 'id': 'depends', 'ishideshow': true, 'name': 'Predecessors', 'type': 'text', 'visibility': true, 'editable': true, 'customHTML': '', 'customHeaderHTML': '', 'tdData': [{ 'condition': '(#=obj.hasExternalDep?"readonly":""#)'}], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:100px;text-align:center;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'string' },
      { 'id': 'startday', 'ishideshow': true, 'name': 'Start Day', 'type': 'text', 'visibility': true, 'editable': false, 'customHTML': '<tt>Day<tt> <input type="text" style="width:28px;" name="startday" readonly value="" class="startday">', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:64px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'number' },
      { 'id': 'endday', 'ishideshow': true, 'name': 'End Day', 'type': 'text', 'visibility': true, 'editable': false, 'customHTML': '<tt>Day<tt> <input type="text" style="width:28px;" name="endday" readonly value="" class="endday">', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:60px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'number' },
      { 'id': 'progress', 'ishideshow': true, 'name': 'Progress', 'type': 'text', 'visibility': true, 'editable': false, 'customHTML': '<input type="text" name="progress" readonly value="(#=obj.progress#)" class="progress">', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:60px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'number' },
      { 'id': 'progressbar', 'ishideshow': true, 'name': 'Progress Bar', 'type': 'text', 'visibility': true, 'editable': false, 'customHTML': '<div class="progress"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: (#=obj.progress#)%"><span class="sr-only">(#=obj.progress#)</span></div></div>', 'customHeaderHTML': '', 'tdData': [], 'dvalue': 'progress', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:87px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'number' },
      { 'id': 'files', 'ishideshow': true, 'name': 'Files', 'type': 'text', 'visibility': true, 'editable': false, 'customHTML': '<span class="fileinput-button high-light" style="border-radius: 5px;padding: 4px;font-size: 15px;color: green;cursor:pointer;"><i class="fa fa-plus-square" title="Attach Files"></i><i class="fa fa-paperclip paper-clip" title="Attach Files"></i></span></a>', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:40px;', 'resizable': false, 'celltype': '', 'align': '', 'storage': 'array' },
       { 'id': 'comments', 'ishideshow': true, 'name': 'Comments', 'type': 'text', 'visibility': true, 'editable': false, 'customHTML': '<a class="default pb comments high-light"  data-toggle="modal" data-close-others="true"><i class="fa fa-comments-o previewfile" style="cursor:pointer;font-size: 17px;" title="click to view the comments"></i></a>', 'customHeaderHTML': '', 'tdData': [], 'dvalue': '', 'splclass': '', 'editableRegion': '', 'options': '', 'style': 'width:75px;', 'resizable': false, 'celltype': '', 'storage': 'array' }
         ];
          if (phaseId == 3)//onHold
          {
              canWrite = true;
              canWriteOnParent = true;
              isneedCxtmenu = true;
              isneedDragdrop = true;
              projectplanACL();
          }
          else {
              canWrite = false;
              canWriteOnParent = false;
              isneedCxtmenu = false;
              isneedDragdrop = false;
          }
        break;
    }
    return rowset;
}

function projectplanACL(){
  if (pageLevelACL === 2) {
      canWrite = false;
      canWriteOnParent = false;
      isneedCxtmenu = false;
      isneedDragdrop = false;
  }else if(pageLevelACL === 3){
      if (parentgconfig.isapprovalmail === 1 || parentgconfig.isclientapproved === 1) {
        canWrite = false;
        canWriteOnParent = false;
        isneedCxtmenu = false;
        isneedDragdrop = false;
     }else{
        canWrite = true;
        canWriteOnParent = false;
        isneedCxtmenu = false;
        isneedDragdrop = false;
     }
  }else if (pageLevelACL === 4) {
     if (parentgconfig.isapprovalmail === 1 || parentgconfig.isclientapproved === 1) {
        canWrite = false;
        canWriteOnParent = false;
        isneedCxtmenu = false;
        isneedDragdrop = false;
     }else{
        canWrite = true;
        canWriteOnParent = true;
        isneedCxtmenu = true;
        isneedDragdrop = true;
     }
  }
}


function ppACL() {

    $('[data-moduleid]').each(function () {
        if (pageLevelACL === 2) {
          $(this).attr('disabled','disabled');  
          
          if (loggedUserRole === 2) {
            if ($(this).attr('id') === 'sendmailtoclient' || $(this).attr('id') === 'sendmailtoclientsep') {
                 // $(this).attr('disabled','disabled');
                 $(this).hide();                     
            }
            if ($(this).attr('id') === 'clientapprove' || $(this).attr('id') === 'clientapprovesep') {
                 // $(this).attr('disabled','disabled');
                 if (parentgconfig.isapprovalmail === 1 && parentgconfig.isclientapproved === 0) {
                    $(this).removeAttr('disabled');  
                 }else{
                    $(this).hide();
                 }
            }
          }
        }else if(pageLevelACL === 3){
          $('[__template=TASKEMPTYROW]').off('click');
          if ($(this).attr('id') === 'phaseopt') {
             $(this).attr('disabled','disabled');
          }
        }else if(pageLevelACL === 4)
        {
            if (loggedUserRole !== 1 || parentgconfig.CurrentprojectPlanPhase.PlanphaseId !==2) {
                if ($(this).attr('id') === 'sendmailtoclient' || $(this).attr('id') === 'sendmailtoclientsep') {
                   // $(this).attr('disabled','disabled');
                   $(this).hide();
                }
             }
            if ($(this).attr('id') === 'clientapprove' || $(this).attr('id') === 'clientapprovesep') {
                 // $(this).attr('disabled','disabled');
                 $(this).hide();
            }

            if (parentgconfig.isapprovalmail === 1 || parentgconfig.isclientapproved === 1) {
               $(this).attr('disabled','disabled');
               
            }
            // else{
            //      if (loggedUserRole !== 1 || parentgconfig.CurrentprojectPlanPhase.PlanphaseId !==2) {
            //         if ($(this).attr('id') === 'sendmailtoclient' || $(this).attr('id') === 'sendmailtoclientsep') {
            //            // $(this).attr('disabled','disabled');
            //            $(this).hide();                     
            //         }
            //      }
            // }

        }
        
    });
}


function gettimestamp(datetime) {
    //var dateParts = datetime.match(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)/);
    var dateParts = datetime.match(/(\d+)\/(\d+)\/(\d+)/);
    var date = new Date(dateParts[3], parseInt(dateParts[1], 10) - 1, dateParts[2]);
    return date.getTime(); //1379426880000
}



window.downloadFile = function (sUrl) {

    //iOS devices do not support downloading. We have to inform user about this.
    if (/(iP)/g.test(navigator.userAgent)) {
        alert('Your device do not support files downloading. Please try again in desktop browser.');
        return false;
    }

    //If in Chrome or Safari - download via virtual link click
    if (window.downloadFile.isChrome || window.downloadFile.isSafari) {
        //Creating new link node.
        var link = document.createElement('a');
        link.href = sUrl;

        if (link.download !== undefined) {
            //Set HTML5 download attribute. This will prevent file from opening if supported.
            var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
            link.download = fileName;
        }

        //Dispatching click event.
        if (document.createEvent) {
            var e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
            return true;
        }
    }

    // Force file download (whether supported by server).
    var query = '?download';

    window.open(sUrl + query, '_self');
};

window.downloadFile.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
window.downloadFile.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;

  function showGantt(el){
    angular.element(document.getElementById('projectPlan')).scope().hideGantt(el.checked);
    //var show
    if (el.checked) {
        //show = true;
        var wid = $('.splitElement.splitBox2').width();
        var lft = $('.splitElement.splitBox2').position().left;
        $('.splitElement.splitBox2').css("left", (lft + wid - 20) + "px");
        $('.splitElement.splitBox2').css("width", "20px");
        wid += $('.splitElement.splitBox1').width() - 20;
        $('.splitElement.splitBox1').css("width", (wid) + "px");
        $('.splitElement.vSplitBar').css("left", (wid) + "px");
        $('.gdfTable').css("width", "100%");
    }else{
        splresize(60);
        //show = false;
    }
  }

  function splresize(newPerc){
        perc=newPerc ? newPerc : 0;
        var totW=splele.width();
        var realW=splfirstbox.get(0).scrollWidth;
        var newW=totW*this.perc/100;
        newW=newW > 0 ? newW:0;
        newW=newW < realW?newW : realW;
        splfirstbox.css({width:newW});
        splitbar.css({left:newW});
       splsecondBox.css({left:newW + splitbar.width(),width:totW - newW - splitbar.width()});
  }

  function getOptions(el,id){
      var status = el.checked;
      var val = id;
      if (status) {
          parentgconfig.hideshowoptions.push(el.name);          
          $('.gdfTable tr th:nth-child(' + val + '),.gdfTable tr td:nth-child(' + val + ')').show();
      }
      else {
           $('.gdfTable tr th:nth-child(' + val + '),.gdfTable tr td:nth-child(' + val + ')').hide();
          parentgconfig.hideshowoptions = $.grep(parentgconfig.hideshowoptions, function (e) {
              return e != el.name;
          });
      }
      shwhidcol();
  }

function initdropdownmenus(master)
{
  var obj = $('.showhidecol');
    collist = '';
    $.each(rowSet, function (idx, rec) {
        if (rec.ishideshow === true) {
            collist += '<input type="checkbox" name="'+rec.name+'" onClick="getOptions(this,'+idx+');"  text="' + rec.name + '" value="' + idx + '" /> ' + rec.name + ' <br/>';
        }
    });
    obj.html(collist);

    var list = $('.showhidecol input');
    if (parentgconfig.hideshowoptions === '' || parentgconfig.hideshowoptions === null || parentgconfig.hideshowoptions === undefined || parentgconfig.hideshowoptions.length === 0) {
        parentgconfig.hideshowoptions = [];
        list.each(function (index) {
            item = $(this);
            parentgconfig.hideshowoptions.push(item.attr('name'));
            item.attr('checked', true);
        });        
    }
    else {
        list.each(function (index) {
            item = $(this);
            if (parentgconfig.hideshowoptions.indexOf(item.attr('name')) != -1) {
                item.attr('checked', true);
            }
        });
    }
    // console.log("Load",parentgconfig.hideshowoptions);
    $('#showhidecol').click(function () {
        // var ttop = ($(this).position().top + 33);
        // var lleft = ($(this).position().left);
        // $('.showhidecol').css({ "top": ttop + "px", "left": lleft + "px" });
        $('.showhidecol').slideToggle();

        // $('.showhidecol input[type=checkbox]').click(function () {
        //   console.log($(this));
        //     console.log(($(this).attr('checked')));
        //     var val = $(this).val();
        //     var item = $(this).attr('text');
        //     var status = ($(this).attr('checked') === 'checked' ? true : false);
            
        //     if (status) {
        //         parentgconfig.hideshowoptions.push(item);
        //         console.log(parentgconfig.hideshowoptions);
        //         console.log(val);
        //         $('.gdfTable tr th:nth-child(' + val + '),.gdfTable tr td:nth-child(' + val + ')').show();
        //     }
        //     else {
        //         $('.gdfTable tr th:nth-child(' + val + '),.gdfTable tr td:nth-child(' + val + ')').hide();
        //         parentgconfig.hideshowoptions = $.grep(parentgconfig.hideshowoptions, function (e) {
        //             return e != item;
        //         });
        //     }
        //     // shwhidcol();
        // });
    });

  $('button[title=highlevelplan]').click(function () {
        var obj = $(this);
        // var ttop = ($(this).position().top + 33);
        // var lft = ($(this).position().left);
        // $('.highlevelplanmnu').css({ "top": ttop + "px", "left": lft + "px" });
        $('.highlevelplanmnu').slideToggle();
        $("body").off("click", ".highlevelplanmnu ul li");

        $("body").on("click", ".highlevelplanmnu ul li", function () {
            //$('.highlevelplanmnu ul li').click(function () {
            $('.highlevelplanmnu').slideUp();

            var txt = $(this).attr('id');
            if (txt == '11') {
                highlighthighlevel(master);
            }
            else {
                savehighlevel(master);
            }
        });
    });

    var highlighthighlevel = function (mas) {
        $('.gdfTable tbody .taskEditRow').each(function () {
            var taskid = $(this).attr('taskid');
            var obj = $(this);
            var tasks = mas.tasks;            
            $.each(tasks, function (i, tas) {
                if (tas.id == taskid) {
                    obj.find('input[type=checkbox]').prop('checked', tas.ishighlevelplan ? tas.ishighlevelplan : false);
                }
            });
        });
    };

    var savehighlevel = function (mas) {
        $('.gdfTable tbody .taskEditRow').each(function () {
            var taskid = $(this).attr('taskid');
            var obj = $(this);
            var tasks = mas.tasks;
            $.each(tasks, function (i, tas) {
                if (tas.id == taskid) {
                    tas.ishighlevelplan = obj.find('input[type=checkbox]').prop('checked');
                }
            });
            obj.find('input[type=checkbox]').prop('checked', false);
        });
        mas.saveGanttOnServer(true);
        //$('.gdfTable tbody .taskEditRow').find('input[type=checkbox]').prop('checked', false);
    };

  $('button[title=phaseoptions]').click(function () {
        parentgconfig.phaseenable = ajaxServiceCall("caseTracker/projectplan/getEnabledPhase", "POST", '{"projectId" : '+ parentgconfig.projectID +' , "currentPhaseID" : '+parentgconfig.phaseID+'}').EnabledPhaseID;        
        // var obj1 = $('.phasemnu').find('.dropdown-menu');
        var obj1 = $('.phasemnu');
        var phaselist = '<ul style="padding:0;">';
        $.each(parentgconfig.projectPlanStatus, function (idx, rec) {
            var isfound = false;
            $.each(parentgconfig.phaseenable, function (i, r) {
                if (r == rec.PhaseID) {
                    isfound = true; 
                    if (!parentgconfig.isProposal && rec.PhaseID == 2 ) {                      
                      phaselist += '<li class=""><a class="" id=' + rec.PhaseID + '>' + rec.PhaseName + '</a></li>';      
                    }else{
                      phaselist += '<li class="active"><a class="active" id=' + rec.PhaseID + '>' + rec.PhaseName + '</a></li>';
                    }
                }
            });
            if (!isfound) {
                phaselist += '<li class=""><a class="" id=' + rec.PhaseID + '>' + rec.PhaseName + '</a></li>';
            }
        });
        phaselist += '</ul>';
        obj1.html(phaselist);

        obj1.find('ul li.active').click(function () {
            // $('.phasemnu').slideUp('slow');
            obj1.find('ul li').removeClass('ct');
            $(this).addClass('ct');
            var paseid = $(this).find('a').attr('id');
            var pasename = $(this).find('a').text();
            

            // parentgconfig.CurrentprojectPlanPhase = { "PlanphaseId": paseid, "planphasename": pasename };
            $('#phasename').text(pasename);

            // console.log(master.tasks);
            var mas = master;
            phaseChanged = true;
            if (paseid == 2) {
                $.each(mas.tasks, function (idx, tas) {
                    tas.primaryowner = {};
                    tas.secondaryowner = {};
                });
            }

            parentgconfig.phaseID = parseInt(paseid,10);
            var status = projectplan.autosaveGanttOnServer();
            if (status !== true) {
                return;
            }else{
              // var curphaseDet =ajaxServiceCall("caseTracker/projectplan/getCurrentPhase", "POST", '{"projectId" : '+ parentgconfig.projectID +'}');
              // parentgconfig.CurrentprojectPlanPhase = { "PlanphaseId": curphaseDet.PropDet[0].PhaseID, "planphasename": curphaseDet.PropDet[0].PhaseName };
              // parentgconfig.phaseID = curphaseDet.PropDet[0].PhaseID;
              // parentgconfig.isProposal = curphaseDet.Isproposal;
              // initdropdownmenus(master);
            }
            parent.$('.projectactionlist li a.active').click();
        });
        $('.phasemnu').slideToggle();
      });

    $('button[title=SaveasTemplate]').on('mouseover',function () {
        $(this).attr('title','Save as Template');
    });

    $('button[title=SaveasTemplate]').on('mouseleave',function () {
        $(this).attr('title','SaveasTemplate');
    });

    $('button[title=SaveasTemplate]').click(function () {
        $('#templatemodal').modal('show');
        $("#templatemodal").find("#btnTempSave").click(function(){
          // console.log(projectplan.tasks);
            var templateName = $("#templatemodal").find("#txtName").val();
            var templateDesc =  $("#templatemodal").find("#txtComments").val();
            var status=false;
              if (templateName !== '' || templateDesc !== '') {
                status =true;
              }else{
                  if (templateName === '') {
                    alert('Please Enter Template Name');
                    return;
                  }else if(templateDesc === ''){
                    alert('Please Enter Template Description');
                    return;
                  }
              }
              if (status) {
                  var param = {};
                  param.tempName = templateName;
                  param.tempDesc = templateDesc;
                  param.userID = parentgconfig.userID;
                  param.tasks = [];
                  param.tasks = tempTreedata(projectplan.tasks);
                  var res = ajaxServiceCall("caseTracker/projectplan/saveTemplate", "POST", JSON.stringify(param));
                  if (res.result) {
                     successMsg("Project Plan", "Template Saved successfully .");
                     $('#templatemodal').modal('hide');
                  }
              }
        });
    });
    
    $('button[title=signoff]').on('mouseover',function () {
        $(this).attr('title','sign off');
    });

    $('button[title=signoff]').on('mouseleave',function () {
        $(this).attr('title','signoff');
    });

    $('button[title=signoff]').click(function () {
        $('#clientsignoffmodal').modal('show');
        $("#clientsignoffmodal").find("#btnClientApprove").click(function(){
            BootstrapDialog.confirm('Do you want to Approve the Project Plan ?', function(result){
                if(result) {  
                  initiateClientApproval(1);     
                }
            });
        });

        $("#clientsignoffmodal").find("#btnClientReject").click(function(){
            BootstrapDialog.confirm('Do you want to Reject the Project Plan ?', function(result){
                if(result) {  
                  initiateClientApproval(0);     
                }
            });
          });
      });
    
    var initiateClientApproval =function (status){
        var clientComment =  $("#clientsignoffmodal").find("#txtComments").val();
        var valstatus=false;
          if (clientComment !== '') {
            valstatus =true;
          }else{
             alert('Please enter the comments.');
             return;
          }
          if (valstatus) {
              var param = {};
              param.projectID = parentgconfig.projectID;
              param.clientComments = clientComment;
              param.clientStatus = status;
              param.projectName = selectedProjectName;
              param.clientName = loggedUserName;
              console.log(param);
              var res = ajaxServiceCall("caseTracker/projectplan/clientApproval", "POST", JSON.stringify(param));
              if (res.status) {
                 successMsg("Project Plan", "Mail has been sent to Manager");
                 angular.element(document.getElementById('projectPlan')).scope().reloadPage();
                 $('#clientsignoffmodal').modal('hide');
              }else{
                successMsg("Project Plan", "Mail not sent to Manager");
                angular.element(document.getElementById('projectPlan')).scope().reloadPage();
                 $('#clientsignoffmodal').modal('hide');
              }
          }
    };
    shwhidcol();
}

function tempTreedata(task) {
    var treedata = [];
    $.each(task, function (idx, tas) {
        var ttask = {};        
        ttask.Taskname = tas.name;        
        ttask.Duration = tas.duration;
        ttask.Startday = tas.startday;
        ttask.Endday = tas.endday;
        ttask.Predecessors = tas.depends;
        ttask.Parentid = tas.level;
        ttask.hasChild = tas.hasChild;
        treedata.push(ttask);
    });
  // console.log("treedata",treedata);
    return treedata;
  }

function shwhidcol() {
    if (parentgconfig.hideshowoptions !== null && parentgconfig.hideshowoptions !== '') {
        $.each(rowSet, function (index, column) {
            if (column.ishideshow === true) {
                column.visibility = false;
            }
        });
        $.each(parentgconfig.hideshowoptions, function (idx, rec) {
            $.each(rowSet, function (index, column) {
                if (column.name === rec) {
                    column.visibility = true;
                }
            });
        });
    }

    $.each(rowSet, function (index, column) {
        if (column.ishideshow === true) {
            var status = column.visibility;
            if (status) {
                $('.gdfTable tr th:nth-child(' + index + '),.gdfTable tr td:nth-child(' + index + ')').show();
            }
            else {
                $('.gdfTable tr th:nth-child(' + index + '),.gdfTable tr td:nth-child(' + index + ')').hide();
            }
        }
    });
    //$('.gdfTable').css("width", "100%");
    $('table.gdfTable:not(.fixCol)').css("width", "100%");
}
