import { render } from '@testing-library/react';
import React from 'react';
import DaySeparator from './DaySeparator';

describe('DaySeparator', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<DaySeparator {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('DaySeparator')).toBeTruthy();
    });
});
