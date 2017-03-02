// Document ready

$(function () {
    $("#fblogin").click(function() {
        window.location.replace("https://www.facebook.com/v2.8/dialog/oauth?client_id=1108439522617596&redirect_uri=http://localhost:3000/fb_login&scope=manage_pages,publish_pages");
    });
});
