import { render } from '@testing-library/react';
import React from 'react';
import VideoChatList from './VideoChatList';

describe('VideoChatList', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<VideoChatList {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('VideoChatList')).toBeTruthy();
    });
});
