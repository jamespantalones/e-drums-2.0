import * as React from 'react';
import clsx from 'clsx';
import styles from './IconButton.module.css';
import { motion } from 'framer-motion';

type Props = {
  children: React.ReactNode;
  className?: string;
  fill?: string;
  color?: string;
  onClick?: () => void | any;
  noBorder?: boolean;
  disabled?: boolean;
  small?: boolean;
  margin?: boolean;
  muted?: boolean;
};

const Button = React.forwardRef<HTMLButtonElement, Props>(function Component(
  props,
  ref
) {
  const {
    fill,
    color,
    children,
    className,
    onClick,
    small,
    margin,
    muted,
    disabled,
    noBorder,
  } = props;
  const cx = clsx(
    'button',
    'mx-auto',
    'w-full',
    'h-auto',
    'disabled:opacity-50',
    'disabled:pointer-events-none',
    className,
    {
      [styles.margin]: margin,
      [styles.button]: !small && !muted,
      [styles.small]: small && !muted,
      [styles.muted]: small && muted,
      [styles['no-border']]: noBorder,
    }
  );
  return (
    <button
      ref={ref}
      onClick={onClick}
      type="button"
      className={cx}
      disabled={Boolean(disabled)}
      style={{
        ...(fill && { backgroundColor: fill }),
        ...(color && { color }),
      }}
    >
      {children}
    </button>
  );
});

export const IconButton = motion(Button);
