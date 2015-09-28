var myCallbackFn = function(data)
{
	console.log("Testing JSON Object");
	console.log(JSON.stringify(data));


}


$( document ).ready(function() {
	$("#locationTextHd").attr('autocomplete', 'off');
	$("#locationTextHd").keyup(function(e){
		
		
		keywordHd = $("#locationTextHd").val();
		var p = new hd.Promise();
		var q = p.then(
			
				function fetch(keywordHd){
				var x = new hd.Promise();
				$.ajax({
				      url: 'http://autocomplete.wunderground.com/aq?&format=json&cb=myCallbackFn&query=New'+ keywordHd,
				      error: function() {
				         //$('#info').html('<p>An error has occurred</p>');
				      },
				      dataType: 'json',
				      success: function(data) {
						
						var cities = [];  
				    	for(i=0;i<data.length;i++)
				    	{ cities.push(data[i].cityName); }
				    	x.resolve( cities );
				    	
				      },
				      type: 'GET'
				   })
				   return x;
			}
		
		);
		
		
		q.then(
				function populate(citiesHd)
				{	
					$("#locationTextHd").autocomplete({
			    	     source: citiesHd
			    	   });
					$("#locationTextHd").attr('autocomplete', 'on');
					
				}
		);	
		
			
	
	p.resolve(keywordHd);	
	});
	
	

	
	
	
});	




function fun() 
{
  	var url = 'http://autocomplete.wunderground.com/aq?query=New&format=json&cb=myCallbackFn';

	$.ajax({
	   type: 'GET',
	    url: url,
	    async: true,
	    dataType: 'jsonp',
	    error: function(e) {
	       console.log(e.message);
	    }
	});


}