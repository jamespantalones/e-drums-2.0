import * as React from 'react';
import styles from './IconButton.module.css';

type Props = {
  children: React.ReactNode;
  onClick: () => void;
};
export function IconButton(props: Props) {
  const { children, onClick } = props;
  return (
    <button onClick={onClick} type="button" className={styles.button}>
      {children}
    </button>
  );
}
