(function() {
  angular.module('builder.components', ['builder', 'validator.rules']).config([
    '$builderProvider', function($builderProvider) {
      $builderProvider.registerComponent('textInput', {
        group: 'Default',
        label: 'Text Input',
        description: 'description',
        placeholder: 'placeholder',
        required: false,
        hideOptions: false,
        validationOptions: [
          {
            label: 'none',
            rule: '/.*/'
          }, {
            label: 'number',
            rule: '[number]'
          }, {
            label: 'email',
            rule: '[email]'
          }, {
            label: 'url',
            rule: '[url]'
          }
        ],
        template: "<div class=\"col-md-6 form-group\" ng-hide=\"{{hideOptions}}\">\n    <label for=\"{{formName+index}}\" class=\"col-sm-4 control-label\" ng-class=\"{'fb-required':required}\">{{label}}</label>\n    <div class=\"col-sm-8\">\n        <input type=\"text\" ng-model=\"inputText\" validator-required=\"{{required}}\" validator-group=\"{{formName}}\" id=\"{{formName+index}}\" class=\"form-control\" placeholder=\"{{placeholder}}\"/>\n        <p class='help-block'>{{description}}</p>\n    </div>\n</div>",
        popoverTemplate: "<form>\n    <div class=\"form-group\">\n        <label class='control-label'>Label</label>\n        <input type='text' ng-model=\"label\" validator=\"[required]\" class='form-control'/>\n    </div>\n    <div class=\"form-group\">\n        <label class='control-label'>Description</label>\n        <input type='text' ng-model=\"description\" class='form-control'/>\n    </div>\n    <div class=\"form-group\">\n        <label class='control-label'>Placeholder</label>\n        <input type='text' ng-model=\"placeholder\" class='form-control'/>\n    </div>\n    <div class=\"checkbox\">\n        <label>\n            <input type='checkbox' ng-model=\"required\" />\n            Required</label>\n    </div>\n    <div class=\"form-group\" ng-if=\"validationOptions.length > 0\">\n        <label class='control-label'>Validation</label>\n        <select ng-model=\"$parent.validation\" class='form-control' ng-options=\"option.rule as option.label for option in validationOptions\"></select>\n    </div>\n\n    <hr/>\n    <div class='form-group'>\n        <input type='submit' ng-click=\"popover.save($event)\" class='btn btn-primary' value='Save'/>\n        <input type='button' ng-click=\"popover.cancel($event)\" class='btn btn-default' value='Cancel'/>\n        <input type='button' ng-click=\"popover.remove($event)\" class='btn btn-danger' value='Delete'/>\n    </div>\n</form>"
      });
      $builderProvider.registerComponent('textArea', {
        group: 'Default',
        label: 'Text Area',
        description: 'description',
        placeholder: 'placeholder',
        required: false,
        hideOptions: false,
        template: "<div class=\"col-md-12 form-group\" ng-hide=\"{{hideOptions}}\">\n    <label for=\"{{formName+index}}\" class=\"col-sm-2 control-label\" ng-class=\"{'fb-required':required}\">{{label}}</label>\n    <div class=\"col-sm-9\">\n        <textarea type=\"text\" ng-model=\"inputText\" validator-required=\"{{required}}\" validator-group=\"{{formName}}\" id=\"{{formName+index}}\" class=\"form-control\" placeholder=\"{{placeholder}}\"/>\n        <p class='help-block'>{{description}}</p>\n    </div>\n</div>",
        popoverTemplate: "<form>\n    <div class=\"form-group\">\n        <label class='control-label'>Label</label>\n        <input type='text' ng-model=\"label\" validator=\"[required]\" class='form-control'/>\n    </div>\n    <div class=\"form-group\">\n        <label class='control-label'>Description</label>\n        <input type='text' ng-model=\"description\" class='form-control'/>\n    </div>\n    <div class=\"form-group\">\n        <label class='control-label'>Placeholder</label>\n        <input type='text' ng-model=\"placeholder\" class='form-control'/>\n    </div>\n    <div class=\"checkbox\">\n        <label>\n            <input type='checkbox' ng-model=\"required\" />\n            Required</label>\n    </div>\n\n    <hr/>\n    <div class='form-group'>\n        <input type='submit' ng-click=\"popover.save($event)\" class='btn btn-primary' value='Save'/>\n        <input type='button' ng-click=\"popover.cancel($event)\" class='btn btn-default' value='Cancel'/>\n        <input type='button' ng-click=\"popover.remove($event)\" class='btn btn-danger' value='Delete'/>\n    </div>\n</form>"
      });
      /*$builderProvider.registerComponent('checkbox', {
        group: 'Default',
        label: 'Checkbox',
        description: 'description',
        placeholder: 'placeholder',
        required: false,
        hideOptions: false,
        options: ['value one', 'value two'],
        arrayToText: true,
        template: "<div class=\"col-md-6 form-group\" ng-hide=\"{{hideOptions}}\">\n    <label for=\"{{formName+index}}\" class=\"col-sm-4 control-label\" ng-class=\"{'fb-required':required}\">{{label}}</label>\n    <div class=\"col-sm-8\">\n        <input type='hidden' ng-model=\"inputText\" validator-required=\"{{required}}\" validator-group=\"{{formName}}\"/>\n        <div class='checkbox' ng-repeat=\"item in options track by $index\">\n            <label><input type='checkbox' ng-model=\"$parent.inputArray[$index]\" value='item'/>\n                {{item}}\n            </label>\n        </div>\n        <p class='help-block'>{{description}}</p>\n    </div>\n</div>",
        popoverTemplate: "<form>\n    <div class=\"form-group\">\n        <label class='control-label'>Label</label>\n        <input type='text' ng-model=\"label\" validator=\"[required]\" class='form-control'/>\n    </div>\n    <div class=\"form-group\">\n        <label class='control-label'>Description</label>\n        <input type='text' ng-model=\"description\" class='form-control'/>\n    </div>\n    <div class=\"form-group\">\n        <label class='control-label'>Options</label>\n        <textarea class=\"form-control\" rows=\"3\" ng-model=\"optionsText\"/>\n    </div>\n    <div class=\"checkbox\">\n        <label>\n            <input type='checkbox' ng-model=\"required\" />\n            Required\n        </label>\n    </div>\n\n    <hr/>\n    <div class='form-group'>\n        <input type='submit' ng-click=\"popover.save($event)\" class='btn btn-primary' value='Save'/>\n        <input type='button' ng-click=\"popover.cancel($event)\" class='btn btn-default' value='Cancel'/>\n        <input type='button' ng-click=\"popover.remove($event)\" class='btn btn-danger' value='Delete'/>\n    </div>\n</form>"
      });
      $builderProvider.registerComponent('radio', {
        group: 'Default',
        label: 'Radio',
        description: 'description',
        placeholder: 'placeholder',
        required: false,
        hideOptions: false,
        options: ['value one', 'value two'],
        template: "<div class=\"col-md-6 form-group\" ng-hide=\"{{hideOptions}}\">\n    <label for=\"{{formName+index}}\" class=\"col-sm-4 control-label\" ng-class=\"{'fb-required':required}\">{{label}}</label>\n    <div class=\"col-sm-8\">\n        <div class='radio' ng-repeat=\"item in options track by $index\">\n            <label><input name='{{formName+index}}' ng-model=\"$parent.inputText\" validator-group=\"{{formName}}\" value='{{item}}' type='radio'/>\n                {{item}}\n            </label>\n        </div>\n        <p class='help-block'>{{description}}</p>\n    </div>\n</div>",
        popoverTemplate: "<form>\n    <div class=\"form-group\">\n        <label class='control-label'>Label</label>\n        <input type='text' ng-model=\"label\" validator=\"[required]\" class='form-control'/>\n    </div>\n    <div class=\"form-group\">\n        <label class='control-label'>Description</label>\n        <input type='text' ng-model=\"description\" class='form-control'/>\n    </div>\n    <div class=\"form-group\">\n        <label class='control-label'>Options</label>\n        <textarea class=\"form-control\" rows=\"3\" ng-model=\"optionsText\"/>\n    </div>\n\n    <hr/>\n    <div class='form-group'>\n        <input type='submit' ng-click=\"popover.save($event)\" class='btn btn-primary' value='Save'/>\n        <input type='button' ng-click=\"popover.cancel($event)\" class='btn btn-default' value='Cancel'/>\n        <input type='button' ng-click=\"popover.remove($event)\" class='btn btn-danger' value='Delete'/>\n    </div>\n</form>"
      });*/
      $builderProvider.registerComponent('date', {
        group: 'Default',
        label: 'Date',
        description: '',
        placeholder: 'mm/dd/yyyy',
        required: false,
        hideOptions: false,
        templateUrl: 'layout/directive-template/date.html',
        popoverTemplateUrl: 'layout/popover-template/dateTemplate.html'
      });
      $builderProvider.registerComponent('time', {
        group: 'Default',
        label: 'Time',
        description: '',
        placeholder: 'hh:ss',
        required: false,
        hideOptions: false,
        templateUrl: 'layout/directive-template/time.html',
        popoverTemplateUrl: 'layout/popover-template/timeTemplate.html'
      });
      $builderProvider.registerComponent('dropDown', {
          group: 'predefined',
          label: 'Select Box',
          description: 'description',
          placeholder: 'placeholder',
          required: false,
          hideOptions: false,
          options: [],
          preOptions : '',
          preOptionsList: [],
          dependency : '',
          dependencyOptions: [],
          functionCall : '',
          templateUrl: 'layout/directive-template/dropdown.html',
          popoverTemplateUrl: 'layout/popover-template/dropdown.html'
      });
      $builderProvider.registerComponent('emailTemplate', {
          group: 'predefined',
          label: 'Email Template',
          description: '',
          placeholder: 'Select Email Template',
          required: false,
          hideOptions: false,
          options: [],
          preOptions : '',
          preOptionsList: [],
          dependency : '',
          dependencyOptions: [],
          functionCall : '',
          templateUrl: 'layout/directive-template/email.html',
          popoverTemplateUrl: 'layout/popover-template/emailTemplate.html'
      });
      return $builderProvider.registerComponent('select', {
        group: 'Default',
        label: 'Select',
        description: 'description',
        placeholder: 'placeholder',
        required: false,
        hideOptions: false,
        options: ['value one', 'value two'],
        template: "<div class=\"col-md-6 form-group\" ng-hide=\"{{hideOptions}}\">\n    <label for=\"{{formName+index}}\" class=\"col-sm-4 control-label\">{{label}}</label>\n    <div class=\"col-sm-8\">\n        <select ng-options=\"value for value in options\" id=\"{{formName+index}}\" class=\"form-control\"\n            ng-model=\"inputText\" ng-init=\"inputText = options[0]\"/>\n        <p class='help-block'>{{description}}</p>\n    </div>\n</div>",
        popoverTemplate: "<form>\n    <div class=\"form-group\">\n        <label class='control-label'>Label</label>\n        <input type='text' ng-model=\"label\" validator=\"[required]\" class='form-control'/>\n    </div>\n    <div class=\"form-group\">\n        <label class='control-label'>Description</label>\n        <input type='text' ng-model=\"description\" class='form-control'/>\n    </div>\n    <div class=\"form-group\">\n        <label class='control-label'>Options</label>\n        <textarea class=\"form-control\" rows=\"3\" ng-model=\"optionsText\"/>\n    </div>\n\n    <hr/>\n    <div class='form-group'>\n        <input type='submit' ng-click=\"popover.save($event)\" class='btn btn-primary' value='Save'/>\n        <input type='button' ng-click=\"popover.cancel($event)\" class='btn btn-default' value='Cancel'/>\n        <input type='button' ng-click=\"popover.remove($event)\" class='btn btn-danger' value='Delete'/>\n    </div>\n</form>"
      });
    }
  ]);

}).call(this);
