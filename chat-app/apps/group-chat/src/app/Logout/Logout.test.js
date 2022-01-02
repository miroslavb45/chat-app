import { render } from '@testing-library/react';
import React from 'react';
import Logout from './Logout';

describe('Logout', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<Logout {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('Logout')).toBeTruthy();
    });
});
