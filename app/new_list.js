
var lists = [];
var user = {};
var itemcount = 0; 
var lat, lon;
var map;
var insideCarousel = false;
var GroupedByList = [];
$(document).ready(function () {

   $('.exit').click(
       function(){
           localStorage.setItem('userid', null)
            window.location.href = "index.html"
       }
   )
    
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
                console.log(returnedData)
                $('.trendingproduct').hide();
                $('#listdisplay').empty()
                checklist()
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
           makeCarousel(products)
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
           makeCarousel(products)
        }

        insideCarousel = false;
    })
}
function makeCarousel(_products) {
      var carousel = $('#trendproducts')
      var plen = _products.length
      for (let i = 0; i < plen; i++) {
          var product = _products[i]
          console.log(product)
          var itemId = product.itemId
          var title = product.name
          var brand = product.brandName
          var image = product.thumbnailImage
          var price = product.salePrice
          var catagoryNode = product.categoryNode
          var categoryPath = product.categoryPath.split('/')
          var category = categoryPath[categoryPath.length - 1]

          var ci = $('<a>')
          $(ci).addClass('carousel-item').attr('href', "#")
          $(ci).data('categoryid', catagoryNode)
          $(ci).data('itemid', itemId)
          $(ci).data('price', price)
          $(ci).data('category', categoryPath)
          $(ci).data('name', title)
          var div = $('<div>')
          $(div).addClass('col')
          var h = $('<h5>')
          $(h).addClass('header').text(title)
          var img = $('<img>')
          $(img).attr('src', image)
          var p = $('<p>')
          $(p).html("price $" + price)
          var p2 = $('<p>')
          $(p2).text(category)
          $(div).append(h).append(img).append(p).append(p2)
          $(ci).append(div)
          $(carousel).append(ci)
      }
      $(carousel).addClass('carousel')
      $('.carousel').carousel();

}
function checklist() {
    data_GetAllListsForUser(user.id);
    $(document).on('getAllListsForUser', function (data) {
        var obj = data.message.lists;
        
        if (obj) {
            
            var distinctListIds = [...new Set(obj.map(x=>x.list_id))]
            var countofList = distinctListIds.length
            for (let i = 0; i < countofList; i++) {
                var items = []
                for (var item of obj) {
                    if (item.list_id == distinctListIds[i]) {
                         items.push(item)
                    }
                }
                   GroupedByList.push({
                       list_id: i,
                       items: items
                   })
            }
             console.log(GroupedByList)
                
            
            // created_on: "2019-05-05"
            // item_id: "10"
            // list_id: "8"
            // name: "soup"
            // upc: null
            // user_id: "35"
            // walmart_category: "Soups"
            // walmart_category_id: "1001359"
            // walmart_id: null
            // walmart_price: null

            drawLists(GroupedByList)
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
    $('#listdisplay').empty()
    var display = $('#listdisplay')
    console.log(listsObjArray)
    listsObjArray.forEach(function (liobj) {
        var div = $('<div>')
        var drawnList = drawList(liobj);
        $(div).addClass('card-panel col-2').addClass('shadow').append(drawnList)
        $(display).append(div)
    })
     $('#listdisplay').show()

}
function drawList(listObject) {
    console.log(listObject);
    var button = $('<button>')
    $(button).addClass('btn') 
    $(button).text('Sort List')
    var l = drawListItems(listObject.items)
    
    $(l).append(button)
    return l
}
function drawListItems(itemsObjarray) {
 
    var ol = $('<ol>')
  for (var itemObj of itemsObjarray) {
    var li = $('<li>')
    $(li).data('categoryid', itemObj.walmart_category_id)
    $(li).data('category', itemObj.walmart_category)
    var ch = makeCheckBox(itemObj.name, ('gotit_' + itemObj.item_id.toString()));
    $(li).addClass('collection-item').append(ch)
  
    $(ol).append(li)
var idname = 'sortable_' + itemsObjarray.list_id.toString()
      $(ol).addClass('collection').attr('id', idname).load(function () {
           $("#" + idname).sortable();
           $("#" + idname).disableSelection();
       });
}
    return ol

}
function makeCheckBox(_label, _id = '', _checked = false) {
  
    var label = $('<label>')
    var input = $('<input>')
    var span = $('<span>')
    $(input).attr('type', 'checkbox').addClass('active')
    if (_id) {
        $(input).attr('id', _id)
    }
    if (_checked) {
         $(input).prop('checked', true)
    }
    $(span).text(_label)
    $(label).append(input).append(span)
    return label
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

function getAuthForKroger() {
    var config = {
        clientId: "ryanccrawford@live.com",
        oauth2BaseUrl: "https://api.kroger.com/v1/connect/oauth2",
        redirectUrl: "http://localhost/php-api/signin.htm",
        apiBaseUrl: "https://api.kroger.com"
    
    }
    var defualt = {
        apiBaseUrl: config.apiBaseUrl,
        oauth2BaseUrl: config.oauth2BaseUrl,
        clientId: config.clientId,
        redirectUrl: config.redirectUrl
    }
    var scope = encodeURIComponent('product.basic')
    var url = config.oauth2BaseUrl + '/authorize?'
        + 'client_id=' + encodeURIComponent(config.clientId)
        + '&redirect_uri=' + encodeURIComponent(config.redirectUrl)
        + '&response_type=code'
        + '&scope=' + scope;
    return url;
}
