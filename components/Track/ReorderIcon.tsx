import { DragControls } from 'framer-motion';
import styles from './ReorderIcon.module.css';
import { GripHorizontal } from 'lucide-react';

interface Props {
  dragControls: DragControls;
}

export function ReorderIcon({ dragControls }: Props) {
  return (
    <div
      className={styles.wrapper}
      onPointerDown={(ev) => dragControls.start(ev)}
    >
      <GripHorizontal />
    </div>
  );
}
