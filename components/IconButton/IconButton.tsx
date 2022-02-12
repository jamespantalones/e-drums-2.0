import * as React from 'react';
import clsx from 'clsx';
import styles from './IconButton.module.css';

type Props = {
  children: React.ReactNode;
  onClick: () => void | any;
  small?: boolean;
  muted?: boolean;
};
export function IconButton(props: Props) {
  const { children, onClick, small, muted } = props;
  const cx = clsx({
    [styles.button]: !small && !muted,
    [styles.small]: small && !muted,
    [styles.muted]: small && muted,
  });
  return (
    <button onClick={onClick} type="button" className={cx}>
      {children}
    </button>
  );
}
