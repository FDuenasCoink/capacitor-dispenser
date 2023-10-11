export class Controller {
  private readonly OPTION_CONTAINER_ID = 'dispenser-option-container';
  private CONTENT_WIDTH = '0px';
  private container?: HTMLElement;

  private options = {
    cardStuck:  false,
    recyclingBoxFull: false,
    cardInGate: false,
    cardsInDispenser: true,
    dispenserFull: false,
  };

  init() {
    this.render();
  }

  getDispenserFlags() {
    return this.options;
  }

  private render() {
    const expandBtn = this.generateExpandButton();
    const options = this.generateOptions();
    const container = this.generateContainer();
    container.appendChild(options);
    container.appendChild(expandBtn);
    this.container = container;
    document.body.appendChild(container);
    this.toggleContent();
  }

  private toggleContent() {
    if (!this.container) return;
    if (this.container.style.left !== '0px') {
      this.container.style.left = '0px';
    } else {
      this.container.style.left = `-${this.CONTENT_WIDTH}`;
    }
  }

  private generateContainer() {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = '0px';
    div.style.top = '50%';
    div.style.transform = 'translateY(-50%)';
    div.style.background = '#white';
    div.style.height = '300px';
    div.style.borderRadius = '0px 20px 20px 0px';
    div.style.display = 'flex';
    div.style.transition = '.2s all ease-in-out';
    div.style.overflow = 'hidden';
    return div;
  }

  private generateExpandButton() {
    const btn = document.createElement('button');
    btn.style.width = '30px';
    btn.style.height = '100%';
    btn.style.background = '#004B40';
    btn.style.color = 'white';
    btn.style.position = 'relative';

    const span = document.createElement('span');
    span.style.color = 'white';
    span.style.fontWeight = '700';
    span.style.writingMode = 'vertical-lr';
    span.style.textOrientation = 'upright'
    span.innerText = 'DISPENSER FLAGS';

    btn.appendChild(span);
    btn.onclick = this.toggleContent.bind(this);
    return btn;
  }

  private generateOptions() {
    const ul = document.createElement('ul');
    ul.id = this.OPTION_CONTAINER_ID;
    ul.style.width = '250px';
    ul.style.padding = '0px';
    ul.style.margin = '0px';
    this.CONTENT_WIDTH = ul.style.width;
    Object.entries(this.options).forEach(([key, value]) => {
      const option = this.generateOption(key, value);
      ul.appendChild(option);
    })
    return ul;
  }

  private generateOption(labelText: string, value: boolean) {
    const container = document.createElement('li');
    container.style.listStyle = 'none';

    const label = document.createElement('label');
    label.style.padding = '16px';
    label.style.display = 'flex';
    label.style.justifyContent = 'space-between';
    label.style.borderBottom = '1px solid #eee';
    label.style.animation = '.2s';
    label.style.cursor = 'pointer';
    label.onmouseenter = () => {
      label.style.background = '#eee';
    }
    label.onmouseleave = () => {
      label.style.background = '#FFF';
    }

    const text = document.createElement('span');
    text.style.fontFamily = 'Arial, Helvetica, sans-serif';
    text.style.fontSize = '16px';
    text.innerText = labelText;

    const check = document.createElement('input');
    check.type = 'checkbox'
    check.checked = value;
    check.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement;
      const checked = target.checked;
      this.options = {
        ...this.options,
        [labelText]: checked,
      }
    });
    label.appendChild(text);
    label.appendChild(check);
    container.appendChild(label);
    return container;
  }
}
