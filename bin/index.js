#!/usr/bin/env node

const sizeOf = require('image-size')
const fs = require('fs')
const inquirer = require('inquirer')

inquirer
  .prompt([
    {
        type: 'list',
        name: 'size',
        message: 'Please select a platform',
        choices: ['pc', 'wap'],
        filter: function(val) {
            return val.toLowerCase();
        }
    },
    {
        type: 'input',
        name: 'oldName',
        message: 'Please enter the need to replace the image name'
    },
    {
        type: 'input',
        name: 'newName',
        message: 'Please enter a replacement image name'
    }
  ])
  .then(answers => {
    const platform=answers.size
    let css=''
    const imageFolder=`${process.cwd()}/images`
    const oldName=answers.oldName
    const newName=answers.newName


    fs.readdir(imageFolder, (err, files) => {
        files.forEach(file => {
            if (!/\.jpg$/g.test(file) && !/\.png$/g.test(file)) {
                return 
            }
            if(file.indexOf(oldName)!==0){
                return
            }
            const dimensions = sizeOf(`images/${file}`)
            const name = file.substr(0,file.indexOf('.')).replace(oldName,newName)

            if(platform==='wap'){
                css+=`
.${name}{
    height: ${dimensions.height/100}rem;
    background:url(../images/${file}) 0 0/cover
}
                    `
            }else{
                css+=`
.${name}, .${name} .inner {
    height: ${dimensions.height}px;
    background:url(../images/${file}) no-repeat center top
}
                    `
            }

        })
        fs.exists('css', function(exists) {
            if(exists){
                fs.exists('css/style.css', function(){
                    if(exists){
                        fs.appendFile('css/style.css', css, err => {
                            if (err) {
                              throw err
                            }
                            console.log('Completed!')
                        })
                    }else{
                        fs.writeFile('css/style.css', css, function(err) {
                            if(err) {
                                throw err
                            }
                            console.log('Completed!')
                        }); 
                    }
                })
            }else{
                fs.mkdirSync('css');
                fs.writeFile('css/style.css', css, function(err) {
                    if(err) {
                        throw err
                    }
                    console.log('Completed!')
                })
            }
        })
    })
})





