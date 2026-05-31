export const COLORS = {
  background: '#F9F5F2',
  primary: '#381932',
  accent: '#D9B48B',
  white: '#FFFFFF',
  black: '#1A1A1A',
  text: '#1A1A1A',
  cardBg: '#FFFFFF',
  inputBg: '#F0EBE5',
  sidebarBg: '#381932',
  gray: {
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  inactive: '#9E9E9E',
  success: '#2E7D32',
  warning: '#F57C00',
  error: '#C62828',
  info: '#1976D2',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
    xxxl: 32,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 100,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const COMMITMENT_TYPES = {
  '15min_call': { label: '15-min Call', icon: 'call-outline' as const },
  'file_review': { label: 'File Review', icon: 'document-text-outline' as const },
  'referral': { label: 'Referral', icon: 'people-outline' as const },
  'shadow_task': { label: 'Shadow Task', icon: 'eye-outline' as const },
};

export const URGENCY_COLORS = {
  low: COLORS.success,
  medium: COLORS.warning,
  high: '#E65100',
  urgent: COLORS.error,
};

export const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote', 'Hybrid'];

export const EXPERIENCE_LEVELS = ['Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Lead', 'Manager', 'Director'];
