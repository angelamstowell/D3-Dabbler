   var svgWidth = 900;
   var svgHeight = 600;

   // SVG margins 
   var margin = {
       top: 40,
       right: 40,
       bottom: 80,
       left: 90
   };

   var width = svgWidth - margin.left - margin.right;
   var height = svgHeight - margin.top - margin.bottom;


   var svg = d3.select("#scatter")
       .append("svg")
       .attr("width", svgWidth)
       .attr("height", svgHeight);

   var chartGroup = svg.append("g")
       .attr("transform", `translate(${margin.left}, ${margin.top})`);



   var file = "assets/data/data.csv"


   d3.csv(file).then(successHandle, errorHandle);

   function errorHandle(error) {
       throw error;
   }

   function successHandle(statesData) {

       // Loop through the data 
       statesData.map(function(data) {
           data.poverty = +data.poverty;
           data.obesity = +data.obesity;
       });

       //  Scale functions

       var xLinearScale = d3.scaleLinear()
           .domain([8.1, d3.max(statesData, d => d.poverty)])
           .range([0, width]);

       var yLinearScale = d3.scaleLinear()
           .domain([20, d3.max(statesData, d => d.obesity)])
           .range([height, 0]);


       var bottomAxis = d3.axisBottom(xLinearScale)
           // Adjust the number of ticks for the bottom axis  
           .ticks(7);
       var leftAxis = d3.axisLeft(yLinearScale);


       chartGroup.append("g")
           .attr("transform", `translate(0, ${height})`)
           .call(bottomAxis);
       chartGroup.append("g")
           .call(leftAxis);


       // Create Circles for scatter plot
       var circlesGroup = chartGroup.selectAll("circle")
           .data(statesData)
           .enter()
           .append("circle")
           .attr("cx", d => xLinearScale(d.poverty))
           .attr("cy", d => yLinearScale(d.obesity))
           .attr("r", "13")
           .attr("fill", "#788dc2")
           .attr("opacity", ".75")


       // Append text to circles 

       var circlesGroup = chartGroup.selectAll()
           .data(statesData)
           .enter()
           .append("text")
           .attr("x", d => xLinearScale(d.poverty))
           .attr("y", d => yLinearScale(d.obesity))
           .style("font-size", "13px")
           .style("text-anchor", "middle")
           .style('fill', 'white')
           .text(d => (d.abbr));

       // Initialize tool tip

       var toolTip = d3.tip()
           .attr("class", "tooltip")
           .offset([80, -60])
           .html(function(d) {
               return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}% `);
           });

       // Tool-tip

       chartGroup.call(toolTip);

       // Event Listeners

       circlesGroup.on("mouseover", function(data) {
               toolTip.show(data, this);
           })
           // onmouseout event
           .on("mouseout", function(data) {
               toolTip.hide(data);
           });

       // Create axes labels
       chartGroup.append("text")
           .attr("transform", "rotate(-90)")
           .attr("y", 0 - margin.left + 40)
           .attr("x", 0 - (height / 2))
           .attr("dy", "1em")
           .attr("class", "axisText")
           .text("Obese (%)");

       chartGroup.append("text")
           .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
           .attr("class", "axisText")
           .text("In Poverty (%)");
   }