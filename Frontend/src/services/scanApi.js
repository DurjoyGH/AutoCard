const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Get card details by ID
export const getCardDetails = async (cardId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scan/card/${cardId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to retrieve card details');
    }

    return data;
  } catch (error) {
    console.error('Get card details error:', error);
    throw error;
  }
};
