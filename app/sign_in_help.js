//Sign in help page
$(document).ready(function () {

    //Grab user input from text fields
    $("#sign-in-help").on("click", function (event) {
        event.preventDefault();

        if ($("#email").val() != '') {
            var userEmail = $("#email").val().trim();
        }
        resetPassword($email, $database);
    })
})