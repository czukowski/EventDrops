import 'd3';
import xAxis from '../xAxis';

const boolOrReturnValue = (x, data) =>
    typeof x === 'function' ? x(data) : x;

const drawAxis = (container, xScale, configuration, orientation, y) => {
    return container
        .append('g')
        .classed('x-axis', true)
        .classed(orientation, true)
        .attr('transform', `translate(0, ${y})`)
        .call(xAxis(xScale, configuration, orientation));
};

export class TopAxisComponent {

    draw(container, dimensions, scales, configuration, data) {
        if (boolOrReturnValue(configuration.hasTopAxis, data)) {
            drawAxis(container, scales.x, configuration, 'top', 0);
        }
    }

    zoom(container, dimensions, scales, configuration, data) {
        if (boolOrReturnValue(configuration.hasTopAxis, data)) {
            container.call(d3.axisTop().scale(scales.x));
        }
    }

};

export class BottomAxisComponent {

    draw(container, dimensions, scales, configuration, data) {
        if (boolOrReturnValue(configuration.hasBottomAxis, data)) {
            drawAxis(
                container,
                scales.x,
                configuration,
                'bottom',
                +dimensions.height - 21
            );
        }
    }

    zoom(container, dimensions, scales, configuration, data) {
        if (boolOrReturnValue(configuration.hasTopAxis, data)) {
            container.call(d3.axisBottom().scale(scales.x));
        }
    }

};
