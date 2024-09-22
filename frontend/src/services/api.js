import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Flask backend URL

export const createOverlay = async (overlayData) => {
  try {
    const response = await axios.post(`${API_URL}/overlay`, overlayData);
    return response.data;
  } catch (error) {
    console.error("Error creating overlay:", error);
    throw error;
  }
};

export const getOverlays = async () => {
  try {
    const response = await axios.get(`${API_URL}/overlays`);
    return response.data;
  } catch (error) {
    console.error("Error fetching overlays:", error);
    throw error;
  }
};

export const updateOverlay = async (name, overlayData) => {
  try {
    const response = await axios.put(`${API_URL}/overlay/${name}`, overlayData);
    return response.data;
  } catch (error) {
    console.error("Error updating overlay:", error);
    throw error;
  }
};

export const deleteOverlay = async (name) => {
  try {
    const response = await axios.delete(`${API_URL}/overlay/${name}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting overlay:", error);
    throw error;
  }
};
