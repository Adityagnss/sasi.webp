import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, Target, Users, Briefcase, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Project } from './ProjectForm';
import { Employee } from './EmployeeForm';

export interface Assignment {
  id: string;
  projectId: string;
  employeeId: string;
  activity: string;
  date: Date;
  startTime: string;
  endTime: string;
}

interface AssignmentFormProps {
  projects: Project[];
  employees: Employee[];
  assignments: Assignment[];
  onAddAssignment: (assignment: Assignment) => void;
}

const activities = [
  { value: 'Modeling', icon: '🏗️', color: 'text-purple-600' },
  { value: 'Drafting', icon: '📐', color: 'text-blue-600' },
  { value: 'Checking', icon: '🔍', color: 'text-green-600' },
  { value: 'Approval', icon: '✅', color: 'text-orange-600' }
];

export const AssignmentForm: React.FC<AssignmentFormProps> = ({ 
  projects, 
  employees, 
  assignments, 
  onAddAssignment 
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !selectedEmployeeId || !selectedActivity || !selectedDate || !startTime || !endTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all assignment details",
        variant: "destructive",
      });
      return;
    }

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      projectId: selectedProjectId,
      employeeId: selectedEmployeeId,
      activity: selectedActivity,
      date: selectedDate,
      startTime,
      endTime,
    };

    onAddAssignment(newAssignment);
    
    // Reset form
    setSelectedProjectId('');
    setSelectedEmployeeId('');
    setSelectedActivity('');
    setSelectedDate(undefined);
    setStartTime('');
    setEndTime('');

    toast({
      title: "🎉 Assignment Created!",
      description: "Work has been assigned successfully",
      className: "border-l-4 border-l-accent",
    });
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? `${project.projectNumber} - ${project.projectName}` : '';
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? `${employee.employeeNumber} - ${employee.employeeName}` : '';
  };

  return (
    <Card className="shadow-colorful card-hover backdrop-blur-sm bg-gradient-card border-0 overflow-hidden">
      <CardHeader className="bg-gradient-accent text-accent-foreground relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-full">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Employee Project Assignment</CardTitle>
            <CardDescription className="text-accent-foreground/90 mt-1">
              Assign the right people to the right tasks at the right time
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-accent" />
                Project
              </Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger className="input-glow border-2 h-12 text-lg focus:ring-accent/30 focus:border-accent">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent className="shadow-elevated">
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-accent">#{project.projectNumber}</span>
                        <span>- {project.projectName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-accent" />
                Employee
              </Label>
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                <SelectTrigger className="input-glow border-2 h-12 text-lg focus:ring-accent/30 focus:border-accent">
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent className="shadow-elevated">
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-accent">#{employee.employeeNumber}</span>
                        <span>- {employee.employeeName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Target className="h-4 w-4 text-accent" />
              Activity
            </Label>
            <Select value={selectedActivity} onValueChange={setSelectedActivity}>
              <SelectTrigger className="input-glow border-2 h-12 text-lg focus:ring-accent/30 focus:border-accent">
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent className="shadow-elevated">
                {activities.map((activity) => (
                  <SelectItem key={activity.value} value={activity.value}>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{activity.icon}</span>
                      <span className={cn("font-medium", activity.color)}>{activity.value}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-accent" />
              Work Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-medium border-2 input-glow focus:ring-accent/30 focus:border-accent",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-3 h-5 w-5 text-accent" />
                  {selectedDate ? format(selectedDate, "PPP") : "Choose work date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 shadow-elevated" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="startTime" className="text-sm font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" />
                Start Time
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3.5 h-5 w-5 text-accent z-10" />
                <input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="input-glow border-2 h-12 w-full rounded-lg border-input bg-background px-12 py-3 text-lg font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="endTime" className="text-sm font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" />
                End Time
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3.5 h-5 w-5 text-accent z-10" />
                <input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="input-glow border-2 h-12 w-full rounded-lg border-input bg-background px-12 py-3 text-lg font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 bg-gradient-accent hover:shadow-glow btn-bounce text-lg font-semibold"
          >
            <CheckCircle className="mr-3 h-5 w-5" />
            Create Assignment
          </Button>
        </form>

        {/* Assignments Table */}
        {assignments.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-accent rounded-lg">
                <Target className="h-5 w-5 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold gradient-text">Active Assignments</h3>
            </div>
            <div className="rounded-xl border-2 border-accent/20 overflow-hidden shadow-colorful bg-gradient-card">
              <table className="w-full">
                <thead className="bg-gradient-accent text-accent-foreground">
                  <tr>
                    <th className="text-left p-4 font-semibold">Project</th>
                    <th className="text-left p-4 font-semibold">Employee</th>
                    <th className="text-left p-4 font-semibold">Activity</th>
                    <th className="text-left p-4 font-semibold">Date</th>
                    <th className="text-left p-4 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment, index) => {
                    const activity = activities.find(a => a.value === assignment.activity);
                    return (
                      <tr key={assignment.id} className={cn(
                        "border-t border-accent/10 hover:bg-accent/5 transition-all duration-200",
                        index % 2 === 0 ? "bg-white/50" : "bg-accent/5"
                      )}>
                        <td className="p-4 font-medium">{getProjectName(assignment.projectId)}</td>
                        <td className="p-4 font-medium">{getEmployeeName(assignment.employeeId)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{activity?.icon}</span>
                            <span className={cn("font-medium", activity?.color)}>{assignment.activity}</span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{format(assignment.date, "PP")}</td>
                        <td className="p-4 font-medium">{assignment.startTime} - {assignment.endTime}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
