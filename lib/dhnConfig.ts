import { registrarAcessoDHN } from './dhnAuth'

const API_BASE = 'https://activation.sismeipro.com.br'
const APP_ID = 'rota-nautica'

// Busca a config da camada DHN depois do login. Silencioso em qualquer cenário sem
// acesso (403 = não autorizado, sem conexão, servidor fora) — a camada simplesmente
// não aparece, sem travar nem avisar o usuário, mesmo comportamento de antes quando
// a env var de build estava vazia.
export async function buscarConfigDHN(token: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/api/dhn-config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: APP_ID, token }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return
    const data = await res.json()
    if (data.tilesHost && data.tilesUser && data.tilesPass) {
      registrarAcessoDHN({ tilesHost: data.tilesHost, tilesUser: data.tilesUser, tilesPass: data.tilesPass })
    }
  } catch {
    // sem conexão — não bloqueia o app, camada DHN só fica desligada
  }
}
