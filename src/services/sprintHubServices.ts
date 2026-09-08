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
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
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

export const addMemberToGroup = async (groupId: string, email: string, role: string) => {
  const { data } = await api.post(`/groups/${groupId}/members`, { email, role });
  return data;
};

export const deleteGroup = async (groupId: string) => {
  const { data } = await api.delete(`/groups/${groupId}`);
  return data;
};

// --- Boards ---
export const getBoards = async (groupId: string) => {
  const { data } = await api.get(`/boards/group/${groupId}`);
  return data;
};

export const getBoardById = async (boardId: string) => {
  const { data } = await api.get(`/boards/${boardId}`);
  return data;
};

export const createBoard = async (payload: { title: string, description?: string, groupId: string, columnsIds?: string[] }) => {
  const { data } = await api.post('/boards', payload);
  return data;
};

export const updateBoard = async (id: string, payload: { title: string, description?: string, columnsIds?: string[] }) => {
  const { data } = await api.put(`/boards/${id}`, payload);
  return data;
};

export const removeBoard = async (id: string) => {
  const { data } = await api.delete(`/boards/${id}`);
  return data;
};

// --- COLUMNS ---
export const getColumns = async (boardId: string) => {
  const { data } = await api.get(`/columns/board/${boardId}`);
  return data;
};

export const createColumn = async (payload: { name: string, boardId: string }) => {
  const { data } = await api.post('/columns', payload);
  return data;
};

export const updateColumn = async (id: string, payload: { name?: string, cardsId?: string[] }) => {
  const { data } = await api.put(`/columns/${id}`, payload);
  return data;
};

export const removeColumn = async (id: string) => {
  const { data } = await api.delete(`/columns/${id}`);
  return data;
};

// --- ACTIVIDADES / TARJETAS ---
export const createCard = async (cardData: any) => {
  const { data } = await api.post('/cards', cardData);
  return data;
};

export const getCards = async (boardId: string, filters?: { title?: string; columnId?: string; assignedTo?: string }) => {
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

// --- COMENTARIOS ---
export const createComment = async (commentData: { name: string, description: string, cardId: string, createdFor?: string }) => {
  const { data } = await api.post('/comments', commentData);
  return data;
};

export const getCommentsByCard = async (cardId: string) => {
  const { data } = await api.get(`/comments/card/${cardId}`);
  return data;
};

export const deleteComment = async (commentId: string) => {
  const { data } = await api.delete(`/comments/${commentId}`);
  return data;
};

export const getUserProfile = async () => {
  const { data } = await api.get('/users/me');
  return data;
};

// --- REPORTES ---
export const getGroupPerformanceReport = async (groupId: string) => {
  const { data } = await api.get(`/reports/groups/${groupId}`);
  return data;
};

export const getUserPerformanceReport = async (userId: string, startDate?: string, endDate?: string) => {
  const { data } = await api.get(`/reports/users/${userId}`, {
    params: { startDate, endDate }
  });
  return data;
};

export const getCompletedActivitiesReport = async (groupId: string) => {
  const { data } = await api.get(`/reports/groups/${groupId}/completed`);
  return data;
};

// --- BACKLOG (CardPB) ---
export const getBacklog = async (groupId: string, search?: string, assignedTo?: string) => {
  const { data } = await api.get('/cardPB/group/' + groupId, { params: { search, assignedTo } });
  return data;
};

export const createBacklogCard = async (payload: any) => {
  const { data } = await api.post('/cardPB', payload);
  return data;
};

export const deleteBacklogCard = async (id: string) => {
  const { data } = await api.delete('/cardPB/' + id);
  return data;
};

export const exportBacklogCsv = async (groupId: string) => {
  const { data } = await api.get('/cardPB/group/' + groupId + '/export-csv', { responseType: 'blob' });
  return data;
};

// --- SPRINTS ---
export const getSprints = async (groupId: string) => {
  const { data } = await api.get('/sprints/group/' + groupId);
  return data;
};

export const createSprint = async (payload: any) => {
  const { data } = await api.post('/sprints', payload);
  return data;
};

export const moveCardToSprint = async (cardId: string, sprintId: string | null) => {
  const { data } = await api.put('/sprints/cards/' + cardId + '/move', { sprintId });
  return data;
};

export const getSprintCards = async (sprintId: string) => {
  const { data } = await api.get('/sprints/' + sprintId + '/cards');
  return data;
};

export const exportCardToBoard = async (cardId: string, columnId: string) => {
  const { data } = await api.post('/sprints/cards/' + cardId + '/export', { columnId });
  return data;
};
