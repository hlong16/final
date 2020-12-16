import { default as LinearRegression } from "./js/LinearRegression.js";

const margin = ({top: 60, right: 60, bottom: 60, left: 60});
const width = 600 - margin.left - margin.right;
const height = 850 - margin.top - margin.bottom;

let selected = null;

const svg = d3.select('.bar-chart').append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


const xScale = d3.scaleLinear()
		.range([0, width]);

const yScale = d3.scaleBand()
		.range([height, 0]).padding(0.2); 

const xAxis = d3.axisBottom()
	.scale(xScale);

const yAxis = d3.axisLeft()
	.scale(yScale);


svg.append('g')
	.attr('class', 'axis x-axis')
	.attr('transform', `translate(0, ${height})`)
	.call(xAxis);
	
svg.append('g')
	.attr('class', 'axis y-axis')
	.call(yAxis);

const stateLabel = document.querySelector('.state');

const scoreLabel = document.querySelector('.score');
const casesLabel = document.querySelector('.cases');
const percentLabel = document.querySelector('.percent');

function barClicked(d) {
	stateLabel.innerHTML = d.state;
	scoreLabel.innerHTML = d.score;
	casesLabel.innerHTML = d.cases.toFixed(2);
	percentLabel.innerHTML = `${((d.cases / 100000) * 100).toFixed(2)}%`;
}

// ----------------------------------------------------------------------------------------

const margin2 = ({top: 60, right: 60, bottom: 60, left: 60});
const width2 = 600 - margin.left - margin.right;
const height2 = 600 - margin.top - margin.bottom;

const svg2 = d3.select('.scatter').append('svg')
	.attr('width', width2 + margin2.left + margin2.right)
	.attr('height', height2 + margin2.top + margin2.bottom)
	.append('g')
	.attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')');

const xScale2 = d3.scaleLinear()
	.range([0, width2]);

const yScale2 = d3.scaleLinear()
	.range([height2, 0]); 

const xAxis2 = d3.axisBottom()
	.scale(xScale2);

const yAxis2 = d3.axisLeft()
	.scale(yScale2);

svg2.append('g')
	.attr('class', 'axis x-axis2')
	.attr('transform', `translate(0, ${height2})`)
	.call(xAxis2);
	
svg2.append('g')
	.attr('class', 'axis y-axis2')
	.call(yAxis2);

function update(data) {
	
	yScale.domain(data.map(function(d) {return d.score}));

    xScale.domain(d3.extent(data, d => d.cases)).nice();



    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", 1)
        .attr("y", function(d) {return yScale(d.score)})
        .attr("height", yScale.bandwidth())
        .attr("width", function(d) { return xScale(d.cases) })
        .attr("fill", "#38FF14")
        .on('click', function(e,d) {			
            barClicked(d);
            if(selected !== null) {
                d3.selectAll(".bar")
                .style("fill", "#38FF14");
            }
            selected = d.state;
            d3.select(this).style("fill", "#0511c2");
            console.log(selected);
        })
        .on("mouseover", function(e,d) {
            if (d.state !== selected) {
                d3.select(this).style("fill", "#15F4EE");
            }
        })              
        .on("mouseout", function(e,d) {
            if(d.state !== selected) {
                console.log("trigger");
                d3.select(this).style("fill", "#38FF14");
            }
        });

    svg.selectAll('.x-axis')
        .call(xAxis);

    svg.selectAll('.y-axis')
        .call(yAxis);

    svg.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {
            return d.state;
        })
        .attr('y', function(d) {
            return yScale(d.score) + 5 ;
        })
        .attr('x', function(d) {
            return xScale(d.cases);
        })
        .attr('dx', 4)
        .attr('dy', 3)
        .attr('text-anchor', 'beginning')
        .style("fill", "white")
        .attr('class', 'label');


    svg.append("text")
        .attr("x", -60)
        .attr("y", -10)
        .attr("font-size", "18px")
        .style("fill", "white")
        .text("Covid Plan Score");

    svg.append("text")
        .attr("x", width / 2 + 70)
        .attr("y", height + 40)
        .attr("font-size", "18px")
        .style("fill", "white")
        .attr('text-anchor', 'end')
		.text("Cases per 100k people");

// ___________________________________________________________

	xScale2.domain(d3.extent(data, d => d.score)).nice();

	yScale2.domain(d3.extent(data, d => d.cases)).nice();

	svg2.append('g')
    	.selectAll(".dot")
    	.data(data)
    	.enter()
    	.append("circle")
      	.attr("cx", function (d) { return xScale2(d.score); } )
      	.attr("cy", function (d) { return yScale2(d.cases); } )
		.attr("r", 3)
		.attr("class", "dot")		 
		.style("fill", "#38FF14");

	console.log(d3.min(data, function(d) {return d.score}))
	console.log(d3.min(data, function(d) {return d.cases}))

	let xval = data.map(function (d) {return parseFloat(d.score)});
	let yval = data.map(function (d) {return parseFloat(d.cases)});

	let linear = LinearRegression(xval, yval);

	console.log(linear);

	let max = d3.max(data, function (d) {return d.cases})
	svg2.append('line')
		.attr('class', 'regression')
		.attr('x1', 0)
		.attr('y1', yScale2(linear.intercept))
		.attr('x2', xScale2(max))
		.attr('y2', yScale2((max * linear.slope) + linear.intercept))
		.style("stroke", "white");

	svg2.selectAll('.x-axis2')
        .call(xAxis2);

    svg2.selectAll('.y-axis2')
		.call(yAxis2);
		
	svg2.append("text")
        .attr("x", -60)
        .attr("y", -15)
        .attr("font-size", "18px")
        .style("fill", "white")
        .text("Cases per 100k people");

    svg2.append("text")
        .attr("x", width2 / 2 + 50)
        .attr("y", height2 + 40)
        .attr("font-size", "18px")
        .style("fill", "white")
        .attr('text-anchor', 'end')
		.text("Covid Score");

}

d3.csv('./data/per100k.csv', d3.autoType).then(data => {
	data.pop();

	data.sort(function(x, y) {
		return d3.ascending(x.score, y.score)
	})
	console.log(data);
	update(data);
});