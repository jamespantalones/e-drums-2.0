import * as React from 'react';
import { Highlight } from '../Highlight/Highlight';
import styles from './Modal.module.css';
export function Modal({ initialize }: { initialize: () => Promise<void> }) {
  return (
    <section className={styles.modal} tabIndex={-1}>
      <div className={styles.inner}>
        <button className={styles.button} onClick={initialize}>
          <Highlight>START</Highlight>
        </button>
      </div>
    </section>
  );
}
