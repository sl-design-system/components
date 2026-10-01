import { type AssetsWidgetModel } from './etsl-assets-widget.js';

/**
 * The twelve asset-type counts exactly as the design shows them, in reading order (row-major
 * across the two columns): Document, Picture / Audio, Video / Streaming, Explorit / Three
 * Ships, YouTube / GeoGebra, Sowiso / MathType, ChemType.
 *
 * In the real page this is a slice of what the root `sl-etsl-dashboard-page` fetches; the
 * fixture lives here so the widget's own story can render the design's content standalone.
 */
export const assetsWidgetMock: AssetsWidgetModel = {
  types: [
    { id: 'document', label: 'Document', count: 10 },
    { id: 'picture', label: 'Picture', count: 8 },
    { id: 'audio', label: 'Audio', count: 8 },
    { id: 'video', label: 'Video', count: 6 },
    { id: 'streaming', label: 'Streaming', count: 4 },
    { id: 'explorit', label: 'Explorit', count: 2 },
    { id: 'three-ships', label: 'Three Ships', count: 1 },
    { id: 'youtube', label: 'YouTube', count: 0 },
    { id: 'geogebra', label: 'GeoGebra', count: 0 },
    { id: 'sowiso', label: 'Sowiso', count: 0 },
    { id: 'mathtype', label: 'MathType', count: 0 },
    { id: 'chemtype', label: 'ChemType', count: 0 }
  ]
};
