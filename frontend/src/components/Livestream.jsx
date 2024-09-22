import { useState, useEffect } from 'react';
import Modal from 'react-modal'; // Import modal
import { createOverlay, getOverlays, updateOverlay, deleteOverlay } from '../services/api';

Modal.setAppElement('#root'); // For accessibility

const Livestream = () => {
  const [overlays, setOverlays] = useState([]);
  const [newOverlay, setNewOverlay] = useState({
    content: '',
    position: 'top-left',
    size: 'medium',
    type: 'text',
    imageUrl: '', // Add image URL for logos
  });
  const [editingOverlay, setEditingOverlay] = useState(null);
  const [overlayModalOpen, setOverlayModalOpen] = useState(false);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [overlayToDelete, setOverlayToDelete] = useState(null);
  const [rtspUrl, setRtspUrl] = useState('');
  const [streamUrl, setStreamUrl] = useState('');

  // Fetch existing overlays when the component loads
  const fetchOverlays = async () => {
    const data = await getOverlays();
    setOverlays(data);
  };

  useEffect(() => {
    fetchOverlays();
  }, []);

  const handleAddOverlay = async () => {
    await createOverlay(newOverlay);
    await fetchOverlays(); // Refresh overlays after adding
    setOverlayModalOpen(false); // Close modal after adding
    resetNewOverlay();
  };

  const resetNewOverlay = () => {
    setNewOverlay({
      content: '',
      position: 'top-left',
      size: 'medium',
      type: 'text',
      imageUrl: '', // Reset image URL
    });
  };

  const handleUpdateOverlay = async () => {
    await updateOverlay(editingOverlay._id, editingOverlay); // Use _id for updates
    await fetchOverlays(); // Refresh overlays after editing
    setEditingOverlay(null);
    setOverlayModalOpen(false); // Close modal after editing
  };

  const handleDeleteOverlay = async () => {
    if (overlayToDelete) {
      await deleteOverlay(overlayToDelete._id); // Use _id for deletion
      await fetchOverlays(); // Refresh overlays after deleting
      setDeleteConfirmModalOpen(false); // Close modal after delete
      setOverlayToDelete(null);
    }
  };

  const handleRtspSubmit = () => {
    setStreamUrl(`http://localhost:5000/stream?url=${encodeURIComponent(rtspUrl)}`);
  };

  // Function to determine CSS styles based on overlay properties
// Function to determine CSS styles based on overlay properties
const getOverlayStyles = (overlay) => {
  const positions = {
    'top-left': { top: '10px', left: '10px' },
    'top-right': { top: '10px', right: '10px' },
    'bottom-left': { bottom: '10px', left: '10px' },
    'bottom-right': { bottom: '10px', right: '10px' },
  };

  const textSizes = {
    small: { fontSize: '12px', padding: '5px' },
    medium: { fontSize: '16px', padding: '10px' },
    large: { fontSize: '20px', padding: '15px' },
  };

  const logoSizes = {
    small: { width: '50px', height: '50px' },
    medium: { width: '70px', height: '70px' },
    large: { width: '50px', height: '50px' },
  };

  // Determine styles based on overlay type
  const sizeStyles = overlay.type === 'text' ? textSizes[overlay.size] : logoSizes[overlay.size];

  return {
    position: 'absolute',
    color: overlay.type === 'text' ? 'white' : 'transparent',
    backgroundColor: overlay.type === 'text' ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
    ...positions[overlay.position],
    ...sizeStyles,
  };
};


  return (
    <div className="livestream">
      {/* RTSP URL Input */}
      <div className="rtsp-controls">
        <input
          type="text"
          value={rtspUrl}
          onChange={(e) => setRtspUrl(e.target.value)}
          placeholder="Enter RTSP URL"
        />
        <button onClick={handleRtspSubmit}>Load Stream</button>
      </div>

      {/* Video Stream */}
      {streamUrl && (
        <div className="video-container" style={{ position: 'relative' }}>
          <img src={streamUrl} alt="Livestream" className="video-stream" />
          {/* Render overlays on the video */}
          {overlays.map((overlay, index) => (
            <div key={index} style={getOverlayStyles(overlay)}>
              {overlay.type === 'text' ? (
                overlay.content
              ) : (
                <img src={overlay.content || overlay.imageUrl} alt="Logo" style={getOverlayStyles(overlay)} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Overlay List with Edit/Delete options */}
      <div className="overlay-controls">
        {/* Add Overlay Button */}
        <button onClick={() => setOverlayModalOpen(true)} className="add-overlay-button">
          Add Overlay
        </button>
      </div>

      <table className="overlay-table">
        <thead>
          <tr>
            <th>Content</th>
            <th>Position</th>
            <th>Size</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {overlays.map((overlay, index) => (
            <tr key={index}>
              <td>{overlay.type === 'text' ? overlay.content : 'Image Logo'}</td>
              <td>{overlay.position}</td>
              <td>{overlay.size}</td>
              <td>{overlay.type}</td>
              <td>
                <button
                  onClick={() => {
                    setEditingOverlay(overlay);
                    setOverlayModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setOverlayToDelete(overlay);
                    setDeleteConfirmModalOpen(true);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Overlay Modal */}
      <Modal
        isOpen={overlayModalOpen}
        onRequestClose={() => setOverlayModalOpen(false)}
        contentLabel="Overlay Form"
        className="overlay-modal" // Add custom class for modal styling
      >
        <h2>{'Overlay Form'}</h2>
        {newOverlay.type === 'text' || (editingOverlay && editingOverlay.type === 'text') ? (
          <input
            type="text"
            value={editingOverlay ? editingOverlay.content : newOverlay.content}
            onChange={(e) => {
              if (editingOverlay) {
                setEditingOverlay({ ...editingOverlay, content: e.target.value });
              } else {
                setNewOverlay({ ...newOverlay, content: e.target.value });
              }
            }}
            placeholder="Overlay content"
          />
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  if (editingOverlay) {
                    setEditingOverlay({ ...editingOverlay, imageUrl: reader.result });
                  } else {
                    setNewOverlay({ ...newOverlay, imageUrl: reader.result });
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        )}
        {/* Position, Size, Type fields */}
        <select
          value={editingOverlay ? editingOverlay.position : newOverlay.position}
          onChange={(e) => {
            if (editingOverlay) {
              setEditingOverlay({ ...editingOverlay, position: e.target.value });
            } else {
              setNewOverlay({ ...newOverlay, position: e.target.value });
            }
          }}
        >
          <option value="top-left">Top Left</option>
          <option value="top-right">Top Right</option>
          <option value="bottom-left">Bottom Left</option>
          <option value="bottom-right">Bottom Right</option>
        </select>
        <select
          value={editingOverlay ? editingOverlay.size : newOverlay.size}
          onChange={(e) => {
            if (editingOverlay) {
              setEditingOverlay({ ...editingOverlay, size: e.target.value });
            } else {
              setNewOverlay({ ...newOverlay, size: e.target.value });
            }
          }}
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
        <select
          value={editingOverlay ? editingOverlay.type : newOverlay.type}
          onChange={(e) => {
            if (editingOverlay) {
              setEditingOverlay({ ...editingOverlay, type: e.target.value });
            } else {
              setNewOverlay({ ...newOverlay, type: e.target.value });
            }
          }}
        >
          <option value="text">Text</option>
          <option value="logo">Logo</option>
        </select>
        <button onClick={editingOverlay ? handleUpdateOverlay : handleAddOverlay}>
          {editingOverlay ? 'Save' : 'Add'}
        </button>
        <button onClick={() => setOverlayModalOpen(false)}>Cancel</button>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmModalOpen}
        onRequestClose={() => setDeleteConfirmModalOpen(false)}
        contentLabel="Confirm Delete"
        className="confirm-modal" // Add custom class for modal styling
      >
        <h2>Are you sure you want to delete this overlay?</h2>
        <button onClick={handleDeleteOverlay}>Confirm</button>
        <button onClick={() => setDeleteConfirmModalOpen(false)}>Cancel</button>
      </Modal>
    </div>
  );
};

export default Livestream;
