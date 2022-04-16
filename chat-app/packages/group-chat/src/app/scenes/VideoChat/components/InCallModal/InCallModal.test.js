import { render } from '@testing-library/react';
import React from 'react';
import InCallModal from './InCallModal';

describe('InCallModal', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<InCallModal {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('InCallModal')).toBeTruthy();
    });
});
