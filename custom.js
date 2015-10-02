var context = new hd.ContextBuilder()
	  .variables({keyword: '', list: []})
	  .constraint('keyword, list')
	  .method('keyword -> list', function(keyword){
		  return fetchCityList(keyword); })
	  .context();

var pm = new hd.PropertyModel();
console.log("PropertyModel created");

pm.addComponent(context);
window.addEventListener('load', function(){
	hd.performDeclaredBindings(context);
});

function AutoCompleteHd(el)
{
	this.el = el;
}

AutoCompleteHd.prototype.onNext = function(cities)
{
	$(this.el).autocomplete({source: cities});
}

AutoCompleteHd.prototype.onError = function()
{
	console.log("onError");
}

AutoCompleteHd.prototype.onCompleted = function()
{
	console.log("onCompleted");
}

function fetchCityList(keyword) {

	var p = new hd.Promise();
	var cities = [];

  $.ajax({
    type: 'GET',
    url: 'http://autocomplete.wunderground.com/aq?cb=call=?',
    data: {
      "query": keyword
    },
    async: false,
    dataType: 'jsonp',
    crossDomain: true,
    success: function(response) {
      $.each(response.RESULTS, function(i) {
        out = (response.RESULTS[i].name);
        cities.push(out);
      });

      console.log(cities);
      p.resolve(cities);
    },
    error: function(xhr, ajaxOptions, thrownError) {
      alert(xhr.status);
      alert(thrownError);
    }
  });

  return p;
}



function AutoComplete( menu, result ) {
  this.menu = menu;
  this.result = result;
  this.index = -1;
  this.items = [];
  this.selected = '';
}

AutoComplete.prototype.newQuery = function( query ) {
  if (this.query == query) { return; }
  this.query = query;
  this.index = -1;
  this.select( query );
  if (query) {
    var thisObj = this;
    $.ajax({
      type: 'GET',
      url: 'http://autocomplete.wunderground.com/aq',
      data: {
        'query': query
      },
      dataType: 'jsonp',
      jsonp: 'cb',
      crossDomain: true,
      success: function( response ) {
        thisObj.newItems( response.RESULTS.map( function( city ) { return city.name; } ) )
      },
      error: ajaxError
    });
  }
  else {
    this.newItems( [] );
  }
}

AutoComplete.prototype.select = function( text ) {
  this.selected = text;
  while (this.result.lastChild) {
    this.result.removeChild( this.result.lastChild );
  }
  this.result.appendChild( document.createTextNode( text ) );
}

AutoComplete.prototype.newItems = function( items ) {
  this.items = items;
  while (this.menu.rows.length > 0) {
    this.menu.deleteRow( 0 );
  }
  for (var i = 0, l = items.length; i < l; ++i) {
    var tr = this.menu.insertRow( i );
    var td = tr.insertCell( 0 );
    td.appendChild( document.createTextNode( items[i] ) );
  }
}

AutoComplete.prototype.consider = function( index ) {
  this.index = index;
  this.select( this.items[index] );
  for (var i = 0, l = this.menu.rows.length; i < l; ++i) {
    if (i == index) {
      this.menu.rows[i].firstElementChild.classList.add( 'on' );
    }
    else {
      this.menu.rows[i].firstElementChild.classList.remove( 'on' );
    }
  }
}

AutoComplete.prototype.advance = function( howmany ) {
  var index = this.index + howmany;
  if (index < 0) {
    index = 0;
  }
  if (index >= this.items.length) {
    index = this.items.length - 1;
  }
  this.consider( index );
  var td = this.menu.rows[index].cells[0];
  if (td.scrollIntoViewIfNeeded) {
    td.scrollIntoViewIfNeeded();
  }
  else {
    td.scrollIntoView();
  }
}


function ajaxError( jqXHR, status, error ) {
  alert( status );
  console.error( status, error );
}

$(function() {
  var ac = new AutoComplete( document.getElementById( 'menu-no-hd' ),
                             document.getElementById( 'result-no-hd' ) );

  $('#query-no-hd').keydown(
    function( e ) {
      if (e.keyCode == 38) {
        ac.advance( -1 );
        e.preventDefault();
      }
      else if (e.keyCode == 40) {
        ac.advance( 1 );
        e.preventDefault();
      }
      else if (e.keyCode == 13) {
        this.value = ac.selected;
        e.preventDefault();
      }
    }
  ).keyup(
    function( e ) {
      if (e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13) {
        ac.newQuery( this.value );
      }
    }
  );

  $('#menu-no-hd').on( 'mouseenter', 'td', function() {
    ac.consider( this.parentElement.rowIndex )
  } ).click( function () {
    $('#query-no-hd').val( ac.selected ).focus();
  } );
} );

// $(document).ready(function() {

//   $("#locationTextWithoutHd").keydown(function() {

//     var keyword = $("#locationTextWithoutHd").val();
//     var url = 'http://autocomplete.wunderground.com/aq?format=json&cb=myCallbackFn&query=' + keyword;
//     $.ajax({
//       type: 'GET',
//       url: url,
//       async: true,
//       dataType: 'jsonp',
//       error: function(e) {
//         console.log(e.message);
//       }
//     });
//   });



// });

// var myCallbackFn = function(data) {
//   var cities = [];
//   for (i = 0; i < data.RESULTS.length; i++) {
//     if (data.RESULTS[i].type == 'city') {
//       cities.push(data.RESULTS[i].name);
//     }
//   }

//   $("#locationTextWithoutHd").autocomplete({
//     source: cities
//   }).autocomplete("widget").addClass("fixed-height");
// }
