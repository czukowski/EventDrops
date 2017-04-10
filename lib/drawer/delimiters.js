export default class {

    constructor(minFormat='{0}', maxFormat='{0}') {
        this.maxFormat = maxFormat;
        this.minFormat = minFormat;
    }

    draw(svg, dimensions, scales, configuration) {
        const x = configuration.labelsWidth + configuration.labelsRightMargin;
        const dateFormat = configuration.dateFormat;

        const extremum = svg.select('.extremum');
        const domain = scales.x.domain();

        extremum.selectAll('.minimum').remove();
        extremum.selectAll('.maximum').remove();

        extremum
            .append('text')
            .text(this.minFormat.replace('{0}', dateFormat(domain[0])))
            .classed('minimum', true);

        extremum
            .append('text')
            .text(this.maxFormat.replace('{0}', dateFormat(domain[1])))
            .classed('maximum', true)
            .attr('transform', `translate(${scales.x.range()[1] - x})`)
            .attr('text-anchor', 'end');
    }

};
