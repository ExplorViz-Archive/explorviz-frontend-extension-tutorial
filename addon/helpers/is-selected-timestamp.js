import { helper } from '@ember/component/helper';

export function isSelectedTimestamp([model,timestamp]/*, hash*/) {
  if(model.get('landscapeTimestamp')==timestamp.get('timestamp.timestamp')){
    return true;
  }
  return false;
}

export default helper(isSelectedTimestamp);
