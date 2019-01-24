import Poi from "../adapters/poi/poi";
import Suggest from "../adapters/suggest";

const GEOLOCALISATION_SELECTOR = 'geolocalisation'

export default class DirectionInput {
  constructor(tagSelector, select, submitHandler) {
    this.select = select
    this.submitHandler = submitHandler
    let prefixes = [
      {id : GEOLOCALISATION_SELECTOR, render : this.renderGeolocailsation}
    ]

    this.suggest = new Suggest(tagSelector, (selectedPoi) => this.selectItem(selectedPoi), prefixes)
    this.suggest.preRender()

    this.listenHandler = listen(submitHandler, () => this.onSubmit())
  }

  onSubmit() {
    this.suggest.onSubmit()
  }

  selectItem(selectedPoi) {
    if(selectedPoi.id === GEOLOCALISATION_SELECTOR) {
      navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude
        let lng = position.coords.longitude
        this.select(new Poi(GEOLOCALISATION_SELECTOR, 'geolocalisation', null, null, {lat, lng}))
      })
      return
    }
    this.select(selectedPoi)
  }

  destroy() {
    if(this.suggest) {
      unListen(this.listenHandler)
      this.suggest.destroy()
      this.suggest = null
    }
  }

  getValue() {
    return this.suggest.getValue()
  }

  setValue(value) {
    this.suggest.setValue(value)
  }

  renderGeolocailsation() {
    return `
      <div data-id="${GEOLOCALISATION_SELECTOR}" data-val="${_('Your position', 'direction')}" class="autocomplete_suggestion itinerary_suggest_your_position">
        <div class=itinerary_suggest_your_position_icon></div>
        ${_('Your position', 'direction')}
      </div>`
  }
}