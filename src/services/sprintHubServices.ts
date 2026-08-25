import api from './api';

// --- AUTENTICACIÓN ---
export const registerUser = async (userData: any) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

export const loginUser = async (credentials: any) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// --- GRUPOS DE TRABAJO ---
export const createGroup = async (groupData: { name: string; description?: string }) => {
  const { data } = await api.post('/groups', groupData);
  return data;
};

export const getMyGroups = async () => {
  const { data } = await api.get('/groups');
  return data;
};

export const addMemberToGroup = async (groupId: string, email: string) => {
  const { data } = await api.post(`/groups/${groupId}/members`, { email });
  return data;
};

// --- ACTIVIDADES / TARJETAS ---
export const createCard = async (cardData: any) => {
  const { data } = await api.post('/cards', cardData);
  return data;
};

export const getCards = async (boardId: string, filters?: { title?: string; listId?: string; assignedTo?: string }) => {
  const { data } = await api.get(`/cards/board/${boardId}`, { params: filters });
  return data;
};

export const updateCard = async (cardId: string, updates: any) => {
  const { data } = await api.put(`/cards/${cardId}`, updates);
  return data;
};

export const deleteCard = async (cardId: string) => {
  const { data } = await api.delete(`/cards/${cardId}`);
  return data;
};
