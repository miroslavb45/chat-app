import { render } from '@testing-library/react';
import React from 'react';
import DropdownItem from './DropdownItem';

describe('DropdownItem', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<DropdownItem {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('DropdownItem')).toBeTruthy();
    });
});
