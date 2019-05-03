$('document').ready(function () {

    $('#addList').click(function (event) {
        event.preventDefault();

        if ($('#newList').val().trim() != '') {
            var list = $('#newList').val().trim();
            var listName = $('<h5>').append(
                $('<span>').text(list).attr('id', 'listKey')
            );
        }

        $('#newList').val('');

        $('#newlistname').text(listName);

        console.log(list);

    });

    $('#addItem').click(function (event) {
        event.preventDefault();

        if ($('#newItem').val().trim() != '') {
            var item = $('#newItem').val().trim();
            var newRow = $("<tr>").append(
                $('<td>').text(item).attr('id', 'itemKey')
            );
        }

        $('#newItem').val('');

        $('#shoplist').append(newRow);

        console.log(item);

    });
})