$(document).ready(function () {
    $("#add-list").on("click", function (event) {
        event.preventDefault();

        if ($("#email").val() != '') {
            var newList = $('#new-list-name').val().trim();
        }
        addUserList(newList);
    })
})