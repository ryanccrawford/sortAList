
var lists = [];
var user = {};
var itemcount = 0; 
var lat, lon;
$(document).ready(function () {
    user.id = localStorage.getItem("userid");
    user.email = localStorage.getItem("useremail");

    $('#username').text(user.email);
    createMap();
    checklist();
        
})




function checklist() {
    data_GetAllListsForUser(user.id);

    $(document).on('getAllListsForUser', function (data) {
        var obj = data.message.lists;
        if (obj) {
            obj.forEach(function (list) {
                lists.push(list);
            })
            drawLists(lists)
        } else {
            $('#nolist').show();
            $('.addlist').click(function (event) {
                $('#newlist').show();
                $('#nolist').hide();
                itemcount = 0;
            })
            var itemtitle = $('#newtitle');
            if ($(itemtitle).val().length > 0) {
                $('.additem').removeClass('disabled');

            }
            $('#newtitle').keyup(function (event) {
                var len = $('#newtitle').val().length;
                if (len > 0) {
                    $('.additem').removeClass('disabled')
                } else {
                    $('.additem').addClass('disabled')
                }

            })
            $('.additem').click(function (event) {
                if (itemcount != 0) {
                    var lastItem = $('#item_' + (itemcount - 1).toString()).val();

                    if (lastItem && lastItem.length != 0) {
                        additemAddList(itemcount);

                        itemcount++
                        $('.additem').addClass('disabled')
                    }
                } else {
                    additemAddList(itemcount);

                    itemcount++
                    $('.additem').addClass('disabled')
                }


            })
            $('.savelist').click(function (event) {

                if (validateItems()) {
                    var listTitle = $('#newtitle').val()
                    var listitems = []
                    var countofitems = $('#itemaddarea').childeren().length
                    for (let l = 0; l < countofitems; l++) {
                        var pushItem = $('#item_' + l.toString());
                        var name = $(pushItem).val()
                        var category = $(pushItem).data('category');
                        listitems.push({
                            name: name,
                            category: category
                        })
                    }

                    data_AddList(user.id, listTitle);
                    $(document).on('addedList', function (data) {
                        var listid = data.list_added
                        listitems.forEach(function (li) {

                            data_AddItem(user.id, li.name, _categoryid, li.category, listid)



                        })


                    })
                }

            })



        }
    })
}
function validateItems() {
    var valid = true;
    for (let l = 0; l < itemcount; l++){
        var lastItem = $('#item_' + l.toString()).val().trim();
        if (lastItem.length < 1) {
            valid = false;
        }
    }
    return valid;
}
function addList() {
    $('#itemaddarea').empty()
   $('#newlist').show()
   



}
function additemAddList(_itemnumber) {
    
    var item = $('<input>');
    var itemsdiv = $('#itemaddarea');
    
    $(item).addClass('listitem');
    $(item).attr('id', 'item_' + _itemnumber);
    $(item).keyup(function (event) { 
          itemname = $(event.target).val().trim();
          if (itemname.length == 0) {
              if (!$('.additem').hasClass('disabled')) {
                 $('.additem').addClass('disabled')
            }
              return;
          }
          $('.additem').removeClass('disabled')
    })
    $(item).focusout(function (event) {
        var itemleaveing = $(event.target);
        var theitem, walmat_category, itemname, walmart_itemid;
        itemname = $(event.target).val().trim();
        if (itemname.length < 3) {
             
            return;
        }
         $('.additem').removeClass('disabled')
        $(itemleaveing).prop('readonly', true);
        //< i class = "material-icons" > create < /i>
        var id = $(itemleaveing).attr('id')
        var newId = "edit_" + id
        if (!$('#'+newId)) {
            var edit = $('<i>')
            $(edit).addClass('material-icons text-black').text("create");
            $(edit).attr('id', newId)
            $(edit).click(function (event) {
                var parent = $(this).parent()
                $(parent).prop('readonly', false)
                $(edit).remove();
            })

            $(itemleaveing).after(edit);
        }
        walmart_SearchItems(itemname);
        
        $(document).on('getWalmartItemSearch', function (data) {

            var itemw = data.message
            console.log(itemw.items)
            if (itemw.items && itemw.items.length > 0) {
                var category = itemw.items[0].categoryPath;
                var categoryNode = itemw.items[0].categoryNode;
                $(item).attr('data-category', category);
                console.log(item);
            } else {
                 $(item).attr('data-category', 'unknown');
            }
            

        })



    })
    $(itemsdiv).append(item);
}
function showLastList() {

}
function showList(listid) {
    


}
function drawLists(listsObjArray) {
    listsObjArray.forEach(function (liobj) {
        drawList(liobj);
    })
}
function drawList(listObject) {
    console.log(listObject);
}
function drawListItems(itemsObjArray) {
 


}
function sortList() {
    

}
function createMap() {
    
    

    mash_getUserWalmartStore(user.id)
 var map;

 function initMap() {
     map = new google.maps.Map(document.getElementById('map'), {
         center: {
             lat: lat,
             lng: lon
         },
         zoom: 8
     });
 }
    $(document).on('getWalmartStores', function (data) {
        console.log(data.message)
        var cords = data.message[0].coordinates
        lat = cords[0];
        lon = cords[1];
       
         var mapssrc = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDiaHiIDgafsFhfwb1XQBtKETZ1zdlrP_o&callback=initMap';
        $.getScript(mapssrc, function (data, status, jqxhr) {
            console.log(data)
            console.log(status)
            console.log(jqxhr)
        

        });
       

    })
    

    

}