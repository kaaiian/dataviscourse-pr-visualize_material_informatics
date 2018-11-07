/** Class implementing the tileChart. */
class Periodic_table {

    /**
     * Initializes the svg elements required to lay the tiles
     * @param ptable instance of ptable
     * and to populate the legend.
     */
    constructor(ptable, act_vs_pre, line_graph,info,tsne){
        // Follow the constructor method in yearChart.js
        // assign class 'content' in style.css to tile chart
        this.margin = {top: 10, right: 5, bottom: 20, left: 5};
        let divyearChart = d3.select("#Periodic_Table_Chart").classed("ptable_view", true);
        this.svgBounds = divyearChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = parseInt(this.svgWidth*3/5);
        this.svg = divyearChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
        this.ptable = ptable;
        this.act_vs_pre = act_vs_pre;
        this.line_graph = line_graph;
        this.info = info;
        this.tsne = tsne;

        /* THIS PREPOPULATES THE Act VS Pred Graph while making the Ptable */
        d3.csv("data/experimental_predictions.csv").then(element_data => {
            console.log('update act_vs_pred', element_data)
            this.act_vs_pre.update(element_data);
        });

        let legendHeight = 20;
        //add the svg to the div
        let legend = d3.select("#legend").classed("tile_view",true);

        // creates svg elements within the div
        this.legendSvg = legend.append("svg")
                            .attr("width",this.svgWidth)
                            .attr("height",legendHeight)
                            .attr("transform", "translate(" + this.margin.left + ",0)");
    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (party) {
        if (party == "R"){
            return "republican";
        }
        else if (party== "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    }





    /**
     * Creates tiles and tool tip for each state, legend for encoding the color scale information.
     *
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */
    update (colorScale){

        //for reference:https://github.com/Caged/d3-tip
        //Use this tool tip element to handle any hover over the chart

        // ******* TODO: PART IV *******
        // Transform the legend element to appear in the center 
        // make a call to this element for it to display.

        // Lay rectangles corresponding to each state according to the 'row' and 'column' information in the data.
        // column is coded as 'Space' in the data.

        // Display the state abbreviation and number of electoral votes on each of these rectangles

        // Use global color scale to color code the tiles.

        // HINT: Use .tile class to style your tiles;
        // .tilestext to style the text corresponding to tiles

        //Call the tool tip on hover over the tiles to display stateName, count of electoral votes
        //then, vote percentage and number of votes won by each party.
        //HINT: Use the .republican, .democrat and .independent classes to style your elements.
        //Creates a legend element and assigns a scale that needs to be visualized
        this.svg.selectAll("*").remove();
        let widthCur = parseInt(this.svgWidth/20);
        let heightCur =parseInt(this.svgHeight/12);
        var domain1 =  [0, 1, 10, 40, 80, 200, 500, 1000 ,1600];


        var ptable_bars = this.svg
            .append("g")
            .attr("id", "ptable_bars");

        var color_bars = this.svg
            .append("g")
            .attr("id", "color_bars");

        color_bars.append('g').attr('id', 'title_of_colors_bar');
        let title_group = color_bars.select('#title_of_colors_bar');
        title_group.append('text')
            .attr('x', widthCur*10.5)
            .attr('y', heightCur*0.3)
            .style('font-size', d=>heightCur*0.2+'px')
            .style('fill','black')
            .style('text-anchor', 'middle')
            .text(d=>"Number of Formulae Containing Each Element");


        let c_bars =  color_bars.selectAll('rect').data(domain1);
        c_bars.enter()
            .append('rect')
            .attr('x', (d,i)=>widthCur*9+i*widthCur/3)
            .attr('y', heightCur*0.6)
            .attr('width',widthCur/3)
            .attr('height', function(d){if(d>1){return d/30*heightCur/20+heightCur/4}else if(d===0){return heightCur/8} return heightCur/6;})
            .style('fill', d=>colorScale(d))
            .style( 'stroke', '#101010')
            .style('stroke-width',1);
        // c_bars.enter()
        //     .append('text')
        //     .attr('x', (d,i)=>widthCur*9+i*widthCur/3+0.5*widthCur/3)
        //     .attr('y', function(d){if(d>1){return d/30*heightCur/20+heightCur/4+heightCur*0.65}else if(d===0){return heightCur*0.65+heightCur/8} return heightCur*0.65+heightCur/6;})
        //     .style('font-size', d=>heightCur*0.15+'px')
        //     .style('fill','red')
        //     .style('text-anchor', 'middle')
        //     .text(d=>d);

        var x = d3.scaleQuantile().range([0, widthCur*1/3,widthCur*2/3,widthCur*3/3,widthCur*4/3,widthCur*5/3,widthCur*6/3,widthCur*7/3,widthCur*8/3]);
        var xDomain = x.domain(domain1);
        let xAxis = d3.axisTop(x).tickSizeOuter(0);
            
        color_bars.append('g').classed('axis', true)
              .attr('transform', "translate("+(widthCur*9-1)+"," + heightCur*0.6 + ")").call(xAxis)
              .style('font-size', d=>heightCur*0.16+'px')
              .style('text-anchor', 'middle');
        let text_bars = color_bars.selectAll('g').selectAll('g').selectAll('text');
        text_bars.attr('y', -heightCur*0.1)
        let lines_bars = color_bars.selectAll('g').selectAll('g').selectAll('line');
        lines_bars.attr('y2', -heightCur*0.06)


        var barChart_bars = this.svg
            .append("g")
            .attr("id", "barChart_bars");

        
        let bars = ptable_bars.selectAll('g').data(this.ptable).enter().append('g');

        


        bars
            .append("rect")
            .attr("y", d=> d.row*heightCur)
            .attr("x", d=> d.column*widthCur)
            .attr('height',heightCur*0.9)
            .attr('width', widthCur*0.9 )  
            .attr('class',"tile")      
            .style('fill',d =>colorScale(d.count));

        

       
        bars
            .append('text')
            .attr("y", d=> d.row*heightCur+heightCur*0.5)
            .attr("x", d=> d.column*widthCur)
            .attr("dx", d=> widthCur*0.05)
            .attr('class', d => d.symbol + " tilestext")
            .style('font-size', d=>heightCur*0.4+'px')
            .style('fill', function(d){if(d.count > 0){ return '#565656'} return 'red'})
            .text(d =>  d.symbol)

        
        
        bars
            .append('text')
            .attr("y", d=> d.row*heightCur+heightCur*0.7)
            .attr("x", d=> d.column*widthCur)
            .attr("dx", d=> widthCur*0.05)
            .attr('class', "tilestext")
            .attr('text-anchor', 'start')
            .style('font-size', d=>heightCur*0.2+'px')
            .style('fill', function(d){if(d.count > 0){ return '#565656'} return 'red'})
            .text(d =>  d.name);

        bars            
            .on('click', click)
            .on("mouseover", hoverOver)
            .on("mouseout", hoverOff);

        let legendQuantile = d3.legendColor()
            .shapeWidth((this.svgWidth - 2*this.margin.left - this.margin.right)/12)
            .cells(20)
            .orient('vertical')
            .labelFormat(d3.format('.1r'))
            .scale(colorScale);

        function click(d) {
            console.log("clicked")
            var selectedCircle = d3.select(this).select('rect')
            if (d.count >0){
                selectedCircle.classed("highlighted",true);
                console.log(d.symbol)
                d3.csv("data/element_data/"+d.symbol+".csv").then(elementTable => {
                    console.log(elementTable);
                    updateBarsCharts(elementTable);
                    act_vs_pre.update(elementTable);
                    //tsne.update(elementTable);
                    //line_graph.update(elementTable);
                });

            }
           
            /*d3.csv("data/year_timeline_"+d.YEAR+".csv").then(electionResult => {
                console.log(electionResult);
                electoralVoteChart.update(electionResult, colorScale);
                votePercentageChart.update(electionResult);
                tileChart.update(electionResult, colorScale);
            });*/
        }

        function hoverOver(d) {
            let selected_data = d3.selectAll('#act_vs_pred_data')
                .selectAll("*:not(."+d.symbol+')')
                .lower()
                .classed('not_selected', true)
        }

        function hoverOff(d) {
            let selected_data = d3.selectAll('#act_vs_pred_data')
                .selectAll("*:not(."+d.symbol+')')
                .classed('not_selected', false)
        }

        function notclick() {
            var selectedCircle = d3.select(this).select('rect')
            selectedCircle.classed("highlighted",false);
        }

        function updateBarsCharts(residualTable){
            console.log("shtting check");
            console.log(barChart_bars);
    
    
    
        };


            
    };

    


}