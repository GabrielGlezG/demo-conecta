import React, { memo } from 'react';
import { Card, Button } from 'react-bootstrap';
import { ArrowRight } from 'react-bootstrap-icons';

const ProjectCard = memo(({ project, onSelect }) => (
  <Card className="border-0 mb-3 shadow-sm hover-shadow transition-all">
    <Card.Body>
      <div className="d-flex justify-content-between align-items-center">
        <div className="flex-grow-1 me-3">
          <Card.Title className="h5 mb-2 text-break">
            {project.name}
          </Card.Title>
          <Card.Text className="text-muted mb-0 text-break">
            <span className="fw-medium">Descripción:</span>{' '}
            {project.settings?.description || 'Sin descripción'}
          </Card.Text>
        </div>
        <Button 
          variant="outline-primary" 
          size="sm" 
          onClick={() => onSelect(project.uid)}
          className="d-flex align-items-center gap-1 flex-shrink-0"
        >
          Reportes <ArrowRight size={16} />
        </Button>
      </div>
    </Card.Body>
  </Card>
));

ProjectCard.displayName = 'ProjectCard';

const ProjectList = ({ projects, onProjectSelect }) => {
  if (!projects?.length) {
    return (
      <div className="container py-4">
        <h4 className="mb-4">Proyectos</h4>
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center text-muted">
            No hay reportes disponibles
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h4 className="mb-4">
        Reportes subestaciones
        <span className="badge bg-primary ms-2">{projects.length}</span>
      </h4>
      {projects.map((project) => (
        <ProjectCard
          key={project.uid}
          project={project}
          onSelect={onProjectSelect}
        />
      ))}
    </div>
  );
};

export default memo(ProjectList);