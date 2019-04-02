<template>
    <div class="text-editor">
        <codemirror  ref="myCm"  v-model="item.content"  :options="cmOptions"   @changes="changes" class="code" ></codemirror>
    </div>
</template>

<script>
    import { codemirror } from 'vue-codemirror';
    import 'codemirror/mode/javascript/javascript.js';
    import 'codemirror/theme/idea.css';
    import 'codemirror/lib/codemirror.css';
    require("codemirror/mode/python/python.js");
    require('codemirror/addon/fold/foldcode.js');
    require('codemirror/addon/fold/foldgutter.js');
    require('codemirror/addon/fold/brace-fold.js');
    require('codemirror/addon/fold/xml-fold.js');
    require('codemirror/addon/fold/indent-fold.js');
    require('codemirror/addon/fold/markdown-fold.js');
    require('codemirror/addon/fold/comment-fold.js');

    export default {
        data () {
            return {
                item: {
                    content: ''
                },
                cmOptions: {
                    tabSize: 4,
                    mode: 'text/javascript',
                    theme: 'idea',
                    lineNumbers: true,
                    lineWrapping: true,
                    extraKeys: { "Ctrl": "autocomplete"},
                    lineWiseCopyCut: true,
                    showCursorWhenSelecting: true,
                    line: true
                }
            }
        },
        components: {
            codemirror
        }
    }
</script>