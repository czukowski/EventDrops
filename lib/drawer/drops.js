import { DataItemComponent } from './components';

export default class extends DataItemComponent {

    constructor(dateFunction, canDrawFunction) {
        super();
        this.canDrawFunction = canDrawFunction;
        this.dateFunction = dateFunction;
    }

    create(container, dimensions, scales, configuration) {
        const canDrawFunction = this.canDrawFunction;
        const dateFunction = this.dateFunction;

        return function (container, data) {
            const drops = container.selectAll('.drop');

            drops
                .data(d => d.data.filter(d => canDrawFunction(d)))
                .enter()
                .append('circle')
                .classed('drop', true)
                .attr('r', 5)
                .attr('cx', d => scales.x(dateFunction(d)))
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
        };
    }

    filter(data = [], scale) {
        const canDrawFunction = this.canDrawFunction;
        const dateFunction = this.dateFunction;
        const [min, max] = scale.domain();

        return data.filter(d => {
            if (canDrawFunction(d)) {
                const date = dateFunction(d);
                return date >= min && date <= max;
            }
        });
    }

    zoom(container, dimensions, scales, configuration, data) {
        const dateFunction = this.dateFunction;

        container.selectAll('.drop')
            .attr('cx', (d, i) => {
                return scales.x(dateFunction(d));
            });
    }

};