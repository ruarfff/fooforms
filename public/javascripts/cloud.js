var theForm = new Object();
$(document).ready(function () {

    $('#mainTabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $('#tabsMenu-1').tab('show');


    getClouds('clouds', 'cloud', 'myClouds', function (biglinks) {
        $("#cloudStore").html("<div class='clearfix'>" + biglinks + "</div>" + $("#cloudStore").html());
    });

    getApps('apps', 'app', 'myApps', function (biglinks) {
        if (biglinks == '') {
            loadHTML('newAppForm', function (content) {
                $("#tabs-1").html(content);
            });
        } else {
            $("#tabs-1").html("<div class='clearfix'>" + biglinks + "</div>" + $("#tabs-3").html());
        }
    });


    doButtons();
    showInfoGuides();

    $(".jlink").live('click', function () {
        var classList = this.className.split(" ");
        load(classList);

    });

});
	
	
