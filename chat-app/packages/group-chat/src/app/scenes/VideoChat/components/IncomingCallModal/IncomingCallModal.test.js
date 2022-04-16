import { render } from '@testing-library/react';
import React from 'react';
import IncomingCallModal from './IncomingCallModal';

describe('IncomingCallModal', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<IncomingCallModal {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('IncomingCallModal')).toBeTruthy();
    });
});
