// Assignment validation
export const validateAssignment = (data) => {
  const errors = [];
  
  // Required fields
  if (!data.projectId || data.projectId.trim() === '') {
    errors.push('Project ID is required');
  }
  
  if (!data.employeeId || data.employeeId.trim() === '') {
    errors.push('Employee ID is required');
  }
  
  if (!data.activity || data.activity.trim() === '') {
    errors.push('Activity is required');
  }
  
  if (!data.date) {
    errors.push('Date is required');
  }
  
  if (!data.startTime || data.startTime.trim() === '') {
    errors.push('Start time is required');
  }
  
  if (!data.endTime || data.endTime.trim() === '') {
    errors.push('End time is required');
  }
  
  // Validation rules
  const validActivities = ['Modeling', 'Drafting', 'Checking', 'Approval'];
  if (data.activity && !validActivities.includes(data.activity)) {
    errors.push('Activity must be one of: Modeling, Drafting, Checking, Approval');
  }
  
  if (data.date && isNaN(Date.parse(data.date))) {
    errors.push('Date must be a valid date');
  }
  
  // Time format validation (HH:MM)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (data.startTime && !timeRegex.test(data.startTime)) {
    errors.push('Start time must be in HH:MM format');
  }
  
  if (data.endTime && !timeRegex.test(data.endTime)) {
    errors.push('End time must be in HH:MM format');
  }
  
  // Check if end time is after start time
  if (data.startTime && data.endTime && timeRegex.test(data.startTime) && timeRegex.test(data.endTime)) {
    const startMinutes = parseInt(data.startTime.split(':')[0]) * 60 + parseInt(data.startTime.split(':')[1]);
    const endMinutes = parseInt(data.endTime.split(':')[0]) * 60 + parseInt(data.endTime.split(':')[1]);
    
    if (endMinutes <= startMinutes) {
      errors.push('End time must be after start time');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};