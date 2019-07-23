import PanelsView from '../views/app_panel.dot';
import Panel from '../libs/panel';
import FavoritePanel from './favorites_panel';
import PoiPanel from './poi_panel';
import ServicePanel from './service_panel';
import Share from '../modals/share';
import SearchInput from '../ui_components/search_input';
import TopBar from './top_bar';
import GeolocationModal from '../modals/geolocation_modal';
import GeolocationDeniedModal from '../modals/geolocation_denied_modal';
import GeolocationNotActivatedModal from '../modals/geolocation_not_activated_modal';
import MasqFavoriteModal from '../modals/masq_favorite_modal';
import MasqOnboardingModal from '../modals/masq_onboarding_modal';
import MasqErrorModal from '../modals/masq_error_modal';
import MasqActivatingModal from '../modals/masq_activating_modal';
import nconf from '@qwant/nconf-getter';
import DirectionPanel from './direction/direction_panel';
import Menu from './menu';
import Telemetry from '../libs/telemetry';
import CategoryPanel from './category_panel';

const performanceEnabled = nconf.get().performance.enabled;
const directionEnabled = nconf.get().direction.enabled;
const masqEnabled = nconf.get().masq.enabled;
const categoryEnabled = nconf.get().category.enabled;

export default class AppPanel {
  constructor(parent) {
    this.topBar = new TopBar();
    SearchInput.initSearchInput('#search');
    this.categoryEnabled = categoryEnabled;
    this.directionEnabled = directionEnabled;

    this.sharePanel = new Share();
    this.servicePanel = new ServicePanel();
    this.favoritePanel = new FavoritePanel(this.sharePanel);
    this.poiPanel = new PoiPanel(this.sharePanel);
    this.categoryPanel = this.categoryEnabled ? new CategoryPanel() : null;
    this.directionPanel = this.directionEnabled ? new DirectionPanel(this.sharePanel) : null;

    PanelManager.register(this.servicePanel);
    PanelManager.register(this.favoritePanel);
    PanelManager.register(this.poiPanel);
    if (this.categoryEnabled) {
      PanelManager.register(this.categoryPanel);
    }
    if (this.directionPanel) {
      PanelManager.register(this.directionPanel);
    }

    this.panel = new Panel(this, PanelsView, parent);
    this.geolocationModal = new GeolocationModal();
    this.geolocationDeniedModal = new GeolocationDeniedModal();
    this.geolocationNotActivatedModal = new GeolocationNotActivatedModal();

    this.masqEnabled = masqEnabled;
    if (this.masqEnabled) {
      this.masqFavoriteModal = new MasqFavoriteModal();
      this.masqOnboardingModal = new MasqOnboardingModal();
      this.masqErrorModal = new MasqErrorModal();
      this.masqActivatingModal = new MasqActivatingModal();
    }

    this.menu = new Menu();

    if (performanceEnabled) {
      this.panel.onRender = () => {
        window.times.appRendered = Date.now();
      };
    }

    this.panel.render();
    Telemetry.add(Telemetry.APP_START);
  }

  minify() {
    SearchInput.minify();
    document.querySelector('.side_panel__container').classList.add('side_panel__container--hidden');
  }

  unminify() {
    document.querySelector('.side_panel__container')
      .classList
      .remove('side_panel__container--hidden');
    SearchInput.unminify();
  }

  toggleMinify() {
    if (SearchInput.isMinified()) {
      this.unminify();
    } else {
      this.minify();
    }
  }
}
