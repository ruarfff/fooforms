var theForm = new Object();
$(document).ready(function () {

    $('#mainTabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $('#mainTabs a[href="#tabs-1"]').tab('show');


    getClouds('clouds', 'cloud', 'myClouds', function (biglinks) {
        $("#tabs-1").html("<div class='clearfix'>" + biglinks + "</div>" + $("#tabs-1").html());
    });

    getApps('apps', 'app', 'myApps', function (biglinks) {
        $("#appStore").html("<div class='clearfix'>" + biglinks + "</div>" + $("#appStore").html());
    });

    loadHTML('newCloudForm', function (content) {
        $("#tabs-3").html(content);
    });


    doButtons();
    showInfoGuides();

    $(".jlink").live('click', function () {
        var classList = this.className.split(" ");
        load(classList);

    });

});
	
	
