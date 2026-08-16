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

// Acesso à camada DHN não é mais configurado em tempo de build (env var) — o mesmo
// APK serve pra qualquer usuário. As credenciais são buscadas em runtime, depois do
// login, só se o servidor autorizar essa ativação específica (ver lib/dhnConfig.ts e
// lib/dhnAuth.ts). Esse store fica vazio até essa busca responder com sucesso.
export interface DhnConfig {
  tilesHost: string
  tilesUser: string
  tilesPass: string
}

let dhnConfig: DhnConfig | null = null

export function setDhnConfig(config: DhnConfig | null): void {
  dhnConfig = config
}

export function temAcessoDHN(): boolean {
  return dhnConfig !== null
}

export function getDhnTileUrl(): string {
  return dhnConfig ? `${dhnConfig.tilesHost}/tiles/dhn-guanabara/{z}/{x}/{y}.png` : ''
}

export function getDhnStyleUrl(): string {
  return dhnConfig ? `${dhnConfig.tilesHost}/styles/dhn-guanabara.json` : ''
}

export function getSeamarkStyleUrl(): string {
  return dhnConfig ? `${dhnConfig.tilesHost}/styles/seamark.json` : ''
}

export const DHN_MAX_ZOOM = 16

export interface CamadasConfig {
  seamarks: boolean
  bathymetry: boolean
  dhnRnc: boolean
}
