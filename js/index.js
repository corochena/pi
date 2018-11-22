var n = 51,
    width = 1000,
    height = 700,
    margin = 25,
    xSc = d3.scaleLinear()
    .domain([1,n])
    .range([margin, width - margin]),
    ySc = d3.scaleLinear()
    .domain([2.7,3.7])
    .range([height - margin, margin]),
    iterations = d3.range(1,n),
    colors = ["silver","red","green","brown","blue","orange", "black"],
    funciones = [piMadhava, piWallis, piViete, piNewton, piNilakantha, piContFrac, piReal];

var dataSeries = funciones.map(function(f) {
  return iterations.map(function(i) {
    return {x: i, y: f(i)}
  })
});

var line = d3.line()
  .x(function(d) { return xSc(d.x); })
  .y(function(d) { return ySc(d.y); });

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

svg.selectAll("path.line")
  .data(dataSeries)
  .enter()
    .append("path")
    .attr("class", "line")
    .attr("d", function(d) { return line(d); })
    .style("stroke", function(d,i) { return colors[i]; });
    
// text para leyenda
var txtLey = svg.selectAll("rect")
  .data(funciones)
  .enter()
    .append("text")
    .attr("x", function(d,i) {
      return (i+1)*100;
    })
    .attr("y", 50)
    .style("stroke", function(d,i) {
      return colors[i];
    })
    .text(function(d) {
      return d.name.slice(2);
    });

txtLey.on("click", function(d) {
  funciones.shift();
  console.log(funciones);
})

// axis code

var xAxis = d3.axisBottom().scale(xSc);
var yAxis = d3.axisLeft().scale(ySc);

svg.append("g")
  .attr("transform", "translate(" + 0 + "," + (height-margin) + ")")
  .call(xAxis);

svg.append("g")
  .attr("transform", "translate(" + margin + "," + 0 + ")")
  .call(yAxis);


// pi proximation functions

function piMadhava(n) {
  var aprox=0;
  for (var i=0; i<n; i++)
    aprox += Math.pow(-1,i)/(2*i+1);
  return 4*aprox;
}

function piWallis(n) {
  var aprox = 1;
  for (var i=1; i<=n; i++)
    aprox *= 4*i*i/(2*i-1)/(2*i+1);
  return 2*aprox;
}

function piNewton(n) {
  var aprox = 0;
  for (var i=1; i<=n; i++) 
    aprox += fact(2*i-2)*i/Math.pow(2,2*i-3)/Math.pow(fact(i),2)/(2*i+1);
  return 4 - aprox;
}

function piNilakantha(n) {
  var aprox = 0;
  for (var i=1; i<=n; i++) 
    aprox += Math.pow(-1, i+1)*4/(2*i)/(2*i+1)/(2*i+2);
  return 3 + aprox;
}

function piContFrac(n) {
  var den = 2*n+1;
  for (var i=n; i>0; i--)
    den = i*i/den + 2*i-1;
  return 4/den;
}

function piViete(n) {
  var aprox = 1;
  var den = 0;
  for (var i=1; i<=n; i++) {
    den = Math.sqrt(2+den);
    aprox *= 2/den;
  }
  return 2*aprox;
}

function piReal() {
  return Math.PI;
}

function fact(n) {
  var r = 1;
  for (var i=1; i<=n; i++) 
    r *= i;
  return r;
}