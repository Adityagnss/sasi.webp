import express from 'express';
import { assignmentsDB, projectsDB, employeesDB } from '../utils/database.js';
import { validateAssignment } from '../validators/assignmentValidator.js';

const router = express.Router();

// GET /api/assignments - Get all assignments
router.get('/', async (req, res) => {
  try {
    const assignments = assignmentsDB.findAll();
    
    // Enrich assignments with project and employee details
    const enrichedAssignments = assignments.map(assignment => {
      const project = projectsDB.findById(assignment.projectId);
      const employee = employeesDB.findById(assignment.employeeId);
      
      return {
        ...assignment,
        project: project ? {
          projectNumber: project.projectNumber,
          projectName: project.projectName
        } : null,
        employee: employee ? {
          employeeNumber: employee.employeeNumber,
          employeeName: employee.employeeName,
          designation: employee.designation
        } : null
      };
    });
    
    res.json({
      success: true,
      count: enrichedAssignments.length,
      data: enrichedAssignments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assignments'
    });
  }
});

// GET /api/assignments/:id - Get single assignment
router.get('/:id', async (req, res) => {
  try {
    const assignment = assignmentsDB.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }
    
    // Enrich with project and employee details
    const project = projectsDB.findById(assignment.projectId);
    const employee = employeesDB.findById(assignment.employeeId);
    
    const enrichedAssignment = {
      ...assignment,
      project: project ? {
        projectNumber: project.projectNumber,
        projectName: project.projectName
      } : null,
      employee: employee ? {
        employeeNumber: employee.employeeNumber,
        employeeName: employee.employeeName,
        designation: employee.designation
      } : null
    };
    
    res.json({
      success: true,
      data: enrichedAssignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assignment'
    });
  }
});

// POST /api/assignments - Create new assignment
router.post('/', async (req, res) => {
  try {
    const validation = validateAssignment(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }

    // Verify project and employee exist
    const project = projectsDB.findById(req.body.projectId);
    const employee = employeesDB.findById(req.body.employeeId);
    
    if (!project) {
      return res.status(400).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    if (!employee) {
      return res.status(400).json({
        success: false,
        error: 'Employee not found'
      });
    }

    const assignment = assignmentsDB.create(req.body);
    
    res.status(201).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create assignment'
    });
  }
});

// PUT /api/assignments/:id - Update assignment
router.put('/:id', async (req, res) => {
  try {
    const validation = validateAssignment(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }

    // Verify project and employee exist
    const project = projectsDB.findById(req.body.projectId);
    const employee = employeesDB.findById(req.body.employeeId);
    
    if (!project) {
      return res.status(400).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    if (!employee) {
      return res.status(400).json({
        success: false,
        error: 'Employee not found'
      });
    }

    const assignment = assignmentsDB.update(req.params.id, req.body);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }
    
    res.json({
      success: true,
      data: assignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update assignment'
    });
  }
});

// DELETE /api/assignments/:id - Delete assignment
router.delete('/:id', async (req, res) => {
  try {
    const assignment = assignmentsDB.delete(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Assignment deleted successfully',
      data: assignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete assignment'
    });
  }
});

// GET /api/assignments/project/:projectId - Get assignments by project
router.get('/project/:projectId', async (req, res) => {
  try {
    const assignments = assignmentsDB.findWhere(assignment => 
      assignment.projectId === req.params.projectId
    );
    
    res.json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project assignments'
    });
  }
});

// GET /api/assignments/employee/:employeeId - Get assignments by employee
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const assignments = assignmentsDB.findWhere(assignment => 
      assignment.employeeId === req.params.employeeId
    );
    
    res.json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch employee assignments'
    });
  }
});

// GET /api/assignments/stats/summary - Get assignment statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const assignments = assignmentsDB.findAll();
    const activities = assignments.reduce((acc, assignment) => {
      acc[assignment.activity] = (acc[assignment.activity] || 0) + 1;
      return acc;
    }, {});
    
    res.json({
      success: true,
      data: {
        totalAssignments: assignments.length,
        activityBreakdown: activities,
        mostCommonActivity: Object.keys(activities).reduce((a, b) => 
          activities[a] > activities[b] ? a : b, Object.keys(activities)[0]
        )
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assignment statistics'
    });
  }
});

export default router;