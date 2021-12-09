
var color;
var country_color;
var year;
var x_attr;
var x_r;
var y_attr;
var y_r;
var region_value;
var x_label;
var y_label;
var interval;
var x_extent;
var y_extent;
var extents=
{
  "income":[0,263],"life_exp":[0,94.4],"co2_em":[0,247],"children":[0,8.87],"child_mortality":[0,756]
}


//////////////////////////////////////////////////////////////////////////
//RUNS EVERY TIME PAGE IS LOADED
/////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() 
{

  year = document.getElementById("year-input").value;

  svg = d3.select('#chart');
  svg.append('g').attr("id","plots")

  tooltip = d3.select("body").append("div")
              .attr("class","tooltip")
              .style("opacity",0);


  // Load files
  
  Promise.all([d3.csv('data/countries_regions.csv'),d3.csv('data/mincpcap_cppp.csv'),d3.csv('data/children_per_woman_total_fertility.csv'),d3.csv('data/life_expectancy_years.csv'),d3.csv('data/child_mortality_0_5_year_olds_dying_per_1000_born.csv'),d3.csv('data/co2_emissions_tonnes_per_person.csv')])
  .then(function(values){

  countries_region = values[0];
  income_per_day   = values[1];
  child_per_woman  = values[2];
  life_expectancy  = values[3];
  child_mortality  = values[4];
  co2_emission     = values[5];



// console.log(countries_region);
// console.log(income_per_day[0].country);
// console.log(child_per_woman);
// console.log(life_expectancy);
// console.log(child_mortality);
// console.log(co2_emission);
// countries_region.forEach(element => {console.log(element.name);console.log(element.geo);console.log(element["World bank region"]);});



drawChart(year);

})


  const playBtn = d3.select('#play-button')

  playBtn.on('click', () => {

  if (playBtn.text() === 'Play') {
    playBtn.text('Pause')
    interval = setInterval(incrementYear, 1000)
  } 
  else {
    playBtn.text('Play')
    clearInterval(interval)
  }
  })

});
//DOM function ends here.




////////////////////////////////////////////////////////////////////////////////
// DRAWING CHART
/////////////////////////////////////////////////////////////////////////////////


function drawChart(year)
{
//removing elements for change in value
  d3.select("#axis-y").remove();
  d3.select("#axis-x").remove();
  d3.select("#y_label").remove();
  d3.select("#x_label").remove();
  d3.select("#background_text").remove();

//getting all the input attr from the HTML document
year = document.getElementById("year-input").value;
x_attr = document.getElementById("x-attribute").value;
x_r = x_attr;
 
if(x_attr=="children")
{
 x_label = "Children per Woman" + " (no. of children)";
 x_extent = extents[x_attr];
 x_attr = child_per_woman;
    
}

if(x_attr=="income")
{
 x_label = "Average Daily Income" + " per capita in $ ";
 x_extent = extents[x_attr];
 x_attr = income_per_day;
 
}
if(x_attr=="life_exp")
{
 x_label= "Life Expectancy" +" (in years)";
 x_extent=extents[x_attr]; 
 x_attr=life_expectancy;
 
}
if(x_attr=="co2_em")
{
 x_label = "CO2 Emission (per 1000 tonnes)" ;
 x_extent = extents[x_attr];
 x_attr = co2_emission;
  
}
if(x_attr=="child_mortality")
{
 x_label="Child Mortality ( per 1000 born)";
 x_extent = extents[x_attr];
 x_attr = child_mortality;
  
}




y_attr = document.getElementById("y-attribute").value;
y_r = y_attr;

 
if(y_attr=="children")
{
 y_label = "Children per Woman" + "  (no. of children)";
 y_extent = extents[y_attr];
 y_attr = child_per_woman;
    
}
if(y_attr=="income")
{
 y_label = "Average Daily Income" + " per capita in $ ";
 y_extent = extents[y_attr];
 y_attr = income_per_day;
 
}
if(y_attr=="life_exp")
{
 y_label="Life Expectancy" +" (in years)";
 y_extent=extents[y_attr]; 
 y_attr=life_expectancy;
 
}
if(y_attr=="co2_em")
{
 y_label = "CO2 Emission (per 1000 tonnes)" ;
 y_extent = extents[y_attr];
 y_attr = co2_emission;
  
}
if(y_attr=="child_mortality")
{
 y_label= "Child Mortality ( per 1000 born)";
 y_extent = extents[y_attr];
 y_attr = child_mortality;
  
}

// console.log(y_label);
// console.log(y_extent);
// console.log(y_attr)





region_value = document.getElementById("region_select").value;
// make a list of countries based upon the selected region
color = {"Europe & Central Asia":"#B5EAEA",	"Middle East & North Africa":"#FFBCBC","Sub-Saharan Africa":"#F7DBF0","Latin America & Caribbean":"#CEE5D0","East Asia & Pacific":"#FBC6A4","North America":"#FDFFBC","South Asia":"#FABEA7"};
var country_list = [];
var country_code = [];
var country_color= [];



if(region_value=="All")
{
 let regionData = countries_region;
 regionData.forEach(element => 
  {
    country_list.push(element.name);
    country_code.push(element.geo);
    country_color.push(color[element["World bank region"]]);
  });
}
else
{
let regionData = countries_region.filter( d => d["World bank region"] == region_value); 

regionData.forEach(element => {country_list.push(element.name); country_code.push(element.geo); country_color.push(color[region_value]);});

}

// console.log(country_list);
// console.log(country_code);
// console.log(country_color); 

// console.log(x_attr);
// console.log(y_attr);

x_data=[];
y_data=[];



var XData = {"Year" : year};
for(let x of x_attr){
  // console.log(x);
  XData[x.country] = x[year];
}
var YData = {"Year" : year};
for(let y of y_attr){
  // console.log(y);
  YData[y.country] = y[year];
}



// console.log(XData);
// console.log(YData);


// Converting data into numbers

for(i in country_list)
{
  for (let [key, value] of Object.entries(XData)) {
     if(country_list[i]==String(key))
     {
       x_data.push(parseInt(value))
       
     }
   }
   
   for (let [key, value] of Object.entries(YData)) {
    if(country_list[i]==String(key))
    {    
      y_data.push(parseInt(value))
    }
  }

}
// console.log(x_data);
// console.log(y_data);

data=[]

for (var i=0;i<x_data.length;i++)
{
  data.push([x_data[i],y_data[i],country_code[i],country_color[i],country_list[i]])
}


drawScatterPlot(data);


}

function drawScatterPlot(data)
{


  var margin = {top: 50, right: 40, bottom: 10, left: 40},
  width = 1200 - margin.left - margin.right,
  height = 700 - margin.top - margin.bottom;

  svg.attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
     .append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleLinear()
            .domain(x_extent)
            .range([ 1, width ]);
        
        
  var y = d3.scaleLinear()
            .domain(y_extent)
            .range([ height, 0]);
        

  const t = d3.transition().duration(600)
console.log(data);
  svg.selectAll("g")
     .data(data)
     .join(
      enter => ENTER(enter, t),
      update => UPDATE(update, t),
      exit => EXIT(exit, t)
    )

  function ENTER(enter, t){     
      

    enter.append("g")
         .attr("id", "points")
         .call(
          g => g
          .on('mouseover', function(data,i){
            ToolTip(data);
          })
          .on('mousemove', function(data){
                          ToolTip(data);
            
          })
          
          .on('mouseout', function(data){
            tooltip.transition()
                   .duration('50')
                   .style("opacity",0);          
          
          })
        
          .append("circle")
          .transition(t)
          .attr("cx", function (d) {return x(d[0]); } )
          .attr("cy", function (d) { return y(d[1]); } )
          .attr("r", 16)
          .attr("transform", "translate(+200,20)") 
          .style("stroke", "black")
          .style("stroke-width","1")
          .style("border",4)
          .style("fill",function (d) {return d[3]; })
        )
      
          .call(g =>g.append("text")
                    .transition(t)
                    .attr("id","circle_text")
                    .text(function(d) {
                      return d[2];
                       })
                    .attr("x", function(d) {
                        return x(d[0]);  
                    })
                    .attr("y", function(d) {
                        return y(d[1]);  
                    })
                    .attr("transform", "translate(-10,0)")
                    .attr("font_family", "cursive")  
                    .attr("font-size", "12px")  
                    .attr("transform", "translate(+190,20)") 
                    .attr("fill", "black")   
                      )
    }
  
    function UPDATE(update,t)
    {

    update.call(g=>g.transition(d3.transition().duration(600))
          .select('circle')
          .attr("cx", function (d) {return x(d[0]); } )
          .attr("cy", function (d) { return y(d[1]); } )
          .attr("r", 16)
          .style("stroke", "black")
          .style("stroke-width","1")
          .style("border",4)
          .attr("transform", "translate(+200,20)") 
          .style("fill",function (d) {return d[3]; })
      )
    
    .call(g=>g.transition(t)
    .select('text')
    .text(function(d) {
      return d[2];
    })
    .attr("x", function(d) {
      return x(d[0]);  
    })
    .attr("y", function(d) {
      return y(d[1]);  
    })
    .attr("transform", "translate(+190,20)") 
    .attr("font_family", "cursive") 
    .attr("font-size", "12px")  
    .attr("fill", "black")   
    )
    
    }
    
    function  EXIT(exit,t)
    {
    
      exit.call(g=> g.transition(t).style('opacity',0).remove())
    
    } 
    
    // Add Y axis
      
    svg.append("g")
       .attr("transform", "translate(+200,20)") 
       .attr("id", "axis-y")
       .call(d3.axisLeft(y));

    // Adding X axis

    svg.append("g")
       .attr("transform", "translate(200,670)")
       .attr("id", "axis-x")
       .call(d3.axisBottom(x));



    // Adding text label for the x axis
    svg.append("text")  
       .attr("id","x_label")           
       .attr("transform", "translate(" + (width/2 +250) + " ," + (height + margin.top + 30) + ")")
       .style("text-anchor", "middle")
       .style("stroke","grey")
       .text(x_label);

    // console.log(x_label);
    // console.log(y_label);

    // Adding text label for the y axis
    svg.append("text")
       .attr("id","y_label")
       .attr("transform", "rotate(-90)")
       .attr("y",120)
       .attr("x",0 - (height / 2))
       .style("text-anchor", "middle")
       .style("stroke","grey") 
       .text(y_label);

    svg.append("text")  
        .attr("id","background_text")           
        .attr("transform","translate(" + (width - 325) + " ," + (height - 250) + ")")
        .style("text-anchor", "middle")
        .style("stroke","black")
        .style("stroke-width","2")
        .attr("font-size", "120px")
        .attr("opacity","0.1")
        .text(parseInt(document.getElementById("year-input").value));


}


function ToolTip(data){

    circle_text = data[4];
    tooltip.transition()
           .duration(50)
           .style("opacity",1);

    tooltip.html(circle_text)
           .style("left", (d3.event.pageX+10) + "px")
           .style("top", (d3.event.pageY-15) + "px");
}


function incrementYear()
{
  year = document.getElementById("year-input").value;

  if(year >= 1800 && year < 2100)
  {
    year++;
    d3.select("#year-input").property('value',year)
    drawChart(year);

  }
}       
