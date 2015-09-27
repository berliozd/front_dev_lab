/**
 * Created by Berlioz on 25/09/2015.
 */

var dashboard = dashboard || {};

(function(dashboard) {

  dashboard.scriptingBeginnerController = (function () {
    "use strict";

    var ScriptType = {
      REGLE: "REGLE",
      CRON: "CRON"
    };
    var ActionType = {
      SMS: "SMS",
      EMAIL: "EMAIL",
      DEVICE: "DEVICE", // Devrait être ACTION : "ACTION" conformément à l'enum java
      PUSH: 'PUSH'
    };
    var ConditionType = {
      VU: "VU",
      GT: "GT",
      LT: "LT",
      EQ: "EQ",
      NEQ: "NEQ"
    };
    var Condition = function () {
      return {
        deviceId: "",
        deviceName: "",
        datatypeId: "",
        datatypeUnit: "",
        datatypeTypeData: "",
        datatypeValues: [],
        conditionType: null,
        compareValue: "0",
        compareLabel: ""
      };
    };
    var SmsAction = function () {
      return {
        phoneNumber: "",
        content: ""
      };
    };
    var PushAction = function () {
      return {
        mobileId: "",
        pushTitle: "",
        pushContent: ""
      };
    };
    var EmailAction = function () {
      return {
        email: "",
        title: "",
        content: ""

      };
    };
    var TriggerAction = function () {
      return {
        deviceId: "",
        actionValue: ""
      };
    };
    var CronPeriodicity = function () {
      return {
        days: "",
        hours: "12",
        minutes: "00"
      };
    };
    var CronDetails = function () {
      return {
        days: {
          value: "",
          label: ""
        },
        hours: {
          value: "12",
          label: "12 h"
        },
        minutes: {
          value: "00",
          label: "00 min"
        },
        setDayFrequency: function (value, label) {
          this.days.value = value;
          this.days.label = label;
        },
        setHours: function (value, label) {
          if (value !== null) {
            this.hours.value = value;
            this.hours.label = label;
          }
        },
        setMinutes: function (value, label) {
          if (value !== null) {
            this.minutes.value = value;
            this.minutes.label = label;
          }
        },
        toLabel: function () {
          var at = I18N.page.scripting.blocklyless.at;
          return '' + this.days.label + ' ' + at + ' ' + this.hours.label + ' ' + this.minutes.label;
        },
        toCronPattern: function () {
          return '0 ' + this.minutes.value + ' ' + this.hours.value + ' ? * ' + this.days.value;
        },
        toCronPeriodicity: function () {
          var cp = new CronPeriodicity();
          cp.days = this.days.value;
          cp.hours = this.hours.value;
          cp.minutes = this.minutes.value;
          return cp;
        }

      };
    };
    var cronDetails = new CronDetails();
    var cronPattern = "";

    // MAIN MODEL : WILL BE SENT IN JSON TO SERVER ------------------------------

    var scriptModel = {
      name: "",
      description: "",
      type: ScriptType.CRON,
      cronPeriodicity: new CronPeriodicity(),
      regleConditions: [],
      actions: []
    };

    // CONSTS & VARIABLES ---------------------------------------------------------

    var PREVIOUS_STEP_BTN = '.wizard .actions a[href="#previous"]';
    var NEXT_STEP_BTN = '.wizard .actions a[href="#next"],.wizard .actions a[href="#finish"]';
    var VIEW_MORE_ICON = '<span class="fa fa-angle-right viewMoreIcon"></span>';
    var DEFAULT_SELECTED_CONDITION_TYPE = ConditionType.VU;
    var URLS;
    var userJsonDevices;
    var userJsonActionneurDevices = [];
    var userJsonPhonesDevices = [];
    var scriptId;

    var isModificationMode = function () {
      return scriptId !== '';
    };
    var defineUrls = function (ctxPath) {
      var partnerUrlPart = '?partner=' + urlUtils.getParameter('partner', window.location.href) || '';

      URLS = {
        baseScripting: ctxPath + '/page/scripting' + partnerUrlPart,
        devicesAsJson: ctxPath + '/devices',

        createBeginnerScript: ctxPath + "/script/beginner",
        updateBeginnerScript: ctxPath + "/script/beginner/{scriptId}",
        getMobilesAsJson: ctxPath + "/connectedUser/mobileInfos",
        beginnerScript: ctxPath + "/script/beginner",
        getScript: ctxPath + "/page/scripting/script/" + scriptId

      };
    };
    var filterDevicesBySwitch = function (devicesAsJson) {
      var filteredList = [];
      for (var i = 0; i < devicesAsJson.length; i++) {
        if (devicesAsJson[i].dataType.category == 'ACTIONNEUR' && devicesAsJson[i].dataType.href.contains('switchOnOff')) {
          filteredList.push(devicesAsJson[i]);
        }
      }
      return filteredList;
    };
    var loadMobilesList = function () {
      $.ajax({
        url: URLS.getMobilesAsJson,
        type: "GET",
        contentType: 'application/json; charset=utf-8',
      }).done(function (responseText, textStatus, xhr) {
        console.log(responseText);
        for (var i = 0; i < responseText.length; i++) {
          userJsonPhonesDevices.push(responseText[i]);
        }
        userJsonPhonesDevices = responseText;
        console.log('NEWLY UPDATED MOBILE LIST 3' + userJsonPhonesDevices);
        initMobileDeviceSelect();
      }).fail(function (responseObject, textStatus, xhr) {
        console.log(responseObject);
        console.log(textStatus);
        console.log("ERROR : impossible to retreive the mobiles");
      });

    };
    // LOAD ALL USER DEVICES
    var loadDevices = function () {
      if (isModificationMode()) {
        $('.page-title > h1').text(I18N.page.scripting.modifyTitle);
        UI.loader('.page-title > h1', 'spinner');
      }
      $.ajax({
        url: URLS.devicesAsJson,
        type: "GET",
        contentType: 'application/json; charset=utf-8',
      }).done(function (responseText, textStatus, xhr) {

        userJsonDevices = responseText;
        userJsonActionneurDevices = filterDevicesBySwitch(responseText);
        initAllDeviceSelect();
        initActionneurDeviceSelect();
        if (typeof userJsonDevices === 'undefined' || userJsonDevices.length === 0) {

          // do stuff
          displayAction(false, I18N.page.scripting.blocklyless.noDevices,
            '#chooseDeviceLabel', 'a');
          return;
        }
        if (isModificationMode()) {
          loadScriptModel();
        }

      }).fail(function (responseObject, textStatus, xhr) {
        console.log("ERROR : impossible to retrieve user devices");
      }).always(function () {

      });
    };
    var randomText = function () {
      var text = I18N.page.scripting.blocklyless.randomScenario + ' ';
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    };
    var enableNexStepBtn = function (value) {
      if (value) {
        $(NEXT_STEP_BTN).parent().removeClass("disabled");
        $(NEXT_STEP_BTN).css("pointer-events", "auto");
      } else {
        $(NEXT_STEP_BTN).parent().addClass("disabled");
        $(NEXT_STEP_BTN).css("pointer-events", "none");
      }
    };
    // Cette fonction permet de valider la demande de changement de step.
    var validateStepChange = function (event, currentIndex, newIndex) {
      var result = true;
      switch (currentIndex) {
        case 0:
          result = $('#step1Form')[0].checkValidity();
          break;
        case 1:
          break;
        case 2:
          break;
        default:
      }
      return result;
    };
    var displayAction = function (actionEnabled, disabledMessage, actionContainerClass, element) {
      if (actionEnabled === false) {
        $(actionContainerClass).css({
          'opacity': '.5',
          'cursor': 'default'
        });
        $(actionContainerClass).find(element).css({
          'cursor': 'default'
        });
        $(actionContainerClass).find(element + ' .error').remove();
        $(actionContainerClass).find(element).append('<span class="error"> ' + disabledMessage + '</span>');
        $(actionContainerClass).off();
      }
    };
    var prepareDisplayStep = function (currentIndex, newIndex) {

      if (newIndex === 0) {
        $(PREVIOUS_STEP_BTN).css({
          'visibility': 'hidden'
        });
        enableNexStepBtn(true);
        console.log('user Actionneurs: ' + userJsonActionneurDevices);
        console.log('user Mobile: ' + userJsonPhonesDevices);
      } else {
        $(PREVIOUS_STEP_BTN).css({
          'visibility': 'visible'
        });
      }
      if (newIndex == 1) {
        console.log('user Actionneurs: ' + userJsonActionneurDevices);
        $('.step1Container').hide();
        $('#' + scriptModel.type.toLowerCase() + 'Step1Container').show();
        scriptModel.name = $('#scriptName').val();
        $('.scriptNameLabel').text(scriptModel.name);
        enableNexStepBtn(false);
        console.log('scriptModel', scriptModel);
        if (scriptModel.regleConditions.length) {
          if ($(':radio[name="device"]:checked').val() === scriptModel.regleConditions[0].deviceId) {
            enableNexStepBtn(true);
          }
        }
      } else if (newIndex == 2) {
        console.log('user Mobile: ' + userJsonPhonesDevices);
        $('.step2Container').hide();
        $('#cronStep2Container').show();
        displayAction(userJsonActionneurDevices.length > 0,
          I18N.page.scripting.blocklyless.noActionneurAvailable,
          '.action-container', 'label');
        displayAction(userJsonPhonesDevices.length > 0,
          I18N.page.scripting.blocklyless.noMobileAvailable, '.push-container',
          'label');
        updateStep2ConditionLabel();
      }
    };
    var onDisplayStep = function (currentIndex) {
      var dispNextBtn = true;
      switch (currentIndex) {
        case 1:
          switch (scriptModel.type) {
            case ScriptType.CRON:
              dispNextBtn = cronPattern !== "";
              break;
            case ScriptType.REGLE:
              dispNextBtn = (scriptModel.regleConditions.length > 0 &&
              scriptModel.regleConditions[0].deviceId !== "" &&
              scriptModel.regleConditions[0].conditionType !== "" &&
              typeof $(':radio[name="device"]:checked').val() !== "undefined");
              break;
          }
          break;
        case 2:
          dispNextBtn = (scriptModel.actions.length > 0);
          break;
      }
      enableNexStepBtn(dispNextBtn);
    };
    //LOAD EXISTING SCENARIO
    var loadScriptModel = function () {
      $.ajax({
        url: URLS.getScript,
        type: 'GET',
        dataType: 'json',
      })
        .done(function (responseText, err, xhr) {
          // Set script model global object
          scriptModel = responseText.meta;
          updateView(scriptModel);
          $('.loader-icon').removeClass('fa-spin fa-spinner');
          $('.loader-icon').addClass('fa-check');
          $('.loader-icon').css({
            'color': '#5cb85c'
          });
        })
        .fail(function () {
          console.log("error");

        })
        .always(function () {
          setTimeout(function () {
            UI.loaderRemover('.loader-icon');
          }, 2000);
        });
    };
    var updateView = function (scriptModel) {
      console.log("updateView scriptModel=", scriptModel);

      var action = scriptModel.actions[0],
        typeOfScript = scriptModel.type,
        isCron = (typeOfScript === ScriptType.CRON),
        typeOfAction = action.type,
        selectedActionValue = $('#step2 input:checked').val();

      $('#scriptName').val(scriptModel.name);
      UI.setAsChecked(':radio[name="scriptTypeInput"][value=' + typeOfScript + ']');
      $(':radio[name="scriptTypeInput"][value=' + typeOfScript + ']').attr('checked', 'checked');

      // Set rule fields
      if (!isCron) {
        var deviceId = scriptModel.regleConditions[0].deviceId;
        var condition = scriptModel.regleConditions[0];
        var deviceFound = false;

        $(':radio[name="device"]').each(function () {
          if ($(this).val() === deviceId) {
            UI.setAsChecked(':radio[name="device"][id="' + deviceId + '"]');
            deviceFound = true;
          } else {
            $(this).prop('checked', false);
          }

        });
        chooseDeviceUpdate(null, $('#chooseDeviceModal'), false, deviceFound);
        $('#regleTypeLabel').trigger('click');

        // Condition
        prepareConditionValuesFields();
        UI.setAsChecked(':radio[name="condition"][value=' + condition.conditionType + ']');

        // Get selected condition
        var selectedCondition = getSelectedCondition();

        if (selectedCondition.datatypeTypeData === 'ENUM') {
          $('#receiveDataInput').attr('disabled', 'disabled');
          UI.setAsChecked(':radio[name="conditionEnumValue"][value=' + condition.compareValue + ']');
        } else {
          $('#receiveDataInput').removeAttr('disabled');
          $('#receiveDataInput').val(condition.compareValue);
        }

        $('#chooseConditionModal .validation').trigger('click');

      }

      // Set cron fields
      if (isCron) {
        var cronScheduleDay = '"' + scriptModel.cronPeriodicity.days + '"';
        var cronScheduleHour = functionUtils.pad(scriptModel.cronPeriodicity.hours);
        var cronScheduleMinute = functionUtils.pad(scriptModel.cronPeriodicity.minutes);

        UI.setAsChecked(':radio[name="day-of-the-week"][value=' + cronScheduleDay + ']');
        UI.setAsSelected('.selectHours option[value=' + cronScheduleHour + ']');
        UI.setAsSelected('.selectMinutes option[value=' + cronScheduleMinute + ']');
        $('#cronModal .validation').trigger('click');
      }

      // Actions
      UI.setAsChecked('#step2 input[value=' + typeOfAction + ']');
      console.log('selectedActionValue ' + typeOfAction);
      if (typeOfAction == ActionType.SMS) {
        $('#smsNumberInput').val(action.phoneNumber);
        $('#smsContentTA').val(action.content);
        $('#smsModal .validation').trigger('click');
      } else if (typeOfAction == ActionType.EMAIL) {
        $('#emailDestInput').val(action.email);
        $('#emailObjectTA').val(action.title);
        $('#emailContentTA').val(action.content);
        $('#emailModal .validation').trigger('click');
      } else if (typeOfAction == ActionType.PUSH) {
        $('#pushNotificationTitle').val(action.pushTitle);
        $('#pushContentTa').val(action.pushContent);
        UI.setAsChecked(':radio[name="push"][value=' + action.mobileId + ']');
        $('#pushModal .validation').trigger('click');
      } else {
        UI.setAsChecked(':radio[name="switch"][value=' + action.deviceId + ']');
        UI.setAsChecked(':radio[name="onOffValue"][value=' + action.actionValue + ']');
        $('#actionModal .validation').trigger('click');
      }
    };
    // INIT WIZARD (CREATION)
    var initWizard = function () {
      var $form = $(".wizardWrapper .wizardContainer").show();

      $form.steps({
        bodyTag: "div",
        /*transitionEffect: "slideLeft",*/
        onStepChanging: function (event, currentIndex, newIndex) {
          var result = true;
          if (currentIndex <= newIndex) {
            result = validateStepChange(event, currentIndex, newIndex);
          }
          if (result) {
            prepareDisplayStep(currentIndex, newIndex);
          }
          return result;
        },
        onStepChanged: function (event, currentIndex, priorIndex) {
          onDisplayStep(currentIndex);
          printScriptModel();
        },
        onFinished: function (event, currentIndex) {
          submitWizard(event);
        },
        labels: {
          cancel: I18N.general.cancelMsg,
          current: I18N.page.scripting.blocklyless.current,
          pagination: I18N.page.scripting.blocklyless.pagination,
          finish: I18N.page.scripting.blocklyless.finish,
          next: I18N.page.scripting.blocklyless.next,
          previous: I18N.page.scripting.blocklyless.previous,
          loading: I18N.page.scripting.blocklyless.loading
        }
      })
        /*.validate({
         errorPlacement: function errorPlacement(error, element) {
         element.before(error);
         },
         rules: {
         confirm: {
         equalTo: "#password-2"
         }
         }
         })*/
      ;
      $(PREVIOUS_STEP_BTN).css({
        'visibility': 'hidden'
      });
      $('.number').each(function (index) {
        $(this).text($(this).text().replace(".", ""));
      });

      $(NEXT_STEP_BTN).on('click', function () {
        var $form = $('#step1Form');
        var formValid = $form[0].checkValidity();
        if (!formValid) {
          $('<button type="submit">').hide().appendTo($('#step1Form')).click().remove();
        }
      });

    };
    // INIT STEPS FROM CURRENT MODEL
    var initStepsFromModel = function () {
      $('#' + scriptModel.type.toLowerCase() + 'TypeLabel').trigger('click');
    };
    // SUBMIT STEPS
    var submitWizard = function (event) {
      printScriptModel();
      // SEND TO SERVER THE JSON !
      sendtoServer(event);
    };
    // JUST PRINT MODEL IN CONSOLE FOR DEBBUG
    var printScriptModel = function () {
      var jsonModel = JSON.stringify(scriptModel);
      console.log("jsonScriptModel", jsonModel);
    };
    var sendtoServer = function (event) {
      console.log("Sending json to server ...");
      var $submitBtn = $(event.target).find('.actions li');
      $submitBtn.addClass('disabled');

      // Contextually set url and method
      var url = URLS.beginnerScript;
      var method = 'POST';
      if (isModificationMode()) {
        url += '/' + scriptId;
        method = 'PUT';
      }

      $.ajax({
        url: url,
        type: method,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(scriptModel)
      })
        .done(function (responseText, textStatus, xhr) {
          var message = $(responseText).find('#statusMessageData').data('message');
          var messageType = $(responseText).find('#statusMessageData').data('message-type');
          var params = [];
          params.push({
            name: "message",
            value: message
          });
          params.push({
            name: "messageType",
            value: messageType
          });
          formUtils.doPost(URLS.baseScripting, params);
        })
        .fail(function () {
          var failedToSavedScript = I18N.page.scripting.blocklyless.failedToSavedScript;
          $('#statusMessage').html(UI.statusMessage('fa-frown-o', 'danger',
            failedToSavedScript));
          $submitBtn.removeClass('disabled');
        })
        .always(function () {
          console.log("complete");
        });
    };
    var closeMobileModal = function ($modal) {
      $modal.removeClass('visible-on-screen');
      $('body').removeClass('modal-open');
    };
    var showMobileModal = function ($modal) {
      $modal.addClass('visible-on-screen');
      $('body').addClass('modal-open');
    };
    var initSelect = function ($select, limit, defaultValue, defaultText, indicator) {
      var i = 0;
      $select.append('<option value="' + defaultValue + '" disabled="disabled" selected>' + defaultText + '</option>');
      for (i = 0; i < limit; i++) {
        if (i < 10) {
          i = '0' + i;
        }
        $select.append('<option value="' + i + '">' + i + ' ' + indicator + '</option>');
      }
    };
    var initActionneurDeviceSelect = function () {
      constructDevicesSelect(userJsonActionneurDevices, '#actionModal .toggle-container',
        'switch');
    };
    var initAllDeviceSelect = function () {
      constructDevicesSelect(userJsonDevices, '#chooseDeviceModal .selectDevices', 'device');
    };
    var initMobileDeviceSelect = function () {
      constructMobileSelect(userJsonPhonesDevices, '#pushModal .toggle-container', 'push');
    };
    var constructDevicesSelect = function (jsonDeviceList, container, inputName) {
      var $container = $(container);
      var $input;
      var $label;
      var $labelIcon;
      var jsonDevice;
      for (var i = 0; i < jsonDeviceList.length; i++) {
        jsonDevice = jsonDeviceList[i];
        $input = $('<input type="radio"/>')
          .attr('id', jsonDevice.href)
          .attr('name', inputName)
          .data('dataTypeHref', jsonDevice.dataType.href)
          .data('datatypeUnit', jsonDevice.dataType.unit)
          .data('dataTypeTypeData', jsonDevice.dataType.dataTypeType)
          .data('dataTypeValues', jsonDevice.dataType.dataTypeValue_v1)
          .data('deviceName', jsonDevice.nom)
          .attr('value', jsonDevice.href);
        if (i === 0) {
          $input.attr('checked', 'checked');
        }
        $container.append($input);
        $labelIcon = $('<span />')
          .addClass('fa flaticon-' + jsonDevice.dataType.id);
        $label = $('<label />')
          .attr('for', jsonDevice.href)
          .addClass(jsonDevice.dataType.id)
          .append($labelIcon)
          .append(jsonDevice.nom || jsonDevice.href);
        $container.append($label);

      }
    };
    var constructMobileSelect = function (jsonDeviceList, container, inputName) {
      var $container = $(container);
      var $input;
      var $label;
      var $labelIcon;
      var icon = 'mobile';
      var jsonDevice;
      for (var i = 0; i < jsonDeviceList.length; i++) {

        jsonDevice = jsonDeviceList[i];

        if (jsonDevice.nomConstructeur === 'Apple') {
          icon = 'apple';
        } else {
          icon = 'android';
        }

        $input = $('<input type="radio"/>')
          .attr('id', jsonDevice.smartphoneID)
          .attr('name', inputName)
          .data('constructor', jsonDevice.nomConstructeur)
          .data('deviceName', jsonDevice.nomDevice)
          .data('osConstructor', icon)
          .attr('value', jsonDevice.smartphoneID);
        if (i === 0) {
          $input.attr('checked', 'checked');
        }
        $container.append($input);

        $labelIcon = $('<span />')
          .addClass('fa flaticon-' + icon);
        $label = $('<label />')
          .attr('for', jsonDevice.smartphoneID)
          .append($labelIcon)
          .append(jsonDevice.nomDevice || jsonDevice.smartphoneID);
        $container.append($label);

      }
    };
    var selectConditionType = function (conditionType) {
      UI.setAsChecked('#chooseConditionModal input[type="radio"][value="' + conditionType + '"]');
      var hideBlock = (conditionType === ConditionType.VU);
      var isEnumTypeData = false;
      if (scriptModel.regleConditions.length > 0) {
        var uniqueCondition = scriptModel.regleConditions[0];
        if (uniqueCondition.datatypeTypeData === 'ENUM') {
          isEnumTypeData = true;
        }
      }
      var activeInput = !isEnumTypeData && !hideBlock;
      if (hideBlock) {
        $('#forConditionWithValue').hide();
      } else {
        $('#forConditionWithValue').show();
      }

      if (activeInput) {
        $('#receiveDataInput').removeAttr('disabled');
      } else {
        $('#receiveDataInput').attr('disabled', 'disabled');
      }
    };
    var showChooseConditionMobileModal = function () {
      if (scriptModel.regleConditions.length > 0) {
        var uniqueCondition = scriptModel.regleConditions[0];
        var $modal = $('#chooseConditionModal');
        var i18nUnit = I18N.datatype.unit[uniqueCondition.datatypeUnit];
        $('#receiveDataInput').val(uniqueCondition.compareValue);
        $('#dataTypeUnitlabel').text(i18nUnit);
        var conditionType = uniqueCondition.conditionType;
        if (conditionType === null) {
          conditionType = DEFAULT_SELECTED_CONDITION_TYPE;
        }
        selectConditionType(conditionType);
        prepareConditionValuesFields();
        showMobileModal($modal);
      }
    };
    var prepareConditionValuesFields = function () {
      if (scriptModel.regleConditions.length > 0) {
        var uniqueCondition = scriptModel.regleConditions[0];
        $('#conditionGt').next('label').show();
        $('#conditionLt').next('label').show();
        $('#forConditionWithValue .input-group').show();
        $('#forConditionWithValue .values-group').hide();
        $('#forConditionWithValue .values-group fieldset').empty();
        if (uniqueCondition.datatypeTypeData === 'ENUM') {
          $('#conditionGt').next('label').hide();
          $('#conditionLt').next('label').hide();
          $('#forConditionWithValue .input-group').hide();
          $('#forConditionWithValue .values-group').show();
          $(uniqueCondition.datatypeValues).each(function (i) {
            displayEnumRadio(i, this);
          });
        }
      }
    };
    var displayEnumRadio = function (i, valueItem) {
      var radioGroupName = 'conditionEnumValue';
      var radioItemId = radioGroupName + '_' + valueItem.value;
      var radio = $('<input id="' + radioItemId + '" type="radio" value="' + valueItem.value + '" name="' + radioGroupName + '" />');
      if (scriptModel.regleConditions[0].compareValue === valueItem.value || i === 0) {
        UI.setAsChecked(radio);
      }
      var label = $('<label for="' + radioItemId + '">' +
        '<span class=\"fa fa-angle-right\"></span>' +
        '<span>' + I18N.datatype.value.state[valueItem.name] + '</span>' +
        '</label>');

      $('#forConditionWithValue .values-group fieldset').append(radio).append(label);
    };
    var selectScriptType = function (scriptType) {
      $('.scriptTypeBtn').removeClass('active');
      $('#' + scriptType.toLowerCase() + 'Btn').addClass('active');
      scriptModel.type = scriptType;
    };
    var resetConditionLabel = function () {
      var $unselectedLink = $('<a href="#" />')
        .append($('<span />').text("Choisir condition"))
        .append('<span class="fa fa-angle-right viewMoreIcon"></span>');
      $('#regleStep1Container .chooseConditionLabel a').replaceWith($unselectedLink);
    };
    var initGUIListeners = function () {
      $('#cronTypeLabel').on('click', function () {
        selectScriptType(ScriptType.CRON);
      });
      $('#regleTypeLabel').on('click', function () {
        selectScriptType(ScriptType.REGLE);
      });
      $('.simple-scripting-btn').on('click', function () {
        UI.fullScreenMobileContainer();
      });
      $('.cronPlanificationLabel').on('click', function () {
        showMobileModal($('#cronModal'));
      });
      $('.sms-container').on('click', function (e) {
        e.preventDefault();
        showMobileModal($('#smsModal'));
      });
      $('.push-container').on('click', function (e) {
        e.preventDefault();
        showMobileModal($('#pushModal'));
      });
      $('.email-container').on('click', function (e) {
        e.preventDefault();
        showMobileModal($('#emailModal'));
      });
      $('.action-container').on('click', function (e) {
        e.preventDefault();
        showMobileModal($('#actionModal'));
      });

      $('#chooseDeviceLabel').on('click', function (event) {
        showMobileModal($('#chooseDeviceModal'));
      });

      $('.chooseConditionLabel').on('click', function () {
        showChooseConditionMobileModal();
      });
      $('#chooseConditionModal input[name=condition]').on('click', function (event) {
        selectConditionType($(this).val());
      });
      $('.close-modal').on('click', function (event) {
        closeMobileModal($(this).closest('.mobileModalContainer'));
      });

      // ----------------- MODAL VALIDATIONS ----------------------------------

      $('#chooseConditionModal .validation').on('click', function (event) {
        return chooseConditionUpdate($('#chooseConditionModal'));
      });
      $('#chooseDeviceModal .validation').on('click', function (event) {
        return chooseDeviceUpdate(event, $('#chooseDeviceModal'), true, true);
      });
      $('#cronModal .validation').on('click', function (event) {
        return cronDetailsUpdate(event, $('#cronModal'));
      });
      $('#smsModal .validation').on('click', function (event) {
        return smsDetailsUpdate(event, $('#smsModal'));
      });
      $('#emailModal .validation').on('click', function (event) {
        return emailDetailsUpdate(event, $('#emailModal'));
      });
      $('#actionModal .validation').on('click', function (event) {
        return actionDetailsUpdate(event, $('#actionModal'));
      });
      $('#pushModal .validation').on('click', function (event) {
        return pushDetailsUpdate(event, $('#pushModal'));
      });
      $('.toggle-trigger').on('click', function () {
        var toggleContainer = $(this).closest('.toggle-parent').find('.toggle-container');
        toggleContainer.toggleClass('in');
      });

    };
    var generateConditionIcon = function (conditionType) {
      var $spanIcon = $('<span />')
        .addClass('fa')
        .addClass('conditionIcon');
      switch (conditionType) {
        case ConditionType.VU:
          $spanIcon.attr('id', 'conditionVuIcon').addClass('fa fa-download');
          break;
        case ConditionType.GT:
          $spanIcon.attr('id', 'conditionGtIcon').addClass('fa fa-angle-right');
          break;
        case ConditionType.LT:
          $spanIcon.attr('id', 'conditionLtIcon').addClass('fa fa-angle-left');
          break;
        case ConditionType.EQ:
          $spanIcon.attr('id', 'conditionEqIcon').addClass('fa flaticon-equal');
          break;
        case ConditionType.NEQ:
          $spanIcon.attr('id', 'conditionNeqIcon').addClass('fa flaticon-different');
          break;
      }
      return $spanIcon;
    };
    var updateStep2ConditionLabel = function () {
      if (scriptModel.type == ScriptType.CRON) {
        generateCronConditionLabel('#step2 .choose-moment > span', false);
      } else {
        generateRegleConditionLabel('#step2 .choose-moment > span', false, true);
      }
    };
    var generateCronConditionLabel = function (labelSelector, displayViewMore) {
      $(labelSelector).empty()
        .append($('<span />').text(cronDetails.toLabel()));
      if (displayViewMore) {
        $(labelSelector).append(VIEW_MORE_ICON);
      }
    };
    var generateRegleConditionLabel = function (labelSelector, displayViewMore,
                                                displayDatatypeIcon) {
      var condition = scriptModel.regleConditions[0];
      $(labelSelector).empty();

      if (displayDatatypeIcon) {
        $(labelSelector).append($('<span class="fa flaticon-' + condition.datatypeId + '"></span>'));
      }
      if (condition.conditionType == ConditionType.VU) {
        $(labelSelector)
          .append(generateConditionIcon(condition.conditionType))
          .append(I18N.page.scripting.blocklyless.condition.vu);
      } else if (condition.datatypeId === 'switchOnOff') {
        $(labelSelector)
          .append(generateConditionIcon(condition.conditionType))
          .append(condition.compareValue + ' ');
      } else if (condition.datatypeTypeData === 'ENUM') {
        $(labelSelector)
          .append(generateConditionIcon(condition.conditionType))
          .append(I18N.datatype.value.state[condition.compareLabel] + ' ');
      } else {
        $(labelSelector)
          .append(generateConditionIcon(condition.conditionType))
          .append(condition.compareValue + ' ')
          .append(I18N.datatype.unit[condition.datatypeUnit]);
      }
      if (displayViewMore) {
        $(labelSelector).append(VIEW_MORE_ICON);
      }
    };
    var cronDetailsUpdate = function (event, $modal) {
      var validationBtn = this;
      cronDetails.setDayFrequency(
        $modal.find('.selectDays input[type="radio"]:checked').val(),
        $modal.find('.selectDays input[type="radio"]:checked').next().text());
      cronDetails.setHours(
        $modal.find('.selectHours select').val(),
        $modal.find('.selectHours select option:not([disabled]):selected').text());
      cronDetails.setMinutes(
        $modal.find('.selectMinutes select').val(),
        $modal.find('.selectMinutes select option:not([disabled]):selected').text());
      cronPattern = cronDetails.toCronPattern();
      scriptModel.cronPeriodicity = cronDetails.toCronPeriodicity();
      console.log("CronDetails : " + cronDetails + " -- Pattern : " + cronPattern);
      generateCronConditionLabel('.cronPlanificationLabel a', true);
      closeMobileModal($modal);
      enableNexStepBtn(true);
    };
    var chooseConditionUpdate = function ($form) {
      var conditionType = $('#chooseConditionModal input[name=condition]:checked').val();
      if (conditionType != ConditionType.VU) {
        var formValid = $form[0].checkValidity();
        console.log("Form Validation : " + formValid);
        if (!formValid) {
          return true; // Form in error, the broswer will display errors
        }
      }
      var condition = scriptModel.regleConditions[0];
      condition.conditionType = conditionType;

      if (condition.datatypeTypeData == 'ENUM') {
        condition.compareValue = $('input[name=conditionEnumValue]:checked').val();
        condition.compareLabel =
          getConditionLabel(condition.datatypeValues, condition.compareValue);
      } else {
        condition.compareValue = $('#receiveDataInput').val();
      }

      generateRegleConditionLabel('.chooseConditionLabel a', true, false);
      closeMobileModal($form);
      enableNexStepBtn(true);
      return false;
    };
    var getConditionLabel = function (values, searchValue) {
      var label = null;
      $.each(values, function (i, valueItem) {
        if (valueItem.value == searchValue) {
          label = valueItem.name;
          return false;
        }
      });
      return label;
    };
    var getSelectedCondition = function () {

      var condition = new Condition();
      var selectInput = $('#chooseDeviceModal .selectDevices input[type="radio"]:checked');
      condition.deviceId = selectInput.val();
      condition.datatypeId = selectInput.data('dataType');
      condition.datatypeUnit = selectInput.data('datatypeUnit');
      condition.datatypeTypeData = selectInput.data('dataTypeTypeData');
      condition.datatypeValues = selectInput.data('dataTypeValues');
      condition.deviceName = selectInput.data('deviceName');

      return condition;
    };
    var chooseDeviceUpdate = function (event, $form, resetConditionValue, devicefound) {

      if (event !== null) {
        event.preventDefault();
      }

      if (devicefound === false) {
        return;
      }

      // Set full condition from selected device
      var selectedCondition = getSelectedCondition();

      if (resetConditionValue) {
        selectedCondition.compareValue = "";
        selectedCondition.compareLabel = "";
        selectedCondition.conditionType = DEFAULT_SELECTED_CONDITION_TYPE;
      }

      scriptModel.regleConditions = [];
      scriptModel.regleConditions.push(selectedCondition);
      if (devicefound === true) {
        $('#chooseDeviceLabel a').empty()
          .removeClass()
          .addClass(selectedCondition.datatypeId)
          .append($('<span />').addClass('datatype-icon fa flaticon-' + selectedCondition.datatypeId))
          .append(selectedCondition.deviceName)
          .append(VIEW_MORE_ICON);
      }

      resetConditionLabel();
      closeMobileModal($form);
      return false;
    };
    //STEP2 UTILS
    var emptyAndUpdateCheck = function (inputToCheck) {
      //empty other blocks
      $('.actionDetails').empty();
      //unchecked other intput and checks the current one
      $('#cronStep2Container .customRadioCBContainer input[name=actionTypeInput]').prop('checked',
        'false');
      $(inputToCheck).prop('checked', 'true');
    };
    var smsDetailsUpdate = function (event, $form) {
      var formValid = $form[0].checkValidity();
      if (!formValid) {
        return true; // Form in error, the broswer will display errors
      }
      var smsNumber = $form.find('#smsNumberInput').val();
      var smsObject = $form.find('#smsContentTA').val();
      var smsObjectSumUp = smsObject.substring(0, 30) + '...';

      emptyAndUpdateCheck('#smsActionInput');

      //update action infos.
      $('.smsActionDetails').empty()
        .append($('<p/>').text(smsNumber))
        .append($('<p/>').text(smsObjectSumUp));

      event.preventDefault();
      var smsAction = new SmsAction();
      smsAction.type = ActionType.SMS;
      smsAction.phoneNumber = $('#smsNumberInput').val();
      smsAction.content = $('#smsContentTA').val();
      addActionToScriptModel(smsAction);
      closeMobileModal($form);
      enableNexStepBtn(true);
      return false;
    };
    var emailDetailsUpdate = function (event, $form) {
      var formValid = $form[0].checkValidity();
      if (!formValid) {
        return true; // Form in error, the broswer will display errors
      }
      var email = $form.find('#emailDestInput').val();
      var emailObject = $form.find('#emailObjectTA').val();
      console.log(emailObject);
      var emailObjectSumUp = emailObject.substring(0, 30) + '...';
      var emailContent = $form.find('#emailContentTA').val();
      var emailContentSumUp = emailContent.substring(0, 50) + '...';

      emptyAndUpdateCheck('#emailActionInput');

      //update action infos.
      $('.emailActionDetails').empty()
        .append($('<p/>').text(email))
        .append($('<p/>').text(emailObjectSumUp))
        .append($('<p/>').text(emailContentSumUp));

      event.preventDefault();
      var emailAction = new EmailAction();
      emailAction.type = ActionType.EMAIL;
      emailAction.content = emailContent;
      emailAction.title = emailObject;
      emailAction.email = email;
      addActionToScriptModel(emailAction);
      closeMobileModal($form);
      enableNexStepBtn(true);

      return false;
    };
    var actionDetailsUpdate = function (event, $modal) {

      var selectedDeviceData = $modal.find('.action-switch input:checked').data();
      var selectedDeviceId = $modal.find('.action-switch input:checked').val();
      var spanIcon = '<span class="fa flaticon-' + selectedDeviceData.dataType + '"></span>';
      var actionState = $modal.find('.action-switch-onOff input:checked').val();
      var spanStatePhrase = '';
      var actionStateBoolean = '';
      if (actionState === 'ON') {
        spanStatePhrase = I18N.page.scripting.blocklyless.turnOn;
        actionStateBoolean = true;
      } else {
        spanStatePhrase = I18N.page.scripting.blocklyless.turnOff;
        actionStateBoolean = false;
      }
      var spanState = '<span class="action-state">' + spanStatePhrase + '</span>';

      emptyAndUpdateCheck('#actionTypeInput');

      //update action infos.
      if (!$('.actionActionDetails').hasClass(selectedDeviceData.dataType)) {
        $('.actionActionDetails').addClass(selectedDeviceData.dataType);
      }

      $('.actionActionDetails').html('<p>' + spanState + ' ' + selectedDeviceData.deviceName + ' ' + spanIcon + '</p>');

      var triggerAction = new TriggerAction();
      triggerAction.type = ActionType.DEVICE;
      triggerAction.deviceId = selectedDeviceId;
      triggerAction.actionValue = actionState;
      addActionToScriptModel(triggerAction);
      closeMobileModal($modal);
      enableNexStepBtn(true);
    };
    var pushDetailsUpdate = function (event, $form) {

      var formValid = $form[0].checkValidity();
      console.log('push update, form is valid ? ' + formValid);
      if (!formValid) {
        return true; // Form in error, the broswer will display errors
      }
      var selectedMobileId = $form.find('.push-switch input:checked').attr('id');
      var pushTitle = $form.find('#pushNotificationTitle').val();
      var pushContent = $form.find('#pushContentTa').val();
      var pushTitleSumUp = pushTitle.substring(0, 30);
      var pushContentSumUp = pushContent.substring(0, 50);
      var mobileData = $form.find('.push-switch input:checked').data();
      var spanIcon = '<span class="fa flaticon-' + mobileData.osConstructor + '"></span>';

      emptyAndUpdateCheck('#pushTypeInput');

      //update action infos.
      $('.pushActionDetails').empty()
        .html('<p>' + spanIcon + mobileData.deviceName + '</p>')
        .append($('<p/>').text(pushTitleSumUp))
        .append($('<p/>').text(pushContentSumUp));

      var pushAction = new PushAction();
      pushAction.type = ActionType.PUSH;
      pushAction.mobileId = selectedMobileId;
      pushAction.pushTitle = pushTitle;
      pushAction.pushContent = pushContent;
      addActionToScriptModel(pushAction);
      closeMobileModal($form);

      console.log('pushAction', pushAction);
      enableNexStepBtn(true);
      return false;
    };
    var addActionToScriptModel = function (action) {
      scriptModel.actions = [];
      scriptModel.actions.push(action);
    };
    var initRemoveInputEntries = function () {
      $("input.handler-mobile").on('blur keyup', function () {
        var sizeInputMobile = $(this).val().length;
        var inputMobile = $(this);

        var divHtml = "<div class='cross fa fa-times'></div>";

        if (sizeInputMobile > 0) {
          if ($(this).parent().find('.cross').length === 0) {
            inputMobile.after(divHtml);
          }
          $(this).parent().find('.cross').on('click', function () {
            inputMobile.val('');
            $(this).detach();
          });
        } else {
          if ($(this).parent().find('.cross').length > 0) {
            $(this).parent().find('.cross').detach();
          }
        }

      });
    };

    return {
      // PUBLIC ---------------------------------------------------------------------------------
      onReady: function () {
        scriptId = $("#idScript").val();
        defineUrls(Constants.CONTEXT_PATH);
        initWizard();
        initGUIListeners();
        initSelect($('.selectHours select'), 24, 'default',
          I18N.page.scripting.blocklyless.hoursLabel, 'h');
        initSelect($('.selectMinutes select'), 60, 'default',
          I18N.page.scripting.blocklyless.minutesLabel, 'min');
        loadDevices();
        loadMobilesList();
        initStepsFromModel();
        initRemoveInputEntries();
      },
      onLoad: function () {
      }
    };

  })();

})(dashboard);
