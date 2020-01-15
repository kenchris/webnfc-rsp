import replace from 'rollup-plugin-re';

export default [{
  input: "node_modules/pvutils/src/utils.js",
  output: {
    file: 'web_modules/@pkijs/pvutils/utils.js',
    format: "es"
  }
}, {
  input: "node_modules/bytestreamjs/src/bytestream.js",
  output: {
    file: 'web_modules/@pkijs/bytestreamjs/bytestream.js',
    format: "es"
  }
}, {
  input: "node_modules/asn1js/src/asn1.js",
  output: {
    file: 'web_modules/@pkijs/asn1js/asn1.js',
    format: "es"
  }, 
  plugins: [
    replace({ 
      patterns: [{
        test: "pvutils", 
        replace: "../pvutils/utils.js",
      }]
    })
  ],
  external: ['../pvutils/utils.js']
}, {
  input: "node_modules/pkijs/src/index.js",
  output: {
    file: 'web_modules/@pkijs/pkijs/pkijs.js',
    format: "es"
  },
  plugins: [
    replace({ 
      patterns: [{
        test: "pvutils", 
        replace: "../pvutils/utils.js",
      },{
        test: "bytestreamjs", 
        replace: "../bytestreamjs/bytestream.js",
      },{
        test: "\"asn1js\"", 
        replace: "\"../asn1js/asn1.js\"",
      }]
    })
  ],
  external: ['../pvutils/utils.js', "../bytestreamjs/bytestream.js", "../asn1js/asn1.js"]
}];