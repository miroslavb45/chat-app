import { render } from '@testing-library/react';
import React from 'react';
import SidebarSection from './SidebarSection';

describe('SidebarSection', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<SidebarSection {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('SidebarSection')).toBeTruthy();
    });
});
