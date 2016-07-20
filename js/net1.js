
var width = 800,
    height = 800;

/*var color = d3.scale.ordinal()
            .range(colorbrewer.YlGnBu[9]);
*/
var color = d3.scale.linear()
    .domain([1, 4, 7, 10, 13, 16])
    .range(colorbrewer.YlGnBu[6]);

var threshold = d3.scale.threshold()
    .domain([1, 4, 7, 10, 13, 16])
    .range(colorbrewer.YlGnBu[6]);

var colorsex = d3.scale.ordinal()
    .domain(["f", "m"])
    .range("#F02275","#3622F0");


var origin_r = 15,
    after_r = 40;

var force = d3.layout.force()
    .size([width, height])
    .linkDistance(90)
    .charge(-300);

d3.json("people2.json", function(error, graph) {

    if (error) throw error;

var svg = d3.select("#network").append("svg")
    .attr("width", width)
    .attr("height", height);

// add background color
svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#21212B");

// add images pattern
/*
d3.select("#network").append("svg")
       .append("def")
       .append("pattern")
         .attr("id", "img1")
         .attr("height",1)
         .attr("width",1)
         //.attr("x",0)
         //.attr("y",0)
       .append("image")
        .attr("width",75)
        .attr("height",75)
        .attr("x",0)
        .attr("y",0)
        .attr('xlink:href',"img/jifeng1.jpeg");
*/

// add tips:

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    var html_tip = '<span class = "exit hide-desktop show-700">X</span>';
	    	html_tip += "<h3>" + d.name;
	    	    html_tip += ", " + d.sex;
	    		html_tip += ", " + d.age;
	    	html_tip += "</h3>";
			html_tip += "<h4>" +"Score: "+ d.group + "</h4>";
	    	html_tip += "<div class='tip-role'><p><strong>Race:</strong>" + d.race + "\n"
	    	 + "<strong>Education:</strong>" + d.education + "\n"
	    	 + "<strong>Employment:</strong>" + d.employment + "\n"
	    	 + "<strong>Citizenship:</strong>" + d.citizenship + "\n"
	    	 + "</p></div>";
	    	//html_tip += "<div class='tip-role'><strong>Race:</strong> " + d.employment + "</div>";
	    	//html_tip += "<div class='tip-role'><strong>Race:</strong> " + d.citizenship + "</div>";
	return html_tip;
  })


force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

// add the links and the arrows
var path = svg.append("svg:g").selectAll("path")
    .data(force.links())
  .enter().append("svg:path")
//    .attr("class", function(d) { return "link " + d.type; })
    .attr("class", "link")
    .attr("marker-end", "url(#end)");

// define the nodes
var node = svg.selectAll(".node")
    .data(force.nodes())
  .enter().append("g")
    .attr("class", "node")
    .on("mouseover", tip.show)
    .on("mouseout", function(d) {tip.hide(d);})
    .on("click", click)
    .on("dblclick", doubleclick)
    .call(force.drag)
    .call(tip);

// add the nodes and circles
node.append("circle")
    .attr("id", "circle-outer")
    .attr("r", origin_r)
    .style("fill", function(d) {
    if (d.sex == "f"){return "#F5C1D6";}
    else {return "#B0E4F5"};
    });

node.append("circle")
    .attr("id", "circle-inner")
    .attr("stroke-width", 0)
    .attr("r", origin_r - 4)
    .style("fill", function(d) {return color(d.group); });
/*
var formatPercent = d3.format(".0%"),
    formatNumber = d3.format(".0f");

var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, 240]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(13)
    .tickValues(threshold.domain())
    .tickFormat(function(d) { return d === .5 ? formatPercent(d) : formatNumber(100 * d); });

var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(" + (width - 240) / 2 + "," + height / 2 + ")");

g.selectAll("rect")
    .data(threshold.range().map(function(colour) {
      var d = threshold.invertExtent(colour);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    }))
  .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return x(d[0]); })
    .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    .style("fill", function(d) { return threshold(d[0]); });

g.call(xAxis).append("text")
    .attr("class", "caption")
    .attr("y", -6)
    .text("Percentage of People Getting Married in their Category");*/


// add tick effect

force.on("tick", tick);

// add the curvy lines
function tick() {
    path.attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" +
            d.source.x + "," +
            d.source.y + "A" +
            dr + "," + dr + " 0 0,1 " +
            d.target.x + "," +
            d.target.y;
    });

    node
        .attr("transform", function(d) {
  	    return "translate(" + d.x + "," + d.y + ")"; });
}

// action to take on mouse click

function click() {

    d3.select(this).select("#circle-inner").transition()
        .duration(750)
        .attr("r", after_r)
        .style("fill", function(d) {return "url(#" + d.name+")"});

}

// action to take on double click
function doubleclick() {

    d3.select(this).select("#circle-inner").transition()
        .duration(750)
        .attr("r", origin_r - 3)
        .style("fill", function(d) {return color(d.group); });

/*
    d3.select(this).select("text").transition()
        .duration(750)
        .attr("x", 12)
        .style("stroke", "none")
        .style("fill", "black")
        .style("stroke", "none")
        .style("font", "0px sans-serif");*/
}

});

/*
function initializeViz() {
  var placeholderDiv = document.getElementById("tableauViz");
  var url = "http://public.tableau.com/views/WorldIndicators/GDPpercapita";
  var options = {
    width: placeholderDiv.offsetWidth,
    height: placeholderDiv.offsetHeight,
    hideTabs: true,
    hideToolbar: true,
    onFirstInteractive: function () {
      workbook = viz.getWorkbook();
      activeSheet = workbook.getActiveSheet();
    }
  };
  viz = new tableau.Viz(placeholderDiv, url, options);
}*/

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

// d3.tip function

d3.tip = function() {
  var direction = d3_tip_direction,
      offset    = d3_tip_offset,
      html      = d3_tip_html,
      node      = initNode(),
      svg       = null,
      point     = null,
      target    = null

  function tip(vis) {
    svg = getSVGNode(vis)
    point = svg.createSVGPoint()
    document.body.appendChild(node)
  }

  // Public - show the tooltip on the screen
  //
  // Returns a tip
  tip.show = function() {
    var args = Array.prototype.slice.call(arguments)
    if(args[args.length - 1] instanceof SVGElement) target = args.pop()

    var content = html.apply(this, args),
        poffset = offset.apply(this, args),
        dir     = direction.apply(this, args),
        nodel   = d3.select(node), i = 0,
        coords

    nodel.html(content)
      .style({ opacity: 1, 'pointer-events': 'all' })

    while(i--) nodel.classed(directions[i], false)
    coords = direction_callbacks.get(dir).apply(this)
    nodel.classed(dir, true).style({
      top: (coords.top +  poffset[0]) + 'px',
      left: (coords.left + poffset[1]) + 'px'
    })

    return tip
  }

  // Public - hide the tooltip
  //
  // Returns a tip
  tip.hide = function() {
    nodel = d3.select(node)
    nodel.style({ opacity: 0, 'pointer-events': 'none' })
    return tip
  }

  // Public: Proxy attr calls to the d3 tip container.  Sets or gets attribute value.
  //
  // n - name of the attribute
  // v - value of the attribute
  //
  // Returns tip or attribute value
  tip.attr = function(n, v) {
    if (arguments.length < 2 && typeof n === 'string') {
      return d3.select(node).attr(n)
    } else {
      var args =  Array.prototype.slice.call(arguments)
      d3.selection.prototype.attr.apply(d3.select(node), args)
    }

    return tip
  }

  // Public: Proxy style calls to the d3 tip container.  Sets or gets a style value.
  //
  // n - name of the property
  // v - value of the property
  //
  // Returns tip or style property value
  tip.style = function(n, v) {
    if (arguments.length < 2 && typeof n === 'string') {
      return d3.select(node).style(n)
    } else {
      var args =  Array.prototype.slice.call(arguments)
      d3.selection.prototype.style.apply(d3.select(node), args)
    }

    return tip
  }

  // Public: Set or get the direction of the tooltip
  //
  // v - One of n(north), s(south), e(east), or w(west), nw(northwest),
  //     sw(southwest), ne(northeast) or se(southeast)
  //
  // Returns tip or direction
  tip.direction = function(v) {
    if (!arguments.length) return direction
    direction = v == null ? v : d3.functor(v)

    return tip
  }

  // Public: Sets or gets the offset of the tip
  //
  // v - Array of [x, y] offset
  //
  // Returns offset or
  tip.offset = function(v) {
    if (!arguments.length) return offset
    offset = v == null ? v : d3.functor(v)

    return tip
  }

  // Public: sets or gets the html value of the tooltip
  //
  // v - String value of the tip
  //
  // Returns html value or tip
  tip.html = function(v) {
    if (!arguments.length) return html
    html = v == null ? v : d3.functor(v)

    return tip
  }

  function d3_tip_direction() { return 'n' }
  function d3_tip_offset() { return [0, 0] }
  function d3_tip_html() { return ' ' }

  var direction_callbacks = d3.map({
    n:  direction_n,
    s:  direction_s,
    e:  direction_e,
    w:  direction_w,
    nw: direction_nw,
    ne: direction_ne,
    sw: direction_sw,
    se: direction_se
  }),

  directions = direction_callbacks.keys()

  function direction_n() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.n.y - node.offsetHeight,
      left: bbox.n.x - node.offsetWidth / 2
    }
  }

  function direction_s() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.s.y,
      left: bbox.s.x - node.offsetWidth / 2
    }
  }

  function direction_e() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.e.y - node.offsetHeight / 2,
      left: bbox.e.x
    }
  }

  function direction_w() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.w.y - node.offsetHeight / 2,
      left: bbox.w.x - node.offsetWidth
    }
  }

  function direction_nw() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.nw.y - node.offsetHeight,
      left: bbox.nw.x - node.offsetWidth
    }
  }

  function direction_ne() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.ne.y - node.offsetHeight,
      left: bbox.ne.x
    }
  }

  function direction_sw() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.sw.y,
      left: bbox.sw.x - node.offsetWidth
    }
  }

  function direction_se() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.se.y,
      left: bbox.e.x
    }
  }

  function initNode() {
    var node = d3.select(document.createElement('div'))
    node.style({
      position: 'absolute',
      opacity: 0,
      pointerEvents: 'none',
      boxSizing: 'border-box'
    })

    return node.node()
  }

  function getSVGNode(el) {
    el = el.node()
    if(el.tagName.toLowerCase() == 'svg')
      return el

    return el.ownerSVGElement
  }

  // Private - gets the screen coordinates of a shape
  //
  // Given a shape on the screen, will return an SVGPoint for the directions
  // n(north), s(south), e(east), w(west), ne(northeast), se(southeast), nw(northwest),
  // sw(southwest).
  //
  //    +-+-+
  //    |   |
  //    +   +
  //    |   |
  //    +-+-+
  //
  // Returns an Object {n, s, e, w, nw, sw, ne, se}
  function getScreenBBox() {
    var targetel   = target || d3.event.target,
        bbox       = {},
        matrix     = targetel.getScreenCTM(),
        tbbox      = targetel.getBBox(),
        width      = tbbox.width,
        height     = tbbox.height,
        x          = tbbox.x,
        y          = tbbox.y,
        scrollTop  = document.documentElement.scrollTop || document.body.scrollTop,
        scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft


    point.x = x + scrollLeft
    point.y = y + scrollTop
    bbox.nw = point.matrixTransform(matrix)
    point.x += width
    bbox.ne = point.matrixTransform(matrix)
    point.y += height
    bbox.se = point.matrixTransform(matrix)
    point.x -= width
    bbox.sw = point.matrixTransform(matrix)
    point.y -= height / 2
    bbox.w  = point.matrixTransform(matrix)
    point.x += width
    bbox.e = point.matrixTransform(matrix)
    point.x -= width / 2
    point.y -= height / 2
    bbox.n = point.matrixTransform(matrix)
    point.y += height
    bbox.s = point.matrixTransform(matrix)

    return bbox
  }

  return tip
};