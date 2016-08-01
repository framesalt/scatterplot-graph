

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', function(data){
  
  processData(data);
  
});

function processData(data){
  
  var canvasFrameSize = 600;
  var canvasSize = 500;
  
  var junkie = "#801a00";
  var nonJunkie = "#337ab3";
  
  
  var seconds = [];
  for ( var i = 0; i < data.length; i ++ )
    seconds.push(data[i]['Seconds']);
  
  
  var scaleBySecondsAkaX = d3.scale.linear()
                          .domain( [seconds[0], seconds[seconds.length-1] ])
                          .range( [canvasSize-50, 0] );
  
  var formatedSeconds = [];
  var begin = seconds[0];
  for ( i = 0; i < seconds.length; i ++ )
    formatedSeconds.push(seconds[i] - begin);
  
  var scaleByFormatedSecondsAkaX = d3.scale.linear()
                              .domain( [formatedSeconds[0], formatedSeconds[formatedSeconds.length - 1]])
                              .range( [canvasSize-50, 0]);
  
  
  
  var convertSeconds = function(seconds){
    var sec = seconds % 60;
    var min = (seconds - sec ) / 60;
    
    return min + ":" + (sec < 10 ? "0" + sec : sec);
    
  }
  
  
  var scaleByParticipantsAkaY = d3.scale.linear()
                                  .domain([0, seconds.length])
                                  .range([0, canvasSize-50]);
  
  
  d3.select('body').append('div')
                   .classed('backForSvg', true);
  
  d3.select('body').append('div')
                   .attr('id', 'customTip');
  
  function contentForTip(d){
      return d.Name + " (" + d.Nationality + ")" 
        +  "<br>" 
        +"Year:" + d.Year + ", Time: " + d.Time 
        + "<br>"
        + (d.Doping ? 'junkie' : 'nonJunkie');
  }
                
  
  var canvasFrame = d3.select('body')
                   .append('svg');
  
  var canvas = canvasFrame.append('g')
                    .attr('transform', 'translate(50,50)')
                    .attr('width', canvasSize)
                    .attr('height', canvasSize);
  
  
      canvas.selectAll('circle')
             .data(seconds)
             .enter()
             .append('circle')
              .attr('cx', function(d,i){ return scaleBySecondsAkaX(d);})
              .attr('cy', function(d,i){ return scaleByParticipantsAkaY(i);})
              .attr('r', 5)
              .attr('fill', function(d, i) { return data[i]['Doping'] ? junkie : nonJunkie; })
              .on('mouseover', function(d, i ){
        
        
        
                d3.select('#customTip')
                  .style('display', 'block')
                  .html(contentForTip(data[i]));
        
      })
              .on('mouseout', function(){
        
                d3.select('#customTip')
                  .style('display', 'none');
        
      })
  
      canvas.selectAll('text').data(seconds)
              .enter()
              .append('text')
              .attr('x', function(d,i){ return scaleBySecondsAkaX(d) + 15;})
              .attr('y', function(d,i){ return scaleByParticipantsAkaY(i) + 5;})
              .attr('font-size', 10)
              .text(function(d, i) { return data[i]['Name'] });
  
  
  
  var bottom = canvasFrame.append('g');
        bottom.transition()
        .duration(500)
        .attr('transform', 'translate(50,' + (canvasSize+ 10) + ')')
         .call(d3.svg.axis()
               .scale(scaleByFormatedSecondsAkaX)
               .orient('bottom')
               .tickFormat(convertSeconds)
               .tickSize(3,1));
  
        bottom.selectAll('circle').data([junkie,nonJunkie]).enter()
        .append('circle')
        .attr('cx', 340)
        .attr('cy', function(d, i) { return -60 + (-i*20);})
        .attr('r', 8)
        .attr('fill', function(d) { return d;});
  
  
  
        bottom
              .append('text')
              .attr('x', 370)
              .attr('y', -55 + (-0*20))
              .text('junkie');
  
  
        bottom
              .append('text')
              .attr('x', 370)
              .attr('y', -55 + (-1*20))
              .text('nonJunkie');
  
  
        bottom.append('text')
        .attr('x', 290 )
        .attr('y', -20)
        .text('minutes behind first place');
  
  
  var left = canvasFrame.append('g');
  
              left.transition()
              .duration(1000)
              .attr('transform', 'translate(40,50)')
              .call(d3.svg.axis()
                    .scale(scaleByParticipantsAkaY)
                    .orient('left')
                    .tickSize(3,1));
  
              left.append('text')
              .attr('transform', 'rotate(-90)')
              .attr('y', 30)
              .attr('x', -20)
              .text('ranking');
  
  
  
  
  
}