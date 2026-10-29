import { renderToString } from 'react-dom/server';
import Website from './Website';

export { agency, pages } from './content';

export function render(path: string): string {
  return renderToString(<Website initialPath={path} />);
}
