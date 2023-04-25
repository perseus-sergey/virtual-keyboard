import './template.html';
import './index.scss';
import { KeyBtn } from './modules/KeyBtn';
import { keys, rowNumbers } from './modules/keys';

const makeKeyboard = () => {
  const arr = keys.slice();
  const keyboard = KeyBtn.generateDomElement('div', '', 'keyboard');
  document.body.append(keyboard);
  let start = 0;
  for (let i = 0; i < 5; i++) {
    const keybRow = KeyBtn.generateDomElement('div', '', 'keyboard__row');
    // debugger;
    // start += rowNumbers[i];
    const keysSpliced = arr.slice(start += rowNumbers[i], start + rowNumbers[i]);
    keysSpliced.forEach(
      (key) => keybRow.append(key.generateKeyButton(false)),
    );
    keyboard.append(keybRow);
  }
};

window.onload = function () {
  makeKeyboard();
};
