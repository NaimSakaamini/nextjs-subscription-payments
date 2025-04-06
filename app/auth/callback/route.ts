import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getErrorRedirect, getStatusRedirect } from '@/utils/helpers';

export async function GET(request: NextRequest) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the `@supabase/ssr` package. It exchanges an auth code for the user's session.
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        getErrorRedirect(
          `${requestUrl.origin}/signin`,
          error.name,
          "Sorry, we weren't able to log you in. Please try again."
        )
      );
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(
    getStatusRedirect(
      `${requestUrl.origin}/account`,
      'Success!',
      'You are now signed in.'
    )
  );
export async function handleRefund(orderId: string, amount: number) {
  const order = await fetchOrderDetails(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  if (order.status !== 'completed' && order.status !== 'partially_refunded') {
    throw new Error('Refunds can only be processed for completed or partially refunded orders');
  }

  await refundPayment(order.paymentId, amount);

  const newStatus = amount < order.totalAmount ? 'partially_refunded' : 'refunded';
  await updateOrder(orderId, { status: newStatus });

  sendRefundNotification(order.customerId);
}

}
