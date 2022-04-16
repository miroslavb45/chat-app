import { render } from '@testing-library/react';
import React from 'react';
import OutgoingCallModal from './OutgoingCallModal';

describe('OutgoingCallModal', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<OutgoingCallModal {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('OutgoingCallModal')).toBeTruthy();
    });
});
