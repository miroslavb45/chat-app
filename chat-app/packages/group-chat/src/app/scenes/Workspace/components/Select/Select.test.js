import { render } from '@testing-library/react';
import React from 'react';
import Select from './Select';

describe('Select', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<Select {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('Select')).toBeTruthy();
    });
});
