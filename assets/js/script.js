$( document ).ready(function() {
// you will also have to setup the referring domains on your marvel developer portal
var PRIV_KEY = "1aa326c39f8808fadbacdbe66e99f52d0c19157b";
var publicKey = "0c44207736991ac42409420fa1c2f7bd";
var data;
var textComplete;
var val;
var results;
var nbTable;

  // you need a new ts every request                                                                                    
  var ts = new Date().getTime();
  var hash = CryptoJS.MD5(ts + PRIV_KEY + publicKey).toString();
  $('#name').bind('input', function() { 
    val = $(this).val();
	autocompletion(val);
});


function autocompletion(val){
  var url = 'http://gateway.marvel.com:80/v1/public/characters?nameStartsWith='+val+'&ts='+ts+'&apikey='+publicKey+'&hash='+hash;
     function log( message ) {
	 $('#log').empty();
      $( "<div>" ).html( message ).prependTo( "#log" );
    }
	 $("#name").autocomplete({
	 source: function(request,response){
	 	$.ajax({
		type:"GET",
		url:url,
		dataType: "json",
		data:data,
		 success: function( data ) {
		 results = data.data.results;
		 var name = [];
		 $.each(results,function( i,item ) {
		 name.push(results[i].name);
			//console.log(results[i]);
            response(name.slice(0,5));
		});
          }
		});
	 },
	 minLength: 3,
       
	  select: function( event, ui ) {
          
		 $.each(results,function( i,item ) {
			 if(results[i].name === ui.item.value){
				nbTable = i;
				var name = results[nbTable].name;
				var description = results[nbTable].description;
				var img = results[nbTable].thumbnail.path +'.'+ results[nbTable].thumbnail.extension;
				var comics = results[nbTable].comics.items;
                    if(comics[1]){
                        $("#contenu" ).append( "<p id='subtitle'>Votre héro est apparut dans:</p> <ul id='comics'class='ui-widget-content'></ul>" );
                        $.each(comics,function( i,item ) {
                                $('#comics').append('<li>'+comics[i].name+'</li>');
                        });
                    }
                    else{
                        $( "#subtitle" ).remove();
                        $( "#comics" ).remove();
                    }   

				log("<h2>" + ui.item.value + "</h2>"+
				"<p class='description'>" + description +"</p>"+
				'<img src=\'' + img + '\' />');					
			 };

		});	
	
      }
	 });
};
});