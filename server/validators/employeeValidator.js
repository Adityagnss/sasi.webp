// Employee validation
export const validateEmployee = (data) => {
  const errors = [];
  
  // Required fields
  if (!data.employeeNumber || data.employeeNumber.trim() === '') {
    errors.push('Employee number is required');
  }
  
  if (!data.employeeName || data.employeeName.trim() === '') {
    errors.push('Employee name is required');
  }
  
  if (!data.designation || data.designation.trim() === '') {
    errors.push('Designation is required');
  }
  
  // Validation rules
  if (data.employeeNumber && !/^\d+$/.test(data.employeeNumber)) {
    errors.push('Employee number must contain only numbers');
  }
  
  if (data.employeeName && !/^[a-zA-Z\s]+$/.test(data.employeeName)) {
    errors.push('Employee name must contain only letters and spaces');
  }
  
  if (data.designation && !/^[a-zA-Z\s]+$/.test(data.designation)) {
    errors.push('Designation must contain only letters and spaces');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};