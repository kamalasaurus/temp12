import m from '../../../node_modules/mithril/mithril.js';
import shaderlist from '../../../shader-list.js';
// create manifest list to import wasm array
// create css -> json converters to import as js

export default class Canvas {
  constructor(opts) {
    // create css parser script to make it a loadable json for modular height/width
    // create script to generate module that has default css
    this.canvas = m('canvas', {id: 'canvas'});
    this.shaderlist = this.getshaders(/*imported shader list*/);

    this.oncreate = (vnode) => {
      let gl = vnode.dom.getContext('webgl');
      let program = gl.createProgram();
      let shaders = [
        gl.createShader(gl.VERTEX_SHADER),
        gl.createShader(gl.FRAGMENT_SHADER)
      ];

      this.shaderlist
      //.then(([v,f]) => {
      //  Promise.all([
      //    v.text(),
      //    f.text()
      //  ])
          .then((shaderSrcs) => {
            shaderSrcs.forEach((src, i) => {
              let s = shaders[i];
              gl.shaderSource(s, src);
              gl.compileShader(s);
              gl.attachShader(program, s);
            });
            gl.linkProgram(program)
            initialize(gl, program)
          });
      //});
    };

    this.view = (vnode) => {
      return this.canvas;
    };
  }

  getshaders({vert, frag}) {
    // return {
    //   vert: this.extractshaders(vert),
    //   frag: this.extractshaders(frag)
    // }
    return Promise.all([
      fetch('./vertex.glsl'),
      fetch('./fragment.glsl')
    ]);
  }

  extractshaders(shaderurlarray) {
    return Promise
      .all(
        shaderurlarray
          .map(fetch)
          .then(res => res.text())
      );
  }
}

