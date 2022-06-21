import Vue from 'vue'
import MonacoEditor from '../src'
import './style.css'



function Route(url) {
  this.query = {}
  if (url.indexOf('?') === -1) {
    return
  }
  const query = url.split('?')[1]
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    this.query[pair[0]] = pair[1]
  }
}

new Vue({
  el: '#app',

  data: {
    original: '',
    code: '',
    language: 'javascript',
    theme: 'vs-dark',
    options: {
      lineNumbers: true
    },
    diff: false,
    showDiff: false
  },

  methods: {
    renderDiff() {
      return <div>

        <div v-show={!this.showDiff} class="diff-split-editor">
          <MonacoEditor
            class="editor"
            value={this.original}
            language={this.language}
            theme={this.theme}
            options={this.options}
            onChange={newValue => (this.original = newValue)}
          />
          <MonacoEditor
            class="editor"
            value={this.code}
            language={this.language}
            theme={this.theme}
            options={this.options}
            onChange={newValue => (this.code = newValue)}
          />
        </div>

        {this.showDiff ? <MonacoEditor
          class="full-editor"
          diffEditor={true}
          original={this.original}
          value={this.code}
          language={this.language}
          theme={this.theme}
          options={this.options}
          onChange={newValue => (this.code = newValue)}
        /> : null}

      </div>
    }
  },
  created() {
    document.title = `在线${this.diff ? 'diff' : ''}编辑器`
    const route = new Route(window.location.href)

    this.language = route.query.language || 'javascript'
    this.theme = route.query.theme || 'vs-dark'
    this.diff = route.query.diff ? true : false
  },

  render() {
    return (
      <div id="app">
        <div class="header">

          <div class="title">在线{this.diff ? 'diff' : ''}编辑器</div>

          <div class="btns">
            {this.diff ?
              (this.showDiff ?
                <button class="btn" onClick={() => this.showDiff = !this.showDiff}>去编辑</button>
                :
                <button class="btn btn-primary" onClick={() => this.showDiff = !this.showDiff}>开始比较</button>) : null}

            {!this.diff && this.language === 'javascript' ?
              <button onClick={() => {
                alert('开发中~')
              }} class="btn">运行代码</button> : null}
          </div>
        </div>

        {!this.diff ? <MonacoEditor
          class="full-editor"
          value={this.code}
          language={this.language}
          theme={this.theme}
          options={this.options}
          onChange={newValue => (this.code = newValue)}
        /> :
          this.renderDiff()}

      </div>
    )
  }
})
