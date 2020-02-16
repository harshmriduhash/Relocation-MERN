// Teleport API
var obj = {};

$('#search').autocomplete({
    serviceUrl: 'https://api.teleport.org/api/cities/',
    paramName: 'search',
    transformResult: function(data) {
        var json = JSON.parse(data);
        var city = json._embedded["city:search-results"];
        // console.log(city[0]._links);
           
        var suggestions = [];
        var maxResults = 5;
        city = city.slice(0, 5);
        city.forEach(function (city, index) {
        	suggestions.push(
        		{
                value: city.matching_full_name,
                data: city,
                link: city._links["city:item"].href
            	}
        	);
        });

        return { suggestions: suggestions };
    },
    
    onSelect: function(suggestions) {

    	var queryUrl = suggestions.link;
    	var salariesHref;

    	var masterPromise = $.ajax({ url: queryUrl, method: 'GET' })

    	masterPromise.then(function (masterResponse) {
    		return $.ajax({ url: masterResponse._links["city:urban_area"].href, method: 'GET' })
    	}).then(function (uaResponse) {
    		console.log(queryUrl);
    		obj.city = uaResponse._links["ua:identifying-city"].name;
    		obj.state = uaResponse._links["ua:admin1-divisions"][0].name;
    
    		///////// WEATHER UNDERGROUND /////////

			// This is our API Key - https://home.openweathermap.org/api_keys
			var APIKey = "d4bcc2842a7e6378";

			var weatherURL = "https://api.wunderground.com/api/" + APIKey + "/geolookup/conditions/q/" + obj.state + "/" + obj.city + ".json";
			// console.log(weatherURL)
			// AJAX call for weather
			$.ajax({ url: weatherURL, method: 'GET' }).done(function(res){
				obj.temp = Math.round(res.current_observation.temp_f) + '&deg';
				$("#currentWeatherInfo").html(obj.temp);
			})

    //ADDS NAME TO THE TOP OF THE PAGE
    		
            obj.name = uaResponse.full_name;
        	$('#currentCity').html(obj.name);
    			var scoresPromise = $.ajax({url: uaResponse._links["ua:scores"].href, method: 'GET' }).then(function (scoreResponse){
   
   //PUSHING SCORES INTO AN OBJECT AND ADDING THEM TO THE SCORES CARD.	
    			obj.summary = scoreResponse.summary;
    			obj.cityScore = Math.round(scoreResponse.teleport_city_score)+"%";
    			obj.costLiving = Math.round(scoreResponse.categories[1].score_out_of_10 * 10) + "%";
    			obj.housing = Math.round(scoreResponse.categories[0].score_out_of_10 * 10) + "%";
    			obj.massTransit = Math.round(scoreResponse.categories[4].score_out_of_10 * 10) + "%";
    			obj.commute = Math.round(scoreResponse.categories[5].score_out_of_10 * 10) + "%";
    			obj.safety = Math.round(scoreResponse.categories[7].score_out_of_10 * 10) + "%";
    			obj.education = Math.round(scoreResponse.categories[9].score_out_of_10 * 10) + "%";
    			obj.internet = Math.round(scoreResponse.categories[13].score_out_of_10 * 10) + "%";
    			obj.leisure = Math.round(scoreResponse.categories[14].score_out_of_10 * 10) + "%";
    			obj.tolerance = Math.round(scoreResponse.categories[15].score_out_of_10 * 10) + "%";
    			obj.outdoor= Math.round(scoreResponse.categories[16].score_out_of_10 * 10) + "%";
    			// console.log(obj.cityScore);
    			$('#citySummary').html(obj.summary);
    			$('#cityScoreDet').css({"width":obj.cityScore});
    			$('#cityScore').html(obj.cityScore);
    			$('#costOfLivingDet').css({"width":obj.costLiving});
    			$('#costOfLiving').html(obj.costLiving);
    			$('#housingDet').css({"width":obj.housing});
    			$('#housing').html(obj.housing);
    			$('#massTransitDet').css({"width":obj.massTransit});
    			$('#massTransit').html(obj.massTransit);
    			$('#commuteDet').css({"width":obj.commute});
    			$('#commute').html(obj.commute);
    			$('#safetyDet').css({"width":obj.safety});
    			$('#safety').html(obj.safety);
    			$('#educationDet').css({"width":obj.education});
    			$('#education').html(obj.education);
    			$('#internetDet').css({"width":obj.internet});
    			$('#internetAccess').html(obj.internet);
    			$('#leisureDet').css({"width":obj.leisure});
    			$('#leisureAndCulture').html(obj.leisure);
    			$('#toleranceDet').css({"width":obj.tolerance});
    			$('#tolerance').html(obj.tolerance);
        		$('#outdoorDet').css({"width":obj.outdoor});
        		$('#outdoors').html(obj.outdoor);
        		
    		})
    		var imagesPromise = $.ajax({url: uaResponse._links["ua:images"].href, method: 'GET' }).then(function (imagesResponse){
    			var image = imagesResponse.photos[0].image.mobile;
                $('#picture').html('<img src="' + image + '"  style="width:300px; height:300px;">')
    		})
            var detailsPromise = $.ajax({url: uaResponse._links["ua:details"].href, method: 'GET' }).then(function (detailsResponse){
                var cost = detailsResponse.categories[3];
                var weather = detailsResponse.categories[2];
                var typeWeather;
                var clear = 0;
                var rainy = 0;
                var highTemp = 0;
                var lowTemp = 0;
                // console.log(weather);

                for (var i = 0; i < weather.data.length; i++) {
                      
                    if (weather.data[i].id === "WEATHER-AVERAGE-HIGH") {
                        highTemp = weather.data[i].string_value;
                    }
                    if (weather.data[i].id === "WEATHER-AVERAGE-LOW") {
                        lowTemp = weather.data[i].string_value;
                    }
                    if (weather.data[i].id === "WEATHER-AV-NUMBER-CLEAR-DAYS") {
                        clear = weather.data[i].float_value;
                    }
                    if (weather.data[i].id === "WEATHER-AV-NUMBER-RAINY-DAYS") {
                        rainy = weather.data[i].float_value;
                    }
                    if (weather.data[i].id === "WEATHER-TYPE") {
                        typeWeather = weather.data[i].string_value;
                    }
                }
            
            //-----------COST OF LIVING
                obj.priceOfApple = " $ " + Math.round(cost.data[1].currency_dollar_value);
                obj.priceOfBread = " $ " + Math.round(cost.data[2].currency_dollar_value);
                obj.priceOfCappuccino = " $ " + Math.round(cost.data[3].currency_dollar_value);
                obj.priceOfMovie = " $ " + Math.round(cost.data[4].currency_dollar_value);
                obj.priceOfBeer = " $ " + Math.round(cost.data[6].currency_dollar_value);
                obj.priceOfMeal = " $ " + Math.round(cost.data[8].currency_dollar_value);
                obj.priceOfTaxi = " $ " + Math.round(cost.data[9].currency_dollar_value);
                $("#apples").html(obj.priceOfApple);
                $("#bread").html(obj.priceOfBread);
                $("#cappuccino").html(obj.priceOfCappuccino);
                $("#movies").html(obj.priceOfMovie);
                $("#beer").html(obj.priceOfBeer);
                $("#meals").html(obj.priceOfMeal);
                $("#taxi").html(obj.priceOfTaxi);
            //------------------------------
                obj.weatherType = typeWeather;
                obj.clearDays = clear;
                obj.rainyDays = rainy;
                obj.tempHigh= Math.round(highTemp * 1.8) + 32 +"° F";
                obj.tempLow = Math.round(lowTemp * 1.8) + 32 +"° F";
                console.log(obj.tempHigh);
                console.log(obj.tempLow);
                $("#weatherType").html(obj.weatherType);
                $("#clearDays").html(obj.clearDays);
                $("#rainyDays").html(obj.rainyDays);
                $("#tempHigh").html(obj.tempHigh);
                $("#tempLow").html(obj.tempLow);

            })

    	}) 
           
    }

});

$('#search-form').on('submit', function(e){
	e.preventDefault();
})

$("#jobButton").on('click', function(){

        var job = $("#jobSearch").val();
        var jobSearch = job.replace(' ','+');
        var indeed = 'http://www.indeed.com/jobs?q=' + jobSearch + '&l=' + obj.city + '%2C' + obj.state;
        // console.log(indeed);
        var win = window.open(indeed, '_blank');

        return false

    })  

// $('#search-form').on('click',function(){
// 	$('#search').empty();
// })

 



