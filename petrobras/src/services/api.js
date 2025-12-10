const API_URL = process.env.REACT_APP_API_URL;

export async function getSolicitacoes() {
  const response = await fetch(`${API_URL}/solicitacoes`);
  return response.json();
}
