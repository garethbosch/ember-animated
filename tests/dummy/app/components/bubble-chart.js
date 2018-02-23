import Component from '@ember/component';
import layout from '../templates/components/bubble-chart';
import { computed } from '@ember/object';
import Move from 'ember-animated/motions/move';
import { task } from 'ember-concurrency';
import { rAF } from 'ember-animated/concurrency-helpers';


export default Component.extend({

  currentYear: 1980,
  points: computed('currentYear', 'model', function(){
    let currentYear = parseInt(this.get('currentYear'));
    let myRow = this.get('model').filter(row => row.year === currentYear);

    return myRow.sort((a, b) => b.population - a.population);
  }),
  transition,

  layout,

  playID: null, 
  play: task(function * () {
      while (this.get('currentYear') < 2015) {
        this.set('currentYear', parseInt(this.get('currentYear')) + 1);
        yield rAF();
      } 
  }).drop(),

  startingYear: 1950,
  endingYear: 2015,
  playLoop: task(function * () {
    while (true) {
      this.set('currentYear', parseInt(this.get('startingYear')));
      while (this.get('currentYear') < parseInt(this.get('endingYear'))) {
        this.set('currentYear', parseInt(this.get('currentYear')) + 1);
        yield rAF();
      } 
    }
  }).drop(),

  actions: { pause() {
    this.get('play').cancelAll();
    this.get('playLoop').cancelAll();
  }},
});

function * transition() {
  this.keptSprites.forEach(s => this.animate(new Move(s)));
}