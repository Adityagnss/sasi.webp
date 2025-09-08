import React, { useState } from 'react';
import { ProjectForm, Project } from '@/components/ProjectForm';
import { EmployeeForm, Employee } from '@/components/EmployeeForm';
import { AssignmentForm, Assignment } from '@/components/AssignmentForm';
import { CheckCircle, Circle, ArrowRight, Sparkles, Users, Briefcase, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApi } from '@/hooks/useApi';
import { projectsApi, employeesApi, assignmentsApi } from '@/services/api';

const Index = () => {
  // Load data from backend
  const { data: projects = [], refetch: refetchProjects } = useApi<Project[]>(projectsApi.getAll);
  const { data: employees = [], refetch: refetchEmployees } = useApi<Employee[]>(employeesApi.getAll);
  const { data: assignments = [], refetch: refetchAssignments } = useApi<Assignment[]>(assignmentsApi.getAll);

  const handleAddProject = (project: Project) => {
    refetchProjects();
  };

  const handleAddEmployee = (employee: Employee) => {
    refetchEmployees();
  };

  const handleAddAssignment = (assignment: Assignment) => {
    refetchAssignments();
  };

  // Progress indicators
  const steps = [
    { 
      id: 1, 
      title: 'Projects', 
      completed: projects.length > 0,
      description: 'Create your project portfolio',
      icon: Briefcase,
      color: 'text-primary',
      bgColor: 'bg-gradient-primary'
    },
    { 
      id: 2, 
      title: 'Employees', 
      completed: employees.length > 0,
      description: 'Build your dream team',
      icon: Users,
      color: 'text-secondary',
      bgColor: 'bg-gradient-secondary'
    },
    { 
      id: 3, 
      title: 'Assignments', 
      completed: assignments.length > 0,
      description: 'Assign tasks to achieve goals',
      icon: Target,
      color: 'text-accent',
      bgColor: 'bg-gradient-accent'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        <div className="relative z-10 bg-gradient-card/50 backdrop-blur-lg border-b border-white/20 shadow-elevated">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-glow">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
                  Samvid
                </h1>
              </div>
              <p className="text-xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
                Professional Employee & Project Management System
              </p>
              <p className="text-white/70 mt-2 text-lg">
                Streamline your workflow with intelligent project coordination
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Workflow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-card backdrop-blur-sm rounded-2xl shadow-colorful p-8 mb-8 border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold gradient-text mb-2">Workflow Progress</h2>
            <p className="text-muted-foreground text-lg">Follow the sequential steps to set up your management system</p>
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-12">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center text-center group">
                  <div className={cn(
                    "w-20 h-20 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 shadow-elevated",
                    step.completed 
                      ? `${step.bgColor} text-white shadow-glow scale-110` 
                      : "bg-muted/50 text-muted-foreground hover:bg-muted group-hover:scale-105"
                  )}>
                    {step.completed ? (
                      <CheckCircle className="w-10 h-10" />
                    ) : (
                      <step.icon className="w-10 h-10" />
                    )}
                  </div>
                  <h3 className={cn(
                    "font-bold text-lg mb-2",
                    step.completed ? step.color : "text-muted-foreground"
                  )}>
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-32 leading-relaxed">
                    {step.description}
                  </p>
                  {step.completed && (
                    <div className="mt-3 px-3 py-1 bg-success/10 text-success text-xs font-semibold rounded-full border border-success/20">
                      ✓ Completed
                    </div>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex items-center">
                    <ArrowRight className={cn(
                      "w-8 h-8 transition-all duration-300",
                      step.completed && steps[index + 1].completed ? "text-success" : "text-muted-foreground"
                    )} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-10">
          {/* Project Management Section */}
          <div className="animate-fade-in">
            <ProjectForm projects={projects} onAddProject={handleAddProject} />
          </div>

          {/* Employee Management Section */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <EmployeeForm employees={employees} onAddEmployee={handleAddEmployee} />
          </div>

          {/* Assignment Section - Only show if both projects and employees exist */}
          {projects.length > 0 && employees.length > 0 ? (
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <AssignmentForm 
                projects={projects}
                employees={employees}
                assignments={assignments}
                onAddAssignment={handleAddAssignment}
              />
            </div>
          ) : (
            <div className="bg-gradient-card backdrop-blur-sm rounded-2xl shadow-colorful p-12 text-center border border-white/20">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-muted/20 rounded-full">
                  <Target className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-muted-foreground">
                  Assignment Center
                </h3>
                <p className="text-muted-foreground text-lg max-w-md">
                  Complete the project and employee setup first, then you can create powerful task assignments
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <div className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                    projects.length > 0 ? "bg-success/10 text-success border border-success/20" : "bg-muted/20 text-muted-foreground border border-muted/30"
                  )}>
                    {projects.length > 0 ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    Projects Ready
                  </div>
                  <div className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                    employees.length > 0 ? "bg-success/10 text-success border border-success/20" : "bg-muted/20 text-muted-foreground border border-muted/30"
                  )}>
                    {employees.length > 0 ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    Team Ready
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
