import { DataItemComponent } from './components';

export default class extends DataItemComponent {

    constructor(boundsFunction, canDrawFunction) {
        super();
        this.boundsFunction = boundsFunction;
        this.canDrawFunction = canDrawFunction;
    }

    create(container, dimensions, scales, configuration) {
        const boundsFunction = this.boundsFunction;
        const canDrawFunction = this.canDrawFunction;

        return function (container, data) {
            const ranges = container.selectAll('.range');

            ranges
                .data(d => d.data.filter(d => canDrawFunction(d)))
                .enter()
                .append('rect')
                .classed('range', true)
                .attr('x', d => scales.x(boundsFunction(d)[0]))
                .attr('y', configuration.lineHeight / 2 - 5)
                .attr('width', d => {
                    const dates = boundsFunction(d);
                    return Math.max(scales.x(dates[1]) - scales.x(dates[0]), 10);
                })
                .attr('height', 10)
                .attr('rx', 5)
                .attr('ry', 5)
                .attr('fill', configuration.eventColor)
                .on('click', configuration.click)
                .on('mouseover', configuration.mouseover)
                .on('mouseout', configuration.mouseout);

            // unregister previous event handlers to prevent from memory leaks
            ranges
                .exit()
                .on('click', null)
                .on('mouseout', null)
                .on('mouseover', null)
                .remove();
        };
    }

    filter(data = [], scale) {
        const boundsFunction = this.boundsFunction;
        const canDrawFunction = this.canDrawFunction;
        const [min, max] = scale.domain();

        return data.filter(d => {
            if (canDrawFunction(d)) {
                const dates = boundsFunction(d);
                return dates[1] >= min && dates[0] <= max;
            }
        });
    }

    zoom(container, dimensions, scales, configuration, data) {
        const boundsFunction = this.boundsFunction;
        let selection = container.selectAll('.range');

        if (configuration.zoomDuration) {
            selection = selection.transition()
                .duration(configuration.zoomDuration);
        }
        selection.attr('x', d => scales.x(boundsFunction(d)[0]))
            .attr('width', d => {
                const dates = boundsFunction(d);
                return Math.max(scales.x(dates[1]) - scales.x(dates[0]), 10);
            });
    }

};
