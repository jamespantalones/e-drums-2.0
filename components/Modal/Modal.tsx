import * as React from 'react';
import { Highlight } from '../Highlight/Highlight';
import clsx from 'clsx';
import styles from './Modal.module.css';
export function Modal({ initialize }: { initialize: () => Promise<void> }) {
  return (
    <section className={clsx(styles.modal, 'gridpaper')} tabIndex={-1}>
      <div className={styles.inner}>
        <button className={styles.button} onClick={initialize}>
          START
        </button>
      </div>
    </section>
  );
}
