import { render } from '@testing-library/react';
import React from 'react';
import Workspace from './Workspace';

describe('Workspace', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<Workspace {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('Workspace')).toBeTruthy();
    });
});
