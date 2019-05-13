
var lists = [];
var user = {};
var itemcount = 0; 
var lat, lon;
var map;
var insideCarousel = false;
var GroupedByList = [];
  // storemodal
  // storemodalinfo
  // addmodalarea
  // storemodalclose

  // addeditlistmodal
  // addeditmodalbody
  // addmodalarea
  // addeditmodaldone



$(document).ready(function () {
    $('#storemodal').modal();
    $('#addeditlistmodal').modal();
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
    //createTredndingProducts();

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
            $('#listdisplay').empty()
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
                $('#itemaddarea').empty()
                $('#newlist').hide();
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
   // walmart_GetTrending();
    $(document).on('getTrending', function (data) {
        var products = data.message.items;
        if (products) {
         //  makeCarousel(products)
        }


    })
        



}
function createSearchedProducts(_query) {
    if (!insideCarousel) {
        insideCarousel = true;
    } else {
        return;
    }
    //walmart_SearchItems(_query);
    // $(document).on('getWalmartItemSearch', function (data) {
    //     var products = data.message.data.items;
      
    //     if (products) {
    //        makeCarousel(products)
    //     }

    //     insideCarousel = false;
    // })
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
                        if(!Array.prototype.includes(items)){
                         items.push(item)
                        }
                    }
                }
                   GroupedByList.push({
                       list_id: distinctListIds[i],
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
            startWithNoList('#addlist')
        } else {
            startWithNoList('#nolist')


        }
    })
}
function startWithNoList(_element) {
    $(_element).show();
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
    
    $(item).focusout(function (event) {
        var itemleaveing = $(event.target);
        var theitem, walmat_category, itemname, walmart_itemid;
        itemname = $(event.target).val().trim();
        if (itemname.length < 3) {
             
            return;
        }
         $('.additem').removeClass('disabled')
        //$(itemleaveing).prop('readonly', true);
        //< i class = "material-icons" > create < /i>
        var id = $(itemleaveing).attr('id')
        var newId = "edit_" + id
        if (!$('#'+newId)) {
            var edit = $('<i>')
            $(edit).addClass('material-icons').text("create");
            $(edit).attr('id', newId)
            $(edit).click(function (event) {
                var parent = $(event.target).parent()
                $(parent).prop('readonly', false)
                $(event.target).remove();
            })

            $(itemleaveing).append(edit);
        }
        walmart_SearchItems(itemname, { lineid: '#' + (it.toString()) });
        
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
                catNodeId = catNodeId ? catNodeId : 1
                lastCategory = lastCategory ? lastCategory : 'none'
                $(idofline).attr('data-category', catNodeId);
                $(idofline).attr('data-categorypath', lastCategory)
            } else {
                 $(idofline).attr('data-category', 1);
                 $(idofline).attr('data-categorypath', 'none')
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
    var display = $('#listdisplay')
    $(display).hide()
    $(display).empty()
var numberofList = listsObjArray.length
for(let c = 0; c < numberofList; c++){
        var card = $('<div>')
        var content = $('<div>')
        $(content).addClass('card-content')

        var drawnList = drawList(listsObjArray[c]);
        $(card).addClass('card col-2').addClass('shadow')
        $(content).append(drawnList)
        $(card).append(content)
        $(display).append(card)
    }
     $('#listdisplay').show()

}
function itemAdd(_itemNum){

  
    var item = $('<input>');
   
    
    $(item).addClass('listitem');
    var it = 'item_' + _itemnumber.toString();
    $(item).attr('id', 'item_' + _itemnumber.toString());
    
    $(item).focusout(function (event) {
        var itemleaveing = $(event.target);
        var theitem, walmat_category, itemname, walmart_itemid;
        itemname = $(event.target).val().trim();
        if (itemname.length < 3) {
             
            return;
        }
         $('.additem').removeClass('disabled')
        //$(itemleaveing).prop('readonly', true);
        //< i class = "material-icons" > create < /i>
        var id = $(itemleaveing).attr('id')
        var newId = "edit_" + id
        if (!$('#'+newId)) {
            var edit = $('<i>')
            $(edit).addClass('material-icons').text("create");
            $(edit).attr('id', newId)
            $(edit).click(function (event) {
                var parent = $(event.target).parent()
                $(parent).prop('readonly', false)
                $(event.target).remove();
            })

            $(itemleaveing).append(edit);
        }
        walmart_SearchItems(itemname, { lineid: '#' + (it.toString()) });
        
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
               $(idofline).attr('data-category', '1');
               $(idofline).attr('data-categorypath', 'none')
            }
            
            var itemsdiv = $('#itemaddarea');
            $(itemsdiv).append(idofline);
        })



    })
   
}
function buildAddItem(_appendArea) {
    var g = $(_appendArea)
    $(g).empty()
    var h = $('#newitems').clone( false, false)
    //ADD CLICK HANDELER and fix itemAdd(_itemNum)
    $(h).appendTo(g)
    return h
}
function buildModal(_caller, _modal, _bodytext, _content, _done) {
    $(_bodytext).text('Add new Items. Then Click Done')

     $(_modal).modal('open');
 }

function drawList(listObject) {
    console.log(listObject);
    var addTo = $('<a>')
    $(addTo).addClass('waves-effect waves-light btn-small').data('type', 'edit')
    $(addTo).text('+ Add').click(function (event) {
        var caller = event.target
        var modal = $('#addeditlistmodal')
        var bodytext = $('#addeditmodalbody')
        var area = $('#addmodalarea')
        var done = $('#addeditmodaldone')
        var content = buildAddItem(area)
         buildModal(caller, modal, bodytext, content, done)
       
    })
    var button = $('<a>')
    $(button).addClass('waves-effect waves-light btn-small')
    $(button).text('Sort List').click(function (event) {
        sortList(event)
    })
    var l = drawListItems(listObject.items)
    var cardfooter = $('<div>')
    $(cardfooter).addClass('card-action').append(addTo).append(button)
    $(l).append(cardfooter)
    return l
}
function drawListItems(itemsObjarray) {
 
    var ul = $('<ul>')
  for (var itemObj of itemsObjarray) {
    var li = $('<li>')
    $(li).attr('data-categoryid', itemObj.walmart_category_id)
    $(li).attr('data-category', itemObj.walmart_category)
    var ch = makeCheckBox(itemObj.name, ('gotit_' + itemObj.item_id.toString()));
    $(li).addClass('collection-item').append(ch)
  
    $(ul).append(li)
var idname = 'sortable_' + itemsObjarray.list_id
      $(ul).addClass('collection').attr('id', idname).sortable().disableSelection()
      
    }
    return ul

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
function sortList(event) {
    var list = $(event.target).closest('ul')[0]
    var listitems = $(list).children('li')
    var _sortList = Array.prototype.sort.bind($(listitems));
    var _ascending = true
    doSort(_ascending, _sortList)
    function doSort(ascending, sortList) {

      
       var sn = function(a, b) {

            var aText = $(a).attr('data-category')
            var bText = $(b).attr('data-category')

            if (aText < bText) {
                return ascending ? -1 : 1;
            }

            if (aText > bText) {
                return ascending ? 1 : -1;
            }

            return 0;
        }
        var sl = sortList(sn);
        $(list).append(sl);

    };
    
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
        redirectUrl: "https://fe41a14.online-server.cloud/php-api/signin.html",
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
