(function ($) {


  function init() {

  }

  $(window).load(function () {
    /*
    $('select').select2({
      minimumResultsForSearch: Infinity
    });
    */
      $('select').select2();
  });

  $(window).load(function () {
    var $wrapper = $('.status-wrapper'),
      $current = $wrapper.find('.current'),
      $statusEl = $wrapper.find('.status li');

    $current.on('click touch', function (e) {
      e.preventDefault();

      $wrapper.removeClass('collapsed');
      $(this).parent().toggleClass('collapsed');
    })

    $statusEl.on('click touch', function (e) {
      e.preventDefault();

      $(this).closest($wrapper).find('.current a').remove();
      $(this).closest($wrapper).find('.current').html($(this).html());
      $(this).closest($wrapper).removeClass('collapsed');
    })
  })

  $(window).load(function () {
    var $btn = $('.btn-mobile');

    $btn.on('click touch', function (e) {
      e.preventDefault();

      $('body').toggleClass('mobile-menu');
    })
  });

  $(window).load(function () {
    var wrapper = document.querySelector('.statistic .media');

    if (!wrapper) return;

    linearCharts();

    function linearCharts() {
      var charts = [
        {
          id: '#chart',
          xAxis: ["TIME"],
          yAxis: [0, 10, 20, 30, 40,50,60],
          elms: [
            {
              title: '',
              position: [
                {
                  x: 0,
                  y: 3
                },
                {
                  x: 50,
                  y: 20
                },
                {
                  x: 90,
                  y: 50
                },

                {
                  x: 180,
                  y: 8
                }
              ],
              speed: 1000,
              color: '#72af2b',
              stroke: 1,
              fill: 'url(#pattern)',
              dotRadius: 0,
              dotStroke: 0,
              dotColor: '',
              dotFill: ''
            },
            {
              title: '',
              position: [
                {
                  x: 0,
                  y: 40,
                  dotVisibility: 'hidden'
                },
                {
                  x: 30,
                  y: 40
                },
                {
                  x: 60,
                  y: 40
                },
                {
                  x: 90,
                  y: 40
                },
                {
                  x: 120,
                  y: 40
                },
                {
                  x: 150,
                  y: 40
                },
                {
                  x: 170,
                  y: 40,
                  dotVisibility: 'hidden'
                }
              ],
              speed: 1000,
              color: '#00bf25',
              stroke: 2,
              fill: 'transparent',
              dotRadius: 10,
              dotStroke: 5,
              dotColor: '#1176c0',
              dotFill: 'transparent'
            }
          ]
        }
      ];

      function LinearChart(el) {
        this.el = el;
        this.margin = {top: 10, right: 10, bottom: 38, left: 52};
        this.width = 768 - this.margin.left - this.margin.right;
        this.height = 242 - this.margin.top - this.margin.bottom;
        this.elmsLength = el.elms.length;
        this.wrapper = document.querySelector(el.id);

        this.init();
      }

      LinearChart.prototype.init = function () {
        var self = this;

        var svg = this.createSvg();
        this.svg = svg.svg;
        this.xScale = svg.xScale;
        this.yScale = svg.yScale;
        this.createAxis();

        var lines = [];

        for (var i = 0; i < this.elmsLength; i++) {
          lines.push(self.createLine(this.el.elms[i], i));
        }

        window.addEventListener('scroll', function () {
          self.animate(lines);
        });
        window.addEventListener('resize', function () {
          self.animate(lines);
        });
        setTimeout(function () {
          self.animate(lines);
        }, 50);
      };

      LinearChart.prototype.createSvg = function () {
        var svg = d3.select(this.el.id).append("svg")
          .attr("width", this.width + this.margin.left + this.margin.right)
          .attr("height", this.height + this.margin.top + this.margin.bottom);

        var defs = svg.append("defs")
          .append("pattern")
          .attr("id", "pattern")
          .attr("width", 6)
          .attr("height", 10)
          .attr("patternUnits", "userSpaceOnUse")
          .attr("patternTransform", "rotate(40 50 50)");

        defs.append("line")
          .attr("y2", "10")
          .attr("stroke", "#72af2b")
          .attr("stroke-width", "20px");

        defs.append("line")
          .attr("y2", "10")
          .attr("stroke", "#72af2b")
          .attr("stroke-width", "1px");

        var g = svg.append("g")
          .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        var xScale = d3.scale.linear()
          .range([0, this.width])
          .domain([0, 170]);

        var yScale = d3.scale.linear()
          .range([this.height, 0])
          .domain([0, 80]);

        return {
          svg: g,
          xScale: xScale,
          yScale: yScale
        };
      };

      LinearChart.prototype.createAxis = function () {
        var xLength = this.el.xAxis.length;
        var yLength = this.el.yAxis.length;
        var position = 'start';

        var xAxis = this.svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + (this.height + this.margin.bottom) + ")");

        for (var i = 0; i < xLength; i++) {
          if (i == xLength - 1) {
            position = "end";
          } else if (i > 0 && i !== xLength - 1) {
            position = "middle";
          }

          xAxis.append("g")
            .attr("class", "tick")
            .attr("transform", "translate(" + this.width / 2 + ", 0)")
            .append("text")
            .attr("style", "text-anchor: " + position + ";")
            .text(this.el.xAxis[i]);
        }

        var yAxis = this.svg.append("g")
          .attr("class", "y axis");

        for (var y = 0; y < yLength; y++) {
          var yAxisG = yAxis.append("g")
            .attr("class", "tick")
            .attr("transform", "translate(0, " + (this.height - y * this.height / (yLength - 1)) + ")");

          yAxisG.append("text")
            .attr("x", -20)
            .attr("y", 3)
            .attr("style", "text-anchor: end; " + (y == 2 ? "font-size: 18; fill: #3dc449;" : ''))
            .text(this.el.yAxis[y]);
        }
      };

      LinearChart.prototype.createLine = function (el, index) {
        var self = this;

        var line = d3.svg.line()
          .x(function (d) {
            return self.xScale(d.x);
          })
          .y(function (d) {
            return self.yScale(0);
          })
          .interpolate("cardinal");

        var lineNewPosition = d3.svg.line()
          .x(function (d) {
            return self.xScale(d.x);
          })
          .y(function (d) {
            return self.yScale(d.y);
          })
          .interpolate("cardinal");

        var path = this.svg.append('path')
          .attr('d', line(el.position))
          .attr('stroke', el.color)
          .attr('stroke-width', el.stroke)
          .attr('fill', el.fill);

        var dot = this.svg.selectAll("dot")
          .data(el.position)
          .enter().append("circle")
          .attr('fill', el.dotFill)
          .attr("r", el.dotRadius)
          .attr('stroke', el.dotColor)
          .attr('stroke-width', el.dotStroke)
          .attr('visibility', function (d) {
            if (d.dotVisibility) {
              return d.dotVisibility;
            }
          })
          .attr("cx", function (d) {
            return self.xScale(d.x);
          })
          .attr("cy", function (d) {
            return self.yScale(0);
          });

        return {path: path, speed: el.speed, position: lineNewPosition(el.position), dot: dot};
      };

      LinearChart.prototype.animate = function (lines) {
        var self = this;
        var rect, offsetTop;
        var scrollPosition = document.body.scrollTop + document.documentElement.clientHeight;

        if (self.wrapper.classList.contains('animated')) return;

        rect = self.wrapper.getBoundingClientRect();
        offsetTop = rect.top + document.body.scrollTop;

        if (scrollPosition > offsetTop + self.wrapper.offsetHeight - 90) {
          self.wrapper.classList.add('animated');
          for (var i = 0; i < self.elmsLength; i++) {
            lines[i].path.transition().duration(lines[i].speed)
              .attr('d', lines[i].position);

            lines[i].dot.transition().duration(lines[i].speed)
              .attr("cx", function (d) {
                return self.xScale(d.x);
              })
              .attr("cy", function (d) {
                return self.yScale(d.y);
              });
          }
        }
      };

      function init(charts) {
        for (var i = 0; i < charts.length; i++) {
          new LinearChart(charts[i]);
        }
      }

      init(charts);
    }
  })

})(jQuery);

