var AppForm = function () {
    this.id = 'new';
    this.name = 'Untitled App';
    this.description = 'This is my new app. It Rocks!';
    this.icon = '95';
    this.newButtonLabel = 'New';
    this.menuLabel = 'Untitled App';
    this.privateApp = '';
    this.feedDisplayStyle = 'Feed';
    this.slug = '';
    this.fields = new Array();
    this.allowComments = 'true';
    this.minimumPostLevel = 'Visitor';
    this.minimumViewLevel = 'Visitor';
    this.fieldCount = 0;
    this.nowEditing = '';

    // ADD a NEW FIELD to the FORM
    this.add = function (appField) {
        this.fieldCount += 1;
        if (this.fieldCount == 0) {
            // display the intro explanation
            $('#appLayout').css('background', 'url(images/appcanvas.png) no-repeat');
        } else {
            $('#appLayout').css('background', 'none');
        }
        var id = "field_" + Math.floor((Math.random() * 1000000) + 1);
        this.fields[id] = appField;
        return id;
    }


    this.save = function () {
        $('#msgCenter').show();

        var formData = new FormData();

        formData.append('command', 'do');
        formData.append('object', 'saveApp');
        formData.append('id', this.id);
        formData.append('name', this.name);
        formData.append('description', this.description);
        formData.append('icon', this.icon);
        formData.append('newButtonLabel', this.newButtonLabel);
        formData.append('menuLabel', this.menuLabel);
        formData.append('privateApp', this.privateApp);
        formData.append('feedDisplayStyle', this.feedDisplayStyle);
        formData.append('slug', this.slug);

        formData.append('allowComments', this.allowComments);
        formData.append('minimumPostLevel', this.minimumPostLevel);
        formData.append('minimumViewLevel', this.minimumViewLevel);


        var selected = new Array();
//publish to selected  clouds
        $('#cloudList input:checked').each(function () {
            selected.push($(this).val());

        });
        formData.append('publishcloud', selected);

        // go through the fields and add optiosn
        var fieldList = '';

        for (var key in this.fields) {
            if (this.fields.hasOwnProperty(key)) {

                var fieldData = '';
                var field = this.fields[key];

                var fieldOptions = "";
                for (var key in field.options) {
                    if (field.options.hasOwnProperty(key)) {
                        var option = field.options[key];
                        fieldOptions += option.text + ',';
                    }
                }


                fieldData = '{"fieldName" : "' + field.fieldName + '"';
                fieldData = fieldData + ',"fieldId" : "' + key + '"';
                fieldData = fieldData + ',"fieldLabel" : "' + field.fieldLabel + '"';
                fieldData = fieldData + ',"fieldOptions" : "' + fieldOptions + '"';
                fieldData = fieldData + ',"fieldType" : "' + field.fieldType + '"';
                fieldData = fieldData + ',"useAstitle" : "' + field.useAsTitle + '"';
                fieldData = fieldData + ',"fieldSize" : "' + field.fieldSize + '"}';
                fieldList = fieldList + ',' + fieldData;
            }
        }
        fieldList = fieldList.substring(1);
        fieldList = '[' + fieldList + ']'; //ged rid of comma
        //add the fields
        formData.append('fields', fieldList);

        $.ajax({
            url: '/api/?i=1',  //server script to process data
            type: 'POST',
            xhr: function () {  // custom xhr
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) { // check if upload property exists
                    myXhr.upload.addEventListener('progress', progressHandlingFunction, false); // for handling the progress of the upload
                }
                return myXhr;
            },
            //Ajax events
            success: saveAppSuccess,
            error: saveAppError,
            // Form data
            data: formData,
            dataType: "json",
            //Options to tell JQuery not to process data or worry about content-type
            cache: false,
            contentType: false,
            processData: false
        });
        return false; // avoid to execute the actual submit of the form.


    } //End Sve function


    function saveAppSuccess(result) {
        $('#msgCenter').load('/static/saveAppSuccess.html');
        $('#tabs-publish').tab('show');
        somevar = result;
    }

    function saveAppError(error) {
        $('#msgCenter').load('/static/saveAppError.html');
        somevar = error;
    }
}

var appForm = new AppForm();
//TextBox 
var formTextBox = function () {
    this.id = "";
    this.fieldType = "text";
    this.fieldLabel = "Untitled";
    this.fieldName = "Untitled";
    this.defaultValue = "";
    this.options = '';
    this.fieldSize = "Small";
    this.required = "0";
    this.useAsTitle = 'false';
    this.userInstructions = '';
    this.render = function () {
        return "<div class='appFormObject' id='" + this.id + "'><label>" + this.fieldLabel + "</label><input name='" + this.id + "' type=text></div>";
    };
    this.load = function () {

        var s, m, l;

        switch (this.fieldSize) {
            case 'Small':
                s = ' selected';
                break;
            case 'Medium':
                m = ' selected';
                break;
            case 'Large':
                l = ' selected';
                break;

        }

        var appTabSettings = "<label>Field Label</label> \
  <input type='text' name='fieldLabel' id='fieldLabel' value='" + this.fieldLabel + "'/> \
  <label>Field size</label> \
  <select  name='fieldSize' id='fieldSize'> \
  <option value='Small'" + s + ">Small</option> \
    <option value='Medium'" + m + ">Medium</option> \
    <option value='Large'" + l + ">Large</option> \
  </select> \
  <label>Use as Post Title  <input type='checkbox' name='useAsTitle' id='useAsTitle' ></label> \
  <label>Required  <input type='checkbox' name='required' id='required' ></label> \
   <label>Default Value</label> \
  <input type='text' name='defaultValue' id='defaultValue' value='" + this.defaultValue + "'/> \
  <label>Instructions for user</label> \
  <input type='text' name='userInstructions' id='userInstructions' value='" + this.userInstructions + "'/>";

        return appTabSettings;
    };
}

//TEXTAREA
var formTextArea = function () {
    this.id = "";
    this.fieldType = "textarea";
    this.fieldLabel = "Untitled";
    this.fieldName = "Untitled";
    this.defaultValue = "";
    this.options = '';
    this.fieldSize = "Medium";
    this.required = "0";
    this.userInstructions = '';
    this.render = function () {
        return "<div class='appFormObject' id='" + this.id + "'><label>" + this.fieldLabel + "</label><textarea class='Medium' name='" + this.id + "' ></textarea></div>";
    };
    this.load = function () {

        var s, m, l;

        switch (this.fieldSize) {
            case 'Small':
                s = ' selected';
                break;
            case 'Medium':
                m = ' selected';
                break;
            case 'Large':
                l = ' selected';
                break;

        }

        var appTabSettings = "<label>Field Label</label> \
  <input type='text' name='fieldLabel' id='fieldLabel' value='" + this.fieldLabel + "'/> \
  <label>Field size</label> \
  <select  name='fieldSize' id='fieldSize'> \
  <option value='Small'" + s + ">Small</option> \
    <option value='Medium'" + m + ">Medium</option> \
    <option value='Large'" + l + ">Large</option> \
  </select> \
  <label>Required  <input type='checkbox' name='required' id='required' value='0'></label> \
   <label>Default Value</label> \
  <input type='text' name='defaultValue' id='defaultValue' value='" + this.defaultValue + "'/> \
  <label>Instructions for user</label> \
  <input type='text' name='userInstructions' id='userInstructions' value='" + this.userInstructions + "'/>";

        return appTabSettings;
    };
}

//DROPDOWN LIST
var formDropdown = function () {
    this.id = "";
    this.fieldType = "select";
    this.fieldLabel = "Untitled";
    this.fieldName = "Untitled";
    this.defaultValue = "";
    this.options = '';
    this.fieldSize = "Medium";
    this.required = "0";
    this.userInstructions = '';
    this.render = function () {
        return "<div class='appFormObject' id='" + this.id + "'><label>" + this.fieldLabel + "</label><select class='Medium' name='" + this.id + "' ><option></option></select></div>";
    };
    this.load = function () {

        var s, m, l;

        switch (this.fieldSize) {
            case 'Small':
                s = ' selected';
                break;
            case 'Medium':
                m = ' selected';
                break;
            case 'Large':
                l = ' selected';
                break;

        }

        var appTabSettings = "<label>Field Label</label> \
  <input type='text' name='fieldLabel' id='fieldLabel' value='" + this.fieldLabel + "'/> \
  <label>Field size</label> \
  <select  name='fieldSize' id='fieldSize'> \
  <option value='Small'" + s + ">Small</option> \
    <option value='Medium'" + m + ">Medium</option> \
    <option value='Large'" + l + ">Large</option> \
  </select> \
  <label>Required  <input type='checkbox' name='required' id='required' value='0'></label> \
   <label>Option Values</label> \
   <div id='fieldOptions'> \
   <ul class='unstyled'> \
        <li ng-repeat='todo in todos'> \
         <input type='text' value='{{todo.text}}' ng-model='todo.text'  ng-change='change($index)'> \
          <button class='btn btn-mini btn-danger' ng-model='todo.done'  ng-click='delOption($index)'>X</button> \
         </li> \
      </ul> \
        <button class='btn btn-primary' ng-click='addOption()'>Add</button></div> \
  <label>Instructions for user</label> {{todos}} \
  <input type='text' name='userInstructions' id='userInstructions' value='" + this.userInstructions + "'/>";

        return appTabSettings;
    };
}
// LISTBOX
var formListbox = function () {
    this.id = "";
    this.fieldType = "listbox";
    this.fieldLabel = "Untitled";
    this.fieldName = "Untitled";
    this.defaultValue = "";
    this.options = '';
    this.fieldSize = "Medium";
    this.required = "0";
    this.userInstructions = '';
    this.render = function () {
        return "<div class='appFormObject' id='" + this.id + "'><label>" + this.fieldLabel + "</label><select size=4 class='Medium' name='" + this.id + "' ><option></option></select></div>";
    };
    this.load = function () {

        var s, m, l;

        switch (this.fieldSize) {
            case 'Small':
                s = ' selected';
                break;
            case 'Medium':
                m = ' selected';
                break;
            case 'Large':
                l = ' selected';
                break;

        }

        var appTabSettings = "<label>Field Label</label> \
  <input type='text' name='fieldLabel' id='fieldLabel' value='" + this.fieldLabel + "'/> \
  <label>Field size</label> \
  <select  name='fieldSize' id='fieldSize'> \
  <option value='Small'" + s + ">Small</option> \
    <option value='Medium'" + m + ">Medium</option> \
    <option value='Large'" + l + ">Large</option> \
  </select> \
  <label>Required  <input type='checkbox' name='required' id='required' value='0'></label> \
   <label>Option Values</label> \
   <div id='fieldOptions'> \
   <ul class='unstyled'> \
        <li ng-repeat='todo in todos'> \
         <input type='text' value='{{todo.text}}' ng-model='todo.text'  ng-change='change($index)'> \
          <button class='btn btn-mini btn-danger' ng-model='todo.done'  ng-click='delOption($index)'>X</button> \
         </li> \
      </ul> \
        <button class='btn btn-primary' ng-click='addOption()'>Add</button></div> \
  <label>Instructions for user</label> {{todos}} \
  <input type='text' name='userInstructions' id='userInstructions' value='" + this.userInstructions + "'/>";

        return appTabSettings;
    };
}


// USERS - DROPDOWN LIST
var formUserSelectTo = function () {
    this.id = "";
    this.fieldType = "userSelectTo";
    this.fieldLabel = "Untitled";
    this.fieldName = "Untitled";
    this.defaultValue = "";
    this.options = '';
    this.fieldSize = "Medium";
    this.required = "0";
    this.userInstructions = '';
    this.render = function () {
        return "<div class='appFormObject' id='" + this.id + "'><label>" + this.fieldLabel + "</label><select class='Medium' name='" + this.id + "' ><option></option></select></div>";
    };
    this.load = function () {

        var s, m, l;

        switch (this.fieldSize) {
            case 'Small':
                s = ' selected';
                break;
            case 'Medium':
                m = ' selected';
                break;
            case 'Large':
                l = ' selected';
                break;

        }

        var appTabSettings = "<label>Field Label</label> \
  <input type='text' name='fieldLabel' id='fieldLabel' value='" + this.fieldLabel + "'/> \
  <label>Field size</label> \
  <select  name='fieldSize' id='fieldSize'> \
  <option value='Small'" + s + ">Small</option> \
    <option value='Medium'" + m + ">Medium</option> \
    <option value='Large'" + l + ">Large</option> \
  </select> \
  <label>Required  <input type='checkbox' name='required' id='required' value='0'></label> \
   <label>Instructions for user</label> \
  <input type='text' name='userInstructions' id='userInstructions' value='" + this.userInstructions + "'/>";

        return appTabSettings;
    };
}

//FILE UPLOAD 
var formFileUpload = function () {
    this.id = "";
    this.fieldType = "fileUpload";
    this.fieldLabel = "Untitled";
    this.fieldName = "Untitled";
    this.defaultValue = "";
    this.options = '';
    this.size = "Medium";
    this.required = "0";
    this.userInstructions = '';
    this.render = function () {
        return "<div class='appFormObject' id='" + this.id + "'><label>" + this.fieldLabel + "</label><input type=file class='Medium' name='" + this.id + "' /></div>";
    };
    this.load = function () {

        var s, m, l;

        switch (this.fieldSize) {
            case 'Small':
                s = ' selected';
                break;
            case 'Medium':
                m = ' selected';
                break;
            case 'Large':
                l = ' selected';
                break;

        }

        var appTabSettings = "<label>Field Label</label> \
  <input type='text' name='fieldLabel' id='fieldLabel' value='" + this.fieldLabel + "'/> \
  <label>Field size</label> \
  <select  name='fieldSize' id='fieldSize'> \
  <option value='Small'" + s + ">Small</option> \
    <option value='Medium'" + m + ">Medium</option> \
    <option value='Large'" + l + ">Large</option> \
  </select> \
  <label>Required  <input type='checkbox' name='required' id='required' value='0'></label> \
  <label>Instructions for user</label>  \
  <input type='text' name='userInstructions' id='userInstructions' value='" + this.userInstructions + "'/>";

        return appTabSettings;
    };
}


//Date Picker 
var formDatePicker = function () {
    this.id = "";
    this.fieldType = "datePicker";
    this.fieldLabel = "Date";
    this.fieldName = "date";
    this.defaultValue = "";
    this.options = '';
    this.fieldSize = "Small";
    this.required = "0";
    this.useAsTitle = 'false';
    this.userInstructions = '';
    this.render = function () {
        return "<div class='appFormObject' id='" + this.id + "'><label>" + this.fieldLabel + "</label><input name='" + this.id + "' type=text></div>";
    };
    this.load = function () {

        var s, m, l;

        switch (this.fieldSize) {
            case 'Small':
                s = ' selected';
                break;
            case 'Medium':
                m = ' selected';
                break;
            case 'Large':
                l = ' selected';
                break;

        }

        var appTabSettings = "<label>Field Label</label> \
  <input type='text' name='fieldLabel' id='fieldLabel' value='" + this.fieldLabel + "'/> \
  <label>Field size</label> \
  <select  name='fieldSize' id='fieldSize'> \
  <option value='Small'" + s + ">Small</option> \
    <option value='Medium'" + m + ">Medium</option> \
    <option value='Large'" + l + ">Large</option> \
  </select> \
 <input type='hidden' name='useAsTitle' id='useAsTitle' > \
  <label>Required  <input type='checkbox' name='required' id='required' ></label> \
   <label>Default Value</label> \
  <input type='text' name='defaultValue' id='defaultValue' value='" + this.defaultValue + "'/> \
  <label>Instructions for user</label> \
  <input type='text' name='userInstructions' id='userInstructions' value='" + this.userInstructions + "'/>";

        return appTabSettings;
    };
}


$(document).ready(function () {

//$( "#saveApp" ).button( "option", "icons", { primary: "ui-icon-check" } );
    $("#saveApp").click(function () {
        appForm.save();
    });

//var theApp=new Object();
    $('#optionTabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $('#appTabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $('#appTabs a[href="tabs-newApp"]').tab('show');
    $('#optionTabs a[href="appTabs-fields"]').tab('show');


    $('.appFormObject').live('click', function () {
        $('.appFormObject').removeClass('selected');
        $('#appHeading').removeClass('selected');
        $(this).addClass('selected');
        objectID = this.id;
        appForm.nowEditing = objectID;
        fieldSettings = appForm.fields[objectID].load()
        $('#appTabs-settings').html(fieldSettings);

        fieldOptions = appForm.fields[objectID].options;
        // auto generate default options textboxes
        var $self = $('#fieldOptions');
        $self.attr('ng-controller', 'TodoCtrl');
        handle = angular.bootstrap($self);
        // load in options if the exist
        if (fieldOptions != '') {
            angular.element(document.getElementById('fieldOptions')).scope().$apply(function (scope) {
                scope.todos = fieldOptions;
            });
        }


        $('#appTab2').tab('show');
    });

    $('#appHeading').live('click', function () {
        $('#appHeading').addClass('selected');

        $('#appTab3').tab('show');
    });

    $('#txbxAppName').keyup(function () {
        $('#appName').html($('#txbxAppName').val())
        appForm.name = $('#txbxAppName').val();
        tempname = appForm.name;
        tempname = tempname.replace(' ', '');
        appForm.menuLabel = tempname;
        //update the meu labe at the same time
        //coule be done better, need to check if already entered, etc.
        $('#menuLabel').val(appForm.name = $('#txbxAppName').val());
    });

    $('#txbxAppName').click(function () {
        if (this.value == 'Untitled App') {
            this.value = '';
        }
    });

    $('#txareaAppDescription').keyup(function () {
        $('#appDescription').html($('#txareaAppDescription').val())
        appForm.description = $('#txareaAppDescription').val()
    });

    $('#icon').change(function () {
        appForm.icon = $('#icon').val();
        $('#appIconDisplay').attr('src', '/dispatch?id=' + appForm.icon);
    });

    $('#menuLabel').keyup(function () {
        appForm.menuLabel = $('#menuLabel').val();
    });

    $('#newButtonLabel').keyup(function () {
        appForm.newButtonLabel = $('#newButtonLabel').val();
    });

    $('select#feedDisplayStyle').change(function () {
        appForm.feedDisplayStyle = $('#feedDisplayStyle').val();
    });

    $('#allowComments').change(function () {
        if (this.checked) {
            appForm.allowComments = 'true';
        }
    });
    $('#allowCommentsNo').change(function () {
        if (this.checked) {
            appForm.allowComments = 'false';
        }
    });

    $('#minimumViewLevel').change(function () {
        appForm.minimumViewLevel = $('#minimumViewLevel').val();
    });

    $('#minimumPostLevel').change(function () {
        appForm.minimumPostLevel = $('#minimumPostLevel').val();
    });


    $('#fieldLabel').live('keyup', function () {
        $('#' + appForm.nowEditing + ' label').html($('#fieldLabel').val())
        appForm.fields[objectID].fieldLabel = $('#fieldLabel').val();
        tempname = $('#fieldLabel').val();
        tempname = tempname.replace(' ', '');
        appForm.fields[objectID].fieldName = tempname;
    });

    $('#fieldLabel').live('click', function () {
        if (this.value == 'Untitled') {
            this.value = '';
        }

    });

    $('#fieldLabel').live('change', function () {
        $('#' + appForm.nowEditing + ' label').html($('#fieldLabel').val())
        appForm.fields[objectID].label = $('#fieldLabel').val();
        tempname = $('#fieldLabel').val();
        tempname = tempname.replace(' ', '');
        appForm.fields[objectID].fieldName = tempname;
    });
    $('#fieldSize').live('change', function () {
        appForm.fields[objectID].fieldSize = $('#fieldSize').val();
    });
    $('#defaultValue').live('change', function () {
        appForm.fields[objectID].defaultValue = $('#defaultValue').val();
    });
    $('#userInstructions').live('change', function () {
        appForm.fields[objectID].userInstructions = $('#userInstructions').val();
    });
    $('#required').live('change', function () {
        appForm.fields[objectID].required = $('#required').val();
    });

    $('#useAsTitle').live('click', function () {
        if (this.checked) {
            appForm.fields[objectID].useAsTitle = 'true';
        } else {
            appForm.fields[objectID].useAsTitle = 'false';
        }
    });


    function showApptab() {
        $('#tabs a[href="tabs-newApp"]').tab('show');
    }

    // textbox
    $(".appTextbox").draggable({
        start: function () {
            showApptab();

        },
        stop: function () {
            something = this;
            var txtbox = new formTextBox();
            var newid = appForm.add(txtbox);
            txtbox.id = newid;
            var fieldHtml = txtbox.render();

            $("#appLayout").append(fieldHtml);
        },
        revert: "valid"
    });

    //textarea
    $(".appTextarea").draggable({
        start: function () {
            showApptab();
        },
        stop: function () {
            something = this;
            var txtarea = new formTextArea();
            var newid = appForm.add(txtarea);
            txtarea.id = newid;
            var fieldHtml = txtarea.render();

            $("#appLayout").append(fieldHtml);
        },
        revert: "valid"
    });

    //Listbox
    $(".appDropdown").draggable({
        start: function () {
            showApptab();
        },
        stop: function () {
            something = this;
            var dropdown = new formDropdown();
            var newid = appForm.add(dropdown);
            dropdown.id = newid;
            var fieldHtml = dropdown.render();

            $("#appLayout").append(fieldHtml);
        },
        revert: "valid"
    });


    $(".appUserSelectTo").draggable({
        start: function () {
            showApptab();
        },
        stop: function () {
            something = this;
            var userSelectTo = new formUserSelectTo();
            var newid = appForm.add(userSelectTo);
            userSelectTo.id = newid;
            var fieldHtml = userSelectTo.render();

            $("#appLayout").append(fieldHtml);
        },
        revert: "valid"
    });


    $(".appListbox").draggable({
        start: function () {
            showApptab();
        },
        stop: function () {
            something = this;
            var listbox = new formListbox();
            var newid = appForm.add(listbox);
            listbox.id = newid;
            var fieldHtml = listbox.render();

            $("#appLayout").append(fieldHtml);
        },
        revert: "valid"
    });


    $(".appParagraph").draggable({
        start: function () {
            showApptab();
        },
        stop: function () {
            something = this;
            var paragraph = new formParagraph();
            var newid = appForm.add(paragraph);
            paragraph.id = newid;
            var fieldHtml = paragraph.render();

            $("#appLayout").append(fieldHtml);
        },
        revert: "valid"
    });

    $(".appFileUpload").draggable({
        start: function () {
            showApptab();
        },
        stop: function () {
            something = this;
            var FileUpload = new formFileUpload();
            var newid = appForm.add(FileUpload);
            FileUpload.id = newid;
            var fieldHtml = FileUpload.render();

            $("#appLayout").append(fieldHtml);
        },
        revert: "valid"
    });


    $(".appLineBreak").draggable({
        start: function () {
            showApptab();
        },
        stop: function () {
            $("#appLayout").append("<div class='appFormObject'><hr></div>")
        },
        revert: "valid"
    });


    // textbox
    $(".appDatePicker").draggable({
        start: function () {
            showApptab();

        },
        stop: function () {
            something = this;
            var datePicker = new formDatePicker();
            var newid = appForm.add(datePicker);
            datePicker.id = newid;
            var fieldHtml = datePicker.render();

            $("#appLayout").append(fieldHtml);
        },
        revert: "valid"
    });


    // droped
    $("#appLayout").droppable({

        hoverClass: "ui-state-highlight",

    }).sortable({
            placeholder: "ui-state-highlight"
        });


    $(".jlink").live('click', function () {
        load(this.classList);

    });

});


// angular directives for listboxes

function TodoCtrl($scope) {
    $scope.todos = [
        {text: 'Option 1'},
        {text: 'Option 2'}
    ];

    $scope.addOption = function () {
        $scope.todos.push({text: $scope.todoText});
        $scope.todoText = '';
    };

    $scope.change = function (idx) {
        objectID = appForm.nowEditing
        appForm.fields[objectID].options = $scope.todos;
    };

    $scope.delOption = function (idx) {

        $scope.todos.splice(idx, 1);

    };

    $scope.updateOptions = function (options) {

        $scope.todos = options;

    };

    $scope.remaining = function () {
        var count = 0;
        angular.forEach($scope.todos, function (todo) {
            count += todo.done ? 0 : 1;
        });
        return count;
    };

    $scope.archive = function () {
        var oldTodos = $scope.todos;
        $scope.todos = [];
        angular.forEach(oldTodos, function (todo) {
            if (!todo.done) $scope.todos.push(todo);
        });
    };
}
  