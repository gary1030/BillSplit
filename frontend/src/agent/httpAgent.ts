async function httpAgent(url: string, options: RequestInit) {
  const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`;
  const response = await fetch(fullUrl, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export default httpAgent;
