import FavoritePanelView from 'dot-loader!../views/favorites_panel.dot'
import Panel from '../libs/panel'
import Poi from '../mapbox/poi'
import Store from '../adapters/store'

const store = new Store()

function Favorite() {
  this.active = false
  this.favoritePois = []
  store.onConnect()
    .then(() => store.isRegistered())
    .then((registered) => {
      if(registered) {
        this.getAll()
      } else {
        fire('register_panel__show')
      }
    })

  listen('store_registered', () => {
    this.getAll()
  })

  listen('store_poi', (poi) => {
    this.add(poi)
  })

  this.panel = new Panel(this, FavoritePanelView)
}

Favorite.prototype.getAll = function () {
  store.getAll().then((storeData) => {
    this.favoritePois = Object.keys(storeData).map((mapPoint) => {
      return Poi.load(storeData[mapPoint])
    })
    this.panel.update()
  })
}

Favorite.prototype.toggle = function() {
  if(this.active) {
    this.panel.animate(0.4, '.favorites_panel', {left : '-280px'}).then(() => {
      this.active = false
    })
  } else {
    this.panel.animate(0.4, '.favorites_panel', {left : 0}).then(() => {
      this.active = true
    })
  }
}

Favorite.prototype.go = function(poi) {
  fire('mark_poi', poi)
  if(poi.bbox) {
    fire('fit_bounds', poi)
  } else {
    fire('fly_to', poi)
  }
  this.panel.animate(0.4, '.favorites_panel', {left : '-280px'}).then(() => {
    this.active = false
  })
}

Favorite.prototype.add = function(poi) {
  this.favoritePois.push(poi)
  this.panel.update()
}

Favorite.prototype.del = function(poi) {
  this.favoritePois = this.favoritePois.filter((favorite) => {
    if(favorite === poi) {
      fire('del_poi', poi)
      return false
    }
    return true
  })
  this.panel.update()
}

export default Favorite
