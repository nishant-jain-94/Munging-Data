 var countries =   ["Afghanistan","Armenia","Azerbaijan","Bahrain","Bangladesh","Bhutan","Brunei","Cambodia","China","Cyprus","Georgia","India","Indonesia","Iran","Iraq","Israel","Japan","Jordan","Kazakhstan","Kuwait","Kyrgyzstan","Laos","Lebanon",
 "Malaysia","Maldives","Mongolia","Myanmar (Burma)","Nepal","North Korea","Oman","Pakistan","Palestine","Philippines","Qatar","Russia","Saudi Arabia","Singapore","South Korea","Sri Lanka","Syria","Taiwan","Tajikistan","Thailand","Timor-Leste","Turkey","Turkmenistan",
 "United Arab Emirates","Uzbekistan","Vietnam","Yemen"];

var arableland_asia = {};
var country_count = 0;
var arableland_year = {};
var arableland_data = [];
/*
Getting DataFrom arableland json and comparing it with countries in asia.
If in asia adding to arableland_asia.
*/
$.getJSON("js/arableland.json",function(data) {
  data.forEach(function(datum) {
    console.log(datum["Country Name"]);
    if(countries.indexOf(datum["Country Name"]) > -1) {
      $.each(datum,function(key,value) {
        if(arableland_asia[key] === undefined)
          arableland_asia[key] = parseFloat(value) || 0;
        else {
          arableland_asia[key] += parseFloat(value) || 0;
        }
      });
    }
  });
  var count = Object.keys(arableland_asia).length;
  for(var key in arableland_asia) {
    arableland_data.push( { year:key, percentage:parseFloat((arableland_asia[key]/count)).toFixed(2)});
  }
  visualize();
});


function visualize()
{

  var vis = d3.select("#visualization");

  var margin = { top:20, right:20, bottom:20, left:40 };
  var height = 500;
  var width = 1000;

  var xRange = d3.scale.linear()
    .range([margin.left,width-margin.right])
    .domain([1960,2016]);

  var yRange = d3.scale.linear()
    .range([height-margin.top,margin.bottom])
    .domain([0,10]);

  var xAxis = d3.svg.axis()
    .scale(xRange)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(yRange)
    .orient("left");

  var emptyLineFunc = d3.svg.line()
      .x(0)
      .y(0);

  var lineFunc = d3.svg.line()
        .x(function(datum) {
          return xRange(datum.year);
        })
        .y(function(datum) {
          return yRange(datum.percentage);
        })
        .interpolate('linear');

  vis.append('svg:g')
     .attr('class','x axis')
     .attr("transform","translate(0,"+(height-margin.bottom)+")")
     .call(xAxis);


  vis.append('svg:g')
    .attr('class','y axis')
    .attr('transform','translate('+(margin.left)+',0)')
    .call(yAxis);

  vis.append('svg:path')
     .transition()
     .duration(2000)
     .attr('d',lineFunc(arableland_data))
     .attr('stroke','green')
     .attr('stroke-width',1)
     .attr('fill','none');

}
