import httpAgent from '@/agent/httpAgent';

export const fetchUserProfile = async (token: string) => {
  try {
    const data = await httpAgent('/users/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return null;
  }
};
