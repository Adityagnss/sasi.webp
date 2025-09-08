// Project validation
export const validateProject = (data) => {
  const errors = [];
  
  // Required fields
  if (!data.projectNumber || data.projectNumber.trim() === '') {
    errors.push('Project number is required');
  }
  
  if (!data.projectName || data.projectName.trim() === '') {
    errors.push('Project name is required');
  }
  
  if (!data.budget || data.budget.trim() === '') {
    errors.push('Budget is required');
  }
  
  if (!data.manHours || data.manHours.trim() === '') {
    errors.push('Man hours is required');
  }
  
  if (!data.startDate) {
    errors.push('Start date is required');
  }
  
  // Validation rules
  if (data.projectNumber && !/^\d+$/.test(data.projectNumber)) {
    errors.push('Project number must contain only numbers');
  }
  
  if (data.projectName && !/^[a-zA-Z\s]+$/.test(data.projectName)) {
    errors.push('Project name must contain only letters and spaces');
  }
  
  if (data.budget && !/^\d+$/.test(data.budget)) {
    errors.push('Budget must contain only numbers');
  }
  
  if (data.manHours && !/^\d+$/.test(data.manHours)) {
    errors.push('Man hours must contain only numbers');
  }
  
  if (data.startDate && isNaN(Date.parse(data.startDate))) {
    errors.push('Start date must be a valid date');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};