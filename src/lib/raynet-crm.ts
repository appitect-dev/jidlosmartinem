// Raynet API configuration
const RAYNET_API_BASE = 'https://app.raynet.cz/api/v2';
const RAYNET_INSTANCE = 'recima';

// Types for Raynet API
export interface RaynetClientData {
  firstName: string;
  lastName: string;
  email: string;
  googleDocUrl: string;
}

export interface RaynetApiResponse {
  success: boolean;
  data?: {
    id: number;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  errors?: string[];
}

/**
 * Create a new client (physical person) in Raynet CRM
 */
export async function createRaynetClient({
  firstName,
  lastName,
  email,
  googleDocUrl
}: RaynetClientData): Promise<{ success: boolean; clientId?: number; error?: string }> {
  try {
    console.log('🔍 Creating Raynet client:', { firstName, lastName, email });

    // Validate required environment variables
    if (!process.env.RAYNET_USERNAME || !process.env.RAYNET_API_KEY) {
      console.error('❌ Raynet credentials not configured');
      return { success: false, error: 'Raynet credentials not configured' };
    }

    // Prepare authorization header
    const credentials = `${process.env.RAYNET_USERNAME}:${process.env.RAYNET_API_KEY}`;
    const authHeader = `Basic ${Buffer.from(credentials).toString('base64')}`;

    // Prepare request payload
    const payload = {
      name: `${firstName} ${lastName}`,
      firstName: firstName,
      lastName: lastName,
      email: email, // keep for compatibility
      person: true,
      state: "A_POTENTIAL",
      rating: "A",
      role: "A_SUBSCRIBER",
      notice: googleDocUrl,
      // Raynet expects contact emails inside addresses[].contactInfo.email
      addresses: [
        {
          contactInfo: {
            email: email
          }
        }
      ]
    };

    console.log('🔍 Sending request to Raynet API...');

    // Make API request
    const response = await fetch(`${RAYNET_API_BASE}/company/`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
        'X-Instance-Name': RAYNET_INSTANCE,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('📡 Raynet API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Raynet API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      return { 
        success: false, 
        error: `Raynet API error: ${response.status} ${response.statusText}` 
      };
    }

    const responseData: RaynetApiResponse = await response.json();
    console.log('✅ Raynet API response:', responseData);

    if (responseData.success && responseData.data?.id) {
      console.log('🎉 Raynet client created successfully with ID:', responseData.data.id);
      return {
        success: true,
        clientId: responseData.data.id
      };
    } else {
      console.error('❌ Raynet API returned unsuccessful response:', responseData);
      return {
        success: false,
        error: responseData.errors ? responseData.errors.join(', ') : 'Unknown Raynet API error'
      };
    }

  } catch (error) {
    console.error('💥 Raynet client creation failed:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: error
    });

    return {
      success: false,
      error: `Raynet client creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Test function to validate Raynet API connection
 */
export async function testRaynetConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('🔍 Testing Raynet API connection...');

    if (!process.env.RAYNET_USERNAME || !process.env.RAYNET_API_KEY) {
      return { success: false, error: 'Raynet credentials not configured' };
    }

    const credentials = `${process.env.RAYNET_USERNAME}:${process.env.RAYNET_API_KEY}`;
    const authHeader = `Basic ${Buffer.from(credentials).toString('base64')}`;

    // Test with a simple GET request to check authentication
    const response = await fetch(`${RAYNET_API_BASE}/company/?limit=1`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'X-Instance-Name': RAYNET_INSTANCE,
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      console.log('✅ Raynet API connection successful');
      return { success: true };
    } else {
      console.error('❌ Raynet API connection failed:', response.status, response.statusText);
      return { success: false, error: `Connection failed: ${response.status} ${response.statusText}` };
    }

  } catch (error) {
    console.error('💥 Raynet connection test failed:', error);
    return {
      success: false,
      error: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
