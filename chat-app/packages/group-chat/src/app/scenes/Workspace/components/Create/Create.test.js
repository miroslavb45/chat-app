import { render } from '@testing-library/react';
import React from 'react';
import Create from './Create';

describe('Create', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<Create {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('Create')).toBeTruthy();
    });
});
