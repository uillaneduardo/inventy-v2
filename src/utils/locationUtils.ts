import { LocationItem, Asset, AssetStatus } from '../types';

export interface LocationAggregatedStats {
  totalAssets: number;
  statusBreakdown: Record<AssetStatus, number>;
}

/**
  * Collects all location IDs in the subtree of a node (including node.id)
  */
export function collectSubtreeIds(node: LocationItem): string[] {
  const ids: string[] = [node.id];
  if (node.children) {
    for (const child of node.children) {
      ids.push(...collectSubtreeIds(child));
    }
  }
  return ids;
}

/**
  * Finds all location items in a tree that have coordinates (latitude & longitude)
  */
export function findLocationsWithCoords(locations: LocationItem[]): LocationItem[] {
  const result: LocationItem[] = [];

  function traverse(item: LocationItem) {
    if (item.latitude !== undefined && item.longitude !== undefined) {
      result.push(item);
    }
    if (item.children) {
      for (const child of item.children) {
        traverse(child);
      }
    }
  }

  for (const loc of locations) {
    traverse(loc);
  }

  return result;
}

/**
  * Calculates aggregated total assets and status breakdown for a location node and its descendants
  */
export function calculateAggregatedStats(node: LocationItem, assets: Asset[]): LocationAggregatedStats {
  const subtreeIds = collectSubtreeIds(node);

  // Filter assets in this location subtree
  const matchingAssets = assets.filter((asset) => subtreeIds.includes(asset.locationId));

  // Count by status from actual assets
  const breakdown: Record<AssetStatus, number> = {
    'Em uso': 0,
    'Disponível': 0,
    'Em manutenção': 0,
    'Descartado': 0,
  };

  matchingAssets.forEach((asset) => {
    if (breakdown[asset.status] !== undefined) {
      breakdown[asset.status]++;
    }
  });

  const matchedCount = matchingAssets.length;
  // Use node.assetCount if provided and higher than sample assets
  const total = Math.max(node.assetCount || 0, matchedCount);

  // If node.assetCount is larger than the sample matching assets in mockData,
  // distribute the remaining assets proportionally so the popup status breakdown sums to total.
  if (total > matchedCount && matchedCount > 0) {
    const diff = total - matchedCount;
    // Distribute mostly to 'Em uso' and 'Disponível'
    const emUsoExtra = Math.floor(diff * 0.75);
    const disponivelExtra = Math.floor(diff * 0.20);
    const manutencaoExtra = diff - emUsoExtra - disponivelExtra;

    breakdown['Em uso'] += emUsoExtra;
    breakdown['Disponível'] += disponivelExtra;
    breakdown['Em manutenção'] += manutencaoExtra;
  } else if (total > 0 && matchedCount === 0) {
    // Fallback default distribution if no mock assets match locationId directly
    breakdown['Em uso'] = Math.floor(total * 0.70);
    breakdown['Disponível'] = Math.floor(total * 0.20);
    breakdown['Em manutenção'] = Math.floor(total * 0.08);
    breakdown['Descartado'] = total - breakdown['Em uso'] - breakdown['Disponível'] - breakdown['Em manutenção'];
  }

  return {
    totalAssets: total,
    statusBreakdown: breakdown,
  };
}

/**
  * Finds the parent path IDs leading to targetId in the locations tree
  */
export function findParentPathIds(locations: LocationItem[], targetId: string): string[] {
  const path: string[] = [];

  function search(items: LocationItem[], currentPath: string[]): boolean {
    for (const item of items) {
      const newPath = [...currentPath, item.id];
      if (item.id === targetId) {
        path.push(...newPath);
        return true;
      }
      if (item.children && search(item.children, newPath)) {
        return true;
      }
    }
    return false;
  }

  search(locations, []);
  return path;
}
