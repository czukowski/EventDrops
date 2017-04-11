import * as d3 from 'd3/build/d3';
import debounce from 'debounce'

export default (container, dimensions, scales, configuration, components, data, callback) => {

    const onZoom = (data,index,element) => {
        const rescales = {
            x: d3.event.transform.rescaleX(scales.x)
        };

        components.topAxis.zoom(container.selectAll('.x-axis.top'), dimensions, rescales, configuration, data);
        components.bottomAxis.zoom(container.selectAll('.x-axis.bottom'), dimensions, rescales, configuration, data);

        const sumDataCount = debounce(
            components.labels.create(container.select('.labels'), dimensions, rescales, configuration, components),
            100
        );

        requestAnimationFrame(() =>{

            components.drops.zoom(container.selectAll('.drop-line'), dimensions, rescales, configuration);
            components.ranges.zoom(container.selectAll('.drop-line'), dimensions, rescales, configuration);

            sumDataCount(data);

            if(callback){
                callback(data);
            }
        });
    };

    const zoom = d3.zoom()
        .translateExtent([
            [scales.x(configuration.start), 0],
            [scales.x(configuration.end), dimensions.height]
        ])
        .extent([
            [scales.x(configuration.start), 0],
            [scales.x(configuration.end), dimensions.height]
        ])
        .scaleExtent([configuration.minScale, configuration.maxScale])
        .on('zoom', onZoom)
        .on('end', configuration.zoomend);

    container.call(zoom)
        .on('wheel', () => { d3.event.preventDefault(); });
    return zoom;
};
