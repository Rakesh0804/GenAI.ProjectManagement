export interface TaskType {
  value: string;
  label: string;
  description: string;
  color?: string;
}

export const TASK_TYPES: TaskType[] = [
  {
    value: 'BUG',
    label: 'Bug',
    description: 'Bug fix or defect resolution',
    color: '#f44336' // Red
  },
  {
    value: 'TASK',
    label: 'Task',
    description: 'General development task',
    color: '#2196f3' // Blue
  },
  {
    value: 'SPIKE',
    label: 'Spike',
    description: 'Research or investigation task',
    color: '#ff9800' // Orange
  },
  {
    value: 'STORY',
    label: 'User Story',
    description: 'Feature development story',
    color: '#4caf50' // Green
  }
];

// Default task type
export const DEFAULT_TASK_TYPE = 'TASK';

// Helper function to get task type by value
export function getTaskTypeByValue(value: string): TaskType | undefined {
  return TASK_TYPES.find(type => type.value === value);
}

// Helper function to get task type label
export function getTaskTypeLabel(value: string): string {
  const taskType = getTaskTypeByValue(value);
  return taskType ? taskType.label : value;
}

// Helper function to get task type color
export function getTaskTypeColor(value: string): string {
  const taskType = getTaskTypeByValue(value);
  return taskType?.color || '#666666';
}
