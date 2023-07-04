import clsx from 'clsx';
import styles from './Modal.module.css';
export function Modal({ initialize }: { initialize: () => Promise<void> }) {
  return (
    <section className={clsx(styles.modal)} tabIndex={-1}>
      <div className={styles.inner}>
        <button className="button lg" onClick={initialize}>
          START
        </button>
      </div>
    </section>
  );
}
