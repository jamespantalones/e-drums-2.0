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
};
export function Settings(props: Props) {
  const { open, handleDelete } = props;
  function handleTotalNoteChangeIncrement() {}

  function handleTotalNoteChangeDecrement() {}
  return (
    <section
      className={clsx(styles.settings, {
        [styles.open]: open,
      })}
    >
      <div className={styles.inner}>
        <div className={styles.group}></div>
        <div className={styles.group}>
          <button onClick={handleTotalNoteChangeIncrement} title="Add Slice">
            <Add />
          </button>
          <button onClick={handleTotalNoteChangeDecrement} title="Remove Slice">
            <Remove />
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
