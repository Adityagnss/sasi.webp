import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Users, User, Badge, Hash, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { employeesApi } from '@/services/api';
import { useMutation } from '@/hooks/useApi';

export interface Employee {
  id: string;
  employeeNumber: string;
  employeeName: string;
  designation: string;
}

interface EmployeeFormProps {
  employees: Employee[];
  onAddEmployee: (employee: Employee) => void;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ employees, onAddEmployee }) => {
  const [formData, setFormData] = useState({
    employeeNumber: '',
    employeeName: '',
    designation: '',
  });
  const { toast } = useToast();

  // API mutation for creating employees
  const { mutate: createEmployee, loading: isCreating } = useMutation(
    employeesApi.create,
    (newEmployee) => {
      onAddEmployee(newEmployee);
      // Reset form
      setFormData({
        employeeNumber: '',
        employeeName: '',
        designation: '',
      });
      
      toast({
        title: "🎉 Success!",
        description: "Employee has been saved to the database",
        className: "border-l-4 border-l-secondary",
      });
    },
    (error) => {
      toast({
        title: "Error",
        description: error || "Failed to save employee",
        variant: "destructive",
      });
    }
  );

  // Input validation functions
  const handleNumberInput = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setFormData({ ...formData, employeeNumber: numericValue });
  };

  const handleTextInput = (value: string, field: string) => {
    const textValue = value.replace(/[^a-zA-Z\s]/g, '');
    setFormData({ ...formData, [field]: textValue });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeNumber || !formData.employeeName || !formData.designation) {
      toast({
        title: "Missing Information",
        description: "Please fill in all employee details",
        variant: "destructive",
      });
      return;
    }

    const employeeData = {
      employeeNumber: formData.employeeNumber,
      employeeName: formData.employeeName,
      designation: formData.designation,
    };

    createEmployee(employeeData);
  };

  return (
    <Card className="shadow-colorful card-hover backdrop-blur-sm bg-gradient-card border-0 overflow-hidden">
      <CardHeader className="bg-gradient-secondary text-secondary-foreground relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-full">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Employee Management</CardTitle>
            <CardDescription className="text-secondary-foreground/90 mt-1">
              Build your team with talented professionals
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="employeeNumber" className="text-sm font-semibold flex items-center gap-2">
                <Hash className="h-4 w-4 text-secondary" />
                Employee Number
              </Label>
              <Input
                id="employeeNumber"
                value={formData.employeeNumber}
                onChange={(e) => handleNumberInput(e.target.value)}
                placeholder="Enter employee number (numbers only)"
                className="input-glow border-2 h-12 text-lg font-medium focus:ring-secondary/30 focus:border-secondary"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="employeeName" className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-secondary" />
                Employee Name
              </Label>
              <Input
                id="employeeName"
                value={formData.employeeName}
                onChange={(e) => handleTextInput(e.target.value, 'employeeName')}
                placeholder="Enter employee name (letters only)"
                className="input-glow border-2 h-12 text-lg font-medium focus:ring-secondary/30 focus:border-secondary"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="designation" className="text-sm font-semibold flex items-center gap-2">
              <Badge className="h-4 w-4 text-secondary" />
              Designation
            </Label>
            <Input
              id="designation"
              value={formData.designation}
              onChange={(e) => handleTextInput(e.target.value, 'designation')}
              placeholder="Enter designation (letters only)"
              className="input-glow border-2 h-12 text-lg font-medium focus:ring-secondary/30 focus:border-secondary"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 bg-gradient-secondary hover:shadow-glow btn-bounce text-lg font-semibold"
            disabled={isCreating}
          >
            <UserCheck className="mr-3 h-5 w-5" />
            {isCreating ? 'Saving...' : 'Save Employee'}
          </Button>
        </form>

        {/* Employees Table */}
        {employees.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-secondary rounded-lg">
                <Users className="h-5 w-5 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-bold gradient-text">Team Members</h3>
            </div>
            <div className="rounded-xl border-2 border-secondary/20 overflow-hidden shadow-colorful bg-gradient-card">
              <table className="w-full">
                <thead className="bg-gradient-secondary text-secondary-foreground">
                  <tr>
                    <th className="text-left p-4 font-semibold">Emp No</th>
                    <th className="text-left p-4 font-semibold">Emp Name</th>
                    <th className="text-left p-4 font-semibold">Designation</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee, index) => (
                    <tr key={employee.id} className={cn(
                      "border-t border-secondary/10 hover:bg-secondary/5 transition-all duration-200",
                      index % 2 === 0 ? "bg-white/50" : "bg-secondary/5"
                    )}>
                      <td className="p-4 font-semibold text-secondary">{employee.employeeNumber}</td>
                      <td className="p-4 font-medium">{employee.employeeName}</td>
                      <td className="p-4 text-muted-foreground">{employee.designation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
