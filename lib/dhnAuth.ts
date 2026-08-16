import { TransformRequestManager } from '@maplibre/maplibre-react-native'
import { setDhnConfig, type DhnConfig } from './tiles'

// Registra o header Authorization (Basic Auth) pro host de tiles autorizado pra essa
// ativação, e guarda a config no store de lib/tiles.ts. Chamado explicitamente depois
// que lib/dhnConfig.ts confirma acesso no servidor — nunca roda sozinho no boot do
// app (as credenciais não existem antes do login).
export function registrarAcessoDHN(config: DhnConfig): void {
  setDhnConfig(config)
  const hostEscapado = config.tilesHost.replace(/^https?:\/\//, '').replace(/\./g, '\\.')
  TransformRequestManager.addHeader({
    id: 'dhn-tiles-basic-auth',
    name: 'Authorization',
    value: `Basic ${btoa(`${config.tilesUser}:${config.tilesPass}`)}`,
    match: hostEscapado,
  })
}
