import { DataItemComponent } from './components';

// Function to return only components extending `DataItemComponent` class.
const filterDataComponents = (components) => {
    const result = [];
    for (var key in components) {
        if (components[key] instanceof DataItemComponent) {
            result.push(components[key]);
        }
    }
    return result;
};

export default class {

    create(container, dimensions, scales, configuration, components) {
        const dataComponents = filterDataComponents(components);

        return function (data) {
            const labels = container.selectAll('.label').data(data);

            const text = d => {
                const count = dataComponents.map((c) => c.filter(d.data, scales.x).length)
                    .reduce((a, b) => a + b, 0);
                return d.name + (count > 0 ? ` (${count})` : '');
            };

            labels.text(text);

            labels
                .enter()
                .append('text')
                .classed('label', true)
                .attr('x', configuration.labelsWidth)
                .attr(
                    'transform',
                    (d, idx) => `translate(0, ${40 + scales.y(idx)})`
                )
                .attr('text-anchor', 'end')
                .text(text);

            labels.exit().remove();
        };
    }

};
