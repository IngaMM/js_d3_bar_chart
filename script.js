const w = 1000;
const h = 1000;
const padding = 80;

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

d3.json(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json"
).then(function(data) {
  const gdp = data.data.map(d => d[1]);
  const date = data.data.map(d => d[0]);

  // date format for the infobox
  const niceDate = date.map(d => {
    let quartal = "";
    if (d.substring(5, 7) == "01") {
      quartal = "Q1";
    } else if (d.substring(5, 7) == "04") {
      quartal = "Q2";
    } else if (d.substring(5, 7) == "07") {
      quartal = "Q3";
    } else if (d.substring(5, 7) == "10") {
      quartal = "Q4";
    }
    let year = d.substring(0, 4);
    return quartal + " " + year;
  });

  const dateInDateFormat = date.map(d => {
    return new Date(d);
  });

  const xScale = d3
    .scaleTime()
    .domain([d3.min(dateInDateFormat), d3.max(dateInDateFormat)])
    .range([padding, w - padding]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(gdp)])
    .range([h - padding, padding]);
  const dataScale = d3
    .scaleLinear()
    .domain([0, d3.max(gdp)])
    .range([0, h - 2 * padding]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // append x-axis
  svg
    .append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .attr("id", "x-axis")
    .call(xAxis.tickSizeOuter(0))
    .style("font-size", "15px");

  // append y-axis
  svg
    .append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .attr("id", "y-axis")
    .call(yAxis.tickSizeOuter(0))
    .style("font-size", "15px");

  // label for x-axis
  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + w / 2 + " ," + (h - padding / 2 + 10) + ")"
    )
    .style("text-anchor", "middle")
    .style("font-size", "20px")
    .text("Year");

  // label for y-axis
  svg
    .append("text")
    .attr("x", padding + 30)
    .attr("y", h / 2)
    .attr("transform", "rotate(-90," + (padding + 30) + "," + h / 2 + ")")
    .style("text-anchor", "middle")
    .style("font-size", "20px")
    .text("GDP [Billion $]");

  svg
    .selectAll("rect")
    .data(gdp)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(dateInDateFormat[i]))
    .attr("y", d => yScale(d))
    .attr("width", (w - 2 * padding) / gdp.length)
    .attr("height", d => dataScale(d))
    .attr("class", "bar")
    .attr("data-date", (d, i) => date[i])
    .attr("data-gdp", d => d)
    .attr("fill", "#80ced6")
    .on("mouseover", function(d, i) {
      // add information box
      d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("left", xScale(dateInDateFormat[i]) + "px")
        .attr("data-date", date[i])
        .html(niceDate[i] + ": $" + d3.format(",.1f")(d) + " Billion")
        .style("pointer-events", "none");
      // add white bar
      svg
        .append("rect")
        .attr("id", "activebar")
        .attr("x", xScale(dateInDateFormat[i]))
        .attr("y", yScale(d))
        .attr("width", (w - 2 * padding) / gdp.length)
        .attr("height", dataScale(d))
        .attr("fill", "white")
        .style("pointer-events", "none");
    })
    .on("mouseout", function(d, i) {
      d3.select("#tooltip").remove();
      svg.select("#activebar").remove();
    });
});
