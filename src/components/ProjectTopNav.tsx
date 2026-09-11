import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './ProjectTopNav.css';

interface ProjectTopNavProps {
  groupId: string;
}

const ProjectTopNav: React.FC<ProjectTopNavProps> = ({ groupId }) => {
  const location = useLocation();

  const getActiveClass = (path: string) => {
    return location.pathname.includes(path) ? 'active' : '';
  };

  return (
    <div className="project-top-nav">
      <Link to={`/groups/${groupId}/reports`} className={`project-tab ${getActiveClass('/reports')}`}>
        <i className="fas fa-chart-pie"></i> Resumen
      </Link>
      <Link to={`/wip`} className="project-tab">
        <i className="fas fa-stream"></i> Lista
      </Link>
      <Link to={`/groups/${groupId}/boards`} className={`project-tab ${getActiveClass('/boards')}`}>
        <i className="fas fa-columns"></i> Tablero
      </Link>
      <Link to={`/groups/${groupId}/backlog`} className={`project-tab ${getActiveClass('/backlog')}`}>
        <i className="fas fa-list"></i> Backlog
      </Link>
      <Link to={`/groups/${groupId}/documents`} className={`project-tab ${getActiveClass('/documents')}`}>
        <i className="fas fa-folder-open"></i> Documentación
      </Link>
      <Link to={`/wip`} className="project-tab">
        <i className="fas fa-code"></i> Desarrollo
      </Link>
      <Link to={`/wip`} className="project-tab">
        <i className="fas fa-clipboard-list"></i> Formularios
      </Link>
      <Link to={`/wip`} className="project-tab">
        <i className="fas fa-calendar-alt"></i> Cronograma
      </Link>
    </div>
  );
};

export default ProjectTopNav;
