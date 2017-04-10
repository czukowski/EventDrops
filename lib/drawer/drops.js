import * as d3 from 'd3/build/d3';

export default class {

    create(container, dimensions, scales, configuration) {
        return function (data) {
            const dropLines = container
                .selectAll('.drop-line')
                .data(data)
                .enter()
                .append('g')
                .classed('drop-line', true)
                .attr('transform', (d, idx) => `translate(10, ${scales.y(idx)})`)
                .attr('fill', configuration.eventLineColor);

            const drops = dropLines.selectAll('.drop');

            drops
                .data(d => d.data)
                .enter()
                .append('circle')
                .classed('drop', true)
                .attr('r', 5)
                .attr('cx', d => scales.x(configuration.date(d)))
                .attr('cy', configuration.lineHeight / 2)
                .attr('fill', configuration.eventColor)
                .on('click', configuration.click)
                .on('mouseover', configuration.mouseover)
                .on('mouseout', configuration.mouseout);

            // unregister previous event handlers to prevent from memory leaks
            drops
                .exit()
                .on('click', null)
                .on('mouseout', null)
                .on('mouseover', null)
                .remove();

            dropLines.exit().remove();
        };
    }

    zoom(container, dimensions, scales, configuration, data) {
        container.selectAll('.drop')
            .attr('cx', (d, i) => {
                return scales.x(configuration.date(d));
            });
    }

};
