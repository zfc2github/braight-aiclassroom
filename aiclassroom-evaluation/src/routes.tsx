import EvaluationReport from './pages/EvaluationReport';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: '教学评估报告',
    path: '/',
    element: <EvaluationReport />
  }
];

export default routes;