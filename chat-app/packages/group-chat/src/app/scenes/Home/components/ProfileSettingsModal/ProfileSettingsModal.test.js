import { render } from '@testing-library/react';
import React from 'react';
import ProfileSettingsModal from './ProfileSettingsModal';

describe('ProfileSettingsModal', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<ProfileSettingsModal {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('ProfileSettingsModal')).toBeTruthy();
    });
});
