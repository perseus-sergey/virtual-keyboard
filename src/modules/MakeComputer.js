import { KeyBtn } from './KeyBtn';
import { keys, rowNumbers } from './keys';

export const MakeComputer = {
  main: '',
  monitor: '',
  keyboard: '',
  keybRow: '',
  charReceiver: '',
  isEnglish: false,
  isShift: false,
  isCapsLock: false,

  start() {
    this.makeMainSection();
    this.makeMonitor();
    this.keyboard = this.makeKeyboard();
    this.addListners();
  },

  makeMainSection() {
    const mainSection = KeyBtn.generateDomElement('main', '', 'main');
    document.body.append(mainSection);
    this.main = mainSection;
  },

  makeMonitor() {
    const ecran = KeyBtn.generateDomElement('section', '', 'monitor');
    const displayWrapper = KeyBtn.generateDomElement('div', '', 'monitor__display-wrapper');
    const display = KeyBtn.generateDomElement('div', '', 'monitor__display');
    const receiverWrapper = KeyBtn.generateDomElement('div', '', 'monitor__receiver-wrapper');
    const switchLang = KeyBtn.generateDomElement('p', '⌘ - switch language', 'monitor__os-marker');
    this.charReceiver = KeyBtn.generateDomElement('div', '', 'monitor__char-receiver');
    const osMarker = KeyBtn.generateDomElement('p', 'Made in MacOS', 'monitor__os-marker');
    const textArea = KeyBtn.generateDomElement('textarea', '', 'monitor__textarea');

    textArea.rows = 5;
    textArea.autofocus = true;

    ecran.append(displayWrapper);
    ecran.append(receiverWrapper);
    receiverWrapper.append(switchLang);
    receiverWrapper.append(this.charReceiver);
    receiverWrapper.append(osMarker);
    displayWrapper.append(display);
    display.append(textArea);
    this.main.append(ecran);
    this.monitor = textArea;
  },

  makeKeyboard() {
    if (this.keyboard) this.keyboard.remove();
    const arr = keys.slice();
    const kboard = KeyBtn.generateDomElement('section', '', 'keyboard');
    let start = 0;
    for (let i = 0; i < 5; i += 1) {
      this.keybRow = KeyBtn.generateDomElement('div', '', 'keyboard__row');
      const keysSliced = arr.slice(start, start += rowNumbers[i]);
      keysSliced.forEach((key) => this.appendButtonIntoKeyboard(key));
      kboard.append(this.keybRow);
    }
    this.main.append(kboard);

    kboard.addEventListener('mousedown', (event) => this.keyClickHandler(event));

    return kboard;
  },

  addListners() {
    this.monitor.addEventListener('blur', () => {
      this.monitor.focus();
    });

    document.addEventListener('keydown', (event) => {
      try {
        document.querySelector(`[data-code="${event.code}"]`).classList.add('key-btn_pressed');
      } catch (error) {
        return;
      }
      setTimeout(() => {
        document.querySelector(`[data-code="${event.code}"]`).classList.remove('key-btn_pressed');
      }, 3000);
    });

    document.addEventListener('keyup', (event) => {
      try {
        document.querySelector(`[data-code="${event.code}"]`).classList.remove('key-btn_pressed');
        return false;
      } catch (error) {
        return false;
      }
    });
  },

  keyClickHandler(event) {
    const element = event.target.closest('.key-btn');
    if (element) {
      element.classList.add('key-btn_pressed');
      switch (element.dataset.code) {
        case 'Backspace': {
          this.removeCharFromMonitorCursorPosition();
          break;
        }
        case 'CapsLock':
          this.capsActivated();
          document.querySelector('[data-code="CapsLock"]').classList.toggle('key-btn_shift-activated', this.isCapsLock);
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.shiftActivated();
          document.querySelector('[data-code="ShiftLeft"]').classList.toggle('key-btn_shift-activated', this.isShift);
          document.querySelector('[data-code="ShiftRight"]').classList.toggle('key-btn_shift-activated', this.isShift);
          break;
        case 'MetaLeft':
        case 'MetaRight':
          this.langSwitch();
          break;
        case 'ArrowUp': {
          this.monitor.selectionStart = 0;
          this.monitor.selectionEnd = this.monitor.selectionStart;
          break;
        }
        case 'ArrowDown': {
          this.monitor.selectionStart = this.monitor.value.length;
          break;
        }
        case 'ArrowLeft': {
          if (this.monitor.selectionStart) {
            this.monitor.selectionStart -= 1;
            this.monitor.selectionEnd = this.monitor.selectionStart;
          }
          break;
        }
        case 'ArrowRight': {
          this.monitor.selectionStart += 1;
          this.monitor.selectionEnd = this.monitor.selectionStart;
          break;
        }
        case 'Fn':
        case 'ControlLeft':
        case 'AltLeft':
        case 'AltRight':
          break;
        default: {
          this.makeAnimatedChar(element, event);
          if (this.isShift) {
            this.shiftActivated();
          }
          break;
        }
      }
      this.removeKeyBtnPressedClass(element);
    }
  },

  shiftActivated() {
    if (this.isCapsLock) return;

    this.isShift = !this.isShift;
    this.keyboard = this.makeKeyboard();
  },

  capsActivated() {
    this.isCapsLock = !this.isCapsLock;
    if (this.isShift) return;

    this.keyboard = this.makeKeyboard();
  },

  langSwitch() {
    this.isEnglish = !this.isEnglish;
    this.isShift = false;
    this.isCapsLock = false;
    this.keyboard = this.makeKeyboard();
  },

  async makeAnimatedChar(element, event) {
    const elemValue = element.dataset.output || element.textContent;
    const charReceiverRect = this.charReceiver.getBoundingClientRect();
    const centerXcharReceiver = (charReceiverRect.left + charReceiverRect.right) / 2;

    const moovingChar = KeyBtn.generateDomElement('div', elemValue, 'mooving-char');
    moovingChar.style.top = `${event.pageY * 0.9}px`;
    moovingChar.style.left = `${event.pageX}px`;
    moovingChar.style.color = window.getComputedStyle(element).color;
    document.body.append(moovingChar);

    await new Promise((resolve) => { setTimeout(resolve, 30); });
    moovingChar.classList.add('mooving-char_mooved');
    moovingChar.style.transform = `translateY(${charReceiverRect.bottom * 1.04 - event.pageY}px) translateX(${centerXcharReceiver - event.pageX}px)`;
    // moovingChar.style.transform = `translateY(${centerYcharReceiver - event.pageY}px)`;

    await new Promise((resolve) => { setTimeout(resolve, 400); });
    moovingChar.remove();
    this.insertCharIntoMonitorCursorPosition(element);
  },

  insertCharIntoMonitorCursorPosition(element) {
    const startPos = this.monitor.selectionStart;
    const elemValue = element.dataset.output || element.textContent;
    const startVal = this.monitor.value.substring(0, startPos) + elemValue;
    const endVal = this.monitor.value.substring(startPos, this.monitor.value.length);
    this.monitor.value = startVal + endVal;
    this.monitor.selectionStart = startPos + 1;
    this.monitor.selectionEnd = this.monitor.selectionStart;
  },

  removeCharFromMonitorCursorPosition() {
    const startPos = this.monitor.selectionStart;
    const startVal = this.monitor.value.substring(0, startPos - 1);
    const endVal = this.monitor.value.substring(startPos, this.monitor.value.length);
    this.monitor.value = startVal + endVal;
    if (this.monitor.selectionStart) {
      this.monitor.selectionStart = startPos - 1;
      this.monitor.selectionEnd = this.monitor.selectionStart;
    }
  },

  async removeKeyBtnPressedClass(element) {
    await new Promise((resolve) => { setTimeout(resolve, 150); });
    element.classList.remove('key-btn_pressed');
  },

  appendButtonIntoKeyboard(key) {
    this.keybRow.append(key.generateKeyButton(this.isEnglish, (this.isCapsLock || this.isShift)));
  },
};
