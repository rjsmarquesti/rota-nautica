import { TransformRequestManager } from '@maplibre/maplibre-react-native'
import { DHN_TILES_HOST } from './tiles'

// Registra o header Authorization (Basic Auth) pro serviço pessoal de tiles de teste
// (carta DHN + style.json do overlay OpenSeaMap, ambos hospedados atrás do mesmo
// Basic Auth). Só faz efeito com as 3 env vars configuradas — build de produção,
// sem elas, não registra nada e a camada DHN fica desativada (ver lib/tiles.ts).
const DHN_TILES_USER = process.env.EXPO_PUBLIC_DHN_TILES_USER ?? ''
const DHN_TILES_PASS = process.env.EXPO_PUBLIC_DHN_TILES_PASS ?? ''

if (DHN_TILES_HOST && DHN_TILES_USER && DHN_TILES_PASS) {
  const hostEscapado = DHN_TILES_HOST.replace(/^https?:\/\//, '').replace(/\./g, '\\.')
  TransformRequestManager.addHeader({
    id: 'dhn-tiles-basic-auth',
    name: 'Authorization',
    value: `Basic ${btoa(`${DHN_TILES_USER}:${DHN_TILES_PASS}`)}`,
    match: hostEscapado,
  })
}
