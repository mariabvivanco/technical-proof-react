// ─── State ───────────────────────────────────────────────────────────────────

const state = {
  items: [
    { id: 'item-1', text: 'Item 1' },
    { id: 'item-2', text: 'Item 2' },
    { id: 'item-3', text: 'Item 3' },
    { id: 'item-4', text: 'Item 4' },
  ],
  selectedIds: new Set(),
  history: [],
};

// ─── DOM refs ─────────────────────────────────────────────────────────────────

const itemList      = document.getElementById('item-list');
const btnUndo       = document.getElementById('btn-undo');
const btnDelete     = document.getElementById('btn-delete');
const btnAdd        = document.getElementById('btn-add');
const modalOverlay  = document.getElementById('modal-overlay');
const modalInput    = document.getElementById('modal-input');
const btnModalAdd   = document.getElementById('btn-modal-add');
const btnModalCancel = document.getElementById('btn-modal-cancel');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateId = () =>
  `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const saveToHistory = () => {
  state.history.push(state.items.map((item) => ({ ...item })));
};

// ─── Render ───────────────────────────────────────────────────────────────────

const render = () => {
  itemList.innerHTML = '';

  state.items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'item' + (state.selectedIds.has(item.id) ? ' item--selected' : '');
    li.textContent = item.text;
    li.dataset.id = item.id;
    li.addEventListener('click', () => toggleSelect(item.id));
    li.addEventListener('dblclick', () => deleteByDoubleClick(item.id));
    itemList.appendChild(li);
  });

  btnUndo.disabled   = state.history.length === 0;
  btnDelete.disabled = state.selectedIds.size === 0;
};

// ─── Actions ──────────────────────────────────────────────────────────────────

const toggleSelect = (id) => {
  if (state.selectedIds.has(id)) {
    state.selectedIds.delete(id);
  } else {
    state.selectedIds.add(id);
  }
  render();
};

const addItem = () => {
  const text = modalInput.value.trim();
  if (!text) return;

  saveToHistory();
  state.items.push({ id: generateId(), text });
  closeModal();
  render();
};

const deleteSelected = () => {
  if (state.selectedIds.size === 0) return;

  saveToHistory();
  state.items = state.items.filter((item) => !state.selectedIds.has(item.id));
  state.selectedIds.clear();
  render();
};

const deleteByDoubleClick = (id) => {
  saveToHistory();
  state.items = state.items.filter((item) => item.id !== id);
  state.selectedIds.delete(id);
  render();
};

const undo = () => {
  if (state.history.length === 0) return;

  state.items = state.history.pop();
  state.selectedIds.clear();
  render();
};

// ─── Modal ────────────────────────────────────────────────────────────────────

const openModal = () => {
  modalOverlay.hidden = false;
  modalOverlay.classList.add('overlay--open');
  modalOverlay.classList.remove('overlay--closing');
  setTimeout(() => modalInput.focus(), 50);
};

const closeModal = () => {
  modalOverlay.classList.remove('overlay--open');
  modalOverlay.classList.add('overlay--closing');
  modalInput.value = '';
  btnModalAdd.disabled = true;
  setTimeout(() => {
    modalOverlay.hidden = true;
    modalOverlay.classList.remove('overlay--closing');
  }, 400);
};

// ─── Event listeners ──────────────────────────────────────────────────────────

btnAdd.addEventListener('click', openModal);
btnDelete.addEventListener('click', deleteSelected);
btnUndo.addEventListener('click', undo);
btnModalAdd.addEventListener('click', addItem);
btnModalCancel.addEventListener('click', closeModal);

modalInput.addEventListener('input', () => {
  btnModalAdd.disabled = !modalInput.value.trim();
});

modalInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addItem();
  if (e.key === 'Escape') closeModal();
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// ─── Init ─────────────────────────────────────────────────────────────────────

render();
