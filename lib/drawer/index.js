import { metaballs } from '../metaballs';

export default (svg, dimensions, scales, configuration, components) => {
    const containers = {
        svg: svg,
        defs: svg.append('defs'),
        chart: svg
            .append('g')
            .attr('class', 'chart-wrapper')
            .attr(
                'transform',
                `translate(${configuration.labelsWidth + configuration.labelsRightMargin}, 55)`
            ),
        labels: svg
            .append('g')
            .classed('labels', true)
            .attr('transform', `translate(0, ${configuration.lineHeight})`),
    };

    containers.defs
        .append('clipPath')
        .attr('id', 'drops-container-clipper')
        .append('rect')
        .attr('id', 'drops-container-rect')
        .attr('width', dimensions.width)
        .attr(
            'height',
            dimensions.height +
                configuration.margin.top +
                configuration.margin.bottom
        );

    containers.drops = containers.chart
        .append('g')
        .classed('drops-container', true)
        .attr('clip-path', 'url(#drops-container-clipper)');

    containers.chart
        .append('g')
        .classed('extremum', true)
        .attr('width', dimensions.width)
        .attr('height', 30)
        .attr('transform', `translate(0, -35)`);

    if (configuration.metaballs) {
        metaballs(containers.defs);
        containers.drops.style('filter', 'url(#metaballs)');
    }

    containers.axes = containers.chart.append('g').classed('axes', true);

    const lineSeparator = components.lineSeparator.create(null, dimensions, scales, configuration, components);
    const labels = components.labels.create(containers.labels, dimensions, scales, configuration, components);
    const lines = components.lines.create(containers.drops, dimensions, scales, configuration, components);
    const drops = components.drops.create(containers.drops, dimensions, scales, configuration, components);

    return data => {
        lineSeparator(containers.axes, data);
        components.delimiters.draw(svg, dimensions, scales, configuration);

        const linesSelect = lines(data);
        drops(linesSelect, data);
        linesSelect.exit().remove();

        labels(data);

        components.topAxis.draw(containers.axes, dimensions, scales, configuration, data);
        components.bottomAxis.draw(containers.axes, dimensions, scales, configuration, data);
    };
};
