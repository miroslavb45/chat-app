import { render } from '@testing-library/react';
import React from 'react';
import Topbar from './Topbar';

describe('Topbar', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<Topbar {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('Topbar')).toBeTruthy();
    });
});
