import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ProjectList from './ProjectList';
import SurveyList from './SurveyList';
import LoadingSpinner from './Spinner';
import { fetchProjects, fetchSurveys } from '../services/apiService';
import { Pagination } from 'react-bootstrap';

const PROJECTS_PER_PAGE = 5;

const Projects = () => {
  const [state, setState] = useState({
    projects: [],
    selectedProject: null,
    surveys: [],
    loading: true,
    error: null,
    currentPage: 1
  });

  const { projects, selectedProject, surveys, loading, error, currentPage } = state;

  const loadProjects = useCallback(async () => {
    try {
      const data = await fetchProjects();
      setState(prev => ({
        ...prev,
        projects: data.filter(project => project.name && project.settings?.description),
        loading: false
      }));
    } catch (err) {
      setState(prev => ({ ...prev, error: err.message, loading: false }));
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleFetchSurveys = useCallback(async (projectId) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const data = await fetchSurveys(projectId);
      setState(prev => ({
        ...prev,
        surveys: data,
        selectedProject: projectId,
        loading: false
      }));
    } catch (err) {
      setState(prev => ({ ...prev, error: err.message, loading: false }));
    }
  }, []);

  const handleBack = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedProject: null,
      currentPage: 1
    }));
  }, []);

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * PROJECTS_PER_PAGE;
    const end = start + PROJECTS_PER_PAGE;
    return projects.slice(start, end);
  }, [projects, currentPage]);

  const totalPages = useMemo(() => 
    Math.ceil(projects.length / PROJECTS_PER_PAGE),
    [projects.length]
  );

  const PaginationControls = useCallback(() => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-4 justify-content-end">
        <Pagination.Prev 
          disabled={currentPage === 1} 
          onClick={() => setState(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
        />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item 
            key={index + 1} 
            active={index + 1 === currentPage} 
            onClick={() => setState(prev => ({ ...prev, currentPage: index + 1 }))}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next 
          disabled={currentPage === totalPages} 
          onClick={() => setState(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
        />
      </Pagination>
    );
  }, [currentPage, totalPages]);

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger d-flex align-items-center justify-content-between">
          <span>Error: {error}</span>
          <button 
            className="btn btn-outline-danger btn-sm"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {loading ? (
        <LoadingSpinner />
      ) : !selectedProject ? (
        <>
          <ProjectList 
            projects={paginatedProjects} 
            onProjectSelect={handleFetchSurveys} 
          />
          <PaginationControls />
        </>
      ) : (
        <SurveyList
          surveys={surveys}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default Projects;