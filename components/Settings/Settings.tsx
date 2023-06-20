import Delete from '@mui/icons-material/DeleteOutline';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import Expand from '@mui/icons-material/MoreVert';
import clsx from 'clsx';
import styles from './settings.module.css';

export type Props = {
  open: boolean;
  toggleOpen: () => void;
  handleDelete: () => void;
  handleTotalNoteChangeDecrement: (
    ev: React.MouseEvent<HTMLButtonElement>
  ) => void;
  handleTotalNoteChangeIncrement: (
    ev: React.MouseEvent<HTMLButtonElement>
  ) => void;
};
export function Settings(props: Props) {
  const {
    open,
    handleDelete,
    toggleOpen,
    handleTotalNoteChangeIncrement,
    handleTotalNoteChangeDecrement,
  } = props;

  return (
    <section
      className={clsx(styles.settings, {
        [styles.open]: open,
      })}
    >
      <div className={styles.inner}>
        <div className={clsx(styles.exit)}>
          <button onClick={toggleOpen}>
            <Expand />
          </button>
        </div>
        <div className={styles.group}>
          <button onClick={handleTotalNoteChangeDecrement} title="Remove Slice">
            <Remove />
          </button>
          <button onClick={handleTotalNoteChangeIncrement} title="Add Slice">
            <Add />
          </button>
        </div>
        <div className={styles.group}>
          <button onClick={handleDelete}>
            <Delete />
          </button>
        </div>
      </div>
      <div className={styles.outer}>
        <div className={styles.toggle}>
          <button onClick={props.toggleOpen}>
            <Expand />
          </button>
        </div>
      </div>
    </section>
  );
}
