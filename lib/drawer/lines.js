export default class {

    create(container, dimension, scales, configuration) {
        return function (data) {
            return container
                .selectAll('.drop-line')
                .data(data)
                .enter()
                .append('g')
                .classed('drop-line', true)
                .attr('width', scales.x.range()[1])
                .attr('transform', (d, idx) => `translate(0, ${scales.y(idx)})`)
                .attr('fill', configuration.eventLineColor);
        };
    }

};
