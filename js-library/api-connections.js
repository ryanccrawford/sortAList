    
const walmartApiKey = 'yetbamnvuptfsnzehnsz99nr'
const googleApiKey = 'AIzaSyDiaHiIDgafsFhfwb1XQBtKETZ1zdlrP_o'
const shoppingListApiKey = 'q98ejf-fqwefj-8wefqw8w'
const dataurl = 'https://fe41a14.online-server.cloud'
//const dataurl = "http://localhost/php-api"
var userslists = [];

var currentUser = {
    userid: null,
    email: null,
    password:null
}
var lat;
var lon;
//---------------------------ENDPOINT OBJECTS---------------------------------
var dataEnpoints = {
    createEndpoint: function (_endpoint,_action) {  
        return this.datahost + '/' + _endpoint + 'action=' + _action + '&' + 'apiKey=' + this.apiKey + '&XDEBUG_SESSION_START=netbeans-xdebug'
    },
    datahost: dataurl,
    'apiKey': shoppingListApiKey,
    users: 'api.php?api=users&',
    lists: 'api.php?api=lists&',
    listItems: 'api.php?api=listItems&'
}
var walmartEnpoints = {
    createEndpoint: function (_endpoint) {
        var ep = ''
        if (Array.isArray(_endpoint)) {
            _endpoint.forEach(function (item) {
                ep += item
            })
        } else {
            ep += _endpoint
        }
        return this.walmartHost + '/' + ep + 'apiKey=' + this.apiKey + "&categoryId=976759"
    },
    walmartHost: 'https://api.walmartlabs.com/v1',
    'apiKey': walmartApiKey,
    search: function (_query) {
        return ['search', ('?' + 'query=' + _query + '&')]
    },
    itemLookup: function (_lookUpParam) {
        return 'items' + _lookUpParam
    },
    valueOfDay: 'vod',
    taxonomy: 'taxonomy',
    locator: function(_zip){ 
        return ['stores', ('?' + 'zip=' + _zip + '&')]
    },
    trending: 'trends?'
}
var walmart_lookUpObj = {
    createlookupString: function (_obj) {
        if (_obj.upc) {
            return this.upc(_obj.upc)
        } else {
            return this.itemIds(_obj.ids)
        }
    },
    itemIds: function (_itemIds) { 
        var param = ''
        if (Array.isArray(_itemIds)) {
            param += '?ids='
            param += _itemIds.join(',') + '&'
        } else {
            param += '/' + _itemIds + '?'
        }
        return param
     },
    upc: function (upc) {
        return '?upc=' + upc + '&'
    }
}
//---------------------------PHP API USER FUNCTIONS---------------------------
function data_AddUser(_email,_password,_zip) {
   var endPoint = dataEnpoints.users
    var url = dataEnpoints.createEndpoint(endPoint, 'insert')
    var data = {
        "email": _email,
        "password": _password,
        "zip": _zip
    }
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data)
    }).then(function (response) {
        addedUserEventHandel(response)
    });
}
function makeCall(_type,_url,_data,_handelfunction){
$.ajax({
    type: _type,
    contentType: "application/x-www-form-urlencoded",
    headers: "Access-Control-Allow-Origin:*",
    url: _url,
    data: JSON.stringify(_data)
}).then(_handelfunction)
}
function data_LogInUser(_email, _password) {
    var endPoint = dataEnpoints.users
    var url = dataEnpoints.createEndpoint(endPoint, 'auth_user')
    var data = {
        "email": _email,
        "password": _password
    }
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data)
    }).then(function (response) {
        isLoggedInEventHandel(response)
    });
}
function data_getUserEmail(_userid) {
    var endPoint = dataEnpoints.users
    var url = dataEnpoints.createEndpoint(endPoint, 'get_email')
    var data = {
        "userid": _userid
    }
    $.ajax({
        type: "POST",
        url: url,
        contentType: "application/x-www-form-urlencoded",
        headers: "Access-Control-Allow-Origin:*",
        data: JSON.stringify(data)
    }).then(function (response) {
        getUserEventHandel(response)
    });
}
//---------------------------PHP API LIST FUNCTIONS---------------------------
function data_AddList(_userid, _listname, _obj = {}) {
    var endPoint = dataEnpoints.lists
    var url = dataEnpoints.createEndpoint(endPoint, 'add_list')
   
    var data = {
        "userid": _userid,
        "listname": _listname,
        "listitems": _obj.items ? _obj.items: false
    }
    console.log("data being sent to AddList:")
    console.log(data)
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data)
    }).then(function (response) {
        addListEventHandel(response, _obj)
    });
}
function data_GetLists(_userid) {
    var endPoint = dataEnpoints.lists
    var url = dataEnpoints.createEndpoint(endPoint, 'get_lists')
    var data = {
        "userid": _userid
    }
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data)
    }).then(function (response) {
        getListsEventHandel(response)
    });
}
function data_RemoveList(_userid, _listid) {
    var endPoint = dataEnpoints.lists
    var url = dataEnpoints.createEndpoint(endPoint, 'remove_list')
    var data = {
        "userid": _userid,
        "listid": _listid
    }
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data)
    }).then(function (response) {
        removeListEventHandel(response)
 });
}
//---------------------------PHP API ITEM FUNCTIONS---------------------------
function data_AddItem(_userid, _itemname, _categoryid, _categoryname, _listid) {
    var endPoint = dataEnpoints.listItems
    var url = dataEnpoints.createEndpoint(endPoint, 'add_item')
    var data = {
        "userid": _userid,
        "categoryid": _categoryid,
        "categoryname": _categoryname,
        "listid": _listid
    }
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data)
    }).then(function (response) {
        addItemEventHandel(response)
    });
}
function data_GetListItems(_userid, _listid) {
    var endPoint = dataEnpoints.listItems
    var url = dataEnpoints.createEndpoint(endPoint, 'get_items')
    var data = {
        "userid": _userid,
        "listid": _listid
    }
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data)
    }).then(function (response) {
        getItemsFromListEventHandel(response)
    });
}

function data_RemoveItem(_userid, _itemid, _listid) {
    var endPoint = dataEnpoints.listItems
    var url = dataEnpoints.createEndpoint(endPoint, 'remove_item')
    var data ={
        "email": _email,
        "password": _password
    }
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data)
    }).then(function (response) {
        removeItemFromListEventHandel(response)
    });
}

function data_GetAllListsForUser(_userid) {
    var endPoint = dataEnpoints.lists
    var url = dataEnpoints.createEndpoint(endPoint, 'getAllListsForUser')
    var data = {
        "userid": _userid
    }
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data)
    }).then(function (response) {
        getAllListsForUserEventHandeler(response)
    });
}
//-----------------------------------EVENT HANDLERS-----------------------------
function addedUserEventHandel(_data) {
    $.event.trigger({
        type: "addedUser",
        message: _data
    });
}
function getUserEventHandel(_data) {
    $.event.trigger({
        type: "getUser",
        message: _data
    });
}
function addItemEventHandel(_data, obj = {}) {
    $.event.trigger({
        type: "addedItem",
        message: {
            data: _data,
            arguments: obj,
            event: $.event
        }
    });
}
function getItemsFromListEventHandel(_data) {
    $.event.trigger({
        type: "getItems",
        message: _data
    });
}
function getTrendingEventHandel(_data) {
    $.event.trigger({
        type: "getTrending",
        message: _data
    });
}
function removeItemFromListEventHandel(_data) {
    $.event.trigger({
        type: "removedItem",
        message: _data
    });
}
function removeListEventHandel(_data) {
    $.event.trigger({
        type: "removedList",
        message: _data
    });
}
function addListEventHandel(_data, obj = {}) {
    $.event.trigger({
        type: "addedList",
        message: {
            data: _data,
            obj: obj,
            event: $(this)
        }
    });
}
function getListsEventHandel(_data) {
    $.event.trigger({
        type: "getLists",
        message: _data
    });
}
function isLoggedInEventHandel(_data) {
     $.event.trigger({
         type: "isLoggedIn",
         message: _data
     });
}
//WALMART API EVENT HANDELERS--------------------------------------------------------------
function getItemEventHandel(_data) {
    $.event.trigger({
        type: "getWalmartItem",
        message: _data
});
}
function getsSearchItemEventHandel(_data, obj = {}) {
    $.event.trigger({
        type: "getWalmartItemSearch",
         message: {
             data: _data,
             arguments: obj,
             event: $.event
         }
    });
}
function getStoresEventHandeler(_data){
    $.event.trigger({
        type: "getWalmartStores",
        message: _data
    });
}
function getAllListsForUserEventHandeler(_data){
    $.event.trigger({
        type: "getAllListsForUser",
        message: _data
    });
}

//------------------------------------WALMART API FUNCTIONS---------------------------------


/** send this function an object like this:
{ids: ['23423','23443','23111386'...] } array of walmart item ids(Up to 20) or 
{ids: '23111386' }for a single id or
{ upc: 'upcnumber' } for a upc code **/
function walmart_GetItems(_item_ids) { 
    var item_ids = walmart_lookUpObj.createlookupString(_item_ids)
    var endPoint = walmartEnpoints.itemLookup(item_ids)
    var url = walmartEnpoints.createEndpoint(endPoint)
    
     $.ajax({
         type: "GET",
         url: url
     }).then(function (response) {
         getItemEventHandel(response)
     });
   
}
function walmart_GetTrending() {
    var endPoint = walmartEnpoints.trending
    var url = walmartEnpoints.createEndpoint(endPoint)
    $.ajax({
        type: "GET",
        url: url
    }).then(function (response) {
        getTrendingEventHandel(response)
    });
}
function walmart_SearchItems(_query, refId = {}) {
      var endPoint = walmartEnpoints.search(_query)
      var url = walmartEnpoints.createEndpoint(endPoint)
  
$.ajax({
    type: "GET",
    url: url
}).then(function (response) {
    getsSearchItemEventHandel(response, refId)
});
     
}
function mash_getUserWalmartStore(_userid){
    if(!user.zip){
    var endPoint = dataEnpoints.users
    var url = dataEnpoints.createEndpoint(endPoint, 'get_zip')
    var data = {
        "userid": _userid,
    }
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data)
    }).then(function (response) {
        var zip = response['zip']
        user.zip = zip
        walmart_GetStores(user.zip)
    });
    }else{
        walmart_GetStores(user.zip)
    }
}
function walmart_GetStores(_zip) {
    var endPoint = walmartEnpoints.locator(_zip)
    var url = walmartEnpoints.createEndpoint(endPoint)
    $.ajax({
        type: "GET",
        url: url
    }).then(function (response) {
        getStoresEventHandeler(response)
    });
}
//SORT LIST----------------------------------------------------------------------------------------------------------
function sortThatList(_listofItems) {
    if (_listofItems.items.length > 1) {
        _listofItems.items.sort(compareItems);
    }
    return _listofItems
}
function compareItems(itema, itemb) {
    if (itema.category < itemb.category) {
        return -1
    }
    if (itema.category > itemb.category) {
        return 1
    }
    return 0;
}
var shoppingLists = function (){ return{
    lists : [],
    addList:function(_name){
       var l = new shoppingList(_name)
       this.lists.push(l)
    }

}
}
var shoppingList = function(_listname){return {
    name:_listname,
    items: [],
    addItem: function(_itemname){
        var i = new shoppigItem(_itemname)
        this.item.push(i)
    }


}
}
var shoppigItem = function(_itemname){return {
    name:_itemname,
   walmart_category_id: null,
   walmart_category:''
}
}