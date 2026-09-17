import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBoardById, getBoards } from '../services/sprintHubServices';

interface BoardSwitcherProps {
  currentBoardId: string;
}

const BoardSwitcher: React.FC<BoardSwitcherProps> = ({ currentBoardId }) => {
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupBoards = async () => {
      try {
        setLoading(true);
        // First get the board to find its groupId
        const currentBoardRes = await getBoardById(currentBoardId);
        const boardData = currentBoardRes.data || currentBoardRes;
        const groupId = boardData.groupId;
        
        if (groupId) {
          const boardsRes = await getBoards(groupId);
          setBoards(boardsRes.data || boardsRes || []);
        }
      } catch (error) {
        console.error("Error fetching boards for switcher:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentBoardId) {
      fetchGroupBoards();
    }
  }, [currentBoardId]);

  if (loading) {
    return <span style={{ marginLeft: '8px', color: '#9fadbc' }}>Cargando...</span>;
  }

  if (boards.length === 0) {
    return <span style={{ marginLeft: '8px' }}>Tablero</span>;
  }

  return (
    <select 
      value={currentBoardId}
      onChange={(e) => navigate(`/board/${e.target.value}`)}
      style={{
        marginLeft: '8px',
        background: 'transparent',
        border: 'none',
        color: 'var(--text)',
        fontSize: '1rem',
        fontWeight: 500,
        outline: 'none',
        cursor: 'pointer'
      }}
    >
      {boards.map(b => (
        <option key={b._id} value={b._id} style={{ color: '#000' }}>
          {b.name}
        </option>
      ))}
    </select>
  );
};

export default BoardSwitcher;
