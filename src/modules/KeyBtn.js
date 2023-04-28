export class KeyBtn {
  constructor(
    // id,
    keyCode,
    engTitleBottom,
    engShift,
    ukrTitleBottom,
    ukrShift,
    addBtnStyle = '',
    output = '',
    engTitleUp = '',
    ukrTitleUp = '',
    widthCss = '',
  ) {
    // this.id = id;
    this.keyCode = keyCode;
    this.engTitleUp = engTitleUp;
    this.engTitleBottom = engTitleBottom;
    this.ukrTitleUp = ukrTitleUp;
    this.ukrTitleBottom = ukrTitleBottom;
    this.engShift = engShift;
    this.output = output;
    this.ukrShift = ukrShift;
    this.widthCss = widthCss;
    this.addBtnStyle = addBtnStyle;
  }

  MAIN_BUTTON_STYLE = 'key-btn';

  KEY_COLOR_STYLES = [
    'key-btn_color_blue',
    'key-btn_color_green',
    'key-btn_color_yellow',
    'key-btn_color_pinc',
    'key-btn_color_violet',
    'key-btn_color_orange',
  ];

  KEY_BG_COLOR_STYLES = [
    'key-btn_bgcolor_yellow',
    'key-btn_bgcolor_violet',
    'key-btn_bgcolor_orange',
    'key-btn_bgcolor_pinc',
    'key-btn_bgcolor_green',
    'key-btn_bgcolor_blue',
  ];

  generateKeyButton(isEnglish = true, shifted = false) {
    // debugger;
    const keyBtn = (this.addBtnStyle)
      ? KeyBtn.generateDomElement('div', '', this.MAIN_BUTTON_STYLE, this.addBtnStyle)
      : KeyBtn.generateDomElement('div', '', this.MAIN_BUTTON_STYLE, this.generateRandomColor());
    const keyTitleUp = KeyBtn.generateDomElement('div', isEnglish ? this.engTitleUp : this.ukrTitleUp);

    let isSpecialBtn = false;
    if (this.addBtnStyle) {
      isSpecialBtn = this.addBtnStyle.split(' ').includes('key-btn_special');
    }
    let keyText = isEnglish ? this.engTitleBottom : this.ukrTitleBottom;
    keyText = (shifted && !isSpecialBtn) ? keyText.toUpperCase() : keyText.toLowerCase();
    const keyTitleBottom = KeyBtn.generateDomElement('div', keyText);

    keyBtn.append(keyTitleUp);
    keyBtn.append(keyTitleBottom);

    keyBtn.dataset.code = this.keyCode;
    if (this.output) keyBtn.dataset.output = this.output;

    return keyBtn;
  }

  generateRandomColor() {
    const colorInd = Math.floor(Math.random() * this.KEY_COLOR_STYLES.length);
    const bgColorInd = Math.floor(Math.random() * this.KEY_BG_COLOR_STYLES.length);

    const color = this.KEY_COLOR_STYLES[colorInd];
    const bgColor = this.KEY_BG_COLOR_STYLES[bgColorInd];

    if (this.getRawColor(color) === this.getRawColor(bgColor)) return this.generateRandomColor();
    return [color, bgColor];
  }

  getRawColor(text) {
    const arrText = text.split('_');
    return arrText[arrText.length - 1];
  }

  static generateDomElement(tag, text = '', ...classes) {
    const element = document.createElement(tag);
    // debugger;
    const arrClasses = [];
    classes.forEach((el) => {
      if (Array.isArray(el)) el.forEach((i) => arrClasses.push(i));
      else el.split(' ').forEach((e) => arrClasses.push(e));
    });
    arrClasses.length && element.classList.add(...arrClasses);
    element.textContent = text;
    return element;
  }
}
