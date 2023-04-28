/* eslint-disable no-use-before-define */

// TO DO: english layout
// TO DO: remember keyboard layout
// TO DO: physical click handler
// TO DO: make commits
// TO DO: pass the test
// TO DO: check this task

import { KeyBtn } from './KeyBtn';
import { keys, rowNumbers } from './keys';

let keyboard;
let charReceiver;
let isShift = false;
let isCapsLock = false;
const main = makeMain();
const monitor = makeMonitor();
keyboard = makeKeyboard();

monitor.addEventListener('blur', () => {
  monitor.focus();
});

function keyClickHandler(event) {
  const element = event.target.closest('.key-btn');
  if (element) {
    element.classList.add('key-btn_pressed');
    switch (element.dataset.code) {
      case 'Backspace': {
        removeCharFromMonitorCursorPosition();
        break;
      }
      case 'CapsLock':
        capsActivated();
        document.querySelector('[data-code="CapsLock"]').classList.toggle('key-btn_shift-activated', isCapsLock);
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        shiftActivated();
        document.querySelector('[data-code="ShiftLeft"]').classList.toggle('key-btn_shift-activated', isShift);
        document.querySelector('[data-code="ShiftRight"]').classList.toggle('key-btn_shift-activated', isShift);
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
        makeAnimatedChar(element, event);
        if (isShift) {
          shiftActivated();
        }
        break;
      }
    }
    removeKeyBtnPressedClass(element);
  }
}

function shiftActivated() {
  if (isCapsLock) return;

  isShift = !isShift;
  keyboard = makeKeyboard();
}

function capsActivated() {
  isCapsLock = !isCapsLock;
  if (isShift) return;

  keyboard = makeKeyboard();
}

async function makeAnimatedChar(element, event) {
  const elemValue = element.dataset.output || element.textContent;
  const charReceiverRect = charReceiver.getBoundingClientRect();
  const centerXcharReceiver = (charReceiverRect.left + charReceiverRect.right) / 2;

  const moovingChar = KeyBtn.generateDomElement('div', elemValue, 'mooving-char');
  moovingChar.style.top = `${event.pageY * 0.9}px`;
  moovingChar.style.left = `${event.pageX}px`;
  moovingChar.style.color = window.getComputedStyle(element).color;
  document.body.append(moovingChar);

  await new Promise((resolve) => setTimeout(resolve, 30));
  moovingChar.classList.add('mooving-char_mooved');
  moovingChar.style.transform = `translateY(${charReceiverRect.bottom * 1.04 - event.pageY}px) translateX(${centerXcharReceiver - event.pageX}px)`;
  // moovingChar.style.transform = `translateY(${centerYcharReceiver - event.pageY}px)`;

  await new Promise((resolve) => setTimeout(resolve, 400));
  moovingChar.remove();
  insertCharIntoMonitorCursorPosition(element);
}

function insertCharIntoMonitorCursorPosition(element) {
  const startPos = monitor.selectionStart;
  const elemValue = element.dataset.output || element.textContent;
  const startVal = monitor.value.substring(0, startPos) + elemValue;
  const endVal = monitor.value.substring(startPos, monitor.value.length);
  monitor.value = startVal + endVal;
  monitor.selectionStart = startPos + 1;
  monitor.selectionEnd = monitor.selectionStart;
}

function removeCharFromMonitorCursorPosition() {
  const startPos = monitor.selectionStart;
  const startVal = monitor.value.substring(0, startPos - 1);
  const endVal = monitor.value.substring(startPos, monitor.value.length);
  monitor.value = startVal + endVal;
  if (monitor.selectionStart) {
    monitor.selectionStart = startPos - 1;
    monitor.selectionEnd = monitor.selectionStart;
  }
}

async function removeKeyBtnPressedClass(element) {
  await new Promise((resolve) => setTimeout(resolve, 400));
  element.classList.remove('key-btn_pressed');
}

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
  textArea.autofocus = true;

  ecran.append(displayWrapper);
  ecran.append(charReceiver);
  displayWrapper.append(display);
  display.append(textArea);
  main.append(ecran);
  return textArea;
}

function makeKeyboard() {
  if (keyboard) keyboard.remove();
  const arr = keys.slice();
  const kboard = KeyBtn.generateDomElement('section', '', 'keyboard');
  let start = 0;
  for (let i = 0; i < 5; i += 1) {
    const keybRow = KeyBtn.generateDomElement('div', '', 'keyboard__row');
    const keysSliced = arr.slice(start, start += rowNumbers[i]);
    keysSliced.forEach(
      (key) => keybRow.append(key.generateKeyButton(false, (isCapsLock || isShift))),
    );
    kboard.append(keybRow);
  }
  main.append(kboard);

  kboard.addEventListener('mousedown', keyClickHandler);

  return kboard;
}
