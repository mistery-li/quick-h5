import { useSnapshotStore } from '../store/snatshot'

export default () => {
  const snapshotStore = useSnapshotStore()

  const undo = () => {
    snapshotStore.unDo()
  }

  const redo = () => {
    snapshotStore.reDo()
  }

  const addHistorySnapshot = () => {
    snapshotStore.addSnapshot()
  }

  return {
    undo,
    redo,
    addHistorySnapshot,
  }
}
