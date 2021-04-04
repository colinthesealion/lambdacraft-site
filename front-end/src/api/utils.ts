export async function fetchFromBackend(route: string) {
  const response = await fetch(getBackendURL(route));
  if (!response.ok) {
    throw new Error(`Failed to fetch ${route}`);
  }
  return response.json();
}

export function getBackendURL(route: string) {
  return `${process.env.REACT_APP_BACKEND_URL}/${route}`;
}