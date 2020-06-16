var cities = ["Babylon","Nantucket","Mountain View","Palo Alto","New York","Hilton Head Island","San Francisco","Walnut Creek","Waterbury","Montclair","Berkeley","Beaverton","Washington D.C.","San Bernardino","Oakland","Seattle","San Jose","Jersey City","Honolulu","Boston","Los Angeles","Santa Cruz","Irvine","Maui","Chicago","Miami","Denver","Santa Barbara","Boulder","Portland","Long Beach","Cocoa Beach","San Diego","Laguna Niguel","Sacramento","Santa Ana","Anchorage","Fort Lauderdale","Newark","Eugene","West Lafayette","Philadelphia","Tacoma","Atlanta","Pittsburgh","Bozeman","San Luis Obispo","Asheville","Austin","Fort Worth","Charlotte","Minneapolis - St. Paul","Scottsdale","Baltimore","Dallas","Charleston","Baton Rouge","Hartford","Burlington","Salt Lake City","Ann Arbor","Providence","Santa Fe","New Orleans","Kodiak","Phoenix","Savannah","Orlando","Pensacola","Vancouver","Virginia Beach","Nashville","Tampa","Fresno","Reno","Las Vegas","Colorado Springs","Harrisburg","Albany","Durham","Cleveland","Riverside","Raleigh","Ithaca","Houston","St. Louis","Provo","Columbus","Madison","Tempe","Grand Rapids","Shreveport","Spokane","Des Moines","Fargo","Richmond","Kansas City","Buffalo","Charlottesville","Detroit","Little Rock","Jacksonville","Milwaukee","Fort Collins","Tulsa","Indianapolis","Tallahassee","Bakersfield","Louisville","Chattanooga","Boise","Cincinnati","Omaha","Modesto","Greenville","Jackson","Lawrence","Rochester","San Antonio","Corpus Christi","Knoxville","Roanoke","Tucson","Green Bay","Erie","Arlington","Akron","Wichita","Gainesville","Huntsville","Oklahoma City","Flint","Lincoln","Birmingham","Albuquerque","Greensboro","Lubbock","El Paso","Memphis","Lexington","Toledo","Mobile","Florence","Cedar Rapids","San Antonio","McAllen","Fort Wayne","Springfield","Youngstown"]

var prices = [263,262,262,261,255,247,246,239,236,229,227,224,221,221,219,208,208,208,207,206,200,200,196,196,196,194,194,191,190,190,188,187,187,186,186,184,181,178,177,176,175,174,174,170,169,169,168,168,167,167,166,166,165,165,165,164,164,164,164,163,161,161,160,159,159,158,158,158,157,156,156,156,155,155,155,155,155,155,155,154,154,153,153,152,152,152,151,151,151,151,151,150,148,147,147,147,147,146,145,145,145,145,144,143,143,143,142,142,142,141,141,141,140,140,140,139,139,139,139,138,138,138,137,137,137,136,135,135,135,134,134,133,133,133,132,130,130,130,130,129,128,128,128,125,123,122,121,120,118]

//From: https://stackoverflow.com/questions/10596417/is-there-a-way-to-get-element-by-xpath-using-javascript-in-selenium-webdriver
function getElementByXpath(path) {
	return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

//Test for updated/refreshed page elements
function testElements(){
	
	//TODO use dicts or duples to store xpaths v
	
	salaryXpaths = ['//*[@id="HeroHeaderModule"]/div[3]/div[1]/div[4]/span','//*[@id="JobsLandingPage"]/div/div/div/div/div[4]/ul/li[1]/div/div/div/div[1]/div/div/div[2]/span','//*[@id="JobView"]/div[1]/div[2]/div/div/div[2]/div[1]/div[1]/div[2]/div/div/div[4]/span'];
	
	cityXpaths = ['//*[@id="HeroHeaderModule"]/div[3]/div[1]/div[3]','//*[@id="JobsLandingPage"]/div/div/div/div/div[4]/ul/li[1]/div/div/div/div[1]/div/div/div[1]/span','//*[@id="JobView"]/div[1]/div[2]/div/div/div[2]/div[1]/div[1]/div[2]/div/div/div[3]'];

	//Can use the same index because the salary+city xpaths are correlated
	for(var i=0; i < salaryXpaths.length; i++){
		var salary = getElementByXpath(salaryXpaths[i]);
		var city = getElementByXpath(cityXpaths[i])

		if(salary!=null)
		{
			replaceSearch(salary,city);
		}
	}
	
	window.setTimeout(testElements,100);
}

function replaceSearch(salary,city){
	salaryRef = salary;
	salary = salary.innerHTML;
	if(salary.search("Price Index Adjusted")!=-1){
		return;
	}
	
	var hasK = salary.search("K") != -1
		
	salary = salary.substr(salary.indexOf('$')).split('-');
		
	var lowVal = parseInt(salary[0].replace(/\D/g,''));
	var highVal = parseInt(salary[1].substr(0,5).replace(/\D/g,''));
	var price = -1;

	city = city.innerHTML.split(',')[0];
	
	for(var i=0; i < cities.length; i++){
		if(city.search(cities[i]) != -1){
			price = prices[i];
			break;
		}
	}
	
	if(price == -1){
		return;
	}
	
	//Use 164 because that's the mean salary index
	lowVal = Math.round(lowVal / (price / 164));
	highVal = Math.round(highVal / (price / 164));
	
	if(hasK){
		lowVal += "K";
		highVal += "K";
	}
	
	//Append findings to the current page salary innerHTML
	salaryRef.innerHTML += "<div id='price_adj'></br><b><i>Price Index Adjusted: $"+lowVal+"-$"+highVal+"</i></b></div>";
}

testElements();