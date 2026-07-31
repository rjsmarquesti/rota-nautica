import { OfflineManager, type LngLatBounds } from '@maplibre/maplibre-react-native'
import { MAPTILER_STYLE_URL } from './tiles'
import { atualizarStatusAreaOffline } from './db'

export interface BBox {
  minLat: number
  maxLat: number
  minLon: number
  maxLon: number
}

// Estimativa client-side (a lib não expõe contagem de tiles antes do download).
// Usado só para mostrar uma faixa aproximada na UI antes de confirmar — o tamanho real
// é atualizado depois, a partir do que o próprio OfflineManager reporta.
export function estimarTiles(bbox: BBox, zoomMin: number, zoomMax: number): number {
  let total = 0
  for (let z = zoomMin; z <= zoomMax; z++) {
    const n = 2 ** z
    const x1 = Math.floor(((bbox.minLon + 180) / 360) * n)
    const x2 = Math.floor(((bbox.maxLon + 180) / 360) * n)
    const lat2rad = (lat: number) => (lat * Math.PI) / 180
    const y1 = Math.floor(((1 - Math.log(Math.tan(lat2rad(bbox.maxLat)) + 1 / Math.cos(lat2rad(bbox.maxLat))) / Math.PI) / 2) * n)
    const y2 = Math.floor(((1 - Math.log(Math.tan(lat2rad(bbox.minLat)) + 1 / Math.cos(lat2rad(bbox.minLat))) / Math.PI) / 2) * n)
    total += (Math.abs(x2 - x1) + 1) * (Math.abs(y2 - y1) + 1)
  }
  return total
}

const BYTES_POR_TILE_ESTIMADO = 18000 // ~18KB/tile, média para raster 256px comprimido

export function estimarTamanhoBytes(bbox: BBox, zoomMin: number, zoomMax: number): number {
  return estimarTiles(bbox, zoomMin, zoomMax) * BYTES_POR_TILE_ESTIMADO
}

// Baixa só a camada base (MapTiler) para uso offline. O OfflineManager desta versão
// da lib só aceita UMA styleURL por pacote (não um StyleSpecification combinado) —
// por isso o overlay de marcas náuticas (OpenSeaMap) continua exigindo internet
// mesmo com a área baixada. Ver nota no plano/registro de decisões.
export async function baixarAreaOffline(
  areaId: number,
  nomePack: string,
  bbox: BBox,
  zoomMin: number,
  zoomMax: number,
  onProgress?: (percentual: number) => void
): Promise<void> {
  if (!MAPTILER_STYLE_URL) {
    atualizarStatusAreaOffline(areaId, 'erro', nomePack)
    throw new Error('MAPTILER_KEY não configurada — não é possível baixar área offline.')
  }

  atualizarStatusAreaOffline(areaId, 'baixando')

  const bounds: LngLatBounds = [bbox.minLon, bbox.minLat, bbox.maxLon, bbox.maxLat]

  try {
    const pack = await OfflineManager.createPack(
      {
        mapStyle: MAPTILER_STYLE_URL,
        bounds,
        minZoom: zoomMin,
        maxZoom: zoomMax,
        metadata: { areaId, nomePack },
      },
      (_pack, status) => {
        onProgress?.(status.percentage)
        if (status.state === 'complete') {
          atualizarStatusAreaOffline(areaId, 'completo', pack.id, status.completedResourceSize)
        }
      },
      (_pack, err) => {
        atualizarStatusAreaOffline(areaId, 'erro', pack.id)
        console.warn('Falha ao baixar área offline', nomePack, err)
      }
    )
    atualizarStatusAreaOffline(areaId, 'baixando', pack.id)
  } catch (err) {
    atualizarStatusAreaOffline(areaId, 'erro', nomePack)
    console.warn('Falha ao criar pacote offline', nomePack, err)
  }
}

export async function removerAreaOffline(packId: string): Promise<void> {
  try {
    await OfflineManager.deletePack(packId)
  } catch (err) {
    console.warn('Falha ao remover pacote offline', packId, err)
  }
}
