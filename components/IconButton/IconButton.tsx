import * as React from 'react';
import clsx from 'clsx';
import styles from './IconButton.module.css';

type Props = {
  children: React.ReactNode;
  onClick: () => void | any;
  disabled?: boolean;
  small?: boolean;
  muted?: boolean;
};
export function IconButton(props: Props) {
  const { children, onClick, small, muted, disabled } = props;
  const cx = clsx('disabled:opacity-50', 'disabled:pointer-events-none', {
    [styles.button]: !small && !muted,
    [styles.small]: small && !muted,
    [styles.muted]: small && muted,
  });
  return (
    <button
      onClick={onClick}
      type="button"
      className={cx}
      disabled={Boolean(disabled)}
    >
      {children}
    </button>
  );
}
