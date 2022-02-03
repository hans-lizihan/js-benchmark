import {Component, jsx} from 'panel';
import defineAndMakeJsxFactory from './defineAndMakeJsxFactory';

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
  "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
  "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
  "keyboard"];

let nextId = 1;

function random(max) {
  return Math.round(Math.random() * 1000) % max;
}
function buildData(count) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    };
  }
  return data;
}

const Button = defineAndMakeJsxFactory('p-button', class extends Component {
  static get attrsSchema() {
    return {
      id: 'string',
      content: 'string',
    };
  }
  get config() {
    return {
      template() {
        return (
          <button type="button" sel=".btn.btn-primary.btn-block" id={this.attr('id')}>{this.attr('content')}</button>
        );
      }
    }
  }
});

const Jumbotron = defineAndMakeJsxFactory('p-jumbotron', class extends Component {
  get config() {
    return {
      helpers: {
        onClick: (e) => {
          this.dispatchEvent(new CustomEvent('operation', {
            bubbles: true,
            detail: { op: e.currentTarget.id },
          }))
        }
      },
      template() {
        return (
          <div sel=".jumbotron">
            <div sel=".row">
              <div sel=".col-md-6">
                <h1>Panel (non-keyed)</h1>
              </div>
              <div sel=".col-md-6">
                <div sel=".row">
                  <div sel=".col-sm-6.smallpad">
                    <Button on={{click: this.helpers.onClick }} attrs={{id:"run", content: "Create 1,000 rows" }} />
                  </div>
                  <div sel=".col-sm-6.smallpad">
                    <Button on={{click: this.helpers.onClick }} attrs={{id:"runlots", content: "Create 10,000 rows" }} />
                  </div>
                  <div sel=".col-sm-6.smallpad">
                    <Button on={{click: this.helpers.onClick }} attrs={{id: "add", content: "Append 1,000 rows"}} />
                  </div>
                  <div sel=".col-sm-6.smallpad">
                    <Button on={{click: this.helpers.onClick }} attrs={{id: "update", content: "Update every 10th row"}} />
                  </div>
                  <div sel=".col-sm-6.smallpad">
                    <Button on={{click: this.helpers.onClick }} attrs={{id: "clear", content: "Clear"}} />
                  </div>
                  <div sel=".col-sm-6.smallpad">
                    <Button on={{click: this.helpers.onClick }} attrs={{id: "swaprows", content: "Swap Rows"}} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    };
  }
})

const Row = defineAndMakeJsxFactory('benchmark-row', class extends Component {
  static get attrsSchema() {
    return {
      id: 'number',
      label: 'string',
      selected: 'boolean',
    }
  }
  get config() {
    return {
      helpers: {
        onSelect: () => {
          this.dispatchEvent(new CustomEvent('select', {
            composed: true,
            bubbles: true,
            detail: {
              id: this.attr('id'),
            }
          }))
        },
        onDelete: () => {
          this.dispatchEvent(new CustomEvent('delete', {
            composed: true,
            bubbles: true,
            detail: {
              id: this.attr('id'),
            }
          }))
        },
      },
      useShadowDom: true,
      css: `
        :host {
          display: table-row;
        }
        td {
          position: static;
          display: table-cell;
          float: none;
          padding: 8px;
          line-height: 1.42857143;
          vertical-align: top;
          border-top: 1px solid #ddd;
        }
        tr.danger {
          background: #f2dede;
        }
        .glyphicon {
          position: relative;
          top: 1px;
          display: inline-block;
          font-family: 'Glyphicons Halflings';
          font-style: normal;
          font-weight: 400;
          line-height: 1;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .glyphicon-remove:before {
          content: "\\e014";
        }
        .col-md-4 {
          width: 33.33333333%;
        }
        .col-md-1 {
          width: 8.33333333%;
        }
      `,
      template() {
        return (
          <tr
            class={{
              'danger': this.attr('selected')
            }}
          >
            <td sel=".col-md-1">{this.attr('id')}</td>
            <td sel=".col-md-4"><a on={{click: this.helpers.onSelect}}>{this.attr('label')}</a></td>
            <td sel=".col-md-1"><a on={{click: this.helpers.onDelete}}><span sel=".glyphicon.glyphicon-remove" aria-hidden="true"></span></a></td>
            <td sel=".col-md-6"></td>
          </tr>
        );
      }
    };
  }
})

class PApp extends Component {
  get config() {
    return {
      defaultState: {
        data: [],
        selected: 0,
      },
      helpers: {
        onSelect: (e) => {
          this.update({selected: e.detail.id})
        },
        onRemove: (e) => {
          this.update({
            data: this.state.data.filter(d => d.id !== e.detail.id),
            selected: 0,
          })
        },
        onOperation: (e) => {
          switch (e.detail.op) {
            case 'run':
              this.update({ data: buildData(1000), selected: 0 });
              break;
            case 'runlots':
              this.update({ data: buildData(10000), selected: 0 });
              break;
            case 'add':
              this.update({ data: this.state.data.concat(buildData(1000)) });
              break;
            case 'update':
              const data = this.state.data;
              for (let i = 0; i < data.length; i += 10) {
                const item = data[i];
                data[i] = { id: item.id, label: item.label + ' !!!' };
              }
              this.update({ data });
              break;
            case 'clear':
              this.update({ data: [], selected: 0 });
              break;
            case 'swaprows': {
              const data = this.state.data;
              if (data.length > 998) {
                let temp = data[1];
                data[1] = data[998];
                data[998] = temp;
              }
              this.update({data});
              break;
            }
          }
        },

      },
      template() {
        return (
          <div>
            <Jumbotron on={{operation: this.helpers.onOperation}} />

            <table sel=".table.table-hover.table-striped.test-data">
              <tbody>
                {this.state.data.map(d => (
                  <Row
                  key={d.id}
                  attrs={{
                    selected: this.state.selected === d.id,
                    id:d.id,
                    label: d.label,
                  }}
                  on={{
                    select: this.helpers.onSelect,
                    delete: this.helpers.onRemove,
                  }}
                  />
                ))}
              </tbody>
            </table>

            <span sel=".preloadicon.glyphicon.glyphicon-remove" aria-hidden="true"></span>
          </div>
        )
      }
    };
  }
}

export default defineAndMakeJsxFactory('p-app', PApp)
