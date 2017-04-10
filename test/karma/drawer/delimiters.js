import DelimitersComponent from '../../../lib/drawer/delimiters';

describe('Delimiter drawer', () => {
    let configuration;
    let object;
    let scales;
    let svg;

    beforeEach(() => {
        configuration = {
            dateFormat: d3.timeFormat('%d %B %Y'),
            labelsWidth: 0,
            labelsRightMargin: 0
        };
        scales = {
            x: d3.scaleTime(),
            y: d3.scaleOrdinal()
        };

        object = new DelimitersComponent;
        svg = d3.select('body').append('svg');
        svg.append('g').classed('extremum', true);
    });

    it('should replace all previously existing minimum or maximum', () => {
        ['maximum', 'minimum'].forEach(extremum => {
            
            svg.select('.extremum')
                .append('text')
                .classed(extremum, true);

            object.draw(svg, null, scales, configuration);
            expect(svg.selectAll(`.${extremum}`).size()).toBe(1, `for ${extremum}`);
        });
    });

    it('should display formated start date of current displayed scale', () => {
        scales.x.domain([new Date('2014-01-01'), new Date('2014-04-01')]);
        object.draw(svg, null, scales, configuration);

        expect(svg.select('.extremum .minimum').text()).toBe('01 January 2014');
    });

    it('should display formated end date of current displayed scale', () => {
        scales.x.domain([new Date('2014-01-01'), new Date('2014-05-01')]);
        object.draw(svg, null, scales, configuration);

        expect(svg.select('.extremum .maximum').text()).toBe('01 May 2014');
    });

    it('should display formated dates using explicit format strings', () => {
        scales.x.domain([new Date('2014-01-01'), new Date('2014-05-01')]);
        object = new DelimitersComponent('◄ {0}', '{0} ►');
        object.draw(svg, null, scales, configuration);

        expect(svg.select('.extremum .minimum').text()).toBe('◄ 01 January 2014');
        expect(svg.select('.extremum .maximum').text()).toBe('01 May 2014 ►');
    });
});
