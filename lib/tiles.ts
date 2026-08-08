import Constants from 'expo-constants'

// Chave gerada em https://cloud.maptiler.com — configurar em app.json > expo.extra.mapTilerKey
// (ou via variável de ambiente EXPO_PUBLIC_MAPTILER_KEY no build). Sem a chave, a camada
// base não carrega — telas devem tratar esse caso mostrando aviso, não travar o app.
export const MAPTILER_KEY: string =
  process.env.EXPO_PUBLIC_MAPTILER_KEY ??
  (Constants.expoConfig?.extra?.mapTilerKey as string | undefined) ??
  ''

// Style hospedado pela própria MapTiler — usado tanto na exibição ao vivo (prop
// `mapStyle` do <Map>) quanto no download offline (OfflineManager.createPack só aceita
// uma URL de style, não um objeto StyleSpecification inline nesta versão da lib).
export const MAPTILER_STYLE_URL = MAPTILER_KEY
  ? `https://api.maptiler.com/maps/ocean/style.json?key=${MAPTILER_KEY}`
  : ''

export const SEAMARK_TILE_URL = 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'

// Proxy próprio (Cloudflare Worker) que converte bbox do tile em GetMap do WMS da GEBCO.
// Ver plano técnico — não é bloqueante para o MVP (camada fica desativada até existir).
export const BATHYMETRY_TILE_URL = ''

export const SEAMARK_MAX_ZOOM = 15
export const OFFLINE_ZOOM_DEFAULT = { min: 8, max: 14 }

// Host do serviço pessoal de tiles (carta RNC da DHN, uso de teste — nunca em build de
// produção). Configurar via EXPO_PUBLIC_DHN_TILES_HOST no .env.local (não versionado).
// Vazio = camada desativada, mesmo padrão do BATHYMETRY_TILE_URL acima.
export const DHN_TILES_HOST: string =
  process.env.EXPO_PUBLIC_DHN_TILES_HOST ??
  (Constants.expoConfig?.extra?.dhnTilesHost as string | undefined) ??
  ''

// Autenticação (Basic Auth) desse host é registrada via header em lib/dhnAuth.ts —
// nunca embutir usuário/senha na URL (OkHttp/MapLibre Native não decodifica userinfo).
export const DHN_TILE_URL = DHN_TILES_HOST ? `${DHN_TILES_HOST}/tiles/dhn-guanabara/{z}/{x}/{y}.png` : ''
export const DHN_STYLE_URL = DHN_TILES_HOST ? `${DHN_TILES_HOST}/styles/dhn-guanabara.json` : ''
export const SEAMARK_STYLE_URL = DHN_TILES_HOST ? `${DHN_TILES_HOST}/styles/seamark.json` : ''
export const DHN_MAX_ZOOM = 16

export interface CamadasConfig {
  seamarks: boolean
  bathymetry: boolean
  dhnRnc: boolean
}
