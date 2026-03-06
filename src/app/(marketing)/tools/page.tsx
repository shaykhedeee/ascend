import { redirect } from 'next/navigation';

// Free tools page removed — redirects to /templates
export default function ToolsPage() {
  redirect('/templates');
}
