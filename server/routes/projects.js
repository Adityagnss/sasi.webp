import express from 'express';
import { projectsDB } from '../utils/database.js';
import { validateProject } from '../validators/projectValidator.js';

const router = express.Router();

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = projectsDB.findAll();
    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects'
    });
  }
});

// GET /api/projects/:id - Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = projectsDB.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project'
    });
  }
});

// POST /api/projects - Create new project
router.post('/', async (req, res) => {
  try {
    const validation = validateProject(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }

    const project = projectsDB.create(req.body);
    
    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create project'
    });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', async (req, res) => {
  try {
    const validation = validateProject(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }

    const project = projectsDB.update(req.params.id, req.body);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update project'
    });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req, res) => {
  try {
    const project = projectsDB.delete(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Project deleted successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete project'
    });
  }
});

// GET /api/projects/stats/summary - Get project statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const projects = projectsDB.findAll();
    const totalBudget = projects.reduce((sum, project) => sum + parseInt(project.budget || 0), 0);
    const totalManHours = projects.reduce((sum, project) => sum + parseInt(project.manHours || 0), 0);
    
    res.json({
      success: true,
      data: {
        totalProjects: projects.length,
        totalBudget,
        totalManHours,
        averageBudget: projects.length > 0 ? Math.round(totalBudget / projects.length) : 0,
        averageManHours: projects.length > 0 ? Math.round(totalManHours / projects.length) : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project statistics'
    });
  }
});

export default router;