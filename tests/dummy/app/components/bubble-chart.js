import Component from '@ember/component';
import layout from '../templates/components/bubble-chart';
import { computed } from '@ember/object';
import Move from 'ember-animated/motions/move';
import { task } from 'ember-concurrency';

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
    if (this.get('playID') !== null) { return } //play in progress
    let id = yield setInterval(() => {
      if (this.get('currentYear') < 2015) {
        this.set('currentYear', parseInt(this.get('currentYear')) + 1);
      } else {
        clearInterval(parseInt(this.get('playID')));
        this.set('playID', null);
        this.set('currentYear', 2015);
      }
    }, 100);
    this.set('playID', id);
  }).drop(),

  pause: task(function * () {
    clearInterval(parseInt(this.get('playID')));
    this.set('playID', null);
  }),

  // actions: {
  //   play() {
  //     setInterval(() => {
  //       this.set('currentYear', parseInt(this.get('currentYear')) + 1);
  //     }, 100);
  //   }
  // }
  
});

function * transition() {
  this.keptSprites.forEach(s => this.animate(new Move(s)));
}