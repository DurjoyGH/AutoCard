const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const makePayment = async (cardApplicationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payment/make`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ cardApplicationId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to initiate payment");
    }

    return data;
  } catch (error) {
    console.error("Make payment error:", error);
    throw error;
  }
};

export const getPaymentStatus = async (applicationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payment/status/${applicationId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to get payment status");
    }

    return data;
  } catch (error) {
    console.error("Get payment status error:", error);
    throw error;
  }
};
