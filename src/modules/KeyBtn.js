export class KeyBtn {
  constructor(
    // id,
    keyCode,
    engTitleBottom,
    engShift,
    ukrTitleBottom,
    ukrShift,
    engTitleUp = '',
    ukrTitleUp = '',
    widthCss = '',
    addBtnStyle = '',
  ) {
    // this.id = id;
    this.keyCode = keyCode;
    this.engTitleUp = engTitleUp;
    this.engTitleBottom = engTitleBottom;
    this.ukrTitleUp = ukrTitleUp;
    this.ukrTitleBottom = ukrTitleBottom;
    this.engShift = engShift;
    this.ukrShift = ukrShift;
    this.widthCss = widthCss;
    this.addBtnStyle = addBtnStyle;
  }

  MAIN_BUTTON_STYLE = 'key-btn';

  // Key Button generator

  generateKeyButton(isEnglish = true, shifted = false) {
    const keyBtn = this.addBtnStyle
      ? KeyBtn.generateDomElement('div', '', this.MAIN_BUTTON_STYLE, this.addBtnStyle)
      : KeyBtn.generateDomElement('div', '', this.MAIN_BUTTON_STYLE);
    const keyTitleUp = KeyBtn.generateDomElement('div', isEnglish ? this.engTitleUp : this.ukrTitleUp);
    const keyTitleBottom = KeyBtn.generateDomElement('div', isEnglish ? this.engTitleBottom : this.ukrTitleBottom);

    keyBtn.append(keyTitleUp);
    keyBtn.append(keyTitleBottom);

    // keyBtn.dataset.id = this.id;

    return keyBtn;
  }

  static generateDomElement(tag, text = '', ...classes) {
    const element = document.createElement(tag);
    classes && element.classList.add(...classes);
    element.textContent = text;
    return element;
  }
}
