// Returns the podt date in the form of x days n hours ago....
function long_long_ago(feed_time) {
    var today = new Date();
    var posted = new Date(feed_time * 1000);
    var difference = new Date(today - posted);
    postedMonths = difference.getMonth();
    var one_day = 1000 * 60 * 60 * 24;
    var one_hour = 1000 * 60 * 60;
    var one_minute = 1000 * 60;
    if (postedMonths > 1) {
        ago = "Around " + postedMonths + " months ago";
    } else {
        postedDays = parseInt(difference / one_day);
        if (postedDays > 13) {
            weeks = postedDays / 7;
            ago = "Around " + weeks + " weeks ago";
        } else if (postedDays > 1) {
            ago = "" + postedDays + " days ago";

        } else {
            postedHours = parseInt(difference / one_hour);
            if (postedHours > 1) {

                ago = "" + postedHours + " hours ago";
            } else if (postedHours == 1) {
                ago = "Around " + postedHours + " hour ago";

            } else {
                postedMinutes = parseInt(difference / one_minute);
                if (postedMinutes > 2) {
                    ago = postedMinutes + " minutes ago";
                } else {
                    ago = "A few minutes ago";
                }

            }


        }
    }
    return ago;
}


function resetAll() {
    $("#nowViewing h1").html('');
    $("#nowViewing img").attr("src", '');
    $("#nowViewing span").html("");
}

//generic file upload
//triggered on file selection
//uploads file and returns file id


$('#file_icon, .fileuploader').live('change', function () {

    $('#progress').fadeIn();
    formName = this.name.substring(5);
    //var formData = new FormData($('#' + formName)[0]);

    var formData = new FormData();
    formData.append('file', this.files[0]);
    formData.append('fileID', formName);

    $.ajax({
        url: '/arrivals',  //server script to process data
        type: 'POST',
        xhr: function () {  // custom xhr
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) { // check if upload property exists
                myXhr.upload.addEventListener('progress', progressHandlingFunction, false); // for handling the progress of the upload
            }
            return myXhr;
        },
        //Ajax events
        beforeSend: beforeSendHandler,
        success: completeHandler,
        error: errorHandler,
        // Form data
        data: formData,
        dataType: "json",
        //Options to tell JQuery not to process data or worry about content-type
        cache: false,
        contentType: false,
        processData: false
    });
});

function beforeSendHandler(data) {
}
function completeHandler(data) {
    $('#progress').fadeOut();
    $('#img_' + data.fieldId).attr('src', data.url);


    input_field = document.getElementById(data.fieldId);
    input_field.value = data.id;
    $(input_field).trigger('change');
}

function errorHandler(data) {
    $('#progress').fadeOut();
    alert(data.responseText);
}
function progressHandlingFunction(e) {
    if (e.lengthComputable) {
        $('#progress').attr({value: e.loaded, max: e.total});
    }
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function createNewCloud() {
    var formData = new Object();

    formData.command = 'do';
    formData.object = 'createNewCloud';

    formData.name = document.getElementById('name').value;
    formData.description = document.getElementById('description').value;
    formData.icon = document.getElementById('icon').value;
    formData.menuLabel = document.getElementById('menuLabel').value;
    jsonData = formData;
    var request = $.ajax({
        url: "/api/?i=1",
        type: "POST",
        data: jsonData,
        dataType: "json"
    });
    request.done(function (msg) {

        if (msg.status == undefined) {

            var url = msg.response.docs[0].menuLabel;
            window.location = '/' + url;
        } else {
            cg = document.getElementById('menuLabelCG');
            hm = document.getElementById('menuLabelHelp');
            $(hm).html(msg.status);
            $(cg).addClass('error');

        }
    });

    request.fail(function (jqXHR, textStatus) {
        error = "<div class='m5 alert alert-error'>Request failed: " + textStatus + '</div>';
        alert(error);
    });


    return false; // avoid to execute the actual submit of the form.

}


function showInfoGuides() {
    $("#hubInfo").fadeIn();
}

function doButtons() {


    $(".btnNewCloud").click(function () {
        resetAll();
        loadTabsHTML('newCloudForm');

    });


    $("#btnFindClouds").click(function () {
        loadTabsHTML('findClouds');
    });


    $(".btnNewApp").click(function () {
        loadTabsHTML('newAppForm');
    });


    $("#btnFindApps").click(function () {
        loadTabsHTML('findApps');
    });


    $("#btnNewHub").click(function () {
        loadTabsHTML('newHubForm');
    });

    $("#btnFindHubs").click(function () {
        loadTabsHTML('findHubs');
    });

    $("#btnNotificationSettings").click(function () {
        loadTabsHTML('findHubs');
    });

}


function getApps(source, item, target, callback) {
    var request = $.ajax({
        url: "/api/?i=1",
        type: "POST",
        data: {command: "get", object: source},
        dataType: "json"
    });
    request.done(function (msg) {

        var length = msg.response.length,
            element = null;
        links = '';
        biglinks = '';
        for (var i = 0; i < length; i++) {
            links = links + "<a class='jlink " + item + " " + msg.response[i]._id + "' href='#'><img class='icon' src='/dispatch/?id=" + msg.response[i].icon + "' />" + msg.response[i].menuLabel + "</a>";
            biglinks = biglinks + "<div class='mediaBox'><a class='jlink " + item + " " + msg.response[i]._id + "' href='#'><img class='left' src='/dispatch/?id=" + msg.response[i].icon + "' /><br>" + msg.response[i].menuLabel + "</a></div>";

        }

        $("#" + target).html(links);
        callback(biglinks);
    });

    request.fail(function (jqXHR, textStatus) {
        error = "<div class='m5 alert alert-error'>Get Apps Request failed: " + textStatus + '</div>';
        callback(error);
    });
}

function getClouds(source, item, target, callback) {
    var request = $.ajax({
        url: "/api/?i=1",
        type: "POST",
        data: {command: "get", object: source},
        dataType: "json"
    });
    request.done(function (msg) {

        var length = msg.response.length;

        if (length == 0) {
            callback("");
        } else {
            element = null;
            links = '';
            biglinks = '';
            for (var i = 0; i < length; i++) {
                links = links + "<a class='iconLink " + item + " " + msg.response[i]._id + "' href='/" + msg.response[i].menuLabel + "'><img class='icon' src='/dispatch/?id=" + msg.response[i].icon + "' />" + msg.response[i].menuLabel + "</a>";
                biglinks = biglinks + "<div class='mediaBox'><a class='media " + item + " " + msg.response[i]._id + "' href='/" + msg.response[i].menuLabel + "'><img class='left' src='/dispatch/?id=" + msg.response[i].icon + "' />" + msg.response[i].name + "</a></div>";
            }
            $("#" + target).html(links);

            callback(biglinks);
        }
    });
    request.fail(function (jqXHR, textStatus) {
        error = "<div class='m5 alert alert-error'>Request failed: " + textStatus + '</div>';
        callback(error);
    });
}


function getCloud(id) {
    var request = $.ajax({
        url: "/api/?i=1",
        type: "POST",
        data: {command: "get", object: 'cloud', item: id},
        dataType: "json"
    });
    request.done(function (cloudData) {

        element = null;
        data = '';
//cloud details
        theForm.cloud = cloudData.response.cloud[0];
        icon = '/dispatch/?id=' + theForm.cloud.icon
        $("#nowViewingProfile img").attr("src", icon);

// $('#posts').html(tabData);


        $("#nowViewing h1").html(theForm.cloud.name);
        $("#nowViewing img").attr("src", icon);
        $("#nowViewingProfile img").attr("src", icon);


// get the clouds apps
        var length = cloudData.response.apps.length

        links = '';
        if (length > 0) {
            var apps = cloudData.response.apps;
            biglinks = '';
            for (var i = 0; i < length; i++) {
                links = links + "<a class='jlink app " + apps[i]._id + "' href='#'><img class='icon' src='/dispatch/?id=" + apps[i].icon + "' />" + apps[i].menuLabel + "</a>";
                biglinks = biglinks + "<div class='mediaBox'><a class='jlink app " + apps[i]._id + "' ><img class='left' src='/dispatch/?id=" + apps[i].icon + "' />" + apps[i].name + "</a></div>";

            }

            $("#cloudApps").html(links);
            $("#tabs-1").html("<div class='clearfix'>" + biglinks + "</div>");
        } else {
// No Apps for this cloud so show default messages instead.
            loadTabsHTML('noApps');
            $('#cloudApps').load('/static/noApps.html');

        }


    });
    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });
}


function getCalendar() {
    var request = $.ajax({
        url: "/api/?i=1",
        type: "POST",
        data: {command: "get", object: "calendar"},
        dataType: "json"
    });
    request.done(function (msg) {

        var length = msg.response.length,
            element = null;
        clouds = '';
        for (var i = 0; i < length; i++) {
            clouds = clouds + "<a class='jlink calendar " + msg.response[i].id + "'>" + msg.response[i].name + "</a>";
            // Do something with element i.
        }
        content = clouds + $("#myClouds").html();
        $("#myClouds").html(content);
    });
    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });
}


function load(classList) {
    var request = $.ajax({
        url: "/api/?i=1",
        type: "POST",
        data: {command: "get", object: classList[1], item: classList[2]},
        dataType: "json"
    });
    request.done(function (msg) {


        element = null;
        data = '';

        if (classList[1] == 'cloud') {
            theForm.app = msg.response.app[0];
            icon = '/dispatch/?id=' + theForm.app.icon
            $("#nowViewingProfile img").attr("src", icon);
            titles = "<li><a href='#tabs-1'>Posts</a></li><li><a href='#tabs-2'>Search</a></li>";
            contents = "<div id='tabs-1'></div><div id='tabs-2'>Search Now</div>";
            tabData = "<ul id='tabHeadings'>" + titles + "</ul>" + contents;
            $('#tabs').html(tabData);
            $('#tabs').tabs('refresh');

            $("#nowViewing h1").html(theForm.app.name);
            $("#nowViewing img").attr("src", icon);
            $("#nowViewing span").html("<a  class='btn' id='btnToggleFormDisplay' href='#' onclick='toggleFormDisplay(this)'>New Post</a>");

        } else {
            theForm.app = msg.response.app;
            theForm.posts = msg.response.posts;
            theForm.users = msg.response.users;
            icon = '/dispatch/?id=' + theForm.app.icon
            Description = theForm.app.description;
//jsonfields = msg.response.fields;

//theForm.app.fields=$.evalJSON(jsonfields);


            var fields = '';

            if (theForm.app.fields !== null) {
                var length = theForm.app.fields.length;
                var dateFields = Array();
                var dateFieldCount = 0;
                for (var i = 0; i < length; i++) {

                    var field = theForm.app.fields[i];
                    switch (field.fieldType) {


                        case 'text':
                            fields = fields + '<label>' + field.fieldLabel + "</label><input name='" + field.fieldName + "' id='dynamic_" + field.fieldName + "' title='" + field.fieldToolTip + "' type='text' class='formfield " + field.id + "'><br>";
                            break;

                        case 'textarea':
                            fields = fields + '<label>' + field.fieldLabel + "</label><textarea  rows=8 name='" + field.fieldName + "' id='dynamic_" + field.fieldName + "'  class='formfield " + field.id + "'></textarea><br>";
                            break;

                        case 'listbox':
                            options = field.fieldOptions.split(',');
                            var length = options.length,
                                optionsHtml = null;
                            for (var i = 0; i < length; i++) {
                                optionsHtml += "<option>" + options[i] + "</option>";
                                // Do something with element i.
                            }
                            fields = fields + '<label>' + field.fieldLabel + "</label><select zise=4 name='" + field.fieldName + "' id='dynamic_" + field.fieldName + "' class='formfield " + field.id + "'>" + optionsHtml + "</select><br>";
                            break;

                        case 'select':
                            options = field.fieldOptions.split(',');

                            optionsHtml = null;
                            for (var j = 0; j < options.length; j++) {
                                optionsHtml += "<option>" + options[j] + "</option>";
                                // Do something with element i.
                            }
                            fields = fields + '<label>' + field.fieldLabel + "</label><select  name='" + field.fieldName + "' id='dynamic_" + field.fieldName + "' class='formfield " + field.id + "'>" + optionsHtml + "</select><br>";
                            break;


                        case 'userSelectTo':

                            var userOptions = ''
                            for (var j = 0; j < theForm.users.length; j++) {

                                userOptions += '<option>' + theForm.users[j].displayName + '</option>';

                            }


                            fields = fields + '<label>' + field.fieldLabel + "</label><select  name='" + field.fieldName + "' id='dynamic_" + field.fieldName + "' class='formfield " + field.id + "'>" + userOptions + "</select><br>";
                            break;

                        case 'fileUpload':

                            fields = fields + "<div> \
		<input type='hidden' name='" + field.fieldName + "' id='" + field.fieldName + "' value='na' /> \
		<img id='img_" + field.fieldName + "' class='" + field.fieldName + " icon' src='http://www.cloudthingy.com/app/dispatch.php?id=95' /> \
		<input class='fileuploader btn' name='file_" + field.fieldName + "' id='file_" + field.fieldName + "' type='file' /> \
		<progress id='progress' style='display:none;'></progress>  \
		</div> "

                            break;

                        case 'datePicker':
                            fields = fields + '<label>' + field.fieldLabel + "</label><input  name='" + field.fieldName + "' id='dynamic_" + field.fieldName + "' title='" + field.fieldToolTip + "' type='text' class='formfield " + " datePicker'><br>";

                            dateFields[dateFieldCount] = 'dynamic_' + field.fieldName;
                            dateFieldCount++;
                            break;


                        case 'submit':
                            fields = fields + '<label>' + field.fieldLabel + "</label><input class='btnDynamicSubmit bth btn-primary'  name='" + field.fieldName + "' id='dynamic_Submit' type='submit' class='formfield " + field.id + "' value='" + field.fieldValue + "'><br>";
                            break;
                    }

                    // Do something with element i.
                }
                fields = fields + "<div id='submitForm'><button class='btnDynamicSubmit btn btn-primary'>Submit</button></div>";
            }
            var length = theForm.posts.length;
            var posts = '';
            var contents = '';
            for (var i = 0; i < length; i++) {
                var post = theForm.posts[i].fieldData;
                var fullPost = theForm.posts[i];
                if (theForm.app.feedDisplayStyle == 'Feed') {
                    posts = posts + renderPost(post, fullPost);
                } else if (theForm.app.feedDisplayStyle == 'Bucket') {
                    posts = posts + renderBucket(post, fullPost);
                } else {
                    posts = posts + renderGrid(post, theForm.posts[i]._id);
                }


            }

            if (theForm.app.feedDisplayStyle == 'Feed') {
                contents = posts;
            } else if (theForm.app.feedDisplayStyle == 'Bucket') {
                contents = "<div class='btn-group w100'> \
  <button class='btn w33'>Pending</button>\
  <button class='btn w33'>In Progress</button>\
  <button class='btn w33'>Complete</button>\
</div><ul id='sortable1' class='connectedSortable'>" + posts + "</ul><ul id='sortable2' class='connectedSortable'> </ul><ul id='sortable3' class='connectedSortable'> </ul>";


            } else {
                tableStart = "<table id='table_" + theForm.app._id + "'  class='p5 table table-striped'>";
                tableHead = rendertableHead();
                tableEnd = "</table>";
                contents = tableStart + "<thead>" + tableHead + "</thead>" + "<tfoot>" + tableHead + "</tfoot><tbody>" + posts + "</tbody>" + tableEnd;
            }


            // Do something with element i.


            $('#posts').html(contents);
            $('#table_' + theForm.app._id).dataTable();
            $('#theForm').html(fields);

            // assign date pickers
            for (var df = 0; df < dateFieldCount; df++) {
                dateField = document.getElementById(dateFields[df]);
                datePicker(dateField);
            }


            $('#tabs').fadeOut(function () {
                $('#appView').fadeIn();
            });
            $("#nowViewing h1").html(theForm.app.name);
            $('#theFormDescription').html(Description);
            $("#nowViewing img").attr("src", icon);
            $("#nowViewing span").html("<a  class='btn' id='btnToggleFormDisplay' href='#' onclick='toggleFormDisplay(this)'>" + theForm.app.newButtonLabel + "</a>");

            $(function () {
                $("#sortable1, #sortable2").sortable({
                    connectWith: ".connectedSortable"
                }).disableSelection();
                $("#sortable2, #sortable3").sortable({
                    connectWith: ".connectedSortable"
                }).disableSelection();
            });


        }

    });

    request.fail(function (jqXHR, textStatus) {
        alert("Clouds Request failed: " + textStatus);
    });
}

function toggleFormDisplay(me) {
    if ($(me).html() !== 'Cancel') {
        $("#theForm").slideDown();
        $("#btnToggleFormDisplay").html('Cancel');
    } else {
        $("#theForm").fadeOut();
        $("#btnToggleFormDisplay").html('New ' + theForm.app.menuLabel);
    }
}


//
// Submit the Form
//
$(".btnDynamicSubmit").live('click', function () {

    // build the data for submit


    var formData = new FormData();

    formData.append('command', 'post');
    formData.append('object', 'app');
    formData.append('appName', theForm.app.name);
    formData.append('appId', theForm.app._id);

    var length = theForm.app.fields.length;
    var list = '';
    for (var i = 0; i < length; i++) {
        var field = theForm.app.fields[i];
        list = list + field.fieldName + " ";
        if (document.getElementById('dynamic_' + field.fieldName) != undefined) {
            formData.append(field.fieldName, document.getElementById('dynamic_' + field.fieldName).value);
        } else if (document.getElementById('' + field.fieldName) != undefined) {
            formData.append(field.fieldName, document.getElementById('' + field.fieldName).value);
        }

    }


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
        success: newPostHandler,
        error: errorPostHandler,
        // Form data
        data: formData,
        dataType: "json",
        //Options to tell JQuery not to process data or worry about content-type
        cache: false,
        contentType: false,
        processData: false
    });
    return false; // avoid to execute the actual submit of the form.

});

function newPostHandler(data) {
    new_post = data.response;
    var length = theForm.app.fields.length;
    var newPostHtml = '';

    classList = new Array();
    classList[0] = '';
    classList[1] = 'app';
    classList[2] = theForm.app._id;
    load(classList);

    $("#theForm").fadeOut();
    $("#btnToggleFormDisplay").html('New ' + theForm.app.menuLabel);

}


function updatePost() {

    // build the data for submit


    var formData = new FormData();

    formData.append('command', 'post');
    formData.append('object', 'appUpdate');
    formData.append('appName', theForm.app.name);
    formData.append('appId', theForm.app._id);
    formData.append('postId', $('#currentPostId').val());

    var length = theForm.app.fields.length;
    var list = '';
    for (var i = 0; i < length; i++) {
        var field = theForm.app.fields[i];
        list = list + field.fieldName + " ";
        if (document.getElementById('view_' + field.fieldName) != undefined) {
            formData.append(field.fieldName, document.getElementById('view_' + field.fieldName).value);
        }

    }


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
        success: updatePostHandler,
        error: errorPostHandler,
        // Form data
        data: formData,
        dataType: "json",
        //Options to tell JQuery not to process data or worry about content-type
        cache: false,
        contentType: false,
        processData: false
    });
    return false; // avoid to execute the actual submit of the form.

};

function updatePostHandler(msg) {

    if (msg.response.success == 1) {
        $("#formStatusMsg").fadeIn(function () {
                load(new Array('jlink', 'app', theForm.app._id));
                $("#formStatusMsg").html('Success, your updates have been saved.');
            }
        );

    } else {
        $("#formStatusMsg").removeClass('success', function () {
            $("#formStatusMsg").addClass('error', function () {
                $("#formStatusMsg").fadeIn(function () {
                        $("#formStatusMsg").html('Oh!, your updates were not saved.');
                    }
                );
            });
        });

    }
}


function renderPost(postFields, post) {
    PostHtml = '';
    try {
        var createdx = (typeof(post.posted) != "undefined") ? post.posted : "";
        var date = new Date(createdx);
        created = long_long_ago(date.getTime() / 1000);
        var title;

//postFields = $.evalJSON( postFields );
        var length = theForm.app.fields.length;
        var PostHtml = '';
        var title = theForm.app.name;
        for (var i = 0; i < length; i++) {
            fieldName = theForm.app.fields[i].fieldName;
            var field = eval('postFields.' + fieldName);

            PostHtml = PostHtml + "<label class='fieldTitle'>" + theForm.app.fields[i].fieldName + "</label><label class='smallFont'> " + nl2br(field) + "</label>";
            if (theForm.app.fields[i].fieldType == 'text') {
                if (theForm.app.fields[i].useAsTitle !== 'undefined' && theForm.app.fields[i].useAsTitle == 'true') {
                    title = field;
                }
            }
            if (theForm.app.fields[i].fieldType == 'fileUpload') {
                PostHtml = PostHtml + "<img class='postImg' src='/dispatch?id=" + field + "' />";
            }
        }
        var TitleHtml = "<div class='post alert alert-info mb5' onclick='highlightPost(this)'><a class='pull-left' href='#'> \
	  <img class='profile' src='" + post.postedBy.photo + "'></a> \
	  <h4 class='media-heading'>" + post.postedBy.displayName + " &raquo; <img class='iconSmall' src='/dispatch/?id=" + theForm.app.icon + "' /> " + title + "</h4><span class='postMeta'>" + created + "</span> \
	  <a onclick='loadPost(\"" + post._id + "\");'><div class='media-body '>";

        PostHtml = TitleHtml + PostHtml + "</div></a></div></div>";
    } catch (err) {
        PostHtml = '';
    }
    return PostHtml;
}


function renderBucket(postFields, post) {
    var createdx = (typeof(post.posted) != "undefined") ? post.posted : "";
    var date = new Date(createdx);
    created = long_long_ago(date.getTime() / 1000);

//postFields = $.evalJSON( postFields );
    var length = theForm.app.fields.length;
    var PostHtml = "<li class='post bucket bucket1 m5' onclick='highlightPost(this)'>\
  <div class='alert alert-info mb5'><a class='pull-left' href='#'> \
  <img class='profile' src='" + post.postedBy.photo + "'></a> \
  <h4 class='media-heading'>" + post.postedBy.displayName + " &raquo; <img class='iconSmall' src='/dispatch/?id=" + theForm.app.appIcon + "' /> " + theForm.app.name + "</h4><span class='postMeta'>" + created + "</span></div> \
  <a onclick='loadPost(\"" + post._id + "\");'><div class='media-body m5 smallfont'>";
    for (var i = 0; i < length; i++) {
        fieldName = theForm.app.fields[i].fieldName;
        var field = eval('postFields.' + fieldName);

        PostHtml = PostHtml + "<label class='fieldTitle'>" + theForm.app.fields[i].fieldName + "</label><label class='smallFont'> " + nl2br(field) + "</label>";

        if (theForm.app.fields[i].fieldType == 'fileUpload') {
            PostHtml = PostHtml + "<img class='postImg' src='/dispatch?id=" + field + "' />";
        }

    }
    PostHtml = PostHtml + "</div></a></div></li>";
    return PostHtml;
}


function renderGrid(data, postid) {
//data = $.evalJSON( data );
    var length = theForm.app.fields.length;
    var PostHtml = "<tr  onclick='loadPost(\"" + postid + "\");'>";
    for (var i = 0; i < length; i++) {
        fieldName = theForm.app.fields[i].fieldName;

        if (fieldName !== 'command' && fieldName !== 'app' && fieldName !== 'appName') {
            var field = eval('data.' + fieldName);

            PostHtml = PostHtml + "<td>" + field + "</td>";
        }
    }
    PostHtml = PostHtml + "</tr>";
    return PostHtml;
}


function rendertableHead() {
    var PostHtml = '<tr>';
    var length = theForm.app.fields.length;
    for (var i = 0; i < length; i++) {
        fieldName = theForm.app.fields[i].fieldLabel;
        PostHtml = PostHtml + "<th>" + fieldName + "</th>";

    }
    PostHtml = PostHtml + "</tr>";
    return PostHtml;
}

function errorPostHandler(id) {
    alert('Error Posting Data - Try Again');
}

function loadTabsHTML(item) {
    var request = $.ajax({
        url: "/api/?i=1",
        type: "POST",
        data: {command: "do", object: item},
        dataType: "json"
    });
    request.done(function (msg) {

        var length = msg.response.length,
            element = null;
        titles = '';
        contents = '';
        for (var i = 0; i < length; i++) {
            $('#tabsMenu-' + (i + 1)).html(msg.response[i].title);
            $('#tabs-' + (i + 1)).html(msg.response[i].content);

        }

//$("#itemTitle").html(data);
    });
    request.fail(function (jqXHR, textStatus) {
        alert("Clouds Request failed: " + textStatus);
    });
}

function loadHTML(item, callback) {
    var request = $.ajax({
        url: "/api/?i=1",
        type: "POST",
        data: {command: "get", object: 'snippet', item: item},
        dataType: "json"
    });
    request.done(function (msg) {


        contents = msg.response[0].content;
        callback(contents);
    });

    request.fail(function (jqXHR, textStatus) {
        error = "<div class='alert alert-error'>LoadHTML Request failed: " + textStatus + '</div>';
        callback(error);
    });
}

function postComment(postId) {
    var comment = $('#comment').val();

    var request = $.ajax({
        url: "/api/?i=1",
        type: "POST",
        data: {command: "do", object: 'comment', item: theForm.app._id, comment: comment, postId: postId},
        dataType: "json"
    });
    request.done(function (msg) {

        comment = msg.response;
        var contents = '<div class=comments><h4><img class="iconSmall" src="' + comment.postedBy.photo + '" /> ' + comment.postedBy.displayName + '</h4>' + comment.comment + '</div>';

        $('#comments').html(contents + $('#comments').html());


    });

    request.fail(function (jqXHR, textStatus) {
        error = "<div class='alert alert-error'>Request failed: " + textStatus + '</div>';
        alert(error);
    });
}


function getUserNewsFeed(callback) {
    var request = $.ajax({
        url: "/api/?i=1",
        type: "POST",
        data: {command: "get", object: 'userNewsFeed'},
        dataType: "json"
    });
    request.done(function (msg) {

        if (0 == msg.response.posts.length) {
            callback('');
        } else {

            UserNewsFeed = renderNewsFeed(msg.response.posts);
            callback(UserNewsFeed);
        }

    });
    request.fail(function (jqXHR, textStatus) {
        alert("Posts Request failed: " + textStatus);
        return false;
    });
}

function renderNewsFeed(posts) {

    var postcount = posts.length;
    PostHtml = "";
    for (var i = 0; i < postcount; i++) {

        PostHtml = PostHtml + renderNewsFeedPost(posts[i]);
    }
    return PostHtml;
}

function renderNewsFeedPost(post) {
    PostHtml = '';
    try {
        postdataJson = $.evalJSON(post.fieldData);
        var postdata = $.map(postdataJson, function (k, v) {
            return [Array(v, k)];
        });
        var length = postdata.length;
//convert post date to nice time since
        var createdx = (typeof(post.posted) != "undefined") ? post.posted : "";
        var date = new Date(createdx);
        created = long_long_ago(date.getTime() / 1000);

        var PostHtml = "<div class='media posties'>";
        PostHtml = PostHtml + "<button type='button' class='close' data-dismiss='alert'>&times;</button> \
  <div class='alert alert-info mb5'><a class='pull-left' href='#'> \
  <img class='profile' src='/dispatch/?id=" + post.appIcon + "' /></a> \
  <h4 class='media-heading'>" + postdata[2][1] + " &raquo; <img class='iconSmall' src='" + post.postedBy.picture + "'> " + post.postedBy.displayName + "</h4><span class='postMeta'>" + created + "</span></div> \
  <a onclick='loadPost(\"" + post._id + "\");'><div class='media-body m5 smallfont'>";
        for (var i = 4; i < length; i++) {
            fieldName = postdata[i][0];
            fieldValue = postdata[i][1];
            PostHtml = PostHtml + fieldName + '<label class="smallFont">' + fieldValue + '</label>';

        }
        PostHtml = PostHtml + "</div></a></div>";

    } catch (err) {
        PostHtml = '';
    }
    return PostHtml;
}

function loadPost(postId) {
    $('#modalPostContent').html("<img src='/images/ajax-loader.gif' />");
    $('#postViewer').fadeIn();
    $('#formStatusMsg').fadeOut();

    var request = $.ajax({
        url: "/api/?i=1",
        type: "POST",
        data: {command: "get", object: 'post', item: postId},
        dataType: "json"
    });
    request.done(function (msg) {


        element = null;
        data = '';

//theForm.app = msg.response.app;
        theForm.posts = msg.response.posts;
        theForm.comments = msg.response.comments;
        theForm.users = msg.response.users;
        icon = theForm.posts[0].postedBy.photo
        Description = theForm.posts[0].postedBy.displayName;


//jsonfields = msg.response.fields;

//theForm.app.fields=$.evalJSON(jsonfields);


        var fields = '<input type="hidden" id="currentPostId" value="' + theForm.posts[0]._id + '" />';

        if (theForm.app.fields !== null) {
            var length = theForm.app.fields.length;

            var datePickerFields = Array();
            var datePickerCount = 0;

            var data = theForm.posts[0].fieldData;
            //get the post date
            var createdx = (typeof(theForm.posts[0].posted) != "undefined") ? theForm.posts[0].posted : "";
            var date = new Date(createdx);
            created = long_long_ago(date.getTime() / 1000);
//get the post field values
// data = $.evalJSON( post );


            for (var i = 0; i < length; i++) {
                var field = theForm.app.fields[i];
                var fieldValue = eval('data.' + field.fieldName);
                switch (field.fieldType) {


                    case 'text':
                        fields = fields + '<label>' + field.fieldLabel + "</label><input value='" + fieldValue + "' name='" + field.fieldName + "' id='view_" + field.fieldName + "' title='" + field.fieldToolTip + "' type='text' class='formfield " + field.fieldId + ' ' + field.fieldSize + "'><br>";
                        break;

                    case 'textarea':
                        fields = fields + '<label>' + field.fieldLabel + "</label><textarea rows=6  name='" + field.fieldName + "' id='view_" + field.fieldName + "'  class='formfield " + field.fieldId + ' ' + field.fieldSize + "'>" + fieldValue + "</textarea><br>";
                        break;

                    case 'select':
                        fields = fields + '<label>' + field.fieldLabel + "</label><select  name='" + field.fieldName + "' id='view_" + field.fieldName + "' class='formfield " + field.fieldId + ' ' + field.fieldSize + "'><option>" + fieldValue + "</option></select><br>";
                        break;

                    case 'userSelectTo':
                        var userOptions = ''
                        for (var j = 0; j < theForm.users.length; j++) {
                            if (fieldValue == theForm.users[j].displayName) {
                                userOptions += '<option selected>' + theForm.users[j].displayName + '</option>';
                            } else {
                                userOptions += '<option>' + theForm.users[j].displayName + '</option>';
                            }
                        }

                        fields = fields + '<label>' + field.fieldLabel + "</label><select  name='" + field.fieldName + "' id='view_" + field.fieldName + "' class='formfield " + field.fieldId + ' ' + field.fieldSize + "'>" + userOptions + "</select><br>";
                        break;

                    case 'listbox':
                        fields = fields + '<label>' + field.fieldLabel + "</label><select size=4  name='" + field.fieldName + "' id='view_" + field.fieldName + "' class='formfield " + field.fieldId + ' ' + field.fieldSize + "'><option>" + fieldValue + "</option></select><br>";
                        break;

                    case 'fileUpload':
                        fields = fields + "<label>" + field.fieldLabel + "</label><br><a class='btn' href='/dispatch?id=" + fieldValue + "'>AttachmentID: " + fieldValue + "</a><br><img src='/dispatch?id=" + fieldValue + "' /><br><input value='" + fieldValue + "' name='" + field.fieldName + "' id='view_" + field.fieldName + "' title='" + field.fieldToolTip + "' type='hidden' class='formfield " + field.fieldId + ' ' + field.fieldSize + "'>";
                        break;

                    case 'datePicker':
                        fields = fields + '<label>' + field.fieldLabel + "</label><input value='" + fieldValue + "' name='" + field.fieldName + "' id='view_" + field.fieldName + "' title='" + field.fieldToolTip + "' type='text' class='formfield " + field.fieldId + ' ' + field.fieldSize + " datePicker'><br>";
                        datePickerFields[datePickerCount] = "view_" + field.fieldName;
                        datePickerCount++;
                        break;

                    case 'submit':
                        fields = fields + '<label>' + field.fieldLabel + "</label><input class='btnDynamicSubmit bth btn-primary'  name='" + field.fieldName + "' id='dynamic_Submit' type='submit' class='formfield " + field.fieldId + ' ' + field.fieldSize + "' value='" + field.fieldValue + "'><br>";

                        break;
                }

                // Do something with element i.
            }
//fields = fields + "<div id='submitForm'><button class='btnDynamicSubmit btn btn-primary'>Submit</button></div>";
        }
        var length = theForm.posts.length;
        var commentsWrap = '';
        if (theForm.app.allowComments) {
            var comments = '';

            var length = theForm.comments.length;
            for (var i = 0; i < length; i++) {
                var comment = '<div class=comments><h4><img class="iconSmall" src="' + theForm.comments[i].postedBy.photo + '" /> ' + theForm.comments[i].postedBy.displayName + '</h4>' + theForm.comments[i].comment + '</div>';

                comments = comment + comments;
            }

            commentsWrap = "<div id='commentsWrap'><hr><h4>Comments (" + theForm.comments.length + ")</h4><label>&nbsp;</label><textarea id='comment' \ placeholder='Comment' class='Large'></textarea><label>&nbsp;</label><button onclick=postComment('" + postId + "') class='btn btn-small btn-primary'>Post Comment</button><hr><div id='comments'>" + comments + "</div></div>";
        }


        $('#ModalLabel').html(theForm.app.name);


        $('#postContent').html(fields + commentsWrap);
        $('#theModalFormDescription').html(created);
        $("#nowViewingModal img").attr("src", icon);

        for (var df = 0; df < datePickerCount; df++) {
            datePicker(document.getElementById(datePickerFields[df]));
        }
        scrolltoTop();
    });

    request.fail(function (jqXHR, textStatus) {
        alert("Clouds Request failed: " + textStatus);
    });
}

function highlightPost(me) {
    $('.post').removeClass('highlight', function () {
        $(me).addClass('highlight');
    })
}


// angular bits'nbobs

/////////////////////////////////////////////////////////////////////////////////////


// controls the movement of the posts viewer, keeping it fixed to the top of the page but not when scrolling inside it.
/////////////////////////////////////////////////////////////////////////////////////


function datePicker(me) {
    $(me).datepicker({
        showOn: "button",
        buttonImage: "/static/images/calendar.gif",
        buttonImageOnly: true,
        dateFormat: "DD, d MM, yy"
    });
};


function scrolltoTop() {
    var $sidebar = $("#postViewer"),
        $window = $(window),
        offset = $sidebar.offset(),
        topPadding = 0;


    $sidebar.animate({marginTop: $window.scrollTop()})


};

// Ascii Newline tohtml <br>

function nl2br(str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}



    
