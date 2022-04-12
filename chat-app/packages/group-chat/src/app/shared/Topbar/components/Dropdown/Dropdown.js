import MenuIcon from '@mui/icons-material/Menu';
import * as React from 'react';
import { Arrow, useLayer } from 'react-laag';
import styles from './styles.module.scss';

export function Dropdown(props) {
  const [isOpen, setOpen] = React.useState(false);
  const { children, name } = props;

  const { renderLayer, triggerProps, layerProps, arrowProps } = useLayer({
    isOpen,
    placement: 'bottom-center',
    auto: true,
    snap: true,
    preferX: 'left',
    triggerOffset: 10,
    containerOffset: 24,
    arrowOffset: 20,
    onOutsideClick: () => setOpen(false),
  });

  return (
    <>
      <div {...triggerProps} onClick={() => setOpen(!isOpen)} className={styles.profile}>
        <MenuIcon></MenuIcon>
        {name}
      </div>

      {isOpen &&
        renderLayer(
          <div {...layerProps} className={styles.wrapper}>
            {children}
            <Arrow {...arrowProps} size={5} roundness={0} />
          </div>
        )}
    </>
  );
}
