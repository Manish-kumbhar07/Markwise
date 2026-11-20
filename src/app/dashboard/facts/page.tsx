import { getFacts } from '@/app/actions/facts';
import { FactsView } from '@/components/dashboard/FactsView';

export const dynamic = 'force-dynamic';

export default async function FactsPage() {
  const facts = await getFacts();

  return <FactsView initialFacts={facts} />;
}
