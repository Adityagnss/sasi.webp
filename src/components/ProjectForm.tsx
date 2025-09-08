import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Briefcase, DollarSign, Clock, Hash } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export interface Project {
  id: string;
  projectNumber: string;
  projectName: string;
  budget: string;
  manHours: string;
  startDate: Date;
}

interface ProjectFormProps {
  projects: Project[];
  onAddProject: (project: Project) => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ projects, onAddProject }) => {
  const [formData, setFormData] = useState({
    projectNumber: '',
    projectName: '',
    budget: '',
    manHours: '',
  });
  const [startDate, setStartDate] = useState<Date>();
  const { toast } = useToast();

  // Input validation functions
  const handleNumberInput = (value: string, field: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setFormData({ ...formData, [field]: numericValue });
  };

  const handleTextInput = (value: string, field: string) => {
    const textValue = value.replace(/[^a-zA-Z\s]/g, '');
    setFormData({ ...formData, [field]: textValue });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectNumber || !formData.projectName || !formData.budget || !formData.manHours || !startDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to continue",
        variant: "destructive",
      });
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      projectNumber: formData.projectNumber,
      projectName: formData.projectName,
      budget: formData.budget,
      manHours: formData.manHours,
      startDate,
    };

    onAddProject(newProject);
    
    // Reset form
    setFormData({
      projectNumber: '',
      projectName: '',
      budget: '',
      manHours: '',
    });
    setStartDate(undefined);

    toast({
      title: "🎉 Success!",
      description: "Project has been added successfully",
      className: "border-l-4 border-l-primary",
    });
  };

  return (
    <Card className="shadow-colorful card-hover backdrop-blur-sm bg-gradient-card border-0 overflow-hidden">
      <CardHeader className="bg-gradient-primary text-primary-foreground relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-full">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Project Management</CardTitle>
            <CardDescription className="text-primary-foreground/90 mt-1">
              Create and organize your project portfolio
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="projectNumber" className="text-sm font-semibold flex items-center gap-2">
                <Hash className="h-4 w-4 text-primary" />
                Project Number
              </Label>
              <Input
                id="projectNumber"
                value={formData.projectNumber}
                onChange={(e) => handleNumberInput(e.target.value, 'projectNumber')}
                placeholder="Enter project number (numbers only)"
                className="input-glow border-2 h-12 text-lg font-medium"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="projectName" className="text-sm font-semibold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                Project Name
              </Label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={(e) => handleTextInput(e.target.value, 'projectName')}
                placeholder="Enter project name (letters only)"
                className="input-glow border-2 h-12 text-lg font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="budget" className="text-sm font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Budget
              </Label>
              <Input
                id="budget"
                value={formData.budget}
                onChange={(e) => handleNumberInput(e.target.value, 'budget')}
                placeholder="Enter budget (numbers only)"
                className="input-glow border-2 h-12 text-lg font-medium"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="manHours" className="text-sm font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Man Hours
              </Label>
              <Input
                id="manHours"
                value={formData.manHours}
                onChange={(e) => handleNumberInput(e.target.value, 'manHours')}
                placeholder="Enter man hours (numbers only)"
                className="input-glow border-2 h-12 text-lg font-medium"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              Start Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-medium border-2 input-glow",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                  {startDate ? format(startDate, "PPP") : "Pick a start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 shadow-elevated" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 bg-gradient-primary hover:shadow-glow btn-bounce text-lg font-semibold"
          >
            <Briefcase className="mr-3 h-5 w-5" />
            Save Project
          </Button>
        </form>

        {/* Projects Table */}
        {projects.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Briefcase className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold gradient-text">Project Portfolio</h3>
            </div>
            <div className="rounded-xl border-2 border-primary/20 overflow-hidden shadow-colorful bg-gradient-card">
              <table className="w-full">
                <thead className="bg-gradient-primary text-primary-foreground">
                  <tr>
                    <th className="text-left p-4 font-semibold">Project No</th>
                    <th className="text-left p-4 font-semibold">Project Name</th>
                    <th className="text-left p-4 font-semibold">Hours</th>
                    <th className="text-left p-4 font-semibold">Start Date</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, index) => (
                    <tr key={project.id} className={cn(
                      "border-t border-primary/10 hover:bg-primary/5 transition-all duration-200",
                      index % 2 === 0 ? "bg-white/50" : "bg-primary/5"
                    )}>
                      <td className="p-4 font-semibold text-primary">{project.projectNumber}</td>
                      <td className="p-4 font-medium">{project.projectName}</td>
                      <td className="p-4 font-medium">{project.manHours}</td>
                      <td className="p-4 text-muted-foreground">{format(project.startDate, "PP")}</td>
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
