// Document ready

$(function () {
    $("#excel_upload").click(function() {
        alert("Megnyomtad!");
    });
    $("#post").click(function() {
        $.get("/post_test")
    });
});