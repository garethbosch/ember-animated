import { helper } from '@ember/component/helper';

export function scale([value], { minValue, maxValue, scale, invert, minCircleArea, scaleCircleArea }) {
  if( minCircleArea ) { 
    let percentageOfMax = (100 * (value - minValue)/(maxValue - minValue))
    let circleArea = percentageOfMax * scaleCircleArea + minCircleArea;
    let radius = Math.sqrt( circleArea / Math.PI );
    return `${ radius }`;
  }

  if (scale === 'log') {
    value = Math.log2(value);
    minValue = Math.log2(minValue);
    maxValue = Math.log2(maxValue);
  }

  if (invert) {
    return `${100 - (100 * (value - minValue)/(maxValue - minValue))}%`;
  } else {
    return `${ 100 * (value - minValue) / (maxValue - minValue) }%`;
  }

}
export default helper(scale);