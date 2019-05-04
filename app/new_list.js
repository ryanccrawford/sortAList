
var lists = [];
var user = {};
var itemcount = 0; 
var lat, lon;
var map;

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
                    var area = $('#itemaddarea')
                    var childeren = $(area)[0].childNodes
                    var countofitems = childeren.length
                    console.log(childeren)
                    for (let l = 0; l < countofitems; l++) {
                        var pushItem = $('#item_' + l.toString());
                        var name = $(pushItem).val()
                        var category = $(pushItem).data('category');
                        listitems.push({
                            name: name,
                            category: category
                        })
                    }

                    data_AddList(user.id, listTitle, {
                        items: listitems
                    });
                    $(document).on('addedList', function (data) {
                        var message = data.message
                        var listid = message.data['list_added']
                        var listitems = message.obj['items']
                        listitems.forEach(function (li) {
                            var ar = li.category.split('_')
                            var cid = ar[ar.length - 1]
                            data_AddItem(user.id, li.name, cid, li.category, listid)



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
    var it = 'item_' + _itemnumber.toString();
    $(item).attr('id', 'item_' + _itemnumber.toString());
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
                var parent = $(event.target).parent()
                $(parent).prop('readonly', false)
                $(event.target).remove();
            })

            $(itemleaveing).after(edit);
        }
        walmart_SearchItems(itemname, { lineid: '#' + it });
        
        $(document).on('getWalmartItemSearch', function (data) {
            var itemw = data.message.data
            var idofline = data.message.arguments.lineid
            if (itemw.items && itemw.items.length > 0) {
                var category =  itemw.items[0].categoryPath;
                var catNode = itemw.items[0].categoryNode;
                $(idofline).attr('data-category', catNode);
                $(idofline).attr('data-category-path', category)
            } else {
                 $(idofline).attr('data-category', 'unknown');
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
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: lon,
            lng: lat
        },
        zoom:15
    });
    var marker = new google.maps.Marker({
        position: {
            lat: lon,
            lng: lat
        },
        map: map,
        title: 'Your Store'
    });
}