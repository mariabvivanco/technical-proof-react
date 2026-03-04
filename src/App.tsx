import useListManager from './hooks/useListManager';
import Header from './components/Header/Header';
import ItemList from './components/ItemList/ItemList';
import ActionButtons from './components/ActionButtons/ActionButtons';
import AddItemModal from './components/AddItemModal/AddItemModal';
import styles from './App.module.scss';

const App = () => {
  const {
    items,
    selectedIds,
    canUndo,
    isModalOpen,
    addItem,
    deleteSelected,
    toggleSelect,
    deleteByDoubleClick,
    undo,
    openModal,
    closeModal,
  } = useListManager();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Header />

        <ItemList
          items={items}
          selectedIds={selectedIds}
          onSelect={toggleSelect}
          onDoubleClick={deleteByDoubleClick}
        />

        <ActionButtons
          hasSelected={selectedIds.size > 0}
          canUndo={canUndo}
          onUndo={undo}
          onDelete={deleteSelected}
          onAdd={openModal}
        />

        <AddItemModal
          open={isModalOpen}
          onAdd={addItem}
          onClose={closeModal}
        />
      </div>
    </div>
  );
};

export default App;
