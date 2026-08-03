import { z } from 'zod';
import { trackEvent } from '@/lib/tracking';

const trackSchema = z.object({
  eventType: z.string().max(50).optional().default('conversion'),
  eventName: z.string().min(1).max(100),
  entityType: z.string().max(50).optional().nullable().default(null),
  entityId: z.string().max(100).optional().nullable().default(null),
  source: z.string().max(100).optional().default('web'),
  metadata: z.record(z.any()).optional().default({}),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = trackSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      const firstError = Object.values(errors).flat()[0] || 'Validation failed.';
      return Response.json({ success: false, error: firstError }, { status: 400 });
    }

    const sourceUrl = request.headers.get('referer') || '';

    const result = await trackEvent({
      ...parsed.data,
      sourceUrl,
    });

    if (!result.success) {
      return Response.json(
        { success: false, error: result.error || result.reason || 'Tracking failed.' },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      persisted: result.persisted || false,
      id: result.id,
    });
  } catch (error) {
    console.error('[api/track] Error:', error);
    return Response.json({ success: false, error: 'Tracking failed.' }, { status: 500 });
  }
}
