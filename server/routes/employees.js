import express from 'express';
import { employeesDB } from '../utils/database.js';
import { validateEmployee } from '../validators/employeeValidator.js';

const router = express.Router();

// GET /api/employees - Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = employeesDB.findAll();
    res.json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch employees'
    });
  }
});

// GET /api/employees/:id - Get single employee
router.get('/:id', async (req, res) => {
  try {
    const employee = employeesDB.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch employee'
    });
  }
});

// POST /api/employees - Create new employee
router.post('/', async (req, res) => {
  try {
    const validation = validateEmployee(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }

    // Check for duplicate employee number
    const existingEmployee = employeesDB.findWhere(emp => emp.employeeNumber === req.body.employeeNumber);
    if (existingEmployee.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Employee number already exists'
      });
    }

    const employee = employeesDB.create(req.body);
    
    res.status(201).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create employee'
    });
  }
});

// PUT /api/employees/:id - Update employee
router.put('/:id', async (req, res) => {
  try {
    const validation = validateEmployee(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }

    // Check for duplicate employee number (excluding current employee)
    const existingEmployee = employeesDB.findWhere(emp => 
      emp.employeeNumber === req.body.employeeNumber && emp.id !== req.params.id
    );
    if (existingEmployee.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Employee number already exists'
      });
    }

    const employee = employeesDB.update(req.params.id, req.body);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update employee'
    });
  }
});

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const employee = employeesDB.delete(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Employee deleted successfully',
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete employee'
    });
  }
});

// GET /api/employees/stats/summary - Get employee statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const employees = employeesDB.findAll();
    const designations = employees.reduce((acc, emp) => {
      acc[emp.designation] = (acc[emp.designation] || 0) + 1;
      return acc;
    }, {});
    
    res.json({
      success: true,
      data: {
        totalEmployees: employees.length,
        designationBreakdown: designations,
        mostCommonDesignation: Object.keys(designations).reduce((a, b) => 
          designations[a] > designations[b] ? a : b, Object.keys(designations)[0]
        )
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch employee statistics'
    });
  }
});

export default router;