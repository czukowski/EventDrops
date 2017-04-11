import { createDefaultComponents } from '../../../lib/config';
import LabelsComponent from '../../../lib/drawer/labels';

describe('Labels drawer', () => {
    const scales = {
        x: d3.scaleTime(),
        y: d3.scaleOrdinal()
    };

    const config = {
        labelsWidth: 50,
        date: d => d // From defaults
    };

    const domain = [new Date('2014-01-01'), new Date('2014-05-01')];
    const data = [{ name: 'foo', dates: domain }];

    let svg;
    let container;
    let components;
    let object;

    beforeEach(() => {
        d3.select('body').html('');
        svg = d3.select('body').append('svg');
        svg.append('g').classed('extremum', true);

        container = svg
            .append('g')
            .classed('labels', true)
            .attr('transform', 'translate(0, 45)');
        components = createDefaultComponents({date: d => d});
        object = new LabelsComponent;
    });

    it('should apply labelsWidth config', () => {
        scales.x.domain(domain);
        object.create(container, null, scales, config, components)(data);
        expect(+svg.select('.label').attr('x')).toBe(50);
    });

    it('should show label count with simple data', () => {
        const data = [{name: 'foo', data: [new Date('2014-02-01'), new Date('2014-03-01')]}];
        scales.x.domain(domain);
        object.create(container, null, scales, config, components)(data);
        expect(document.querySelector('.label').textContent).toBe('foo (2)');
    });

    it('should show label count with complex data', () => {
        const complexData = [{ name: 'foo', data: [{ test: 'bar', date: new Date('2014-02-01') }, { test: 'baz', date: new Date('2014-03-01') }]}];
        components.drops.dateFunction = (d) => d.date;

        scales.x.domain(domain);
        object.create(container, null, scales, config, components)(complexData);

        expect(document.querySelector('.label').textContent).toBe('foo (2)');
    });
});
