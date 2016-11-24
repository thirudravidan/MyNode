/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  /**
   * The `build_dir` folder is where our projects are compiled during
   * development and the `compile_dir` folder is where our app resides once it's
   * completely built.
   */
  build_dir: 'build',
  compile_dir: 'bin',

  /**
   * This is a collection of file patterns that refer to our app code (the
   * stuff in `src/`). These file paths are used in the configuration of
   * build tasks. `js` is all project javascript, less tests. `ctpl` contains
   * our reusable components' (`src/common`) template HTML files, while
   * `atpl` contains the same, but for our app's code. `html` is just our
   * main HTML file, `less` is our main stylesheet, and `unit` contains our
   * app's unit tests.
   */
  app_files: {
    js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
    // jsunit: [ 'src/**/*.spec.js' ],
    
    // coffee: [ 'src/**/*.coffee', '!src/**/*.spec.coffee' ],
    // coffeeunit: [ 'src/**/*.spec.coffee' ],

    atpl: [ 'src/app/**/*.tpl.ejs' ],
    ctpl: [ 'src/common/**/*.tpl.ejs' ],

    html: [ 'src/index.ejs', 'src/error.ejs','src/customtemplate/acute.select.htm' ],
    less: 'src/less/main.less'
  },

  /**
   * This is a collection of files used during testing only.
   */
  test_files: {
    js: [
      'vendor/angular-mocks/angular-mocks.js'
    ]
  },

  /**
   * This is the same as `app_files`, except it contains patterns that
   * reference vendor code (`vendor/`) that we need to place into the build
   * process somewhere. While the `app_files` property ensures all
   * standardized files are collected for compilation, it is the user's job
   * to ensure non-standardized (i.e. vendor-related) files are handled
   * appropriately in `vendor_files.js`.
   *
   * The `vendor_files.js` property holds files to be automatically
   * concatenated and minified with our project source files.
   *
   * The `vendor_files.css` property holds any CSS files to be automatically
   * included in our app.
   *
   * The `vendor_files.assets` property holds any assets to be copied along
   * with our app's assets. This structure is flattened, so it is not
   * recommended that you use wildcards.
   */
  vendor_files: {
    js: [
      'vendor/angular/angular.js',
      'vendor/angular-route/angular-route.js',
      'vendor/angular-cookies/angular-cookies.js',
      'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',      
      'vendor/ngSlimscroll/src/js/ngSlimscroll.js',
      'vendor/jquery/dist/jquery.js',
      'vendor/ng-ckeditor/libs/ckeditor/ckeditor.js',
      'vendor/ng-ckeditor/ng-ckeditor.js',

      'vendor/bootstrap/dist/js/bootstrap.js',
      'vendor/AdminLTE/plugins/fastclick/fastclick.js',
      'vendor/AdminLTE/plugins/slimScroll/jquery.slimscroll.js',
      'vendor/AdminLTE/dist/js/app.js',
      'vendor/select2/dist/js/select2.full.js',
      'vendor/AdminLTE/dist/js/demo.js',
      'vendor/AdminLTE/plugins/datatables/jquery.dataTables.js',
      'vendor/AdminLTE/plugins/datatables/dataTables.bootstrap.js',
      'vendor/bootstrap/js/validator.js',
      'vendor/bootstrap/js/tooltip.js',
      'vendor/bootstrap3-dialog/src/js/bootstrap-dialog.js',
      'vendor/bootstrap-datepicker/dist/js/bootstrap-datepicker.js',
      'vendor/ng-table/dist/ng-table.js',
      'vendor/angular-xeditable/dist/js/xeditable.js',
      'vendor/alasql/dist/alasql.js',
      'vendor/alasql/console/xlsx.core.min.js',
      // <!--ProjectPlan-->
      'gantt/libs/jquery.livequery.min.js',      
      'gantt/libs/platform.js',
      'gantt/libs/date.js',
      'gantt/libs/i18nJs.js',
      'gantt/libs/jquery.timers.js',
      'gantt/libs/JST/jquery.JST.js',
      'gantt/libs/jquery.svg.min.js',
      'gantt/libs/jquery.svgdom.1.8.js',
      'gantt/libs/source/ganttUtilities.js',
      'gantt/libs/source/ganttTask.js',
      'gantt/libs/source/ganttDrawerSVG.js',
      'gantt/libs/source/ganttGridEditor.js',
      'gantt/libs/source/ganttMaster.js',
      'gantt/libs/idle-timer.js',
      'vendor/orgchart/js/jquery.orgchart.js',
      'vendor/moment/moment.js',
      //File Upload
      'vendor/ng-file-upload/dist/ng-file-upload-shim.js',
      'vendor/ng-file-upload/dist/ng-file-upload.js',
      //Angular Show Errors
      'vendor/angular-bootstrap-show-errors/src/showErrors.js',
      //Angular Tag Input
      'vendor/ng-tags-input/ng-tags-input.js',
      'acuteselect/acute.select.js',

      'vendor/nsPopover/src/nsPopover.js',

      'customautocomplete/ui-bootstrap-tpls-0.9.0.js',
      'vendor/gldatepicker/glDatePicker.js',
      'vendor/Chart.js/Chart.js',
      'vendor/angular-chart.js/dist/angular-chart.js',
      'vendor/countdown/flipclock.js',
      'vendor/bootstrap-datepaginator-master/dist/bootstrap-datepaginator.min.js',
      'vendor/clock/jClocksGMT.js',
      'vendor/clock/jquery.rotate.js',
      'vendor/d3/d3.js',
      'vendor/nvd3/build/nv.d3.js',
      'vendor/angular-nvd3/dist/angular-nvd3.js',
      'vendor/ngSlimscroll/src/js/ngSlimscroll.js',
      'vendor/angu-fixed-header-table/angu-fixed-header-table.js',
      'vendor/scroll/scrollhorizontal/jquery.mCustomScrollbar.concat.min.js',
      'gantt/ng-socket-io.js'
    ],
    css: [
      'vendor/ng-table/dist/ng-table.less',
		  'vendor/bootstrap/less/bootstrap-dialog.min.less',
		  'vendor/bootstrap3-dialog/src/less/bootstrap-dialog.less',
      'vendor/angular-xeditable/dist/css/xeditable.css',
      'vendor/bootstrap-datepicker/dist/css/bootstrap-datepicker.css',
      'gantt/libs/jquery.svg.css',
      'gantt/libs/dateField/jquery.dateField.css',
      'vendor/orgchart/css/jquery.orgchart.css',
      'vendor/animate.css/animate.css',
      'vendor/select2/dist/css/select2.css',
      //Angular Tag Input
      'vendor/ng-tags-input/ng-tags-input.css',
      'acuteselect/acute.select.css',
      'vendor/textAngular/dist/textAngular.css',
      'customautocomplete/css/autocomplete.css',
      'vendor/ng-ckeditor/ng-ckeditor.css',
      'vendor/angular-chart.js/dist/angular-chart.css',
      'vendor/gldatepicker/glDatePicker.default.css',
      // 'vendor/gldatepicker/glDatePicker.flatwhite.css',
      'vendor/countdown/flipclock.css',
      'vendor/bootstrap-datepaginator-master/dist/bootstrap-datepaginator.min.css',
      'vendor/clock/jClocksGMT.css',
      //Chart
      'vendor/nvd3/build/nv.d3.css',
      'vendor/scroll/scrollhorizontal/jquery.mCustomScrollbar.css',
      'vendor/scroll/scrollhorizontal/style.css',
      //fixed header
  

            
    ],
    assets: [

    ]
  },
};