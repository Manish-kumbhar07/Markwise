import { getApprovalQueue } from '@/app/actions/approvals';
import { ApprovalsView } from '@/components/dashboard/ApprovalsView';

export const dynamic = 'force-dynamic';

export default async function ApprovalsPage() {
  const queue = await getApprovalQueue();

  return <ApprovalsView initialQueue={queue} />;
}
