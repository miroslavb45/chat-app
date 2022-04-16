import { render } from '@testing-library/react';
import React from 'react';
import CallAction from './CallAction';

describe('CallAction', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<CallAction {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('CallAction')).toBeTruthy();
    });
});
