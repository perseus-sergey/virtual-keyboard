import { KeyBtn } from './KeyBtn';
import { keys, rowNumbers } from './keys';

// TO DO: --+ shift for digital/special buttons
// TO DO: --+ english layout
// TO DO: --+ remember keyboard layout
// TO DO: --+ physical click handler
// TO DO: --+ make mooving char with physical click
// TO DO: make commits
// TO DO: pass the test
// TO DO: check this task
// TO DO: refactor the code
// TO DO: --+ show shortcut for layout switching
// TO DO: --+ show what OS used to make keyboard

const makeComputer = {
  main: '',
  monitor: '',
  keyboard: '',
  keybRow: '',
  charReceiver: '',
  moovingCharColor: '',
  isEnglish: localStorage.getItem('isEnglish') !== '0',
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

    kboard.addEventListener('click', (event) => this.keyClickHandler(event));

    return kboard;
  },

  addListners() {
    this.monitor.addEventListener('blur', () => {
      this.monitor.focus();
    });

    document.addEventListener('keydown', (event) => {
      event.preventDefault();
      const element = document.querySelector(`[data-code="${event.code}"]`);
      try {
        element.classList.add('key-btn_pressed');
      } catch (error) {
        return;
      }

      this.keyClickHandler(event, element);
      setTimeout(() => {
        document.querySelector(`[data-code="${event.code}"]`).classList.remove('key-btn_pressed');
      }, 3000);
    });
  },

  keyClickHandler(event, element = event.target.closest('.key-btn')) {
    if (element) {
      this.moovingCharColor = window.getComputedStyle(element).color;
      this.addKeyBtnPressedClass(element);
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
          this.makeAnimatedChar(element);
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
    localStorage.setItem('isEnglish', (this.isEnglish) ? 1 : 0);
    this.isShift = false;
    this.isCapsLock = false;
    this.keyboard = this.makeKeyboard();
  },

  async makeAnimatedChar(element) {
    const elemValue = element.dataset.output || element.textContent;
    const charReceiverRect = this.charReceiver.getBoundingClientRect();
    const centerXcharReceiver = (charReceiverRect.left + charReceiverRect.right) / 2;

    const moovingChar = KeyBtn.generateDomElement('div', elemValue, 'mooving-char');

    const keyButoonRect = element.getBoundingClientRect();
    const centerXkeyButoonRect = (keyButoonRect.left + keyButoonRect.right) / 2;

    moovingChar.style.top = `${keyButoonRect.top}px`;
    moovingChar.style.left = `${centerXkeyButoonRect}px`;
    moovingChar.style.color = this.moovingCharColor;
    document.body.append(moovingChar);

    await new Promise((resolve) => { setTimeout(resolve, 30); });
    moovingChar.classList.add('mooving-char_mooved');
    moovingChar.style.transform = `translateY(${charReceiverRect.bottom * 0.9 - keyButoonRect.top}px) translateX(${centerXcharReceiver - centerXkeyButoonRect}px)`;

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

  addKeyBtnPressedClass(element) {
    element.classList.add('key-btn_pressed');
    if (!element.classList.contains('key-btn_special')) element.classList.add('key-btn_transparent');
  },

  async removeKeyBtnPressedClass(element) {
    await new Promise((resolve) => { setTimeout(resolve, 500); });
    element.classList.remove('key-btn_transparent');
    element.classList.remove('key-btn_pressed');
  },

  appendButtonIntoKeyboard(key) {
    this.keybRow.append(key.generateKeyButton(this.isEnglish, (this.isCapsLock || this.isShift)));
  },
};

makeComputer.start();
