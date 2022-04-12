import { render } from '@testing-library/react';
import React from 'react';
import Dropdown from './Dropdown';

describe('Dropdown', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<Dropdown {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('Dropdown')).toBeTruthy();
    });
});
