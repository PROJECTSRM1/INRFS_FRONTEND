import apiClient from '../utils/apiClient';

export interface CreateOrderPayload {
    investment_id: number; // Changed from string to number to match API schema
    amount: number;
}

export interface CreateOrderResponse {
    order_id?: string;
    payment_url?: string;
    status?: string;
    message?: string;
    // Add other fields based on actual API response
}

export const paymentService = {
    /**
     * Create a payment order
     * Endpoint: POST https://inrfs-be.onrender.com/payments/create-order
     */
    createOrder: async (payload: CreateOrderPayload): Promise<CreateOrderResponse> => {
        try {
            console.log('=== PAYMENT ORDER REQUEST ===');
            console.log('Creating payment order with payload:', payload);
            console.log('Payload type check:', {
                investment_id: typeof payload.investment_id,
                amount: typeof payload.amount
            });
            console.log('Stringified payload:', JSON.stringify(payload, null, 2));

            const response = await apiClient.post('/payments/create-order', payload);

            console.log('=== PAYMENT ORDER SUCCESS ===');
            console.log('Payment order created successfully:', response.data);
            console.log('Response status:', response.status);
            return response.data;
        } catch (error: any) {
            console.error('=== PAYMENT ORDER ERROR ===');
            console.error('Error creating payment order:', error);
            console.error('Error response data:', error.response?.data);
            console.error('Error response status:', error.response?.status);
            console.error('Error response headers:', error.response?.headers);
            console.error('Error message:', error.message);

            // Log the full error for debugging
            if (error.response) {
                console.error('Full error response:', JSON.stringify(error.response.data, null, 2));
            }

            throw error;
        }
    }
};

export default paymentService;
