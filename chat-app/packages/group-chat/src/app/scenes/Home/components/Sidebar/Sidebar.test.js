import { render } from '@testing-library/react';
import React from 'react';
import Sidebar from './Sidebar';

describe('Sidebar', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<Sidebar {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('Sidebar')).toBeTruthy();
    });
});
