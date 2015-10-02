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

function AutoComplete(el)
{
	this.el = el;
}

AutoComplete.prototype.onNext = function(cities)
{
	$(this.el).autocomplete({source: cities});
}

AutoComplete.prototype.onError = function()
{
	console.log("onError");
}

AutoComplete.prototype.onCompleted = function()
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

$(document).ready(function() {

    $("#locationTextWithoutHd").keydown(function() {
    	//$("#locationTextWithoutHd").autocomplete('destroy');
    	var keyword = $("#locationTextWithoutHd").val();
        var url = 'http://autocomplete.wunderground.com/aq?format=json&cb=myCallbackFn&query=' + keyword;
        $.ajax({
            type: 'GET',
            url: url,
            async: true,
            dataType: 'jsonp',
            error: function(e) {
                console.log(e.message);
            }
        });
    });



});

var myCallbackFn = function(data) {
    var cities = [];
    for (i = 0; i < data.RESULTS.length; i++) {
        if (data.RESULTS[i].type == 'city') {
            cities.push(data.RESULTS[i].name);
        }
    }

    $("#locationTextWithoutHd").autocomplete({
        source: cities
    }).autocomplete("widget").addClass("fixed-height");
}