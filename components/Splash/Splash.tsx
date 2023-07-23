import clsx from 'clsx';
import styles from './Splash.module.css';
export function Splash({ initialize }: { initialize: () => Promise<void> }) {
  return (
    <section className={clsx(styles.modal)} tabIndex={-1}>
      <div className={styles.inner}>
        <button
          className="border-b border-neutral-800 hover:bg-current "
          onClick={initialize}
        >
          <span className="">START</span>
        </button>
      </div>
    </section>
  );
}
