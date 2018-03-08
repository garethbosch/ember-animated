import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('each');
  this.route('container-only');
  this.route('two-lists');
  this.route('swapping-lists');
  this.route('bind');
  this.route('hero', function(){
    this.route('detail', { path: '/:id' });
  });
  this.route('nested');
  this.route('direct-style');
  this.route('inline-text');
  this.route('orphan');
  this.route('chart');
  this.route('here-there');
  this.route('svg');
  this.route('beacon');
});

export default Router;
