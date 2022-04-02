import { render } from '@testing-library/react';
import React from 'react';
import PrivateMessage from './PrivateMessage';

describe('PrivateMessage', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<PrivateMessage {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('PrivateMessage')).toBeTruthy();
    });
});
