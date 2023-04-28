/* eslint-disable no-use-before-define */
import { KeyBtn } from './KeyBtn';
import { keys, rowNumbers } from './keys';

let charReceiver;
const main = makeMain();
const monitor = makeMonitor();
const keyboard = makeKeyboard();

keyboard.addEventListener('mousedown', keyClickHandler);

monitor.addEventListener('blur', () => {
  monitor.focus();
});

async function keyClickHandler(event) {
  const element = event.target.closest('.key-btn');
  if (element) {
    element.classList.add('key-btn_pressed');
    switch (element.dataset.code) {
      case 'Backspace': {
        // debugger;
        const startPos = monitor.selectionStart;
        const startVal = monitor.value.substring(0, startPos - 1);
        const endVal = monitor.value.substring(startPos, monitor.value.length);
        monitor.value = startVal + endVal;
        // monitor.selectionStart = monitor.selectionEnd = startPos - 1;
        if (monitor.selectionStart) {
          monitor.selectionStart = startPos - 1;
          monitor.selectionEnd = monitor.selectionStart;
        }
        break;
      }
      case 'CapsLock':
        // monitor.value = monitor.value.substring(0, monitor.value.length - 1);
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        // monitor.value = monitor.value.substring(0, monitor.value.length - 1);
        break;
      case 'ArrowUp': {
        monitor.selectionStart = 0;
        monitor.selectionEnd = monitor.selectionStart;
        break;
      }
      case 'ArrowDown': {
        monitor.selectionStart = monitor.value.length;
        break;
      }
      case 'ArrowLeft': {
        if (monitor.selectionStart) {
          monitor.selectionStart -= 1;
          monitor.selectionEnd = monitor.selectionStart;
        }
        break;
      }
      case 'ArrowRight': {
        monitor.selectionStart += 1;
        monitor.selectionEnd = monitor.selectionStart;
        break;
      }
      case 'Fn':
      case 'ControlLeft':
      case 'AltLeft':
      case 'AltRight':
        break;
      default: {
        const monitorRect = monitor.getBoundingClientRect();
        const centerYmonitor = (monitorRect.top + monitorRect.bottom) / 2;
        const centerXmonitor = (monitorRect.left + monitorRect.right) / 2;
        const moovingChar = KeyBtn.generateDomElement('div', element.textContent, 'mooving-char');

        moovingChar.style.top = `${event.pageY * 0.9}px`;
        moovingChar.style.left = `${event.pageX}px`;
        document.body.append(moovingChar);

        await new Promise((resolve) => setTimeout(resolve, 40));
        moovingChar.classList.add('mooving-char_mooved');
        moovingChar.style.transform = `translateY(${centerYmonitor - event.pageY}px) translateX(${centerXmonitor - event.pageX}px)`;
        // moovingChar.style.transform = `translateY(${centerYmonitor - event.pageY}px)`;

        await new Promise((resolve) => setTimeout(resolve, 300));
        element.classList.remove('key-btn_pressed');
        moovingChar.remove();
        monitor.value += element.dataset.output || element.textContent;
        break;
      }
    }
    // console.log(keys.find((key) => key.keyCode === element.dataset.code));

    element.addEventListener('mouseup', () => {
      element.classList.remove('key-btn_pressed');
    });
  }
}

main.append(keyboard);

function makeMain() {
  const mainSection = KeyBtn.generateDomElement('main', '', 'main');
  document.body.append(mainSection);
  return mainSection;
}

function makeMonitor() {
  const ecran = KeyBtn.generateDomElement('section', '', 'monitor');
  const displayWrapper = KeyBtn.generateDomElement('div', '', 'monitor__display-wrapper');
  const display = KeyBtn.generateDomElement('div', '', 'monitor__display');
  charReceiver = KeyBtn.generateDomElement('div', '', 'monitor__char-receiver');
  const textArea = KeyBtn.generateDomElement('textarea', '', 'monitor__textarea');

  textArea.rows = 5;
  // textArea.readOnly = true;
  textArea.autofocus = true;

  ecran.append(displayWrapper);
  ecran.append(charReceiver);
  displayWrapper.append(display);
  display.append(textArea);
  main.append(ecran);
  return textArea;
}

function makeKeyboard() {
  const arr = keys.slice();
  const kboard = KeyBtn.generateDomElement('section', '', 'keyboard');
  let start = 0;
  for (let i = 0; i < 5; i += 1) {
    const keybRow = KeyBtn.generateDomElement('div', '', 'keyboard__row');
    const keysSliced = arr.slice(start, start += rowNumbers[i]);
    keysSliced.forEach(
      (key) => keybRow.append(key.generateKeyButton(false)),
    );
    kboard.append(keybRow);
  }
  return kboard;
}
