import { render } from '@testing-library/react';
import React from 'react';
import Register from './Register';

describe('Register', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<Register {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('Register')).toBeTruthy();
    });
});
