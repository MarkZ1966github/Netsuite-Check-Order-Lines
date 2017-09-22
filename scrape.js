/** 
 * 5/22/17 - This suitelet will check the lines to make sure sales orders are not partially sent to WMS
 * 
 * @param (nlobjRequest) request the request object
 * @param (nlobjResponse) response the response object
 * @author Mark Zschiegner
 * @version 1.0
 */

function scrape(request, response)
{
	// Global Variables

	var arr = [];

    {

	//START - Transaction Search
	    	
		    var columns = [];
		    var salesorderSearch = nlapiSearchRecord("salesorder",null,
		    		[
		    		   ["type","anyof","SalesOrd"], 
		    		   "AND", 
		    		   ["shipcomplete","is","T"], 
		    		   "AND", 
		    		   ["status","anyof","SalesOrd:D","SalesOrd:A","SalesOrd:E","SalesOrd:B"]
		    		], 
		    		[
		    		   columns[0] = new nlobjSearchColumn("internalid","item","GROUP").setSort(false), 
		    		   columns[1] = new nlobjSearchColumn("item",null,"GROUP"), 
		    		   columns[2] = new nlobjSearchColumn("quantitycommitted",null,"SUM"), 
		    		   //columns[3] = new nlobjSearchColumn("quantitybackordered","item","SUM"), 
		    		   columns[4] = new nlobjSearchColumn("quantity",null,"SUM"),
		    		   //columns[5] = new nlobjSearchColumn("quantityshiprecv",null,"SUM")
		    		]
		    		);    	
	    	
	//END - Transaction Search

//START Transaction Loop to set arr

var p = 1;

for (var i = 0; salesorderSearch != null && i < salesorderSearch.length; i++){
		var searchresult = salesorderSearch[i];
		   var iid = ('internalid',p,searchresult.getValue(columns[0]));
		   var itid = ('item',p,searchresult.getValue(columns[1]));
           var qty = ('quantity',p,searchresult.getValue(columns[4]));
           var com = ('quantitycommitted',p,searchresult.getValue(columns[2]));
          // var ship = ('quantityshiprecv',p,searchresult.getValue(columns[5]));
          // var back = ('quantitybackordered',p,searchresult.getValue(columns[3]));
arr.push({qty: qty, com: com});
		  p++;
     }
response.write(iid + "---" + itid + "---" + qty + "--" + com +"\n");
// END Transaction Loop to set arr


/*
// START Loop to check qty-ship = com and back is 0

for (var k = 0; arr != null && k < arr.length; k++){
		var searchresult = arr[k];
		if(qty != com){
				//nlapiSetFieldValue('custbody_a1wms_dnloadtowms', 'F');
			response.write(iid + "---" + itid + "---" + qty + "--" + com +"\n");
			}
		}

// END Loop to check qty-ship = com and back is 0
*/
    }

}