const API_BASE = 'https://activation.sismeipro.com.br'
const APP_ID = 'rota-nautica'

export interface CadastroResult {
  ok: boolean
  error?: string
}

export async function enviarCadastro(dados: {
  nome: string
  email: string
  telefone?: string
  cidade?: string
}): Promise<CadastroResult> {
  try {
    const res = await fetch(`${API_BASE}/api/cadastro/${APP_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: dados.nome.trim(),
        email: dados.email.toLowerCase().trim(),
        telefone: dados.telefone?.trim() || undefined,
        cidade: dados.cidade?.trim() || undefined,
        aceiteTermos: true,
      }),
      signal: AbortSignal.timeout(10000),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data.error ?? 'Não foi possível concluir o cadastro.' }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Sem conexão. Verifique sua internet e tente novamente.' }
  }
}
