import { render } from '@testing-library/react';
import React from 'react';
import Chat from './Chat';

describe('Chat', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<Chat {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('Chat')).toBeTruthy();
    });
});
