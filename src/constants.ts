import { AutomationOption } from './types';

export const VALID_EXTENSIONS = ['.xlsx', '.xls', '.xlsm', '.csv'];

export const AUTOMATION_OPTIONS: AutomationOption[] = [
  {
    id: 'general',
    label: 'General',
    description: 'Run the standard general tracking automation.',
    requiredFiles: ['generals'],
  },
  {
    id: 'family_total',
    label: 'Family Total',
    description: 'Combine and process family tracking totals.',
    requiredFiles: ['parents', 'kids'],
  },
  {
    id: 'family_total_general_quads',
    label: 'Family Total + General Quads',
    description: 'Run family total automation and include general quadrant outputs.',
    requiredFiles: ['generals', 'parents', 'kids'],
  },
  {
    id: 'family_total_younger_quads',
    label: 'Family Total + Younger Quads',
    description: 'Run family total automation and include younger audience quadrant outputs.',
    requiredFiles: ['parents', 'kids'],
  },
];
