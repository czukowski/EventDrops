import * as d3 from  'd3/build/d3';
import DelimitersComponent from './drawer/delimiters';
import DropsComponent from './drawer/drops';
import LabelsComponent from './drawer/labels';
import LinesComponent from './drawer/lines';
import RangesComponent from './drawer/ranges';
import LineSeparatorComponent from './drawer/lineSeparator';
import { TopAxisComponent, BottomAxisComponent } from './drawer/xAxis';

const config = {
    lineHeight: 40,
    start: new Date(0),
    end: new Date(),
    minScale: 0,
    maxScale: Infinity,
    margin: {
        top: 60,
        left: 200,
        bottom: 40,
        right: 50,
    },
    labelsWidth: 210,
    labelsRightMargin: 10,
    locale: null,
    axisFormat: null,
    tickFormat: (date) => {
        const formatMillisecond = d3.timeFormat(".%L"),
            formatSecond = d3.timeFormat(":%S"),
            formatMinute = d3.timeFormat("%I:%M"),
            formatHour = d3.timeFormat("%I %p"),
            formatDay = d3.timeFormat("%a %d"),
            formatWeek = d3.timeFormat("%b %d"),
            formatMonth = d3.timeFormat("%B"),
            formatYear = d3.timeFormat("%Y");

        //multiFormat(date) {
            return (d3.timeSecond(date) < date ? formatMillisecond
                : d3.timeMinute(date) < date ? formatSecond
                    : d3.timeHour(date) < date ? formatMinute
                        : d3.timeDay(date) < date ? formatHour
                            : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
                                : d3.timeYear(date) < date ? formatMonth
                                    : formatYear)(date);
        //}
    },
    mouseout: () => {},
    mouseover: () => {},
    zoomend: () => {},
    click: () => {},
    hasDelimiter: true,
    date: d => d,
    hasTopAxis: true,
    hasBottomAxis: (d) => d.length >= 10,
    eventLineColor: 'black',
    eventColor: null,
    metaballs: true,
    zoomable: true,
    zoomDuration: 50,
    chartComponents: {}
};

config.dateFormat = config.locale ? config.locale.timeFormat('%d %B %Y') : d3.timeFormat('%d %B %Y');

const componentsFactory = (config) => {
    const defaultComponents = {
        delimiters: new DelimitersComponent,
        drops: new DropsComponent(config.date, () => true),
        ranges: new RangesComponent(config.date, () => false),
        labels: new LabelsComponent,
        lineSeparator: new LineSeparatorComponent,
        lines: new LinesComponent,
        topAxis: new TopAxisComponent,
        bottomAxis: new BottomAxisComponent
    };
    // Merge all chart components to config so that it can be accessed externally.
    // FIXME: it won't allow adding/removing components on the fly though.
    config.chartComponents = { ...defaultComponents, ...config.chartComponents };
    return config.chartComponents;
};

// Compatibility layer for putting some config options directly to chart components.
const getPropertyByPath = (obj, path) => {
    var i, j, parent, ref;
    parent = obj;
    if (path.length > 1) {
        for (i = j = 0, ref = path.length - 2; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
            parent = parent[path[i]];
        }
    }
    return parent !== null ? parent[path[path.length - 1]] : undefined;
};

const setPropertyByPath = (obj, path, value) => {
    var i, j, name, parent, ref;
    parent = obj;
    if (path.length > 1) {
        for (i = j = 0, ref = path.length - 2; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
            parent = (parent[name = path[i]] || (parent[name] = {}));
        }
    }
    return parent[path[path.length - 1]] = value;
};

const componentConfigCompatibility = (targetFunction, config, key, components, path) => {
    // Manually add a replacement function that will propagate config value to components.
    targetFunction[key] = (value) => {
        if (!arguments.length) {
            return getPropertyByPath(components, path);
        }
        setPropertyByPath(components, path, value);
        return targetFunction;
    };
    // Remove original value from config so that configurable.js does not report a conflict.
    delete config[key];
};

export {
    config as defaultConfig,
    componentsFactory as createDefaultComponents,
    componentConfigCompatibility as configCompatibility
};
