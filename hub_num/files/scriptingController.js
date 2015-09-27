/**
 * Created by Berlioz on 25/09/2015.
 */
var scriptingController = (function() {
    "use strict";

    var URLS;
    var defineUrls = function(ctxPath) {
        var partnerUrlPart = '?partner=' + urlUtils.getParameter('partner', window.location.href) || '';
        URLS = {
            baseScripting: ctxPath + "/page/scripting",
            blockly: ctxPath + "/frag/scripting/blockly",

            updateScript: ctxPath + "/page/scripting/modify",
            updateScriptSimple: ctxPath + "/script/beginner/modify",

            createScript: ctxPath + "/page/scripting/new/expert" + partnerUrlPart,
            createScriptSimple: ctxPath + "/page/scripting/new/beginner" + partnerUrlPart,

            updateScriptState: ctxPath + "/script/{scriptId}?enable=",
            deleteScript: ctxPath + "/script/{scriptId}"
        };
    };

    var scriptToDelete = null;

    var onScriptSaved = function(responseTxt, statusTxt, xhr) {
        var isSuccess = (responseTxt.indexOf("danger") == -1);
        if (isSuccess) {
            console.log("Script saved successfully.");
        } else {
            console.log("Script not saved, some errors occurs.");
        }
        $("#statusMessage").show();
    };

    function updateScriptActiveState(activeInput) {
        var scriptId = $(activeInput).data('id');
        var isActive = $(activeInput).prop("checked");
        console.log("Updating script id=" + scriptId + " : isActive=" + isActive);
        var url = URLS.updateScriptState.replace("{scriptId}", scriptId) + isActive;
        $.ajax({
            type: "PUT",
            url: url,
            async: true,
            success: function(responseText, textStatus, xhr) {
                console.log("scriptId " + scriptId + " updated successfuly.");
            },
            error: function() {
                console.log("WARN : update scriptId " + scriptId + " failed.");
            }
        });
    }

    var onBlocklyFragLoaded = function(responseText, textStatus, jqXHR) {
        console.log("onBlocklyFragLoaded : " + textStatus);
    };

    var onScriptClick = function() {
        $('.single-script-link').on('click', function(e) {
            e.preventDefault();
            var scriptId = $(this).data('scriptid');
            var typeOfScript = $(this).closest('.single-script').data('type-of-script');
            if (typeOfScript === 'SIMPLE') {
                window.location.href = URLS.updateScriptSimple + "/" + scriptId;
            } else {
                window.location.href = URLS.updateScript + "/" + scriptId;
            }
        });
    };

    var displayMessageIfNoScripts = function displayLinkIfNoDevices() {
        $('.mainContent').prepend('<div class="noDevices"><h2>' + I18N.page.scripting.scriptingEmpty + '</h2>');
    };

    var initFilterScripts = function initFilterScipts() {
        $('.imgPartners').on('click', function(event) {
            $('.noDevices').remove();
            $('.imgPartners a').removeClass('active');
            $(this).find('a').addClass('active');

            var filterScripts = new FilterCustom('.mainContent', '.scripting-container');
            var $elSelected = $('.mainContent [data-filter="' + $(this).data('filter') + '"]');
            event.preventDefault();
            filterScripts.filterByData($(this).data('filter'));
            if (filterScripts.getNUmberOfElinList($elSelected) === 0 && $(this).data('filter') !== 'all') {
                displayMessageIfNoScripts($(this).data('filter'));
            }
        });
    };

    return {

        onReady: function() {
            console.log(Constants.CONTEXT_PATH);
            defineUrls(Constants.CONTEXT_PATH);
            $('.active-script-input').on('change', function() {
                updateScriptActiveState(this);
            });
            $('.administrateDash').on('click', function() {
                $('.administrateContainer').toggleClass('visible');
            });
            UI.removeClassIfWidthUnder('.administrateContainer', 'visible', 480);
            pageController.addChevronToAdministrateDash();
            onScriptClick();
            initFilterScripts();
        },

        onLoad: function() {
            console.log("Scripting page fully loaded.");
        },

        onCreateScriptClick: function(asSimple) {
            if (asSimple) {
                window.location.href = URLS.createScriptSimple;
            } else {
                window.location.href = URLS.createScript;
            }
        },

        onUpdateScriptClick: function(id, asSimple, displayModal) {
            // Format url
            var url = URLS.updateScript;
            if (asSimple) {
                url = URLS.updateScriptSimple;
            }
            if (id !== "") {
                url += "/" + id;
            }

            // Do redirection or display modal
            if (displayModal) {
                var iconHeader = "fa fa-warning INACTIVE";
                UI.createModal(I18N.page.scripting.updateAsBlocklyModalTitle,
                    I18N.page.scripting.updateAsBlocklyModalContent,
                    function() {
                        window.location.href = url;
                    }, I18N.general.okMsg, I18N.general.cancelMsg, iconHeader);
            } else {
                window.location.href = url;
            }
        },

        onDeleteScriptClick: function(event, scriptId) {
            var $that = $(event.target)[0],
                btnText = I18N.general.okMsg,
                header = I18N.page.scripting.deleteScriptMsg,
                nomScript = $(
                    $that).closest('.scripting-container-periph').data('nomscript'),
                optionalIconHeader = "fa fa-warning INACTIVE",
                cancelBtn = I18N.general.cancelMsg,
                content = I18N.page.scripting.deleteScriptVerifMessage,
                deleteScriptAjaxCall = function(e) {
                    e.preventDefault();
                    $.ajax({
                        url: URLS.deleteScript.replace("{scriptId}", scriptId),
                        type: 'DELETE',
                        success: function(responseText, textStatus, jqXHR) {
                            $("#script-" + scriptId).remove();
                        },
                        error: function(responseText, textStatus, jqXHR) {},
                        complete: function(response, textStatus, jqXHR) {
                            $('#modalWindowJs').modal('hide');
                            $('#modalWindowJs').remove();
                            $('.modal-backdrop').remove();
                            $('body').removeClass('modal-open');
                            UI.setContent("statusMessage", response.responseText);
                            $("#statusMessage").show();
                            $("html, body").animate({
                                scrollTop: $('html').offset().top
                            }, 0);
                            $('body').css({
                                'padding-right': '0'
                            });
                        }
                    });
                };
            UI.createModal(header, content.replace('{name}', nomScript),
                deleteScriptAjaxCall, btnText, cancelBtn, optionalIconHeader);
            event.stopPropagation();
        },

        loadBlockyFragment: function(isNewScript, scriptId) {
            console.log("Loading blockly fragment, isNewScript=" + isNewScript + ", scriptId=" + scriptId);
            var params = [];
            params.push({
                name: "scriptId",
                value: scriptId
            });
            params.push({
                name: "isNewScript",
                value: isNewScript
            });
            $("#blockly-panel").load(URLS.blockly, params, onBlocklyFragLoaded);
        }

    };
})();

