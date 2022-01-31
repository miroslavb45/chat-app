import { render } from '@testing-library/react';
import React from 'react';
import VideoChat from './VideoChat';

describe('VideoChat', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<VideoChat {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('VideoChat')).toBeTruthy();
    });
});
