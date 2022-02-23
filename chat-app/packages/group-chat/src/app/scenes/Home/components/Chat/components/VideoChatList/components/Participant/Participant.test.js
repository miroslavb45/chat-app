import { render } from '@testing-library/react';
import React from 'react';
import Participant from './Participant';

describe('Participant', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<Participant {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('Participant')).toBeTruthy();
    });
});
