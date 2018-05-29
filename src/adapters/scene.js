import mapboxgl from 'mapbox-gl'
import ExtendedControl from "../mapbox/extended_nav_control"
import qwantStyle from '@qwant/qwant-basic-gl-style/style.json'
import Poi from "../mapbox/poi"
import StyleLaundry from '../mapbox/style_laundry'
import PanelManager from "../proxies/panel_manager"
import UrlState from "../proxies/url_state"

function Scene() {
  UrlState.register(this)
  this.zoom = 6
  this.center = [46,6]
  this.currentMarker = null
}

Scene.prototype.initMapBox = function () {
  this.mb = new mapboxgl.Map({
    container: 'scene_container',
    style: StyleLaundry(qwantStyle),
    zoom: this.zoom,
    center: this.center,
    hash: false
  })

  window.map = {
    center : () => {
      return this.mb.getCenter()
    },
    bbox : () => {
      return this.mb.getBounds()
    }
  }

  const interactiveLayers =  ['poi-level-1', 'poi-level-2', 'poi-level-3']

  this.mb.on('load', () => {
    const extendedControl = new ExtendedControl()

    this.mb.addControl(extendedControl, 'bottom-right')

    interactiveLayers.forEach((interactiveLayer) => {
      this.mb.on('mouseenter', interactiveLayer, () => {
        this.mb.getCanvas().style.cursor = 'pointer';
      })

      this.mb.on('mouseleave', interactiveLayer, () =>{
        this.mb.getCanvas().style.cursor = '';
      })

      this.mb.on('click', interactiveLayer, (e) => {
        let poi = Poi.sceneLoad(e, this.mb.getZoom())
        PanelManager.setPoi(poi)
        this.addMarker(poi)
      })

      this.mb.on('moveend', () => {
        UrlState.updateUrl()
      })
    })
  })

  listen('fly_to', (poi) => {
   // this.flyTo(poi)
  })

  listen('fit_bounds', (poi, options) => {
    //this.fitBounds(poi, options)
  })

  listen('map_mark_poi', (poi) => {
    this.addMarker(poi)
  })
}

Scene.prototype.flyTo = function (poi) {
  let flyOptions = {}
  if(poi.zoom) {
    flyOptions = {
      center : poi.getLngLat(),
      zoom : poi.zoom
    }
  } else {
    flyOptions = {center : poi.getLngLat()}
  }
  let windowBounds = this.mb.getBounds()
  const originalWindowBounds = windowBounds.toArray() /* simple way to clone value */
  let poiCenter = new mapboxgl.LngLat(poi.getLngLat().lng, poi.getLngLat().lat)
  windowBounds.extend(poiCenter)
  /* flyTo location if it's in the window or else jumpTo */
  if(compareBoundsArray(windowBounds.toArray(), originalWindowBounds)) {
    this.mb.flyTo(flyOptions)
  } else {
    this.mb.jumpTo(flyOptions)
  }
}

Scene.prototype.fitBounds = function (poi) {
  this.mb.fitBounds(poi.bbox, poi.padding)
}

Scene.prototype.addMarker = function(poi) {
  if(this.currentMarker !== null) {
    this.currentMarker.remove()
  }
  let marker = new mapboxgl.Marker()
    .setLngLat(poi.getLngLat())
    .addTo(this.mb)
  this.currentMarker = marker
  return marker
}

/* UrlState interface implementation */
Scene.prototype.store = function () {
  return `z${this.mb.getZoom()}/${this.mb.getCenter().lng}/${this.mb.getCenter().lat}`
}

Scene.prototype.restore = function (url) {
  let geoCenter = url.match(/z(\d*[.]?\d+)\/(\d*[.]?\d+)\/(\d*[.]?\d+)/)
  if(geoCenter) {
    this.zoom = parseFloat(geoCenter[1])
    this.center = [parseFloat(geoCenter[2]), parseFloat(geoCenter[3])]
  }
}

/* private */
function compareBoundsArray(boundsA, boundsB) {
  return boundsA[0][0] === boundsB[0][0] && boundsA[0][1] === boundsB[0][1] && boundsA[1][0] === boundsB[1][0] && boundsA[1][1] === boundsB[1][1]
}

export default Scene
