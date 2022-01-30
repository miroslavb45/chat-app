import { render } from '@testing-library/react';
import React from 'react';
import Login from './Login';

describe('Login', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<Login {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('Login')).toBeTruthy();
    });
});
