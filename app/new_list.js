
var lists = [];
var user = {};
var itemcount = 0; 
var lat, lon;
var map;
var insideCarousel = false;
$(document).ready(function () {

    
    
    user.id = localStorage.getItem("userid");
    user.email = localStorage.getItem("useremail");

    $('#username').text(user.email);
    createMap();
    checklist();
    createTredndingProducts();

    $('.addlist').click(function (event) {
         $('#newlist').show();
         $('#nolist').hide();
         itemcount = 0;
    })
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
            
            var area = $('#itemaddarea')
            var childeren = $(area)[0].childNodes
            var itemsToAdd = inputNodesToList(childeren)
            
            data_AddList(user.id, listTitle, {
                items: itemsToAdd
            });
            $(document).on('addedList', function (data) {
                var returnedData = data.message
                var robj = returnedData.obj
                var revent = returnedData.event
                var rdata = returnedData.data
                console.log(returnedData)
                
            })

        }

    })
})
function inputNodesToList(_nodes) {
    var listitems = []
    var countofitems = _nodes.length
    for (let l = 0; l < countofitems; l++) {
        var pushItem = $(_nodes[l])
        var name = $(pushItem).val()
        var categoryId = $(pushItem).data('category');
        var categoryPath = $(pushItem).data('categorypath');
        listitems.push({
            name: name,
            categoryId: categoryId,
            categoryPath: categoryPath
        })
    }
    return listitems
}
function createTredndingProducts() {
    walmart_GetTrending();
    $(document).on('getTrending', function (data) {
        var products = data.message.items;
        if (products) {
            var carousel = $('#trendproducts')
            console.log(products)
            var plen = products.length
            for (let i = 0; i < plen; i++) {
                var product = products[i]
                console.log(product)
                var itemId = product.itemId
                var title = product.name
                var brand = product.brandName
                var image = product.imageEntities[0].thumbnailImage
                var price = product.salePrice
                var catagoryNode = product.categoryNode
                var categoryPath = product.categoryPath.split('/')
                var category = categoryPath[categoryPath.length - 1]

                var ci = $('<a>')
                $(ci).addClass('carousel-item').attr('href', "#")
                $(ci).data('category', catagoryNode)
                $(ci).data('itemid', itemId)
                var div = $('<div>')
                $(div).addClass('col')
                var h = $('<h5>')
                $(h).addClass('header').text(title)
                var img = $('<img>')
                $(img).attr('src', image)
                var p = $('<p>')
                $(p).html(brand + " <br>price $" + price)
                var p2 = $('<p>')
                $(p2).text(category)
                $(div).append(h).append(img).append(p).append(p2)
                $(ci).append(div)
                $(carousel).append(ci)
            }
             $(carousel).addClass('carousel')
             $('.carousel').carousel();

        }


    })
        



}
function createSearchedProducts(_query) {
    if (!insideCarousel) {
        insideCarousel = true;
    } else {
        return;
    }
    walmart_SearchItems(_query);
    $(document).on('getWalmartItemSearch', function (data) {
        var products = data.message.data.items;
        if (products) {
            var carousel = $('#trendproducts')

            console.log(products)
            var plen = products.length
            for (let i = 0; i < plen; i++) {
                var product = products[i]
                console.log(product)
                var itemId =  product.itemId
                var title = product.name
                var brand =  product.brandName
                var image = product.thumbnailImage
                var price = product.salePrice
                var catagoryNode = product.categoryNode
                var categoryPath =  product.categoryPath.split('/')
                var category = categoryPath[categoryPath.length - 1]
                
                var ci = $('<a>')
                $(ci).addClass('carousel-item').attr('href',"#")
                $(ci).data('category', catagoryNode)
                $(ci).data('itemid', itemId)
                var div = $('<div>')
                $(div).addClass('col')
                var h = $('<h5>')
                $(h).addClass('header').text(title)
                var img = $('<img>')
                $(img).attr('src', image)
                var p = $('<p>')
                $(p).html(brand + " <br>price $" + price)
                var p2 = $('<p>')
                $(p2).text(category)
                $(div).append(h).append(img).append(p).append(p2)
                $(ci).append(div)
                $(carousel).append(ci)
            }

            $(carousel).addClass('carousel')
            $('#trendproducts').carousel();
            }

        insideCarousel = false;
    })




}
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
            startWithNoList()


        }
    })
}
function startWithNoList() {
    $('#nolist').show();
   var itemtitle = $('#newtitle');
   if ($(itemtitle).val().length > 0) {
       $('.additem').removeClass('disabled');
   }
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
        if (itemname.length > 3) {
            $('#trendproducts').empty()
            if ($('#trendproducts').hasClass('carousel')) {
                $('#trendproducts').removeClass('carousel')
            }
            createSearchedProducts(itemname);
        }
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
                var categorys = itemw.items[0].categoryPath;
                var category = categorys.split('/')
                var lastCategory = category[category.length - 1]
                var catNodes = itemw.items[0].categoryNode;
                var catNode = catNodes.split('_')
                var catNodeId = catNode[catNode.length-1]
                $(idofline).attr('data-category', catNodeId);
                $(idofline).attr('data-categorypath', lastCategory)
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