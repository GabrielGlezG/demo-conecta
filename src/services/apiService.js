const API_BASE_URL = 'http://localhost:5000/api';

export const fetchProjects = async () => {
  const response = await fetch(`${API_BASE_URL}/projects`);
  if (!response.ok) {
    throw new Error('Error al obtener los proyectos');
  }
  return response.json();
};

export const fetchSurveys = async (projectId) => {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/responses`);
  if (!response.ok) {
    throw new Error('Error al obtener los reportes');
  }
  return response.json();
};