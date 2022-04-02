import { render } from '@testing-library/react';
import React from 'react';
import Channel from './Channel';

describe('Channel', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<Channel {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('Channel')).toBeTruthy();
    });
});
