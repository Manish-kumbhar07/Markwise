import { getReviewContent } from '@/app/actions/review';
import { ReviewView } from '@/components/dashboard/ReviewView';

export const dynamic = 'force-dynamic';

export default async function ReviewPage() {
  const content = await getReviewContent();
  return <ReviewView initialContent={content} />;
}
