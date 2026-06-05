import { UserRole } from './user.model';

export type WidgetColumn = 'full' | 'main' | 'sidebar' | 'grid';

export interface WidgetConfig {
  id: string;
  type: string;
  order: number;
  visible: boolean;
  column: WidgetColumn;
  roles: UserRole[];
}
