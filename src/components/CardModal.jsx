import React, { useState } from 'react';

function CardModal({ card, onClose, onUpdateCard, allLabels }) {
  const [description, setDescription] = useState(card.description);
  const [checklist, setChecklist] = useState(card.checklist);
  const [dueDate, setDueDate] = useState(card.dueDate || '');
  const [labels, setLabels] = useState(card.labels || []);
  const [labelSelectValue, setLabelSelectValue] = useState('');

  const getFormattedDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleChecklistChange = (itemId, isChecked) => {
    const newChecklist = checklist.map(item =>
      item.id === itemId ? { ...item, checked: isChecked } : item
    );
    setChecklist(newChecklist);
  };

  const handleAddLabel = (e) => {
    const labelKey = e.target.value;
    if (!labelKey) return;

    const labelToAdd = { text: allLabels[labelKey].text, color: allLabels[labelKey].color };

    if (!labels.find(label => label.text === labelToAdd.text)) {
      setLabels([...labels, labelToAdd]);
    }
  };

  const handleRemoveLabel = (labelText) => {
    setLabels(labels.filter(label => label.text !== labelText));
  };


  const handleSave = () => {
    const updatedCard = {
      ...card,
      description: description,
      checklist: checklist,
      dueDate: dueDate,
      labels: labels,
    };
    onUpdateCard(updatedCard);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>✕</button>

        <h2 className="modal-title">{card.title}</h2>

        <div className="modal-body">

          <div className="modal-main-content">
            {card.type === 'description' && (
              <div className="modal-section">
                <h3>Descrição</h3>
                <textarea
                  className="modal-textarea"
                  placeholder="Adicione uma descrição mais detalhada..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            )}

            {card.type === 'checklist' && (
              <div className="modal-section">
                <h3>Checklist</h3>
                <div className="modal-checklist">
                  {checklist.map(item => (
                    <div key={item.id} className="checklist-item">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={(e) => handleChecklistChange(item.id, e.target.checked)}
                      />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button className="modal-save-button" onClick={handleSave}>
              Salvar
            </button>
          </div>

          <div className="modal-sidebar">
            <h3>Propriedades</h3>

            <div className="modal-section">
              <strong>Escolha uma Função (Tag):</strong>

              <div className="card-label-container modal-labels">
                {labels.map(label => (
                  <span
                    key={label.text}
                    style={{ backgroundColor: label.color, color: '#1f2937' }}
                    className="label-pill"
                  >
                    {label.text}
                    <button
                      className="label-pill-remove"
                      onClick={() => handleRemoveLabel(label.text)}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              <select
                className="modal-select"
                value={labelSelectValue}
                onChange={(e) => {
                  handleAddLabel(e);
                  setLabelSelectValue('');
                }}
                style={!labelSelectValue ? { color: '#5e6c84' } : {}}
              >
                <option value="" disabled>Adicionar função...</option>
                {Object.keys(allLabels).map(key => (
                  <option key={key} value={key}>
                    {allLabels[key].text}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-section">
              <strong>Data de Entrega</strong>
              <input
                type="date"
                className="modal-date-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="modal-section">
              <strong>Datas</strong>
              <div className="modal-date-info">
                <span>Criação:</span>
                <span>{getFormattedDateTime(card.createdAt)}</span>
              </div>
              <div className="modal-date-info">
                <span>Conclusão:</span>
                <span>{getFormattedDateTime(card.completedAt)}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default CardModal;
