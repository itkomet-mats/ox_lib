export interface AlertProps {
  header: string;
  content: string;
  type?: 'error' | 'success' | 'warning' | 'info' | 'default'; // ✅ Add this
  centered?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  overflow?: boolean;
  cancel?: boolean;
  labels?: {
    cancel?: string;
    confirm?: string;
  };
}
